"use client";

import requireAuth from "@/app/utils/requireAuth";
import React from 'react'


export default function AdminPage() {
    const isAuthorized = requireAuth(true); // Pass true for adminOnly
  
    if (!isAuthorized) {
      return null; // or render a loading state
    }
  
    return (
      <div>
        <h1>Admin Page</h1>
        {/* Admin page content */}
      </div>
    );
  }