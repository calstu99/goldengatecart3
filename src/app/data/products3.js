"use client";
import { useState, useEffect } from 'react';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: 'hab-goldengate.myshopify.com',
  apiVersion: '2024-01',
  publicAccessToken: '2b6b637cda36bc645c35699c9d2941a9',
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
          variants(first: 10) {
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
              }
            }
          }
          collections(first: 10) {
            edges {
              node {
                id
                title
              }
            }
          }
          productType
          images(first: 5) {
            edges {
              node {
                src
                altText
              }
            }
          }
        }
      }
    }
  }
`;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        let cursor = null;
        let allProducts = [];

        while (true) {
          const { data, errors } = await client.request(getAllProductsQuery, {
            variables: { first: 250, after: cursor },
          });

          if (errors) {
            setError(errors);
            break;
          }

          const { products } = data;
          allProducts = [...allProducts, ...products.edges.map((edge) => edge.node)];

          if (!products.pageInfo.hasNextPage) {
            break;
          }

          cursor = products.pageInfo.endCursor;
        }

        setProducts(allProducts);
        // console.log('allProducts', allProducts);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Product List</h2>
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.title}</h3>
          <p>{product.description}</p>
          <p>Price: {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}</p>
          <p>Quantity: {product.totalInventory}</p>
          <h4>Variants:</h4>
          {product.variants.edges.map((variant) => (
            <div key={variant.node.id}>
              <p>Title: {variant.node.title}</p>
              <p>SKU: {variant.node.sku}</p>
              <p>Price: {variant.node.price.amount} {variant.node.price.currencyCode}</p>
              <p>Quantity: {variant.node.quantityAvailable}</p>
            </div>
          ))}
          <h4>Collections:</h4>
          {product.collections.edges.map((collection) => (
            <p key={collection.node.id}>{collection.node.title}</p>
          ))}
          <p>Product Type: {product.productType}</p>
          <h4>Images:</h4>
          {product.images.edges.map((image) => (
            <img key={image.node.src} src={image.node.src} alt={image.node.altText} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ProductList;