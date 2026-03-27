import { Appointment, Client, Service } from '@prisma/client'
import { Badge } from './ui/Badge'
import { Card } from './ui/Card'

interface AppointmentWithRelations extends Appointment {
  client?: Client
  service: Service
}

interface AppointmentCardProps {
  appointment: AppointmentWithRelations
  clientName?: string
  onEdit?: (appointment: AppointmentWithRelations) => void
}

export function AppointmentCard({ appointment, clientName, onEdit }: AppointmentCardProps) {
  const displayName = clientName ?? appointment.client?.name

  return (
    <Card className="flex items-center gap-3">
      <div className="flex flex-col items-center min-w-[50px]">
        <span className="text-lg font-semibold text-rose-900">{appointment.startTime}</span>
        <span className="text-xs text-rose-500">→</span>
        <span className="text-sm text-rose-600">{appointment.endTime}</span>
      </div>
      <div className="flex-1">
        {displayName && <p className="font-medium text-rose-900">{displayName}</p>}
        <p className="text-sm text-rose-600">{appointment.service.title}</p>
      </div>
      <Badge status={appointment.status} />
      {onEdit && (
        <button
          onClick={() => onEdit(appointment)}
          className="ml-2 p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          title="Editar cita"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}
    </Card>
  )
}