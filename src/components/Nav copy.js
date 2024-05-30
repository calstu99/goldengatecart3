"use client";

import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from "./CartContext";
import  { useState, useEffect } from 'react';

import { signOut, useSession } from "next-auth/react";

import Image from 'next/image';
// import logo from '../../public/next.svg';
import logo from '../components/logo.svg';

import { Button } from './ui/button';
import {ShoppingBag, ShoppingCart} from 'lucide-react';
import {
    Sheet,
       SheetTrigger,
       SheetFooter,
       SheetContent,
       SheetClose,
  } from "../components/ui/sheet";

const links = [
    { name: "Home", href: "/" },
    { name: "Men", href: "/Men" },
    { name: "Women", href: "/Women" },
    { name: "Teens", href: "/Teens" },
  ];

const Nav = () => {
    const pathname = usePathname();
    const {cart, openCart} = useCart();
    const [totalQuantity,setTotalQuantity] = useState(0);
    const [isSticky, setIsSticky] = useState(false);

    const { data: session } = useSession();
    console.log('session',session);

    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 20) {
          setIsSticky(true);
          console.log('scrolling');
        } else {
          setIsSticky(false);
        }
      };
  
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);

    useEffect(() => {
    const calculateTotalQuantity = () => {
      return cart.reduce((total,product) => total + product.quantity,0);
    };
    setTotalQuantity (calculateTotalQuantity());
    }, [cart]);

  return (
    <Sheet >
      {/* <header className="mb-8 border-b"> */}
      <header className={`${isSticky ? 'sticky' : ''} mb-8 border-b`}>
        <div className="flex items-center justify-between mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl">
          <Link href="/">
            <h1 className="text-2xl md:text-4xl font-bold">
              GoldenGate<span className="text-primary">Cart </span>
            </h1>
          </Link>
          <Image
            src={logo}
            alt="Logo"
            width={40}
            height={40}
      
          />
          <nav className="hidden gap-12 lg:flex 2xl:ml-16">
            {links.map((link, idx) => (
              <div key={idx}>
                {pathname === link.href ? (
                  <Link
                    className="text-lg font-semibold text-primary"
                    href={link.href}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <Link
                    href={link.href}
                    className="text-lg font-semibold text-gray-600 transition duration-100 hover:text-primary"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
          {/* https://tailwindcss.com/docs/divide-color*/}
          <div className="flex sm:border-1 border-solid border-gray-100 ">
            <button
              variant={"outline"}
              onClick={() => openCart()}
              className="py-4 px-1 relative border-2 border-transparent text-gray-800 rounded-full hover:text-gray-400 focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out"
              aria-label="Cart"
            >
              <ShoppingCart size={25} color="#6d28d9" strokeWidth={1} />
              {totalQuantity > 0 && (
                <span className="absolute inset-0 object-right-top -mr-6">
                  <div className="inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 bg-red-500 text-white">
                    {totalQuantity}
                  </div>
                </span>
              )}
            </button>
            {/* <button  
            onClick={() => { signOut(); }}>
              Login
            </button>
            <button  
            onClick={() => { signOut(); }}>
              Logout
            </button> */}

            <div className="flex flex-1 items-center justify-end gap-x-2">
              {!session ? (
                <>
                  <Link
                    href="/login"
                    className=" ml-2 hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="ml-2 rounded-md bg-purple-500 px-3 py-2 border border-gray-500 border-1 text-xs font-semibold text-white shadow-sm hover:bg-slate-50 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  <span className="ml-10 text-sm">{session.user?.email}</span>

                  <button
                    onClick={() => {
                      signOut();
                    }}
                    className="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900"
                  >
                    Log out
                  </button>
                </>
              )}
            </div>



          </div>
        


          <div>
          </div>
        </div>
      </header>
    </Sheet>
  );
  
}
export default Nav
