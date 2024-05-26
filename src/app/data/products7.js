"use client";
// landing page to show all the details along with variants of the Shopify Storefront API
import React, { useState, useEffect } from 'react';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { useCart } from "../../components/CartContext";
import ProductCard from '../../components/ProductCard';
import ProductVariants from '../../components/ProductVariants';


// (Storefront API client configuration and GraphQL query)

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

// const urlParams = new URLSearchParams(window.location.search);
// console.log('urlParams',urlParams);
// const collectionHandlesFromURL = urlParams.get('collectionHandles');



// const collectionHandlesToFetch = ['men', 'knives', 'car'];
// const collectionHandlesToFetch = ['knives'];
const collectionHandlesToFetch = process.env.NEXT_PUBLIC_COLLECTION_HANDLES_TO_FETCH.split(',');



// GraphQL query to Shopify
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
        tags
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart, cart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
 

  // ... (useEffect hook for fetching products)

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const collectionHandlesFromURL = urlParams.get('collectionHandles');
  //   console.log('collectionHandlesFromURL', collectionHandlesFromURL); // Output: "collection1,collection2"
  //   console.log('urlParams', urlParams);
  // }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        let cursor = null;
        let allProducts = [];

        // Check for collectionHandles query parameter in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const collectionHandlesFromURL = urlParams.get('collectionHandles');

        console.log('urlParams',urlParams);
        console.log('collectionHandles',collectionHandlesFromURL);
        
        // If collectionHandles is provided in the URL, use it instead of the environment variable
        // const collectionHandlesToFetch = collectionHandlesFromURL
        //   ? collectionHandlesFromURL.split(',')
        //   : process.env.NEXT_PUBLIC_COLLECTION_HANDLES_TO_FETCH.split(',');


        while (true) {
          const { data, errors } = await client.request(getAllProductsQuery, {
            variables: { first: 250, after: cursor  },
          });

          if (errors) {
            console.error('GraphQL Errors:', errors);
            setError(errors);
            break;
          }

          const { products } = data;
          // allProducts = [...allProducts, ...products.edges.map((edge) => edge.node)];

          const filteredProducts = products.edges
          .map((edge) => edge.node)
          .filter((product) =>
            product.collections.edges.some(
              (edge) =>
                collectionHandlesToFetch.includes(edge.node.handle.toLowerCase())
            )
          );
  
        allProducts = [...allProducts, ...filteredProducts];

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

    };
    // Fetch products every 300 seconds
    // const interval = setInterval(fetchAllProducts, 30000); // Update every 30 seconds
    // return () => clearInterval(interval); // Clean up the interval on component unmount
    fetchAllProducts();
       // handleSearch();
      // Run handleSearch after 1 second
      // setTimeout(() => {
      //   handleSearch();
      // }, 1000);
   
  }, []);

 
  const showVariants = (product) => {
    setSelectedProduct(product);
  };

  const handleSearch = () => {
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.handle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };


  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Featured Products</h2> */}
        
        <div className="mb-4 text-sm">
          <input
            type="text"
            placeholder="Search your products here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border border-gray-300 rounded-md focus:outline-teal-400 focus:outline-1 focus:outline  py-2 px-4 mr-2 "
          />
          {/* https://stackoverflow.com/questions/74574022/change-the-focus-border-color-in-tailwind-css */}
         
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Search
          </button>
        </div>
              
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onShowVariants={showVariants}
                onAddToCart={addToCart}
                selectedProduct={selectedProduct}
                onCloseVariants={() => setSelectedProduct(null)}
              />
            ))
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onShowVariants={showVariants}
                onAddToCart={addToCart}
                selectedProduct={selectedProduct}
                onCloseVariants={() => setSelectedProduct(null)}
              />
            ))
          )}
        </div>


      </div>
    </div>
  );
};

export default LandingPage;