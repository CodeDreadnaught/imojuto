import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold tracking-normal", {
  variants: {
    variant: {
      default: "bg-[#27241f] text-white",
      secondary: "bg-[#efe8dc] text-[#655c50]",
      outline: "border border-[#ded5c5] text-[#655c50]",
      success: "bg-[#dcefe5] text-[#1d4f43]",
      warning: "bg-amber-100 text-amber-900",
      danger: "bg-red-100 text-red-900",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
