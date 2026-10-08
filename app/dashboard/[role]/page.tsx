"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RoleDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center font-bold text-[#003366]">
      Redirecting to Unified Project Board...
    </div>
  );
}
