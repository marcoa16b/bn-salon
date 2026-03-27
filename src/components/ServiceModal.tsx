'use client'

import { useState } from 'react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { Service } from '@prisma/client'

interface ServiceModalProps {
  open: boolean
  onClose: () => void
  service?: Service | null
  onSave?: () => void
}

export function ServiceModal({ open, onClose, service, onSave }: ServiceModalProps) {
  const [title, setTitle] = useState(service?.title || '')
  const [description, setDescription] = useState(service?.description || '')
  const [price, setPrice] = useState(service?.price ? String(service.price) : '')
  const [durationMinutes, setDurationMinutes] = useState(
    service?.durationMinutes ? String(service.durationMinutes) : ''
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isEditing = !!service

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = isEditing ? `/api/services/${service.id}` : '/api/services'
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || null,
          price: parseFloat(price),
          durationMinutes: parseInt(durationMinutes),
        }),
      })

      if (!res.ok) throw new Error('Error saving service')
      onClose()
      onSave?.()
    } catch (err) {
      setError('No se pudo guardar el servicio')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-6 pb-20 max-w-[480px] mx-auto animate-slide-up">
        <div className="w-12 h-1 bg-rose-200 rounded-full mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-rose-900 mb-4">
          {isEditing ? 'Editar Servicio' : 'Agregar Servicio'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Título"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="Corte de cabello"
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-rose-900">Descripción</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 placeholder:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
              rows={3}
              placeholder="Descripción del servicio..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Precio ($)"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
              placeholder="1500.00"
            />
            <Input
              label="Duración (min)"
              type="number"
              min="1"
              value={durationMinutes}
              onChange={e => setDurationMinutes(e.target.value)}
              required
              placeholder="60"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
