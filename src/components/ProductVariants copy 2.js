import React, { useEffect, useRef } from 'react';
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

  return (
    <div className="product-variants-overlay">
      <div className="product-variants-modal" ref={modalRef}>
        <div className="bg-white shadow-md rounded-lg p-4 mt-4 mx-2">
          <div className="flex flex-col items-center mb-4">
            <button
              onClick={onCloseVariants}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded mb-4 text-sm"
            >
              Close
            </button>
            <h4 className="text-lg font-medium text-gray-900">Our Selections</h4>
          </div>
          {/* <p className="text-sm">Name: {selectedProduct.handle}</p> */}
          {/* <p className="text-sm">ID: {selectedProduct.id}</p> */}

          <Carousel>
            <CarouselContent>
              <CarouselItem>...</CarouselItem>
              <CarouselItem>...</CarouselItem>
              <CarouselItem>...</CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          {selectedProduct.variants.edges.map((variant) => (
            <div key={variant.node.id} className="flex flex-col items-center mb-4">
              {/* {variant.node.image && (
                <img
                  src={variant.node.image.src}
                  alt={variant.node.title}
                  className="variant-image mb-2"
                />
              )} */}
                  {variant.node.image && (
                <Zoom>
                <img
                  alt={variant.node.image.src}
                  src={variant.node.image.src}
                  width="200"
                  style={{ padding: '1rem' }}
                />
              </Zoom>
              )}

              <div className="flex justify-between items-center w-full mt-1">
                <p className="text-sm">{variant.node.title}</p>
                      <p className="text-sm">
                          {variant.node.price.currencyCode === 'USD' ? '$' : ''}{variant.node.price.amount}
                      </p>

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
                                      imageUrl:variant.node.image.src,
                                  })
                              }
                              className={`bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-xs ml-2 ${
                                cart.some((item) => item.id === `${selectedProduct.id}-${variant.node.title}`)
                                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                  : 'bg-blue-500 hover:bg-blue-600'
                              }`}
                            //   className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-xs ml-2"
                          >
                              {cart.some((item) => item.id === `${selectedProduct.id}-${variant.node.title}`)
                                  ? 'Added to Cart'
                                  : 'Add to Cart'}
                          </button>
                      ) : (
                          <p className="text-red-500 font-medium text-xs ml-2">Sold Out</p>
                      )}


              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductVariants;
