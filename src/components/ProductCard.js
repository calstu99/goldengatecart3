import React from 'react';
import ProductVariants from './ProductVariants';
import Link from 'next/link';

const ProductCard = ({ product, onShowVariants, onAddToCart, selectedProduct,onCloseVariants }) => {
  return (
    <div className="flex flex-col items-center justify-center shadow rounded-lg overflow-hidden">
      {product.images.edges.length > 0 && (
        <img
          src={product.images.edges[0].node.src}
          alt={product.images.edges[0].node.altText}
          className="h-64 w-full object-cover"
          style={{ padding: '1rem' }}
          onClick={() => onShowVariants(product)} // Added onClick event here
        />
      )}
      <div className="p-4">
        <h3 className="text-sm text-gray-950 font-medium mb-2">{product.title}</h3>
        <p className="text-gray-500 font-normal mb-4 line-clamp-4 text-sm">{product.description}</p>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-900 font-medium">
            {'$'}
            {product.priceRange.minVariantPrice.amount}{' '}
            {product.priceRange.minVariantPrice.currencyCode}
          </p>
          {/* <Link href={`/products/${product.handle}`}>Product</Link> */}
          <div className="flex space-x-2">
            <button
              onClick={() => onShowVariants(product)}
              className="bg-green-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded text-sm ml-2"
            >
             {/* {product.variants.edges.length} item */}
             <div className='text-xs'>
              <p>
                {product.variants.edges.length} {product.variants.edges.length === 1 ? 'item' : 'items'}
              </p>
              </div>
            </button>
          </div>
                  {selectedProduct && selectedProduct.id === product.id && (
                      <ProductVariants
                       selectedProduct={selectedProduct} 
                       addToCart={onAddToCart} 
                       onCloseVariants={onCloseVariants} />
                  )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;