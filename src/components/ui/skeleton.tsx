import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-[12px] bg-[#F5F1E8]", className)}
      {...props}
    />
  )
}

export { Skeleton }
