import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          "flex h-11 w-full rounded-2xl border border-[#eadfce] bg-white px-4 py-2 text-sm text-[#241a36] shadow-sm transition-colors placeholder:text-[#a99cb8] focus-visible:border-[#23d6d6] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#23d6d6]/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
