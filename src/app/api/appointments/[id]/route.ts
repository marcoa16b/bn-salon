import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface Params {
  params: Promise<{ id: string }>
}

// GET /api/appointments/[id]
export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params
  
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { client: true, service: true },
    })
    
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }
    
    return NextResponse.json(appointment)
  } catch (error) {
    console.error('GET /api/appointments/[id] error:', error)
    return NextResponse.json({ error: 'Error fetching appointment' }, { status: 500 })
  }
}

// PUT /api/appointments/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params
  
  try {
    const body = await request.json()
    const { date, startTime, endTime, clientId, serviceId, notes, status } = body
    
    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        date: date ? new Date(date) : undefined,
        startTime,
        endTime,
        clientId,
        serviceId,
        notes,
        status,
      },
      include: { client: true, service: true },
    })
    
    return NextResponse.json(appointment)
  } catch (error) {
    console.error('PUT /api/appointments/[id] error:', error)
    return NextResponse.json({ error: 'Error updating appointment' }, { status: 500 })
  }
}

// DELETE /api/appointments/[id]
export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params
  
  try {
    await prisma.appointment.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/appointments/[id] error:', error)
    return NextResponse.json({ error: 'Error deleting appointment' }, { status: 500 })
  }
}
