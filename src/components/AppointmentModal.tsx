'use client'

import { useState, useEffect } from 'react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { Client, Service } from '@prisma/client'
import { generateTimeSlots } from '@/lib/utils'
import { format } from 'date-fns'

interface AppointmentModalProps {
  open: boolean
  onClose: () => void
  defaultDate?: Date
  onSave?: () => void
}

export function AppointmentModal({ open, onClose, defaultDate = new Date(), onSave }: AppointmentModalProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [clientSearch, setClientSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [date, setDate] = useState(format(defaultDate, 'yyyy-MM-dd'))
  const [startTime, setStartTime] = useState('10:00')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showClientDropdown, setShowClientDropdown] = useState(false)

  useEffect(() => {
    if (open) {
      setSelectedClient(null)
      setSelectedService(null)
      setClientSearch('')
      setNotes('')
      setDate(format(defaultDate, 'yyyy-MM-dd'))
      setError('')
    }
  }, [open, defaultDate])

  useEffect(() => {
    async function fetchData() {
      try {
        const [clientsRes, servicesRes] = await Promise.all([
          fetch('/api/clients'),
          fetch('/api/services'),
        ])
        const [clientsData, servicesData] = await Promise.all([clientsRes.json(), servicesRes.json()])
        setClients(clientsData)
        setServices(servicesData)
      } catch (err) {
        console.error('Error fetching data:', err)
      }
    }
    if (open) fetchData()
  }, [open])

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.phone.includes(clientSearch)
  )

  const timeSlots = generateTimeSlots('08:00', '20:00', 30)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!selectedClient || !selectedService || !date || !startTime) {
      setError('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Calculate endTime based on service duration
      const [h, m] = startTime.split(':').map(Number)
      const endMinutes = h * 60 + m + selectedService.durationMinutes
      const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          startTime,
          endTime,
          clientId: selectedClient.id,
          serviceId: selectedService.id,
          notes: notes || null,
          status: 'SCHEDULED',
        }),
      })

      if (!res.ok) throw new Error('Error creating appointment')
      
      onClose()
      onSave?.()
    } catch (err) {
      setError('No se pudo agendar la cita')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 left-0 md:left-auto md:w-full md:max-w-md bg-white z-50 overflow-y-auto animate-slide-up md:animate-slide-in-right">
        <div className="p-6 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-rose-900">Agendar Cita</h2>
            <button onClick={onClose} className="text-rose-500 hover:text-rose-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Client selector */}
            <div className="relative">
              <label className="text-sm font-medium text-rose-900 mb-1 block">Cliente *</label>
              {selectedClient ? (
                <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <div>
                    <p className="font-medium text-rose-900">{selectedClient.name}</p>
                    <p className="text-sm text-rose-600">{selectedClient.phone}</p>
                  </div>
                  <button type="button" onClick={() => { setSelectedClient(null); setClientSearch('') }} className="text-rose-500">
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={e => { setClientSearch(e.target.value); setShowClientDropdown(true) }}
                    onFocus={() => setShowClientDropdown(true)}
                    placeholder="Buscar cliente..."
                    className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 placeholder:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  {showClientDropdown && clientSearch && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-rose-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {filteredClients.length === 0 ? (
                        <p className="p-3 text-sm text-rose-500">No se encontraron clientes</p>
                      ) : (
                        filteredClients.map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => { setSelectedClient(c); setShowClientDropdown(false) }}
                            className="w-full text-left p-3 hover:bg-rose-50 border-b border-rose-100 last:border-b-0"
                          >
                            <p className="font-medium text-rose-900">{c.name}</p>
                            <p className="text-sm text-rose-600">{c.phone}</p>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Service selector */}
            <div>
              <label className="text-sm font-medium text-rose-900 mb-1 block">Servicio *</label>
              <select
                value={selectedService?.id || ''}
                onChange={e => {
                  const service = services.find(s => s.id === e.target.value)
                  setSelectedService(service || null)
                }}
                className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              >
                <option value="">Seleccionar servicio...</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.title} — ${Number(s.price)} ({s.durationMinutes} min)
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-sm font-medium text-rose-900 mb-1 block">Fecha *</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            {/* Time */}
            <div>
              <label className="text-sm font-medium text-rose-900 mb-1 block">Hora *</label>
              <select
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              >
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
              {selectedService && (
                <p className="text-xs text-rose-500 mt-1">
                  La cita terminará aproximadamente a las {' '}
                  {(() => {
                    const [h, m] = startTime.split(':').map(Number)
                    const endMinutes = h * 60 + m + selectedService.durationMinutes
                    return `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`
                  })()}
                </p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium text-rose-900 mb-1 block">Notas</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 placeholder:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                rows={3}
                placeholder="Notas adicionales..."
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={loading || !selectedClient || !selectedService}>
                {loading ? 'Guardando...' : 'Agendar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
