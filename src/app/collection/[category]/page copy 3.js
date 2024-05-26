import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { redirect } from 'next/navigation';
import { unstable_noStore } from 'next/cache';

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION,
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_PUBLIC_ACCESS_TOKEN,
});

const getAllProductsQuery = `
query getAllProducts($first: Int, $after: String) {
  products(first: $first, after: $after) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        totalInventory
        variants(first: 70) {
          edges {
            node {
              id
              title
              sku
              availableForSale
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              quantityAvailable
              image {
                src
                altText
              }
            }
          }
        }
        images(first: 6) {
          edges {
            node {
              src
              altText
            }
          }
        }
        collections(first: 70) {
          edges {
            node {
              id
              title
              handle
            }
          }
        }
      }
    }
  }
}
`;

export default async function ProductPage({ params }) {
  unstable_noStore();
  const { category } = params;
  const { filteredProducts, errors } = await getFilteredProducts(category);

  if (errors) {
    console.error('Error fetching products:', errors);
    console.log('Data:', filteredProducts);
    console.log('Errors:', errors);
    return;
  }

  return (
    <section className="mx-auto max-w-2xl px-4 sm:pb-6 lg:max-w-7xl lg:px-8">
      {filteredProducts.map((edge) => (
        <div key={edge.node.id} className="flex flex-col items-center">
          {edge.node.images.edges.length > 0 && (
            <img
              src={edge.node.images.edges[0].node.src}
              alt={edge.node.images.edges[0].node.altText}
              className="mb-4 object-cover w-1/4 cursor-none"
            />
          )}
          <h2>{edge.node.title}</h2>
          <p>{edge.node.description}</p>
          <p>
            Price: {edge.node.priceRange.minVariantPrice.amount}{' '}
            {edge.node.priceRange.minVariantPrice.currencyCode}
          </p>
          <p>Quantity: {edge.node.totalInventory}</p>
          <br /> <br />
        </div>
      ))}
    </section>
  );
}

async function getFilteredProducts(category) {
  let filteredProducts = [];
  let errors = null;

  try {
    const { data, errors: queryErrors } = await client.request(getAllProductsQuery, {
      variables: { first: 250, after: null },
      
    });


    
    if (queryErrors) {
      errors = queryErrors;
      console.error('Error fetching products:', queryErrors);
      return { filteredProducts, errors };
    }

    filteredProducts = data.products.edges.filter((edge) => {
      const collectionHandles = edge.node.collections.edges.map((collectionEdge) => collectionEdge.node.handle);
      return collectionHandles.includes(category.toLowerCase());
    });

    if (filteredProducts.length === 0) {
      const interval = setInterval(async () => {
        try {
          const { data, errors: intervalErrors } = await client.request(getAllProductsQuery, {
            variables: { first: 250, after: null },
          });

          if (intervalErrors) {
            errors = intervalErrors;
            console.error('Error fetching products:', intervalErrors);
            clearInterval(interval);
            return;
          }

          filteredProducts = data.products.edges.filter((edge) => {
            const collectionHandles = edge.node.collections.edges.map((collectionEdge) => collectionEdge.node.handle);
            return collectionHandles.includes(category.toLowerCase());
          });

          if (filteredProducts.length > 0) {
            clearInterval(interval);
          }
        } catch (error) {
          errors = error;
          console.error('Error fetching product:', error);
          clearInterval(interval);
        }
      }, 20000);
    }

    return { filteredProducts, errors };
  } catch (error) {
    errors = error;
    console.error('Error fetching product:', error);
    return { filteredProducts, errors };
  }
}

export const generateStaticParams = async () => {
  try {
    const { data, errors } = await client.request(getAllProductsQuery, {
      variables: { first: 250, after: null },
    });

    if (errors) {
      console.error('Error fetching products:', errors);
      return [];
    }

    if (!data || !data.products || !data.products.edges || data.products.edges.length === 0) {
      console.error('No products found');
      return [];
    }

    const categories = data.products.edges
      .flatMap((edge) => edge.node?.collections?.edges.map((collectionEdge) => collectionEdge.node?.handle))
      .filter((category, index, self) => category && self.indexOf(category) === index);

    console.log('Available Categories:', categories);

    return categories.map((category) => ({ category }));
  } catch (error) {
    console.error('Error generating static paths:', error);
    return [];
  }
};