"use client";
import React, { useEffect, useState } from "react";
import requireAuth from "@/app/utils/requireAuth";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const isAuthorized = requireAuth(true); // Pass true for adminOnly
  
 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/get_orders/master");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/get_orders/master`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, newStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(`/api/get_orders/master`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
      } else {
        console.error("Failed to delete order");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!isAuthorized) {
    return null; // or render a loading state
  }
  return (
    <>
      <div className="px-8">
        <h1 className="text-2xl font-bold mb-4">Admin Orders Page</h1>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              {/* <th className="border px-4 py-2">Order ID</th> */}
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Total Amount</th>
              <th className="border px-4 py-2">Payment Method</th>
              <th className="border px-4 py-2">Shipping Address</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                {/* <td className="border px-4 py-2">{order._id}</td> */}
                <td className="border px-4 py-2">{order.currentDate}</td>
                <td className="border px-4 py-2">{order.name}</td>
                <td className="border px-4 py-2">${order.sub_total}</td>
                <td className="border px-4 py-2">{order.paymentMethod.platform}</td>
                <td className="border px-4 py-2">
                    {`${order.shippingAddress.line1}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postal_code}`}
               
                </td>
                 <td className="border px-4 py-2">
                    <span
                        className={`${order.status === "COMPLETED" || order.status === "paid"
                                ? "text-green-500"
                                : ""
                            }`}
                    >
                        {order.status}
                    </span>
                </td>
                <td className="border px-4 py-2">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="border rounded px-2 py-1 mr-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                        <button
                            onClick={() => deleteOrder(order._id)}
                            className="ml-4 bg-red-500 text-white px-2 py-1 rounded text-xs"
                        >
                            Delete
                        </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <br />
        {/* <h1>{JSON.stringify(orders)}</h1> */}
      </div>
    </>
  );
};

export default AdminOrdersPage;
