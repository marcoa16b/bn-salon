import Link from 'next/link'
import { Client } from '@prisma/client'
import { Avatar } from './ui/Avatar'

interface ClientWithCount extends Client {
  _count?: { appointments: number }
}

interface ClientRowProps {
  client: ClientWithCount
}

function formatLastVisit(lastVisit: Date | null | undefined): string {
  if (!lastVisit) return 'Sin visitas'
  const now = new Date()
  const diff = Math.floor((now.getTime() - new Date(lastVisit).getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  if (diff < 7) return `Hace ${diff} días`
  return new Date(lastVisit).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

export function ClientRow({ client }: ClientRowProps) {
  return (
    <Link
      href={`/clientes/${client.id}`}
      className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
    >
      <Avatar name={client.name} size="md" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-rose-900 truncate">{client.name}</p>
        <p className="text-sm text-rose-600">{client.phone}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-rose-500">{formatLastVisit(client.lastVisit)}</p>
      </div>
    </Link>
  )
}