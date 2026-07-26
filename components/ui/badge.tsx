import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold", {
  variants: {
    variant: {
      default: "bg-stone-900 text-white",
      secondary: "bg-stone-100 text-stone-800",
      outline: "border border-stone-300 text-stone-700",
      success: "bg-emerald-100 text-emerald-900",
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
