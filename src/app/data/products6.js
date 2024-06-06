"use client";
// landing page to show all the details along with variants of the Shopify Storefront API
import { useState, useEffect } from 'react';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { useCart } from "../../components/CartContext";

import ProductCard from '../../components/ProductCard';
import ProductVariants from '../../components/ProductVariants';

// const client = createStorefrontApiClient({
//   storeDomain: 'hab-goldengate.myshopify.com',
//   apiVersion: '2024-01',
//   publicAccessToken: '2b6b637cda36bc645c35699c9d2941a9',
// });

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION,
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_PUBLIC_ACCESS_TOKEN,
});

// original 

// const getAllProductsQuery = `
//   query getAllProducts($first: Int, $after: String) {
//     products(first: $first, after: $after) {
//       pageInfo {
//         hasNextPage
//         endCursor
//       }
//       edges {
//         node {
//           id
//           title
//           handle
//           description
//           priceRange {
//             minVariantPrice {
//               amount
//               currencyCode
//             }
//             maxVariantPrice {
//               amount
//               currencyCode
//             }
//           }
//           totalInventory
//           variants(first: 10) {
//             edges {
//               node {
//                 id
//                 title
//                 sku
//                 availableForSale
//                 price {
//                   amount
//                   currencyCode
//                 }
//                 compareAtPrice {
//                   amount
//                   currencyCode
//                 }
//                 quantityAvailable
//               }
//             }
//           }
//           images(first: 5) {
//             edges {
//               node {
//                 src
//                 altText
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;

// // 2nd update
// const getAllProductsQuery = `
//   query getAllProducts($first: Int, $after: String) {
//     products(first: $first, after: $after) {
//       pageInfo {
//         hasNextPage
//         endCursor
//       }
//       edges {
//         node {
//           id
//           title
//           handle
//           description
//           priceRange {
//             minVariantPrice {
//               amount
//               currencyCode
//             }
//             maxVariantPrice {
//               amount
//               currencyCode
//             }
//           }
//           totalInventory
//           variants(first: 10) {
//             edges {
//               node {
//                 id
//                 title
//                 sku
//                 availableForSale
//                 price {
//                   amount
//                   currencyCode
//                 }
//                 compareAtPrice {
//                   amount
//                   currencyCode
//                 }
//                 quantityAvailable
//                 image {
//                   src
//                   altText
//                 }
//               }
//             }
//           }
//           images(first: 5) {
//             edges {
//               node {
//                 src
//                 altText
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;

// 2nd update
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
        collections(first: 10) {
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



const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
//   const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {addToCart, cart } = useCart();
  // update ProductShopify.js


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
        
        console.log('allProducts', allProducts);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }

       // Fetch products when the component mounts
    };
     
    
    // Fetch products every 300 seconds
    // const interval = setInterval(fetchAllProducts, 30000); // Update every 30 seconds

    // return () => clearInterval(interval); // Clean up the interval on component unmount
    fetchAllProducts();
  }, []);

//   const addToCart = (product) => {
//     setCart([...cart, product]);
//   };

  const showVariants = (product) => {
    setSelectedProduct(product);
    
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Featured Products</h2> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            // <div key={product.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div key={product.id} className="flex flex-col items-center justify-center shadow-md rounded-lg overflow-hidden">

              {/* {product.images.edges.length > 0 && (
                <img
                  src={product.images.edges[0].node.src}
                  alt={product.images.edges[0].node.altText}
                  className="h-64 w-full object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{product.title}</h3>
                <p className="text-gray-500 mb-4 line-clamp-5">{product.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-900 font-medium">
                    {product.priceRange.minVariantPrice.amount}{' '}
                    {product.priceRange.minVariantPrice.currencyCode}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => showVariants(product)}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
                    >
                      Show Variants
                    </button>
                  </div>
                </div>
              </div> */}
              <ProductCard
                key={product.id}
                product={product}
                onShowVariants={showVariants}
                onAddToCart={addToCart}
                selectedProduct={selectedProduct}
                onCloseVariants={() => setSelectedProduct(null)}
              />

            
              
              {/* {selectedProduct && selectedProduct.id === product.id && (
                <div className="bg-white shadow-md rounded-lg p-4 mt-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Variants</h4>
                  <p>Name: {selectedProduct.handle}</p>
                  <p>ID: {selectedProduct.id}</p>
                  {selectedProduct.variants.edges.map((variant) => (
                    <div key={variant.node.id} className="flex justify-between items-center mb-2">
                      <p>{variant.node.title}</p>
                      <p>
                        {variant.node.price.amount} {variant.node.price.currencyCode}
                      </p>
                      <p>Quantity available: {variant.node.quantityAvailable}</p>
                      <button
                        onClick={() =>
                          addToCart({
                            id: `${selectedProduct.id}-${variant.node.title}`,
                            name:
                              variant.node.title !== 'Default Title'
                                ? `${selectedProduct.handle}-${variant.node.title}`
                                : selectedProduct.handle,
                            quantity: parseInt(variant.node.quantityAvailable),
                            price: parseFloat(variant.node.price.amount),
                          })
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )} */}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;