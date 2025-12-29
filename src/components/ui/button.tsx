import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-lg",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border bg-transparent hover:bg-muted hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        finance: "bg-finance/10 text-finance border border-finance/30 hover:bg-finance/20 hover:border-finance/50",
        trading: "bg-trading/10 text-trading border border-trading/30 hover:bg-trading/20 hover:border-trading/50",
        tech: "bg-tech/10 text-tech border border-tech/30 hover:bg-tech/20 hover:border-tech/50",
        spiritual: "bg-spiritual/10 text-spiritual border border-spiritual/30 hover:bg-spiritual/20 hover:border-spiritual/50",
        music: "bg-music/10 text-music border border-music/30 hover:bg-music/20 hover:border-music/50",
        content: "bg-content/10 text-content border border-content/30 hover:bg-content/20 hover:border-content/50",
        work: "bg-work/10 text-work border border-work/30 hover:bg-work/20 hover:border-work/50",
        glass: "bg-muted/50 backdrop-blur-xl border border-border/50 hover:bg-muted/80 text-foreground",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-xl px-8",
        xl: "h-14 rounded-xl px-10 text-base",
        icon: "h-10 w-10",
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
