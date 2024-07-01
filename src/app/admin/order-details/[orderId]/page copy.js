"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const OrderDetailsPage = () => {
  const [order, setOrder] = useState(null);
  const params = useParams();
  const orderId = params.orderId;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/get_orders/${orderId}`);
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-8">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Name:</strong> {order.name}</p>
      <p><strong>Total Amount:</strong> ${order.sub_total}</p>
      <p><strong>Payment Method:</strong> {order.paymentMethod.platform}</p>
      <p><strong>Shipping Address:</strong> {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postal_code}</p>
      <p><strong>Status:</strong> {order.status}</p>
      {/* Add more order details as needed */}
    </div>
  );
};

export default OrderDetailsPage;

