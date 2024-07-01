"use client";

import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from "./CartContext";
import  { useState, useEffect } from 'react';
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

import { Dancing_Script } from 'next/font/google';
import requireAuth from "@/app/utils/requireAuth";



import { signOut, useSession } from "next-auth/react";

import Image from 'next/image';
// import logo from '../../public/next.svg';
// import logo from '../components/logo.svg';
import logo from '../../public/images/logo.png';

import { Button } from './ui/button';
import {ShoppingBag, ShoppingCart, Menu, Minimize2, User} from 'lucide-react';
import {
    Sheet,
       SheetTrigger,
       SheetFooter,
       SheetContent,
       SheetClose,
  } from "../components/ui/sheet";

  import {links} from '@/app/utils/constants';

// const links = [
//     { name: "Home", href: "/" },
//     { name: "Men", href: "/Men" },
//     { name: "Women", href: "/Women" },
//     { name: "Teens", href: "/Teens" },
//   ];

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: '700' });



const Nav = () => {
    const pathname = usePathname();
    const {cart, openCart} = useCart();
    const [totalQuantity,setTotalQuantity] = useState(0);
    const [isSticky, setIsSticky] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { data: session } = useSession();
    console.log('session',session);

    const isAuthorized = requireAuth(true); // Pass true for adminOnly

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

    const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
      console.log('clicked mobile');
    };

  return (
    <Sheet >
      {/* <header className="mb-8 border-b"> */}
      <header className={`${isSticky ? 'sticky' : ''} mb-8 border-b`}>
        <div className="flex items-center justify-between mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl">
          <Link href="/">
          <h1 className={`${dancingScript.className} text-2xl md:text-3xl lg:text-4xl`}>True
          <span className="text-nav-text-800">Rosa</span>
          </h1>
          {/* <h1 className="text-lg md:text-xl font-bold">
              True<span className="text-primary">Rosa</span>
            </h1> */}
          </Link>
          <Image
            src={logo}
            alt="Logo"
            width={75}
            height={75}
            className='ml-4'
      
          />
          
          <nav className="hidden gap-12 lg:flex 2xl:ml-16 px-8">
            {links.map((link, idx) => (
              <div key={idx}>
               {pathname === link.href ? (
                  <Link
                    className="text-lg font-semibold text-nav-text-800"
                    href={link.href}
                  >
                   <span className="text-sm font-semibold">{link.name}</span>
                  </Link>
                ) : (
                  <Link
                    href={link.href}
                    className="text-lg font-semibold text-gray-600 transition duration-100 hover:text-nav-text-300"
                  >
                    <span className="text-sm font-semibold">{link.name}</span>
                  </Link>
                )}
              </div>
            ))}

             {/*  Object.values(links) instead of just links. This converts the object into an array of its values, which you can then map over. */}
                 
                  {/* {Object.values(links).map((link, idx) => (
                    <div key={idx}>
                      {pathname === link.href ? (
                        <Link
                          className="text-lg font-semibold text-primary"
                          href={link.href}
                        >
                          <span className="text-sm font-semibold">{link.name}</span>
                        </Link>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-lg font-semibold text-gray-600 transition duration-100 hover:text-primary"
                        >
                          <span className="text-sm font-semibold">{link.name}</span>
                        </Link>
                      )}
                    </div>
                  ))} */}
            
            {
              isAuthorized &&
              (<Link href="/admin/orders/update/master">
                <span className="text-sm font-semibold">Admin </span>
              </Link>)
            }
           
          </nav>
          {/* https://tailwindcss.com/docs/divide-color*/}
          <div className="flex sm:border-1 border-solid border-gray-100 mx-10">
            <button
              variant={"outline"}
              onClick={() => openCart()}
              className="py-4 px-1 relative border-2 border-transparent text-gray-800 rounded-full hover:text-gray-400 focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out"
              aria-label="Cart"
            >
              <ShoppingCart size={25} color="#6d28d9" strokeWidth={1} />
              {totalQuantity > 0 && (
                <span className="absolute inset-0 object-right-top -mr-6">
                  <div className="inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-light leading-4 bg-red-500 text-white">
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

            {/* <div className="flex flex-1 items-center justify-end gap-x-2">
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
            </div> */}



          </div>
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
                    className="ml-2 hidden lg:block rounded-md bg-purple-500 px-3 py-2 border border-gray-500 border-1 text-xs font-semibold text-white shadow-sm hover:bg-slate-50 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                <User/>
                  {/* <span className="ml-10 text-sm">{session.user?.email}</span> */}

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
                <button
                className="lg:hidden"
                onClick={toggleMobileMenu}
                aria-label="Toggle Menu"
              >
                <Menu className="w-6 h-6 mr-4" />
              </button>
            </div>

            {/* {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className={`${
                    pathname === link.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  } block px-3 py-2 rounded-md text-base font-medium`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  {session ? (
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {session.user?.email}
                    </span>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Log in
                      </Link>
                      <Link
                        href="/register"
                        className="ml-2 bg-purple-500 text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
                <div className="ml-3">
                  {session && (
                    <button
                      onClick={() => {
                        signOut();
                      }}
                      className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Log out
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )} */}

          <Dialog open={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} className="relative z-50">
            <div>
              <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                {/* <DialogTitle className="font-bold">Deactivate account</DialogTitle> */}
                {/* <p>Are you sure you want to deactivate your account? All of your data will be permanently removed.</p> */}
                {/* <p>Golden Gate Cart</p>
                <Image
                  width={50}
                  height={50}
                  src={logo}
                  alt="star logo mobile"
                /> */}
                <div className="flex items-center justify-center mt-10">
                  {/* <p className="text-xl md:text-2xl font-bold mr-2">
                    Golden Gate<span className="text-primary">Cart</span>
                  </p> */}
                  <h1 className={`${dancingScript.className} text-2xl md:text-3xl lg:text-4xl`}>True
                    <span className="text-primary">Rosa</span>
                  </h1>
                  <Image
                    src={logo}
                    alt="Logo"
                    width={40}
                    height={40}
                    className="ml-2"
                  />
                </div>
             
               
                <div className="lg:hidden">
                
                  <div className="pt-4 pb-3 border-t border-gray-700">
                  <br />
                    <div className="flex items-center px-5">
                      <div className="flex-shrink-0">
                        {session ? (
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                            {session.user?.email}
                          </span>
                        ) : (
                          <>
                            <Link
                              href="/login"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                              Log in
                            </Link>
                            <Link
                              href="/register"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="ml-2 bg-purple-500 text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                              Sign up
                            </Link>
                          </>
                        )}
                      </div>
                      <div className="ml-3">
                        {session && (
                          <button
                            onClick={() => {
                              signOut();
                            }}
                            className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                          >
                            Log out
                          </button>
                          
                        )}
                      </div>
                      <button className="ml-auto" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="rounded-full bg-gray-200 p-2">
                          <Minimize2 />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                <br /><br />
       
              </DialogPanel>
            </div>
          </Dialog>

          <div>
          </div>
        </div>
      </header>
    </Sheet>
  );
  
}
export default Nav
