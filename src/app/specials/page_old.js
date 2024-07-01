"use client";
// landing page to show all the details along with variants of the Shopify Storefront API
import React, { useState, useEffect } from 'react';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { useCart } from "../../components/CartContext";
import ProductCard from '../../components/ProductCard';
import ProductVariants from '../../components/ProductVariants';
import {getAllProductsQuery} from '@/app/utils/ShopifyQuery';
import {link_headline,link_descriptions} from '@/app/utils/constants';
import Image from "next/image";

import {landingPageText, SpecialPagePics ,landingPagePics,Hero_links, Hero_offers} from '@/app/utils/constants';

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
  const [headline, setHeadline] = useState('Select from our best products');

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: session } = useSession();


  // if (session) {
  //   const { email, tier } = session.user;
  //   console.log('email and tier: ',email,tier)
  //   console.log('log session',session.user)
  //   // Use email, tier, and firstname as needed
  // }

  

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

   

        // Find the headline based on the collection handles
        const matchingHeadline = collectionHandlesToFetch.find(
          (handle) => link_headline[handle]
        );
        setHeadline(matchingHeadline ? link_headline[matchingHeadline] : '');

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

      // Update URL with the selected product's handle
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('productHandle', product.handle);
      router.push(`${pathname}?${newSearchParams.toString()}`, undefined, { shallow: true });


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

            <div className="w-full md:w-2/4 md:px-3">
              <div className="w-full pb-6 space-y-6 sm:max-w-md lg:max-w-lg md:space-y-4 lg:space-y-8 xl:space-y-9 sm:pr-5 lg:pr-0 md:pb-0">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-xl md:text-3xl lg:text-3xl xl:text-4xl">
                  <span className="block xl:inline">Deals made easy all year long.  </span>
               
                  <span className="block xl:inline font-normal text-lg mt-4">Free shipping. Best prices.  </span>
                  {/* <span className="block text-primary xl:inline">
                    Order Now!
                  </span> */}
                </h1>
                <p className="mx-auto font-bold text-base text-gray-500 sm:max-w-md lg:text-lg md:max-w-xl">
                  {/* It's never been easier to get the best value for you money. One stop shop. */}
                 {headline}
                </p>
                <p className="mx-auto font-normal text-base text-gray-500 sm:max-w-md lg:text-lg md:max-w-xl">
                  {/* It's never been easier to get the best value for you money. One stop shop. */}
                 {description}
                </p>
                <br/><br/>
                <div>
                  {/* {!session && <h1>Login for our discounts!</h1>} */}
                </div>

                {!session &&

                  <div className="relative flex flex-col sm:flex-row sm:space-x-4">
                    <a
                      href="/login"
                      className="flex items-center w-full px-4 py-2 mb-3 text-sm text-white bg-indigo-600 rounded-md sm:mb-0 hover:bg-indigo-700 sm:w-auto"
                    >
                      Login for discounts

                    </a>
                    <a
                      href="/register"
                      className="flex items-center px-4 py-2 text-sm text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 hover:text-gray-600"
                    >
                      Sign up
                    </a>
                  </div>
                }


              </div>
            </div>
            {/* <div className="w-full md:w-1/3">
             

              <div className="w-full h-auto overflow-hidden rounded-md shadow-xl sm:rounded-xl">
                <img
                  // src="https://images.pexels.com/photos/6238368/pexels-photo-6238368.jpeg?auto=compress"
                  // src="https://images.pexels.com/photos/935760/pexels-photo-935760.jpeg?auto=compress"
                  src={landingPagePics.SpecialPic2}
                  alt="Image Description"
                  className="w-[40%] mx-auto"
                />
                
              </div>
              <div className="w-full h-auto overflow-hidden rounded-md shadow-xl sm:rounded-xl">
                <img
                  // src="https://images.pexels.com/photos/6238368/pexels-photo-6238368.jpeg?auto=compress"
                  // src="https://images.pexels.com/photos/935760/pexels-photo-935760.jpeg?auto=compress"
                  src={landingPagePics.SpecialPic2}
                  alt="Image Description"
                  className="w-[40%] mx-auto"
                />
              </div>           


            </div> */}

                    <div className="w-full md:w-2/4">
                      <div className="flex justify-between space-x-4">
                        <div className="w-1/2 h-auto overflow-hidden rounded-md shadow-xl sm:rounded-xl">
                          <img
                            src={SpecialPagePics.SpecialPic1}
                            alt="Image Description"
                            className="w-full h-full object-cover"
                            // className="w-[100%] mx-auto"
                          />
                        </div>
                        <div className="w-1/2 h-auto overflow-hidden rounded-md shadow-xl sm:rounded-xl">
                          <img
                            src={SpecialPagePics.SpecialPic2}
                            alt="Image Description"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      
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
                  onCloseVariants={() => {
                    setSelectedProduct(null);
                    // Remove productHandle from URL when closing variants
                    const newSearchParams = new URLSearchParams(searchParams);
                    newSearchParams.delete('productHandle');
                    router.push(`${pathname}?${newSearchParams.toString()}`, undefined, { shallow: true });
                  }}
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