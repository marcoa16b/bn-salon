'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/PageHeader'
import { ServiceCard } from '@/components/ServiceCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { FAB } from '@/components/FAB'
import { ServiceModal } from '@/components/ServiceModal'
import { Service } from '@prisma/client'

function ServiciosContent() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const searchParams = useSearchParams()

  const isNew = searchParams.get('new') === 'true'

  useEffect(() => {
    if (isNew) {
      setShowModal(true)
    }
  }, [isNew])

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services')
        const data = await res.json()
        setServices(data)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  function handleEdit(service: Service) {
    setEditingService(service)
    setShowModal(true)
  }

  function handleClose() {
    setShowModal(false)
    setEditingService(null)
  }

  return (
    <div>
      <PageHeader title="Servicios" subtitle={`${services.length} servicios`} />

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
            </svg>
          }
          title="No hay servicios aún"
          description="Agrega tu primer servicio usando el botón +"
        />
      ) : (
        <div className="space-y-3">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} onEdit={handleEdit} />
          ))}
        </div>
      )}

      <FAB />
      <ServiceModal
        open={showModal}
        onClose={handleClose}
        service={editingService}
        onSave={() => window.location.reload()}
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

export default function ServiciosPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ServiciosContent />
    </Suspense>
  )
}
