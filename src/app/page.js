import React from 'react'
import Hero from './Hero';
import Newest from './Newest';
// import ProductList from '../app/data/products3';
// import LandingPage from './data/products7';
import LandingPage from './landing';


const Home = () => {
  return (
    <>
    <div className='bg-slate-50'>
    <Hero/>
    <LandingPage/>
    </div>
    </>
   )
}

export default Home