import React from 'react'
import Hero from './Hero';
import Newest from './Newest';
import ProductList from '../app/data/products2';




const Home = () => {
  return (
    <>
    <Hero/>
    <Newest/> 
    <ProductList/>
    </>
   )
}

export default Home