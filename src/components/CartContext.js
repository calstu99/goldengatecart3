"use client";

import React, { createContext, useContext, useState, useEffect } from "react";


const CartContext = createContext();

const CartProvider = ({ children }) => {
const [cart, setCart] = useState([]);
const [isCartOpen, setIsCartOpen] = useState(false);


const openCart = () => {
  setIsCartOpen(true);
  // localStorage.setItem('openCartModal','true');
//  console.log('clicked open cart');
}

const closeCart = () => {
  setIsCartOpen(false);
  // localStorage.setItem('openCartModal','false');
} 

const clearCart = () => {
  setCart([]);
}
 
// adding retrieval from localStorage
useEffect(() => {
  // Retrieve cart state from local storage on component mount
  const storedCart = localStorage.getItem('cartItems');
  if (storedCart) {
    setCart(JSON.parse(storedCart));
  }
}, []);

useEffect(() => {
  const data = JSON.stringify(cart);
  window.localStorage.setItem('cartItems', data)
}, [cart]);


  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex(
      (item) => item.id === product.id
    );

    if (existingProductIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
      setCart(updatedCart);
      // console.log('cart',cart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
  };

  const incrementQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCart(updatedCart);
  };

  const decrementQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId
        ? { ...item, quantity: item.quantity > 0 ? item.quantity - 1 : 0 }
        : item
    );
    const filteredCart = updatedCart.filter((item) => item.quantity > 0);
    setCart(filteredCart);
  };


  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen);
    // console.log('clicked', newOpen);
  };


  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        isCartOpen,
        openCart,
        closeCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartContext, CartProvider, useCart };
