'use client';
import { useState, useEffect } from 'react';
import ProductForm from '@/components/ProductForm';
import requireAuth from "@/app/utils/requireAuth";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const isAuthorized = requireAuth(true); // Pass true for adminOnly

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch('/api/products');
    const data = await response.json();
    setProducts(data);
  };

  const handleSubmit = async (productData) => {
    const url = '/api/products';
    const method = productData._id ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      fetchProducts();
      setEditingProduct(null);
    }
  };

  const handleDelete = async (id) => {
    const response = await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      fetchProducts();
    }
  };

  if (!isAuthorized) {
    return null; // or render a loading state
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      <ProductForm onSubmit={handleSubmit} product={editingProduct} />
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Product List</h2>
        <ul>
          {products.map(product => (
            <li key={product._id} className="border p-2 mb-2">
              <p>{product.name} - ${product.targetPrice} - {product.shipmentType}</p>
              <p>Sources: {product.sources.join(', ')}</p>
              <button onClick={() => setEditingProduct(product)} className="text-blue-500 mr-2">Edit</button>
              <button onClick={() => handleDelete(product._id)} className="text-red-500">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}