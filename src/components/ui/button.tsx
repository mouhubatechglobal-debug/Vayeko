import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'whatsapp' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-[#0E9F6E] text-white hover:bg-[#0A7A52] shadow-sm hover:shadow-md": variant === 'default',
            "bg-[#FFF8E7] text-[#1A2E1A] hover:bg-[#FFEDC2] border border-[#E8E0D0]": variant === 'secondary',
            "border border-[#E8E0D0] bg-white hover:bg-[#FFFBEB] hover:text-[#0E9F6E]": variant === 'outline',
            "hover:bg-[#F5F1E8] hover:text-[#1A2E1A]": variant === 'ghost',
            "bg-[#25D366] text-white hover:bg-[#128C7E] shadow-sm": variant === 'whatsapp',
            "bg-[#E11D48] text-white hover:bg-[#BE123C]": variant === 'destructive',
          },
          {
            "h-11 px-6 py-2": size === 'default',
            "h-9 rounded-full px-4 text-xs": size === 'sm',
            "h-12 rounded-full px-8 text-base": size === 'lg',
            "h-10 w-10": size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
