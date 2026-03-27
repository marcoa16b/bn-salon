import { cn } from '@/lib/utils'
import { AppointmentStatus } from '@prisma/client'

interface BadgeProps {
  status: AppointmentStatus
  className?: string
}

export function Badge({ status, className }: BadgeProps) {
  const config = {
    SCHEDULED: { label: 'Programada', bg: 'bg-blue-100', text: 'text-blue-700' },
    COMPLETED: { label: 'Completada', bg: 'bg-green-100', text: 'text-green-700' },
    CANCELLED: { label: 'Cancelada', bg: 'bg-gray-100', text: 'text-gray-500' },
  }
  
  const { label, bg, text } = config[status]
  
  return (
    <span className={cn('inline-flex px-2 py-0.5 rounded-full text-xs font-medium', bg, text, className)}>
      {label}
    </span>
  )
}
