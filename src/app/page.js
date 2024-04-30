import React from 'react'
import Hero from './Hero';
import Newest from './Newest';
// import ProductList from '../app/data/products2';
import ProductList from '../app/data/products3';
// import LandingPage from '../app/data/products4';
// import LandingPage from '../app/data/products5';
import LandingPage from '../app/data/products6';





const Home = () => {
  return (
    <>
    <Hero/>
    <Newest/> 
    {/* <ProductList/> */}
    <LandingPage/>
    </>
   )
}

export default Home