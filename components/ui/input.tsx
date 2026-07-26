import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-md border border-[#d8cebe] bg-white/90 px-3 py-2 text-sm text-[#27241f] shadow-sm outline-none transition placeholder:text-[#a59683] focus:border-[#1d4f43] focus:ring-2 focus:ring-[#1d4f43]/15 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
