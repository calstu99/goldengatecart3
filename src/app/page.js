import React from 'react'
import Hero from './Hero';
import Newest from './Newest';
// import ProductList from '../app/data/products2';
import ProductList from '../app/data/products3';
// import LandingPage from '../app/data/products4';
// import LandingPage from '../app/data/products5';
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