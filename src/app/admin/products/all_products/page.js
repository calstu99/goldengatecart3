"use client";
import React, { useEffect, useState, useRef } from "react";
import { MaterialReactTable } from "material-react-table";
import { DownloadTableExcel } from 'react-export-table-to-excel';
import { useRouter } from "next/navigation";
import requireAuth from "@/app/utils/requireAuth";
import Link from 'next/link';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const isAuthorized = requireAuth(true); // Pass true for adminOnly
  const tableRef = useRef(null);
  const router = useRouter();

  const updateProduct = async (productId, updatedData) => {
    try {
      const response = await fetch(`/api/products`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: productId, ...updatedData }),
      });
  
      if (response.ok) {
        return await response.json();
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`/api/products`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: productId }),
      });
  
      if (response.ok) {
        return true;
      } else {
        console.error("Failed to delete product");
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleUpdateProduct = async (productId, updatedData) => {
    const updatedProduct = await updateProduct(productId, updatedData);
    if (updatedProduct) {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        )
      );
    }
  };

  const handleDeleteProduct = async (productId) => {
    const success = await deleteProduct(productId);
    if (success) {
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
    }
  };

  const handleViewProduct = (productId) => {
    router.push(`/admin/products/product-details/${productId}`);
  };

  const columns = [
    { accessorKey: "_id", header: "ID", size: 80 },
    { accessorKey: "name", header: "Product Name" },
    { 
      accessorKey: "targetPrice", 
      header: "Target Price",
      Cell: ({ cell }) => `$${cell.getValue().toFixed(2)}`,
    },
    { accessorKey: "shipmentType", header: "Shipment Type" },
    {
      accessorKey: "sources",
      header: "Sources",
      Cell: ({ cell }) => cell.getValue().join(', '),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <>
          <button
            onClick={() => handleViewProduct(row.original._id)}
            className="mt-1 mr-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
          >
            View
          </button>
          <button
            onClick={() => handleDeleteProduct(row.original._id)}
            className="mt-1 bg-red-500 text-white px-2 py-1 rounded text-xs"
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  if (!isAuthorized) {
    return null; // or render a loading state
  }

  return (
    <div className="px-8">
      <h1 className="text-2xl font-bold mb-4">Admin Products Page</h1>
      <DownloadTableExcel
        filename="products"
        sheet="products"
        currentTableRef={tableRef.current}
      >
        <button className="mb-4 bg-green-500 text-white px-4 py-2 rounded">
          Export to Excel
        </button>
      </DownloadTableExcel>

      <Link href="/admin/products/add-products" className="ml-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add New Product
        </button>
      </Link>

      <MaterialReactTable
        columns={columns}
        data={products}
        enableColumnFilters
        enablePagination
        enableSorting
        enableColumnOrdering
        renderRowOutsideOverlay
        renderRowOutsideOverlayStart={<tr ref={tableRef} />}
        initialState={{
          columnVisibility: {
            _id: false, // This will hide the _id column by default
          },
        }}
      />
    </div>
  );
};

export default AdminProductsPage;