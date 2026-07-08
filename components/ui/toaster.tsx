"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "rounded-2xl! border! border-gray-100! shadow-xl! font-sans!",
          title: "text-navy! font-semibold!",
        },
      }}
    />
  );
}
