"use client";

//If you're using Next.js 13 with the App Router, remember that you can't use hooks or browser-only APIs in Server Components.

import React from 'react'
import ConstantsEditor from '@/components/ConstantsEditor';
import requireAuth from "@/app/utils/requireAuth";

const page = () => {
    const isAuthorized = requireAuth(true); // Pass true for adminOnly

    if (!isAuthorized) {
        return null; // or render a loading state
      }
  return (
    <div>
    {/* <h1>Admin Page</h1> */}
    <ConstantsEditor />
  </div>
  )
}

export default page