"use client";
import React, { useEffect, useState, useRef } from "react";
import { MaterialReactTable } from "material-react-table";
import { DownloadTableExcel } from 'react-export-table-to-excel';
import { useRouter, usePathname, useSearchParams } from "next/navigation"; // Updated import

import requireAuth from "@/app/utils/requireAuth";
import Link from 'next/link';


const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const isAuthorized = requireAuth(true); // Pass true for adminOnly
  const tableRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
        return await response.json();
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
        return true;
      } else {
        console.error("Failed to delete order");
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const updatedOrder = await updateOrderStatus(orderId, newStatus);
    if (updatedOrder) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const success = await deleteOrder(orderId);
    if (success) {
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    }
  };


  const handleViewOrder = (orderId) => {
    router.push(`/admin/order-details/${orderId}`);
  };


const columns = [
  { accessorKey: "transaction_id", header: "ID" },
  { accessorKey: "currentDate", header: "Date Created " },
  { accessorKey: "name", header: "Customer Name" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "sub_total",
    header: "Total Amount",
    Cell: ({ cell }) => `$${cell.getValue()}`,
  },
  { accessorKey: "paymentMethod.platform", header: "Payment Method" },
  {
    accessorKey: "shippingAddress",
    header: "Shipping Address",
    Cell: ({ cell }) => {
      const { line1, city, state, postal_code } = cell.getValue();
      return `${line1}, ${city}, ${state} ${postal_code}`;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    Cell: ({ cell }) => (
      <span
        className={`${
          cell.getValue() === "COMPLETED" || cell.getValue() === "paid"
            ? "text-green-500"
            : ""
        }`}
      >
        {cell.getValue()}
       
      </span>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    Cell: ({ row }) => (
      <>
        <select
          value={row.original.status}
          onChange={(e) =>
            handleUpdateOrderStatus(row.original._id, e.target.value)
          }
          className="border rounded text-xs px-2 py-1 mr-2"
        >
          {/* <option value="pending">Pending</option> */}
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="refund order">Refund Order</option>
          <option value="refunded">Refunded</option>
        </select>
        <button
          onClick={() => handleDeleteOrder(row.original._id)}
          className="mt-1 ml-4 bg-red-500 text-white px-2 py-1 rounded text-xs"
        >
          Delete
        </button>
        <button
          onClick={() => handleViewOrder(row.original._id)}
          className="mt-1 ml-4 bg-blue-500 text-white px-2 py-1 rounded text-xs"
        >
          View
        </button>
      </>
    ),
  },
];


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

 

  if (!isAuthorized) {
    return null; // or render a loading state
  }

  return (
    <div className="px-8">
      <h1 className="text-2xl font-bold mb-4">Admin Orders Page</h1>
      <DownloadTableExcel
        filename="orders"
        sheet="orders"
        currentTableRef={tableRef.current}
      >
        <button className="mb-4 bg-green-500 text-white px-4 py-2 rounded">
          Export to Excel
        </button>
      </DownloadTableExcel>



<Link href="/admin/notification" className="ml-4">
  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Send Notifications
  </button>
</Link>

<Link href="/admin/users" className="ml-4">
  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Update User Tier
  </button>
</Link>
<Link href="/admin/edit-constants" className="ml-4">
  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Edit Website Content
  </button>
</Link>
      
      <MaterialReactTable
        columns={columns}
        data={orders}
        enableColumnFilters
        enablePagination
        enableSorting
        enableColumnOrdering
        // adding for excel extraction
        renderRowOutsideOverlay
        renderRowOutsideOverlayStart={<tr ref={tableRef} />}

      />
    </div>
  );
};

export default AdminOrdersPage;