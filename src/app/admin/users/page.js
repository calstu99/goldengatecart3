"use client";
import React, { useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { useRouter } from "next/navigation";
import requireAuth from "@/app/utils/requireAuth";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const isAuthorized = requireAuth(true); // Pass true for adminOnly
  const router = useRouter();

  const updateUserTier = async (userId, newTier) => {
    try {
      const response = await fetch(`/api/users/update_tier`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, newTier }),
      });

      if (response.ok) {
        return await response.json();
      } else {
        console.error("Failed to update user tier");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateUserTier = async (userId, newTier) => {
    const updatedUser = await updateUserTier(userId, newTier);
    if (updatedUser) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );
    }
  };

  const columns = [
    { accessorKey: "email", header: "Email" },
    // { accessorKey: "firstName", header: "First Name" },
    // { accessorKey: "lastName", header: "Last Name" },
    // { accessorKey: "phoneNumber", header: "Phone Number" },
    {
      accessorKey: "orderCount",
      header: "Orders",
      Cell: ({ cell }) => cell.getValue() || 0,
    },
    {
      accessorKey: "totalAmount",
      header: "Total Spent",
      Cell: ({ cell }) => `$${(cell.getValue() || 0).toFixed(2)}`,
    },
    {
      accessorKey: "tier",
      header: "Tier",
      Cell: ({ row }) => (
        <select
          value={row.original.tier || 'basic'}
          onChange={(e) =>
            handleUpdateUserTier(row.original._id, e.target.value)
          }
          className="border rounded text-sm px-2 py-1"
        >
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
          <option value="admin">Admin</option>
        </select>
      ),
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/update_tier");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  if (!isAuthorized) {
    return null; // or render a loading state
  }

  return (
    <div className="px-8">
      <h1 className="text-2xl font-bold mb-4">Admin Users Page</h1>
      <MaterialReactTable
        columns={columns}
        data={users}
        enableColumnFilters
        enablePagination
        enableSorting
        enableColumnOrdering
      />
    </div>
  );
};

export default AdminUsersPage;