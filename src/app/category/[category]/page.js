

import { Button } from "../../../components/ui/button";
import { Star, Truck } from "lucide-react";
import products from "../../../app/data/products";
import ImageGallery from "../../../components/ImageGallery";



import React from 'react'

const page = ({
    params,
  }) => {

  const product = products.find((p) => p.category === params.category);
  console.log('category',params.category);
  if (!product) {
    return <div>Category not found</div>;
  }



  return (
    <section className="mx-auto max-w-2xl px-4 sm:pb-6 lg:max-w-7xl lg:px-8">
      
    <div>
      {/* <img src={product.imageUrl} alt={product.name} /> */}
      <ImageGallery images={product.images} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ${product.price.toFixed(2)}</p>
      <p>Quantity: {product.quantity}</p>
      
    </div>

    </section>
  )
};

export const generateStaticParams = () => {
  // Get the unique categories from the products array
  const categories = Array.from(new Set(products.map((product) => product.category)));

  // Return an array of objects representing the possible values for the slug parameter
  return categories.map((category) => ({ slug: category }));
};

export default page
