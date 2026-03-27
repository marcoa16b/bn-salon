'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/PageHeader'
import { ClientRow } from '@/components/ClientRow'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { FAB } from '@/components/FAB'
import { ClientModal } from '@/components/ClientModal'
import { Client } from '@prisma/client'

type ClientWithCount = Client & { _count?: { appointments: number } }

function ClientesContent() {
  const [clients, setClients] = useState<ClientWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const searchParams = useSearchParams()

  const isNew = searchParams.get('new') === 'true'

  useEffect(() => {
    if (isNew) setShowModal(true)
  }, [isNew])

  useEffect(() => {
    async function fetchClients() {
      setLoading(true)
      try {
        const url = search ? `/api/clients?search=${encodeURIComponent(search)}` : '/api/clients'
        const res = await fetch(url)
        const data = await res.json()
        setClients(data)
      } finally {
        setLoading(false)
      }
    }
    fetchClients()
  }, [search])

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
  }, [])

  return (
    <div className="pb-20">
      <PageHeader title="Clientes" subtitle={`${clients.length} clientes`} />

      {/* Search */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Buscar por nombre o teléfono..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>

      {/* Client List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : clients.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          title="No hay clientes aún"
          description="Agrega tu primer cliente usando el botón +"
        />
      ) : (
        <div className="space-y-2">
          {clients.map(client => (
            <ClientRow key={client.id} client={client} />
          ))}
        </div>
      )}

      <FAB />
      <ClientModal open={showModal} onClose={() => setShowModal(false)} />
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

export default function ClientesPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ClientesContent />
    </Suspense>
  )
}