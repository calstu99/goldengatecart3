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



const ProductVariants = ({ selectedProduct, addToCart, onCloseVariants }) => {
  const modalRef = useRef(null);
  const { cart } = useCart();
  const [showFullDescription, setShowFullDescription] = useState(false);

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
  

  return (
    <div className="product-variants-overlay">
      <div className="product-variants-modal" ref={modalRef}>
        <div className="bg-white shadow-sm rounded-lg p-4 mt-4 mx-2">
          {selectedProduct.variants.edges.length === 1 ? (
            <Carousel>
              <CarouselContent>
                {selectedProduct.images.edges.map((image, index) => (
                  <CarouselItem key={index} className = "flex">
                    <div className="w-1/2 pr-4">
                    <div className='text-2xl text-slate-700 hover:text-blue-600 font-extrabold'>{selectedProduct.title}</div>
                    <Zoom>
                      <img
                        alt={image.node.altText}
                        src={image.node.src}
                        width="500"
                        style={{ padding: '1rem' }}
                      />
                    </Zoom>
                    </div>
                    <div className="w-1/2 pr-4">
                     
                      <p className="text-sm text-gray-950 font-medium mb-2">{selectedProduct.title}</p>
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
                      <br/>
                      {selectedProduct.totalInventory > 0 ? (
                        <button
                          onClick={() =>
                            addToCart({
                              id: selectedProduct.id,
                              name: selectedProduct.title,
                              quantity: parseInt(selectedProduct.totalInventory),
                              price: parseFloat(selectedProduct.priceRange.minVariantPrice.amount),
                              imageUrl: selectedProduct.images.edges[0].node.src,
                            })
                          }
                          className={`bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-xs ${cart.some((item) => item.id === selectedProduct.id)
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                          }`}
                          disabled={cart.some((item) => item.id === selectedProduct.id)}
                        >
                          {cart.some((item) => item.id === `${selectedProduct.id}`)
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
          ) : (
            <Carousel>
              <CarouselContent>
                {selectedProduct.variants.edges.map((variant) => (
                  <CarouselItem key={variant.node.id} className="flex">
                    <div className="w-1/2 pr-4">
                      {/* <h2>Number of items: {selectedProduct.variants.edges.length}</h2> */}
                      <div className='text-2xl text-slate-700 hover:text-blue-600 font-extrabold'>{selectedProduct.title}</div>
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
                      <p className="text-xs text-gray-500 font-normal line-clamp-6 mb-2">{selectedProduct.description}</p>
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