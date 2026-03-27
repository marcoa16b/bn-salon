'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { AppointmentCard } from '@/components/AppointmentCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Card } from '@/components/ui/Card'
import { FAB } from '@/components/FAB'
import { Appointment, Client, Service } from '@prisma/client'

type AppointmentWithRelations = Appointment & { client: Client; service: Service }

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

function formatDate(date: Date) {
  return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTodayAppointments() {
      try {
        const res = await fetch('/api/appointments/today')
        if (!res.ok) throw new Error('Error fetching appointments')
        const data = await res.json()
        setAppointments(data)
      } catch (err) {
        setError('No se pudieron cargar las citas')
      } finally {
        setLoading(false)
      }
    }
    fetchTodayAppointments()
  }, [])

  const now = new Date()
  const upcoming = appointments.find(apt => {
    const [h, m] = apt.startTime.split(':').map(Number)
    const aptDate = new Date(now)
    aptDate.setHours(h, m, 0, 0)
    return aptDate > now && apt.status === 'SCHEDULED'
  })

  return (
    <div>
      <PageHeader
        title={`${getGreeting()}`}
        subtitle={formatDate(now)}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="text-center">
          <p className="text-3xl font-bold text-rose-500">{appointments.length}</p>
          <p className="text-sm text-rose-600">Citas hoy</p>
        </Card>
        <Card className="text-center">
          {upcoming ? (
            <>
              <p className="text-lg font-bold text-rose-500">{upcoming.startTime}</p>
              <p className="text-sm text-rose-600">Próxima cita</p>
            </>
          ) : (
            <>
              <p className="text-lg font-bold text-rose-400">—</p>
              <p className="text-sm text-rose-600">Sin próximas</p>
            </>
          )}
        </Card>
      </div>

      {/* Appointment List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          title="No hay citas para hoy"
          description="Usa el botón + para agendar una nueva cita"
        />
      ) : (
        <div className="space-y-3">
          {appointments.map(apt => (
            <AppointmentCard key={apt.id} appointment={apt} />
          ))}
        </div>
      )}

      <FAB />
    </div>
  )
}