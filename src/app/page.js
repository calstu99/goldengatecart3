import React from 'react'
import Hero from './Hero';
import Newest from './Newest';
// import ProductList from '../app/data/products3';
// import LandingPage from './data/products7';
import LandingPage from './landing';
import CartSummary from '@/components/CartSummary';


const Home = () => {
  return (
    <>
    <div className='bg-slate-50'>
    <Hero/>
    <LandingPage/>
    <CartSummary /> 
    </div>
    </>
   )
}

export default Home