import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface Params {
  params: Promise<{ id: string }>
}

// GET /api/services/[id]
export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const service = await prisma.service.findUnique({ where: { id } })
    if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching service' }, { status: 500 })
  }
}

// PUT /api/services/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await request.json()
    const { title, description, price, durationMinutes, isActive } = body
    const service = await prisma.service.update({
      where: { id },
      data: { title, description, price: price !== undefined ? String(price) : undefined, durationMinutes, isActive },
    })
    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: 'Error updating service' }, { status: 500 })
  }
}

// DELETE /api/services/[id] — soft delete
export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await prisma.service.update({ where: { id }, data: { isActive: false } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting service' }, { status: 500 })
  }
}
