import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          "flex min-h-[96px] w-full rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm text-[#241a36] shadow-sm transition-colors placeholder:text-[#a99cb8] focus-visible:border-[#23d6d6] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#23d6d6]/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
