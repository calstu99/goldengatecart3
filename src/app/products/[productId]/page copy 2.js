
//This provides dynamic link to the Shopify Product
import React from 'react';


import Link from 'next/link'; // Import the Link component
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION,
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_PUBLIC_ACCESS_TOKEN,
});

const getProductQuery = `
  query getProduct($handle: String!) {
    productByHandle(handle: $handle) {
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
`;


export default async function ProductPage({ params }) {
  const handle  = params.productId;
  // const handle = "mens-t-shirt";
  console.log('params',params);

 // Validate the handle parameter
 const handleRegex = /^[a-z0-9-]+$/;
 if (!handleRegex.test(handle)) {
   console.error('Invalid product handle:', handle);
   return <div>Invalid product handle</div>;
 }


  const { data, errors, graphQLErrors} = await client.request(getProductQuery, {
    variables: { handle },
  });

  if (graphQLErrors) {
    console.error('GraphQL Errors:', graphQLErrors);
    return <div>Error: {graphQLErrors.map(({ message }) => message).join(', ')}</div>;
  }

  if (errors) {
    console.error('Error fetching product:', errors);
    return <div>Error: {errors.message}</div>;
  }

  const product = data.productByHandle;

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <section className="mx-auto max-w-2xl px-4 sm:pb-6 lg:max-w-7xl lg:px-8">
      <div key={product.id} className="flex flex-col items-center">
        {product.images.edges.length > 0 && (
          <Link
          href={{
            pathname: `/products/${product.handle}`,
            query: { productId: product.id },
          }}
          state={{ product }}
          passHref
        >
          <img
            src={product.images.edges[0].node.src}
            alt={product.images.edges[0].node.altText}
            className="mb-4 object-cover w-1/4 cursor-pointer"
          />

        </Link>
        )}
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <p>
          Price: {product.priceRange.minVariantPrice.amount}{' '}
          {product.priceRange.minVariantPrice.currencyCode}
        </p>
        <p>Quantity: {product.totalInventory} - available</p>
        <br /> <br />
      </div>
    </section>
  );
}