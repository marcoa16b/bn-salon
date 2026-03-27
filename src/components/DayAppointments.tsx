import { Appointment, Client, Service } from '@prisma/client'
import { AppointmentCard } from './AppointmentCard'
import { EmptyState } from './ui/EmptyState'

type AppointmentWithRelations = Appointment & { client?: Client; service: Service }

interface DayAppointmentsProps {
  appointments: AppointmentWithRelations[]
  loading?: boolean
  onEdit?: (appointment: AppointmentWithRelations) => void
}

export function DayAppointments({ appointments, loading, onEdit }: DayAppointmentsProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8 pb-20">
        <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (appointments.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
        title="No hay citas para este día"
        description="Usa el botón + para agendar una nueva cita"
      />
    )
  }

  return (
    <div className="space-y-3">
      {appointments.map(apt => (
        <AppointmentCard key={apt.id} appointment={apt} onEdit={onEdit} />
      ))}
    </div>
  )
}