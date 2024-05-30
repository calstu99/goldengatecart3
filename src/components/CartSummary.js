'use client'; // This is a Client Component

import { useContext } from 'react';
// import { CartContext } from './CartContext';
import { useCart } from "./CartContext";

const CartSummary = () => {
//   const { cart } = useContext(CartContext);
  const {cart, openCart} = useCart();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.quantity * item.price, 0);

  const handleClick = () => {
    openCart();
  };

  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-green-500 text-white shadow-lg rounded-lg px-5 py-3 opacity-80 lg:block hidden"
    onClick={handleClick}
    >
    <div className="flex items-center justify-end mb-2 text-sm">
    <span> {totalItems > 1 ? `${totalItems} items` : `${totalItems === 1 ? `${totalItems} item` : '0 items'}`}  </span>
   
    </div>
    <div className="flex items-center justify-between bg-white rounded-lg p-3">
      {/* <span className="font-semibold">Total Price: </span> */}
      {/* <span className='text-green-600 text-xs '>${totalPrice.toFixed(2)}</span> */}
      <span className='text-green-600 text-xs '>${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </div>
  </div>
  );
};

export default CartSummary;