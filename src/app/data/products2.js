"use client";
import { useState, useEffect } from 'react';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: 'your-store-domain.myshopify.com',
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
          images(first: 1) {
            edges {
              node {
                src
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
          {product.images.edges.length > 0 && (
            <img src={product.images.edges[0].node.src} alt={product.title} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductList;




