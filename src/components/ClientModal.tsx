'use client'

import { useState } from 'react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { Client } from '@prisma/client'

interface ClientModalProps {
  open: boolean
  onClose: () => void
  client?: Client
}

export function ClientModal({ open, onClose, client }: ClientModalProps) {
  const [name, setName] = useState(client?.name || '')
  const [phone, setPhone] = useState(client?.phone || '')
  const [email, setEmail] = useState(client?.email || '')
  const [notes, setNotes] = useState(client?.notes || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isEditing = !!client

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = isEditing ? `/api/clients/${client.id}` : '/api/clients'
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email: email || null, notes: notes || null }),
      })

      if (!res.ok) throw new Error('Error saving client')
      onClose()
      window.location.reload()
    } catch (err) {
      setError('No se pudo guardar el cliente')
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
          {isEditing ? 'Editar Cliente' : 'Agregar Cliente'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="María García"
          />
          <Input
            label="Teléfono"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            placeholder="+54 11 1234 5678"
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="maria@ejemplo.com"
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-rose-900">Notas</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 placeholder:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
              rows={3}
              placeholder="Notas sobre el cliente..."
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