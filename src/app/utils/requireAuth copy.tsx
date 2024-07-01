// utils/requireAuth.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function requireAuth(adminOnly = false) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (adminOnly && session.user.tier !== "admin") {
        router.push("/");
      }
    } else if (status === "unauthenticated") {
      // router.push("/login");
    }
  }, [adminOnly, router, session, status]);

  return status === "authenticated" && (!adminOnly || session.user.tier === "admin");
}