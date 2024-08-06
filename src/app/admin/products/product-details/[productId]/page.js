"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import requireAuth from "@/app/utils/requireAuth";

const ProductDetailsPage = ({ params }) => {
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    targetPrice: '',
    shipmentType: 'dropship',
    sources: '',
  });
  const router = useRouter();
  const isAuthorized = requireAuth(true); // Pass true for adminOnly

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.productId}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          setFormData({
            name: data.name,
            targetPrice: data.targetPrice,
            shipmentType: data.shipmentType,
            sources: data.sources.join(', '),
          });
        } else {
          console.error('Failed to fetch product');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (params.productId) {
      fetchProduct();
    }
  }, [params.productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/products`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: params.productId,
          ...formData,
          targetPrice: parseFloat(formData.targetPrice),
          sources: formData.sources.split(',').map(s => s.trim()),
        }),
      });

      if (response.ok) {
        alert('Product updated successfully');
        router.push('/admin/products/all_products');
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isAuthorized) {
    return null; // or render a loading state
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="targetPrice" className="block mb-1">Target Price</label>
          <input
            type="number"
            id="targetPrice"
            name="targetPrice"
            value={formData.targetPrice}
            onChange={handleChange}
            required
            step="0.01"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="shipmentType" className="block mb-1">Shipment Type</label>
          <select
            id="shipmentType"
            name="shipmentType"
            value={formData.shipmentType}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="dropship">Dropship</option>
            <option value="direct">Direct</option>
          </select>
        </div>
        <div>
          <label htmlFor="sources" className="block mb-1">Sources (comma-separated)</label>
          <input
            type="text"
            id="sources"
            name="sources"
            value={formData.sources}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default ProductDetailsPage;