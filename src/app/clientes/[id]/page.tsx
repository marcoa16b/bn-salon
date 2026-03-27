'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { AppointmentCard } from '@/components/AppointmentCard'
import { ClientModal } from '@/components/ClientModal'
import { EmptyState } from '@/components/ui/EmptyState'
import { Client, Appointment, Service } from '@prisma/client'

type ClientWithAppointments = Client & {
  appointments: (Appointment & { service: Service })[]
}

type AppointmentWithClientName = Appointment & { service: Service }

export default function ClientDetailPage() {
  const { id } = useParams()
  const [client, setClient] = useState<ClientWithAppointments | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEdit, setShowEdit] = useState(false)

  useEffect(() => {
    async function fetchClient() {
      try {
        const res = await fetch(`/api/clients/${id}`)
        if (!res.ok) throw new Error('Client not found')
        const data = await res.json()
        setClient(data)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchClient()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!client) {
    return (
      <div>
        <PageHeader title="Cliente no encontrado" />
        <EmptyState
          icon={<span>❌</span>}
          title="Cliente no encontrado"
          description="Este cliente puede haber sido eliminado"
        />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link href="/clientes" className="text-rose-500 hover:text-rose-600">
          ← Volver
        </Link>
        <Button variant="ghost" size="sm" onClick={() => setShowEdit(true)}>
          Editar
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Avatar name={client.name} size="lg" />
        <div>
          <h1 className="text-2xl font-semibold text-rose-900">{client.name}</h1>
          <p className="text-rose-600">{client.phone}</p>
          {client.email && <p className="text-rose-500 text-sm">{client.email}</p>}
        </div>
      </div>

      {client.notes && (
        <Card className="mb-6">
          <p className="text-sm text-rose-700">{client.notes}</p>
        </Card>
      )}

      <PageHeader title="Historial de Citas" />

      {client.appointments.length === 0 ? (
        <EmptyState
          icon={<span>📅</span>}
          title="Sin citas"
          description="Este cliente aún no tiene citas registradas"
        />
      ) : (
        <div className="space-y-3">
          {client.appointments.map(apt => (
            <AppointmentCard key={apt.id} appointment={apt} clientName={client.name} />
          ))}
        </div>
      )}

      <ClientModal open={showEdit} onClose={() => setShowEdit(false)} client={client} />
    </div>
  )
}