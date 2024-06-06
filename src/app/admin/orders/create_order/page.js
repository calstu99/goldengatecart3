"use client";
import React, { useState } from "react";

const CreateOrder = () => {
  const [formData, setFormData] = useState({
    userId: "",
    items: [],
    totalAmount: 0,
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    paymentMethod: {
      cardType: "",
      cardNumber: "",
      expiryDate: "",
      cardHolderName: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleAddItem = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      items: [
        ...prevFormData.items,
        { productId: "", quantity: 1, price: 0 },
      ],
    }));
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      items: prevFormData.items.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/get_orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Order created successfully");
        // Reset form data or perform any other actions
      } else {
        console.error("Failed to create order");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Order</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="userId" className="block text-gray-700 font-medium">
            User ID
          </label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <h3 className="text-xl font-medium mb-2">Items</h3>
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label
                  htmlFor={`items.${index}.productId`}
                  className="block text-gray-700 font-medium"
                >
                  Product ID
                </label>
                <input
                  type="text"
                  id={`items.${index}.productId`}
                  name="productId"
                  value={item.productId}
                  onChange={(e) => handleItemChange(e, index)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor={`items.${index}.quantity`}
                  className="block text-gray-700 font-medium"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id={`items.${index}.quantity`}
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(e, index)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor={`items.${index}.price`}
                  className="block text-gray-700 font-medium"
                >
                  Price
                </label>
                <input
                  type="number"
                  id={`items.${index}.price`}
                  name="price"
                  value={item.price}
                  onChange={(e) => handleItemChange(e, index)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded"
          >
            Add Item
          </button>
        </div>
        <div>
          <label
            htmlFor="totalAmount"
            className="block text-gray-700 font-medium"
          >
            Total Amount
          </label>
          <input
            type="number"
            id="totalAmount"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <h3 className="text-xl font-medium mb-2">Shipping Address</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="shippingAddress.street"
                className="block text-gray-700 font-medium"
              >
                Street
              </label>
              <input
                type="text"
                id="shippingAddress.street"
                name="shippingAddress.street"
                value={formData.shippingAddress.street}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="shippingAddress.city"
                className="block text-gray-700 font-medium"
              >
                City
              </label>
              <input
                type="text"
                id="shippingAddress.city"
                name="shippingAddress.city"
                value={formData.shippingAddress.city}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="shippingAddress.state"
                className="block text-gray-700 font-medium"
              >
                State
              </label>
              <input
                type="text"
                id="shippingAddress.state"
                name="shippingAddress.state"
                value={formData.shippingAddress.state}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="shippingAddress.postalCode"
                className="block text-gray-700 font-medium"
              >
                Postal Code
              </label>
              <input
                type="text"
                id="shippingAddress.postalCode"
                name="shippingAddress.postalCode"
                value={formData.shippingAddress.postalCode}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="shippingAddress.country"
                className="block text-gray-700 font-medium"
              >
                Country
              </label>
              <input
                type="text"
                id="shippingAddress.country"
                name="shippingAddress.country"
                value={formData.shippingAddress.country}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-medium mb-2">Payment Method</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="paymentMethod.cardType"
                className="block text-gray-700 font-medium"
              >
                Card Type
              </label>
              <input
                type="text"
                id="paymentMethod.cardType"
                name="paymentMethod.cardType"
                value={formData.paymentMethod.cardType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="paymentMethod.cardNumber"
                className="block text-gray-700 font-medium"
              >
                Card Number
              </label>
              <input
                type="text"
                id="paymentMethod.cardNumber"
                name="paymentMethod.cardNumber"
                value={formData.paymentMethod.cardNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="paymentMethod.expiryDate"
                className="block text-gray-700 font-medium"
              >
                Expiry Date
              </label>
              <input
                type="text"
                id="paymentMethod.expiryDate"
                name="paymentMethod.expiryDate"
                value={formData.paymentMethod.expiryDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="paymentMethod.cardHolderName"
                className="block text-gray-700 font-medium"
              >
                Card Holder Name
              </label>
              <input
                type="text"
                id="paymentMethod.cardHolderName"
                name="paymentMethod.cardHolderName"
                value={formData.paymentMethod.cardHolderName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded"
        >
          Create Order
        </button>
      </form>
    </div>
  );
};

export default CreateOrder;