"use client";
// landing page to show all the details along with variants of the Shopify Storefront API
import React, { useState, useEffect } from 'react';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { useCart } from "@/components/CartContext";
import ProductCard from '@/components/ProductCard';
import ProductVariants from '@/components/ProductVariants';
import { ShoppingBasket} from 'lucide-react';
import Link from "next/link";
import Image from 'next/image';
import Zoom from 'react-medium-image-zoom';

import { metadata } from './metadata';

import {landingPageText} from '@/app/utils/constants';
import {getAllProductsQuery} from '@/app/utils/ShopifyQuery';


// Add this line at the top level of your file, outside of any component
export { metadata };


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
// const collectionHandlesToFetch = process.env.NEXT_PUBLIC_COLLECTION_HANDLES_TO_FETCH.split(',');


const collectionHandlesToFetch = process.env.NEXT_PUBLIC_COLLECTION_HANDLES_TO_FETCH.split(',').map(function (value) {
  return value.trim();
});


// GraphQL query to Shopify
// const getAllProductsQuery = `
// query getAllProducts($first: Int, $after: String) {
//   products(first: $first, after: $after) {
//     pageInfo {
//       hasNextPage
//       endCursor
//     }
//     edges {
//       node {
//         id
//         title
//         handle
//         description
//         tags
//         priceRange {
//           minVariantPrice {
//             amount
//             currencyCode
//           }
//           maxVariantPrice {
//             amount
//             currencyCode
//           }
//         }
//         totalInventory
//         variants(first: 10) {
//           edges {
//             node {
//               id
//               title
//               sku
//               availableForSale
//               price {
//                 amount
//                 currencyCode
//               }
//               compareAtPrice {
//                 amount
//                 currencyCode
//               }
//               quantityAvailable
//               image {
//                 src
//                 altText
//               }
//             }
//           }
//         }
//         images(first: 5) {
//           edges {
//             node {
//               src
//               altText
//             }
//           }
//         }
//         collections(first: 10) {
//           edges {
//             node {
//               id
//               title
//               handle
//             }
//           }
//         }
//       }
//     }
//   }
// }
// `;


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
  // const bestSellerProducts = products.filter(product => product.tags.includes("best seller")).slice(0, 3);
   const bestSellerProducts = products.filter(product => product.tags.includes("best seller")).slice(0, 4);

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
        
        {/* <h1 className="text-2xl font-bold text-gray-900 ">Our Best Sellers</h1> */}
        <h1>{console.log('bestseller',bestSellerProducts)}</h1>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {
            bestSellerProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onShowVariants={showVariants}
                onAddToCart={addToCart}
                selectedProduct={selectedProduct}
                onCloseVariants={() => setSelectedProduct(null)}
              />
            ))
          }
        </div> */}


<div className="mx-auto container flex justify-center items-center bg-stone-800 py-12 px-4 sm:px-6 2xl:px-4">
  {/*- more free and premium Tailwind CSS components at https://tailwinduikit.com/ -*/}
  
  <div className="flex flex-col  lg:flex-row justify-center items-center space-y-6 lg:space-y-0">
    
    
    <div className="w-80 sm:w-auto flex flex-col justify-start items-start">
      <div>
        <p className="text-3xl xl:text-4xl mr-4 font-semibold leading-9 text-white dark:text-white">
          Shop Best-Sellers
        </p>
      </div>
      <div className="mt-4 lg:w-4/5 xl:w-3/5">
      <p className="text-sm leading-6 text-white uppercase">
         {landingPageText.MainText}
        </p>
        <br/>
        <p className="text-sm leading-6 text-white uppercase">
         {landingPageText.holidayText}
        </p>
      </div>
     
              <Link
                // href="/specials?collectionHandles=best-sellers"
                href={`/specials?collectionHandles=${process.env.NEXT_PUBLIC_BEST_SELLERS}`}
                className=" w-full"
              >
                <div className="mt-16 w-full">
                  <button className="px-3 bg-white dark:bg-white flex justify-between items-center w-full lg:w-48 h-10 text-grey-900 hover:bg-slate-100 focus:ring-2 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 ">
                    <p className="text-base text-grey-900 font-medium leading-5 ">SHOP NOW</p>
                    <svg
                      className="dark:text-gray-900"
                      width={32}
                      height={32}
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.66663 16H25.3333"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20 21.3333L25.3333 16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20 10.6667L25.3333 16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </Link>  
       
    </div>

    
    <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-5 xl:space-x-8 space-y-4 sm:space-y-0">
        {bestSellerProducts.map((product, idx) => (
          <div key={idx} className="overflow-hidden rounded-lg bg-gray-100">
            <Zoom>
              <Image
                src={product.images.edges[0].node.src}
                width={600}
                height={600}
                alt="photo"
                className="h-full w-full object-cover object-center cursor-pointer lg:w-[300px] lg:h-[300px] md:w-[100px] md:h-[100px]"
              />
            </Zoom>
          </div>
        ))}
      </div>
  
  
  </div>
</div>



    {/* {bestSellerProducts.images.edges.length > 0 && (
        <img
          src={bestSellerProducts.images.edges[0].node.src}
          alt={bestSellerProducts.images.edges[0].node.altText}
          className="h-64 w-full object-cover"
          style={{ padding: '1rem' }}
          // onClick={() => onShowVariants(product)} // Added onClick event here
        />
      )} */}
        

        
        {/* <Link
          href="/specials?collectionHandles=best-sellers"
          className="ml-2"
        >
           <ShoppingBasket color="#3e9392" size={80} strokeWidth={0.6} fill="#bae2e2"/>
        </Link>      */}
      <br/>

        <div className="mb-4 text-sm">
          <input
            type="text"
            placeholder="Search Products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border border-gray-300 text-sm text-center rounded-md  focus:outline-teal-400 focus:outline-1 focus:outline  py-2 px-4 mr-2 "
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