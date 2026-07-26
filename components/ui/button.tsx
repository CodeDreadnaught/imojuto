import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold tracking-normal transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#1d4f43] text-[#fffaf1] shadow-sm shadow-emerald-950/10 hover:bg-[#163f36] focus-visible:outline-[#1d4f43]",
        secondary: "bg-[#eee8dd] text-[#27241f] hover:bg-[#e4dccf] focus-visible:outline-[#8f7b5f]",
        outline: "border border-[#d8cebe] bg-white/80 text-[#27241f] shadow-sm hover:border-[#b7a98f] hover:bg-[#fffaf1] focus-visible:outline-[#1d4f43]",
        ghost: "text-[#595044] hover:bg-[#efe8dc] hover:text-[#27241f] focus-visible:outline-[#8f7b5f]",
        destructive: "bg-[#9f2f2f] text-white hover:bg-[#842727] focus-visible:outline-[#9f2f2f]",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-5",
        icon: "h-10 w-10 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
