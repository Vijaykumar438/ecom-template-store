"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "border-transparent bg-[var(--primary)] text-white":
            variant === "default",
          "border-transparent bg-gray-100 text-gray-900":
            variant === "secondary",
          "border-transparent bg-red-100 text-red-700":
            variant === "destructive",
          "border-gray-200 text-gray-700": variant === "outline",
          "border-transparent bg-green-100 text-green-700":
            variant === "success",
          "border-transparent bg-amber-100 text-amber-700":
            variant === "warning",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
