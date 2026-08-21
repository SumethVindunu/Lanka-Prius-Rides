import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-xl bg-dark/80 border border-cyan-500/15 px-4 py-3 text-sm text-gray-200 shadow-sm transition-all duration-300 placeholder:text-gray-500 focus-visible:outline-none focus-visible:border-cyan-400 focus-visible:shadow-[0_0_15px_rgba(0,255,255,0.15)] disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
