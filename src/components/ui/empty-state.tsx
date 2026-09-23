import { Button } from "./button"
import Link from "next/link"

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({ icon = "📦", title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="text-center py-16 bg-white rounded-[20px] border border-[#E8E0D0]/60">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-[#6B7B6B] mt-1 max-w-[400px] mx-auto">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="inline-block mt-4">
          <Button className="rounded-full">{actionLabel}</Button>
        </Link>
      )}
    </div>
  )
}

export function LoadingState() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1,2,3,4,5,6,7,8].map(i => (
        <div key={i} className="bg-white border border-[#E8E0D0]/60 rounded-[16px] p-3 animate-pulse">
          <div className="h-32 bg-[#F5F1E8] rounded-[12px] mb-3" />
          <div className="h-4 bg-[#F5F1E8] rounded mb-2" />
          <div className="h-3 bg-[#F5F1E8] rounded w-2/3" />
        </div>
      ))}
    </div>
  )
}

export function ErrorState({ message, retry }: { message?: string; retry?: () => void }) {
  return (
    <div className="text-center py-16 bg-white rounded-[20px] border border-[#E8E0D0]/60">
      <div className="text-5xl mb-4">⚠️</div>
      <h3 className="font-semibold">Erreur</h3>
      <p className="text-sm text-[#6B7B6B] mt-1">{message || "Une erreur est survenue. Veuillez réessayer."}</p>
      {retry && <Button onClick={retry} className="mt-4 rounded-full" variant="outline">Réessayer</Button>}
    </div>
  )
}
