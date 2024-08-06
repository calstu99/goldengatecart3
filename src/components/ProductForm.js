'use client';
import { useState, useEffect } from 'react';

export default function ProductForm({ product, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    targetPrice: '',
    shipmentType: 'dropship',
    sources: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        sources: product.sources.join(', '),
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      targetPrice: parseFloat(formData.targetPrice),
      sources: formData.sources.split(',').map(s => s.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border p-2"
        />
      </div>
      <div>
        <label htmlFor="targetPrice" className="block">Target Price</label>
        <input
          type="number"
          id="targetPrice"
          name="targetPrice"
          value={formData.targetPrice}
          onChange={handleChange}
          required
          className="w-full border p-2"
        />
      </div>
      <div>
        <label htmlFor="shipmentType" className="block">Shipment Type</label>
        <select
          id="shipmentType"
          name="shipmentType"
          value={formData.shipmentType}
          onChange={handleChange}
          required
          className="w-full border p-2"
        >
          <option value="dropship">Dropship</option>
          <option value="direct">Direct</option>
        </select>
      </div>
      <div>
        <label htmlFor="sources" className="block">Sources (comma-separated)</label>
        <input
          type="text"
          id="sources"
          name="sources"
          value={formData.sources}
          onChange={handleChange}
          className="w-full border p-2"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {product ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  );
}