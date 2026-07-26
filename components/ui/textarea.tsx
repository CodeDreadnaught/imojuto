import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-28 w-full rounded-md border border-[#d8cebe] bg-white/90 px-3 py-2 text-sm text-[#27241f] shadow-sm outline-none transition placeholder:text-[#a59683] focus:border-[#1d4f43] focus:ring-2 focus:ring-[#1d4f43]/15 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
