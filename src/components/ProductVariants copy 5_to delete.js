"use client";

import React, { useEffect, useRef, useState } from 'react';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { useCart } from "./CartContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star,Truck,Minimize2 } from 'lucide-react';

import Rating from './Rating'; 

import ImageGallery from  '@/components/ImageGallery';

import {useSession } from "next-auth/react";


const ProductVariants = ({ selectedProduct, addToCart, onCloseVariants }) => {
  const modalRef = useRef(null);
  const { cart } = useCart();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { data: session } = useSession();
  console.log('session user', session?.user?.email);

  const rating = selectedProduct.tags.includes("high") ? 4.8 : selectedProduct.tags.includes("medium") ? 3.9 : 2.2;


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCloseVariants();
        console.log('clicked outside modal');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCloseVariants]);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };


  const getColorClass = (color) => {
    switch (color) {
      case 'black':
        return 'bg-black';
      case 'red':
        return 'bg-red-500';
      case 'blue':
        return 'bg-blue-500';
      case 'white':
        return 'bg-zinc-50';
      // Add more cases for additional colors
      default:
        return 'bg-red-500';
    }
  };
  
  // <ImageGallery images={selectedProduct.images.edges}/>
  return (
    <div className="product-variants-overlay">
      <div className="product-variants-modal" ref={modalRef}>
        <div className="bg-white rounded-lg p-4 mt-4 mx-2">

          <button className="ml-auto" onClick={onCloseVariants}>
            <div className="rounded-full bg-gray-300 p-2">
              <Minimize2 size={35} strokeWidth={1.0}/>
            </div>
          </button>
          <br/>
          <br/>

          {selectedProduct.variants.edges.length === 1 ? (
            <>
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-1">
                  <div className='lg:text-xl md:text-xs text-slate-700 hover:text-blue-600 font-semibold mb-4'>
                    {selectedProduct.title}
                  </div>                  
                  <ImageGallery images={selectedProduct.images.edges} />
                </div>
                <div className="flex-1 px-6">
                  <p className="text-sm text-gray-950 font-medium mb-2 mt-20">{selectedProduct.title}</p>
                  <div className="mb-6 flex items-center md:mb-10">
                    {/* <button className="flex items-center gap-2 rounded-full bg-violet-500 px-3 py-1">
                      <span className="text-sm font-semibold text-white">
                        {selectedProduct.tags.includes("high") ? 4.5 : selectedProduct.tags.includes("medium") ? 3.9 : 2.2}
                      </span>
                      <Star className="h-5 w-5 text-white" size={25} />
                    </button> */}
                    <button className="flex items-center gap-2 rounded-full bg-violet-500 px-3 py-1">
                      <span className="text-sm font-semibold text-white">
                        {rating}
                      </span>
                      <Rating rating={Math.round(rating)} />
                    </button>
                  </div>
                  {/* <p className="text-xs text-gray-500 font-normal line-clamp-6 mb-2">{selectedProduct.description}</p> */}
                  <p className="text-sm text-gray-950 font-medium mb-2">About this item:</p>
                  <p className={`text-xs text-gray-500 font-normal mb-2 ${showFullDescription ? '' : 'line-clamp-3'}`}>
                    {selectedProduct.description}
                  </p>
                  {/* <p className="text-sm mb-2">
                        ${selectedProduct.priceRange.minVariantPrice.amount}
                      </p> */}
                  <button
                    onClick={toggleDescription}
                    className="text-blue-500 hover:text-blue-700 font-medium text-xs mb-2"
                  >
                    {showFullDescription ? 'Less' : 'Read More'}
                  </button>
                  <div className="flex items-end gap-2">
                    <span className="text-xl font-bold text-gray-800 md:text-2xl">
                      ${(Math.round(selectedProduct.priceRange.minVariantPrice.amount * 100) / 100).toFixed(2)}
                    </span>
                    <span className="mb-0.5 text-red-500 line-through">
                      ${(selectedProduct.priceRange.minVariantPrice.amount * 1.70).toFixed(2)}
                    </span>
                  </div>
                  <div className="mb-6 flex items-center gap-2 text-gray-500">
                    <Truck className="w-6 h-6" />
                    <span className="text-sm">2-4 Day Free Shipping</span>
                  </div>
                  <div>
                    <br />
                    {selectedProduct.totalInventory > 0 ? (
                      <button
                        onClick={() =>
                          addToCart({
                            id: selectedProduct.id,
                            name: selectedProduct.title,
                            quantity: parseInt(selectedProduct.totalInventory),
                            price: parseFloat(
                              session
                                ? selectedProduct.priceRange.minVariantPrice.amount * 1.0
                                : selectedProduct.priceRange.minVariantPrice.amount
                            ),
                            imageUrl: selectedProduct.images.edges[0].node.src,
                          })
                        }
                        className={`bg-blue-500 hover:bg-grey-600 text-white font-medium py-2 px-4 rounded text-xs ${cart.some((item) => item.id === selectedProduct.id)
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          : 'bg-green-500 hover:bg-green-600'
                          }`}
                        disabled={cart.some((item) => item.id === selectedProduct.id)}
                      >
                        {cart.some((item) => item.id === `${selectedProduct.id}`)
                          ? 'Added to Cart'
                          : 'Add to Cart'}
                      </button>
                      


                    ) : (
                      <p className="text-red-500 font-medium text-lg">Sold Out</p>
                    )}

                    <span className="text-gray-500 text-sm ml-4">
                      {0 < selectedProduct.totalInventory && selectedProduct.totalInventory < 6 ? (
                        <span className="text-red-500">Almost sold out</span>
                      ) : (
                        <span>{selectedProduct.totalInventory > 0 ? `${selectedProduct.totalInventory} items left` : null}</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Carousel>
              <CarouselContent>
                {selectedProduct.variants.edges.map((variant) => (
                  <CarouselItem key={variant.node.id} className="flex">
                    <div className="w-1/2 pr-4">
                      {/* <h2>Number of items: {selectedProduct.variants.edges.length}</h2> */}
                      {/* <div className='text-2xl text-slate-700 hover:text-blue-600 font-extrabold'>{selectedProduct.title}</div> */}
                      <div className='lg:text-xl md:text-lg text-slate-700 hover:text-blue-600 font-semibold mb-4'>
                        {selectedProduct.title}
                      </div>
                      {variant.node.image && (
                        <Zoom>
                          <img
                            alt={variant.node.title}
                            src={variant.node.image.src}
                            width="600"
                            style={{ padding: '1rem' }}
                          />
                        </Zoom>
                      )}
                    </div>
                    <div className="w-1/2 pl-4">
                      <p className="text-md text-gray-950 font-medium mb-2">{selectedProduct.title} - {variant.node.title}</p>
                      <p className="text-sm text-gray-950 font-medium mb-2">About this item:</p>
                      {/* <p className="text-xs text-gray-500 font-normal line-clamp-6 mb-2">{selectedProduct.description}</p> */}
                      <p className={`text-xs text-gray-500 font-normal mb-2 ${showFullDescription ? '' : 'line-clamp-3'}`}>
                        {selectedProduct.description}
                      </p>
                      <button
                        onClick={toggleDescription}
                        className="text-blue-500 hover:text-blue-700 font-medium text-xs mb-2"
                      >
                        {showFullDescription ? 'Less' : 'Read More'}
                      </button>
                      <p className="text-sm mb-2">
                        {variant.node.price.currencyCode === 'USD' ? '$' : ''}{variant.node.price.amount}
                      </p>
                      {/* Extract size and color from variant.node.title */}
                      {/* Extract size and color from variant.node.title */}
                      {variant.node.title.match(/\/(.*?)\//)?.[1] && (
                        <p className="text-sm text-gray-500 font-medium mb-2">
                          Size: {variant.node.title.match(/\/(.*?)\//)[1]}
                        </p>
                      )}
                      {variant.node.title.match(/\s(.*)/)?.[1] && (
                        <p className="text-sm text-gray-500 font-medium mb-2">
                          Color: {variant.node.title.match(/\s(.*)/)[1].replace(/\//g, '')}
                        </p>
                      )}
                      {variant.node.quantityAvailable > 0 ? (
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
                              imageUrl: variant.node.image.src,
                            })
                          }
                          className={`text-white font-medium py-2 px-4 rounded text-xs ${cart.some((item) => item.id === `${selectedProduct.id}-${variant.node.title}`)
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600'
                            }`}
                          disabled={cart.some((item) => item.id === `${selectedProduct.id}-${variant.node.title}`)}
                        >
                          {cart.some((item) => item.id === `${selectedProduct.id}-${variant.node.title}`)
                            ? 'Added to Cart'
                            : 'Add to Cart'}
                        </button>
                      ) : (
                        <p className="text-red-500 font-medium text-xs">Sold Out</p>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
        </div>
      </div>
    </div>
  );

  


  
};

export default ProductVariants;