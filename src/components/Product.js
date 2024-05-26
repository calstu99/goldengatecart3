"use client";

import React from "react";
import { useCart } from "./CartContext";
import { toast } from 'react-hot-toast';

const Product = ({ product }) => {
  const { addToCart, cart } = useCart();
  const isProductInCart = cart.some((item) => item.id === product.id);
  const isProductAvailable = product.quantity > 0;

  const handleAddToCart = () => {
    addToCart(product);
    // https://codenestors.com/blog/react-hot-toast-setup-in-next-js
    // https://react-hot-toast.com/
    toast.success(`${product.name} has been added to your cart.`,
    {
      duration: 3000, // Display duration in milliseconds
      position: 'bottom-right', // Change toast position
      style: {
        // Customize style
        border: '2px solid #333',
        color: '#fff',
        backgroundColor: '#333',
      },
    }
  ); // Displays a success message
  };

  return React.createElement(
    "div",
    { className: "border rounded-lg p-4 shadow-md" },
    React.createElement("h2", { className: "text-lg font-semibold" }, product.name),
    React.createElement("p", { className: "text-gray-400" }, `$${product.price.toFixed(2)}`),
    React.createElement("br", null),
    isProductAvailable
      ? React.createElement(
          "button",
          {
            // onClick: () => addToCart(product),
            onClick: handleAddToCart,
            disabled: isProductInCart,
            className: `px-2 py-1.5 ${
              isProductInCart
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-yellow-500 text-white hover:bg-blue-600"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-xs`,
          },
          isProductInCart ? "Added to Cart" : "Add to Cart"
        )
      : React.createElement(
          "p",
          { className: "text-red-500 font-semibold" },
          "Sold out!"
        )
  );
};

export default Product;