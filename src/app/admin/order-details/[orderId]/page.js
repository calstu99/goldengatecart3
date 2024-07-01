"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const OrderDetailsPage = () => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const orderId = params.orderId;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/get_orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error(error);
        setError('Failed to load order details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!order) {
    return <div>No order found</div>;
  }

  return (
    <div className="px-8 mb-4">
      {/* <h1>{JSON.stringify(order)}</h1> */}
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      {/* <p><strong>Order ID:</strong> {order._id}</p> */}
      <h2><strong>Name:</strong> {order.name}</h2>
      <p ><strong>Email:</strong> {order.email}</p>
      <p><strong>Total Amount:</strong> ${order.sub_total.toFixed(2)}</p>
      <p><strong>Currency:</strong> {order.currency}</p>
      <br/>
      <p><strong>Status:</strong> {order.status}</p>
      

      <h2 className="text-lg font-bold mt-4">Items:</h2>
      <ul>
        {order.items.map((item) => (
          <li key={item._id} className="mb-2">
            <p><strong>Name:</strong> {item.name}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Unit Price:</strong> ${item.unit_price}</p>
            <p><strong>Total:</strong> ${item.amount_total.toFixed(2)}</p>
          </li>
        ))}
      </ul>

      {/* <h2 className="text-xl font-bold mt-4">Billing Address</h2>
      <p>{order.address.line1}</p>
      {order.address.line2 && <p>{order.address.line2}</p>}
      <p>{order.address.city}, {order.address.state} {order.address.postal_code}</p>
      <p>{order.address.country}</p> */}

      <h2 className="text-lg font-bold mt-4">Shipping Address:</h2>
      <p>{order.shippingAddress.line1}</p>
      {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postal_code}</p>
      <p>{order.shippingAddress.country}</p>

      <h2 className="text-lg font-bold mt-4">Payment Method:</h2>
      <p><strong>Platform:</strong> {order.paymentMethod.platform}</p>
      <br/>
      <p><strong>Order Date:</strong> {order.currentDate}</p>
      <p><strong>Order Time:</strong> {order.currentTime}</p>
{/* 
      <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      <p><strong>Updated At:</strong> {new Date(order.updatedAt).toLocaleString()}</p> */}
    </div>
  );
};

export default OrderDetailsPage;


