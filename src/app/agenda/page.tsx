'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { format, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { PageHeader } from '@/components/PageHeader'
import { CalendarMonth } from '@/components/CalendarMonth'
import { DayAppointments } from '@/components/DayAppointments'
import { AppointmentModal } from '@/components/AppointmentModal'
import { FAB } from '@/components/FAB'
import { Appointment, Client, Service } from '@prisma/client'

type AppointmentWithRelations = Appointment & { client?: Client; service: Service }

function AgendaContent() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
  })
  const [showModal, setShowModal] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<AppointmentWithRelations | null>(null)
  const searchParams = useSearchParams()

  const isNew = searchParams.get('new') === 'true'

  useEffect(() => {
    if (isNew) setShowModal(true)
  }, [isNew])

  useEffect(() => {
    async function fetchAppointments() {
      setLoading(true)
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd')
        const res = await fetch(`/api/appointments?date=${dateStr}`)
        const data = await res.json()
        setAppointments(data)
      } finally {
        setLoading(false)
      }
    }
    fetchAppointments()
  }, [selectedDate])

  function prevMonth() {
    const newDate = subMonths(new Date(currentMonth.year, currentMonth.month - 1), 1)
    setCurrentMonth({ year: newDate.getFullYear(), month: newDate.getMonth() + 1 })
  }

  function nextMonth() {
    const newDate = addMonths(new Date(currentMonth.year, currentMonth.month - 1), 1)
    setCurrentMonth({ year: newDate.getFullYear(), month: newDate.getMonth() + 1 })
  }

  return (
    <div>
      <PageHeader
        title="Agenda"
        subtitle={format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
      />

      {/* Month calendar with navigation built-in */}
      <div className="mb-4">
        <CalendarMonth
          year={currentMonth.year}
          month={currentMonth.month}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
        />
      </div>

      {/* Appointments for selected day */}
      <DayAppointments appointments={appointments} loading={loading} onEdit={setEditingAppointment} />

      <FAB />
      <AppointmentModal
        open={showModal || !!editingAppointment}
        onClose={() => { setShowModal(false); setEditingAppointment(null) }}
        defaultDate={selectedDate}
        onSave={() => window.location.reload()}
        appointment={editingAppointment ?? undefined}
      />
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="flex justify-center py-8">
      <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function AgendaPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AgendaContent />
    </Suspense>
  )
}