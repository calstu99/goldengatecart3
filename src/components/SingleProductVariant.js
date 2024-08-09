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

const ProductVariants = ({ selectedProduct, onCloseVariants }) => {
  const modalRef = useRef(null);
  const { cart, addToCart } = useCart();
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCloseVariants();
        //console.log('clicked outside modal');
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

  return (
    <div className="product-variants-overlay">
      <div className="product-variants-modal" ref={modalRef}>
        <div className="bg-white shadow-md rounded-lg p-4 mt-4 mx-2">
       <h1>
        Render here!
       </h1>
       <h1>
        Render here!
       </h1>
        </div>
      </div>
    </div>
  );
};

export default ProductVariants;