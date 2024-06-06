import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { redirect } from 'next/navigation';

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
        variants(first: 80) {
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
        images(first: 5) {
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
  const { category } = params;
  console.log("Category:", category);

  try {
    const { data, errors } = await client.request(getAllProductsQuery, {
      variables: { first: 250, after: null },
    });

    if (errors) {
      console.error('Error fetching products:', errors);
      console.log('Data:', data.products.edges);
      console.log('Errors:', errors);
      return;
    }
    console.log('Product Data:', data.products.edges);

    const filteredProducts = data.products.edges.filter((edge) => {
      const collectionHandles = edge.node.collections.edges.map((collectionEdge) => collectionEdge.node.handle);
      return collectionHandles.includes(category);
      
    });
   

    if (filteredProducts.length === 0) {
      console.log('FilteredProducts:', filteredProducts);
      console.log('Errors:', errors);
      return;
    }

    return (
      <section className="mx-auto max-w-2xl px-4 sm:pb-6 lg:max-w-7xl lg:px-8">
        {filteredProducts.map((edge) => (
          <div key={edge.node.id}>
            {edge.node.images.edges.length > 0 && (
              <img
                src={edge.node.images.edges[0].node.src}
                alt={edge.node.images.edges[0].node.altText}
                className="mb-4 object-cover w-1/2"
          
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
  } catch (error) {
    console.error('Error fetching product:', error);
    redirect('/');
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