"use client";

import * as React from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(({ className, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <input
        ref={ref}
        type={visible ? "text" : "password"}
        className={cn(
          "flex h-11 w-full rounded-md border border-[#d8cebe] bg-white/90 px-3 py-2 pr-11 text-sm text-[#27241f] shadow-sm outline-none transition placeholder:text-[#a59683] focus:border-[#1d4f43] focus:ring-2 focus:ring-[#1d4f43]/15 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-[#8a7a67] transition hover:bg-[#efe8dc] hover:text-[#27241f]"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeSlash className="h-4 w-4" weight="duotone" /> : <Eye className="h-4 w-4" weight="duotone" />}
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
