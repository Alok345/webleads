"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Allow login page to be accessible without token
    if (!token && pathname !== "/login") {
      router.replace("/login");
    }

    setChecked(true);
  }, [pathname]);

  if (!checked) return null; // Prevent page flash

  return <>{children}</>;
}
