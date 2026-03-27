import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4 text-rose-400">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-rose-900 mb-1">{title}</h3>
      {description && <p className="text-rose-600 text-sm mb-4 max-w-xs">{description}</p>}
      {action}
    </div>
  )
}
