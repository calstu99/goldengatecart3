"use client";
// landing page to show all the details along with variants of the Shopify Storefront API
import React, { useState, useEffect } from 'react';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { useCart } from "../../components/CartContext";
import ProductCard from '../../components/ProductCard';
import ProductVariants from '../../components/ProductVariants';
import {getAllProductsQuery} from '@/app/utils/ShopifyQuery';
import {link_descriptions} from '@/app/utils/constants';

import {useSession } from "next-auth/react";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// (Storefront API client configuration and GraphQL query)

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION,
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_PUBLIC_ACCESS_TOKEN,
});

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart, cart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [description, setDescription] = useState('Select from our best products');

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: session } = useSession();
 

  

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        let cursor = null;
        let allProducts = [];

        // Access router properties and methods
        // console.log(router.asPath); // Current URL

        // Access pathname
        // console.log('pathname',pathname); // e.g., '/products'

        // Access search params
        // console.log('search params:',searchParams.get('collectionHandles')); // Get the value of the 'search' query param

        /*
        // To extract the "knives" value from the query parameter "collectionHandles" in the
         URL "http://localhost:3000/specials?collectionHandles=knives" using the next/navigation
          package in Next.js 13, you can use the useSearchParams hook.
        
        */
        const collectionHandlesFromURL = searchParams.getAll('collectionHandles');

        // console.log('urlParams',urlParams);
        console.log('collectionHandles', collectionHandlesFromURL);

        


        // const collectionHandlesToFetch = collectionHandlesFromURL
        //   ? collectionHandlesFromURL
        //   : process.env.NEXT_PUBLIC_COLLECTION_HANDLES_TO_FETCH.split(',');

        // Convert collectionHandlesFromURL to a string
        const collectionHandlesToFetch = collectionHandlesFromURL
          ? (collectionHandlesFromURL.toString() || '').split(',')
          : process.env.NEXT_PUBLIC_COLLECTION_HANDLES_TO_FETCH.split(',');


         // Find the description based on the collection handles
        const matchingDescription = collectionHandlesToFetch.find(
          (handle) => link_descriptions[handle]
        );
        setDescription(matchingDescription ? link_descriptions[matchingDescription] : 'Select from our best products');


        while (true) {
          const { data, errors } = await client.request(getAllProductsQuery, {
            variables: { first: 250, after: cursor },
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

    fetchAllProducts();


  }, [searchParams]);


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

    <>

      <section className="px-2 py-2 bg-white md:px-0">
        <div className="container items-center max-w-6xl px-8 mx-auto xl:px-5">
          <div className="flex flex-wrap items-center sm:-mx-3">

            <div className="w-full md:w-2/3 md:px-3">
              <div className="w-full pb-6 space-y-6 sm:max-w-md lg:max-w-lg md:space-y-4 lg:space-y-8 xl:space-y-9 sm:pr-5 lg:pr-0 md:pb-0">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-xl md:text-3xl lg:text-3xl xl:text-4xl">
                  <span className="block xl:inline">Shop with Us </span>
                  <span className="block text-primary xl:inline">
                    Order Now!
                  </span>
                </h1>
                <p className="mx-auto text-base text-gray-500 sm:max-w-md lg:text-xl md:max-w-3xl">
                  {/* It's never been easier to get the best value for you money. One stop shop. */}
                 {description}
                </p>
                <div>
                  {/* {!session && <h1>Login for our discounts!</h1>} */}
                </div>

                {!session &&

                  <div className="relative flex flex-col sm:flex-row sm:space-x-4">
                    <a
                      href="/login"
                      className="flex items-center w-full px-6 py-3 mb-3 text-lg text-white bg-indigo-600 rounded-md sm:mb-0 hover:bg-indigo-700 sm:w-auto"
                    >
                      Login for discounts

                    </a>
                    <a
                      href="/register"
                      className="flex items-center px-6 py-3 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 hover:text-gray-600"
                    >
                      Sign up
                    </a>
                  </div>
                }


              </div>
            </div>
            <div className="w-full md:w-1/3">
              {/* <div className="w-full h-auto overflow-hidden rounded-md shadow-xl sm:rounded-xl">
                <img src="https://images.unsplash.com/photo-1498049860654-af1a5c566876?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=8" />
              </div> */}

<div className="w-full h-auto overflow-hidden rounded-md shadow-xl sm:rounded-xl">
  <img
    // src="https://images.pexels.com/photos/6238368/pexels-photo-6238368.jpeg?auto=compress"
    src="https://images.pexels.com/photos/935760/pexels-photo-935760.jpeg?auto=compress"
    alt="Image Description"
    className="w-[100%] mx-auto"
  />
</div>
            </div>
          </div>
        </div>
      </section>


      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Featured Products</h2> */}
          <div className='mb-4'>
            {/* {session ? (
              <h1>Discount</h1>
            ) : (
              <h1>Login for your discount!</h1>
            )} */}
          </div>
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
    </>
   
  );
};

export default LandingPage;