import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] active:scale-[0.98]",
        destructive:
          "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20",
        outline:
          "border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400",
        secondary:
          "bg-card text-gray-300 border border-card-border hover:border-cyan-500/30 hover:text-white",
        ghost:
          "text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/5",
        link: "text-cyan-400 underline-offset-4 hover:underline",
        glow: "bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold hover:shadow-[0_0_40px_rgba(0,255,255,0.5)] animate-pulse-glow active:scale-[0.98]",
        orange:
          "bg-gradient-to-r from-orange-500 to-orange-400 text-black font-bold hover:shadow-[0_0_30px_rgba(255,107,53,0.4)] active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-13 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
