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

  // Function to handle copying the order details
const handleCopyOrderDetails = (order) => {
  const { name, shippingAddress } = order;
  const { line1, city, state, postal_code } = shippingAddress;

  const detailsToCopy = `${name}\n${line1}, ${city}, ${state} ${postal_code}`;

  navigator.clipboard.writeText(detailsToCopy)
    .then(() => {
      alert('Order details copied to clipboard!');
    })
    .catch(err => {
      console.error('Failed to copy order details: ', err);
    });
};


  const handleViewOrder = (orderId) => {
    router.push(`/admin/order-details/${orderId}`);
  };


const columns = [
  { accessorKey: "transaction_id", header: "ID",size: 80, },
  // { accessorKey: "currentDate", header: "Date Created " },
  { 
    accessorKey: "currentDate", 
    header: "Date Created",
    // Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(), // Format the date
    Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(), // Format the date
    sortingFn: "datetime" // Use datetime sorting function
  },
  { accessorKey: "name", header: "Customer Name" },
  { accessorKey: "email", header: "Email"},
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
          <option value="paid">Paid</option>
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
        <button
          onClick={() => handleCopyOrderDetails(row.original)}
          className="mt-1 ml-4 bg-green-500 text-white px-2 py-1 rounded text-xs"
        >
          Copy Details
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
<Link href="/sms" className="ml-4">
  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    SMS Message
  </button>
</Link>
<Link href="/admin/products/all_products" className="ml-4">
  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
   Products
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
        initialState={{
          columnVisibility: {
            transaction_id: false, // This will hide the transaction_id column by default
            email: false, // This will hide the email column by default
            ['paymentMethod.platform']: false // Use bracket notation In JavaScript object literals, you can't use dot notation for property names. Instead, you need to use bracket notation or quotes around the entire property name.
          },
          sorting: [
            {
              id: 'currentDate', // Sort by the currentDate field
              desc: true,        // Sort in descending order (newest first)
            },
          ],
          density: 'compact', // Set the default density to 'compact'
        }}

      />
    </div>
  );
};

export default AdminOrdersPage;