import React from 'react';

const ProductVariants = ({ selectedProduct, addToCart, onCloseVariants }) => {
  return (
      <div className="product-variants-overlay">
          <div className="product-variants-modal">


              <div className="bg-white shadow-md rounded-lg p-4 mt-4 mx-2">
                  <div className="flex flex-col items-center mb-4">
                      <button
                          onClick={onCloseVariants}
                          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded mb-4 text-sm"
                      >
                          Close
                      </button>
                      <h4 className="text-lg font-medium text-gray-900">Variants</h4>
                  </div>
                  <p className="text-sm">Name: {selectedProduct.handle}</p>
                  <p className="text-sm">ID: {selectedProduct.id}</p>
                  {selectedProduct.variants.edges.map((variant) => (
                      <div key={variant.node.id} className="flex justify-between items-center mb-2">
                          <p className="text-sm">{variant.node.title}</p>
                          <p className="text-sm">
                              {variant.node.price.amount} {variant.node.price.currencyCode}
                          </p>
                          {/* <p>Quantity available: {variant.node.quantityAvailable}</p> */}
                          <button
                              onClick={() =>
                                  addToCart({
                                      id: `${selectedProduct.id}-${variant.node.title}`,
                                      name:
                                          variant.node.title !== 'Default Title'
                                              ? `${selectedProduct.handle}-${variant.node.title}`
                                              : selectedProduct.handle,
                                      quantity: parseInt(variant.node.quantityAvailable),
                                      price: parseFloat(variant.node.price.amount),
                                  })
                              }
                              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-sm"
                          >
                              Add to Cart
                          </button>
                      </div>
                  ))}
              </div>

              
          </div>
      </div>
  );
};

export default ProductVariants;