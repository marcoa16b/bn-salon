'use client'

import { Service } from '@prisma/client'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { formatPrice } from '@/lib/utils'

interface ServiceCardProps {
  service: Service
  onEdit: (service: Service) => void
}

export function ServiceCard({ service, onEdit }: ServiceCardProps) {
  return (
    <Card className="flex items-center gap-3">
      <div className="flex-1">
        <h3 className="font-semibold text-rose-900">{service.title}</h3>
        {service.description && (
          <p className="text-sm text-rose-600 mt-1 line-clamp-2">{service.description}</p>
        )}
        <div className="flex items-center gap-3 mt-2">
          <span className="text-sm font-medium text-rose-700">
            {formatPrice(Number(service.price))}
          </span>
          <span className="text-sm text-rose-500">•</span>
          <span className="text-sm text-rose-500">{service.durationMinutes} min</span>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={() => onEdit(service)}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </Button>
    </Card>
  )
}
