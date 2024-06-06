"use client";
// landing page to show all the details of the Shopify Storefront API
import { useState, useEffect } from 'react';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import fs from 'fs';
import path from 'path';

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

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

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
        // saveProductsToFile(allProducts);
        console.log('allProducts', allProducts);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };


    const interval = setInterval(fetchAllProducts, 10000); // Update every 30 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount

    // fetchAllProducts();
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

//   const saveProductsToFile = (products) => {
//     const filePath = path.join(process.cwd(), 'products.json');
//     fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
//     console.log('Products saved to file:', filePath);
//   };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              {product.images.edges.length > 0 && (
                <img
                  src={product.images.edges[0].node.src}
                  alt={product.images.edges[0].node.altText}
                  className="h-64 w-full object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{product.title}</h3>
                <p className="text-gray-500 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-900 font-medium">
                    {product.priceRange.minVariantPrice.amount}{' '}
                    {product.priceRange.minVariantPrice.currencyCode}
                  </p>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;