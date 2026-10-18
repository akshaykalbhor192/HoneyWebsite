"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";

// The basket lives in the slide-out drawer; this route just opens it.
export default function CartPage() {
  const setOpen = useCart((s) => s.setOpen);
  const router = useRouter();
  useEffect(() => {
    setOpen(true);
    router.replace("/shop");
  }, [setOpen, router]);
  return null;
}
