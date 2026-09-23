import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-[#0E9F6E] text-white": variant === 'default',
          "border-transparent bg-[#FFF8E7] text-[#1A2E1A] border-[#E8E0D0]": variant === 'secondary',
          "border-transparent bg-[#D1FAE5] text-[#065F46]": variant === 'success',
          "border-transparent bg-[#FEF3C7] text-[#92400E]": variant === 'warning',
          "border-transparent bg-[#FFE4E6] text-[#9F1239]": variant === 'destructive',
          "text-[#1A2E1A] border-[#E8E0D0]": variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
