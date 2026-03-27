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
}

export function AppointmentCard({ appointment, clientName }: AppointmentCardProps) {
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
    </Card>
  )
}