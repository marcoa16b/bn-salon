import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/appointments — List appointments with optional filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') // YYYY-MM-DD
  const clientId = searchParams.get('clientId')
  const serviceId = searchParams.get('serviceId')
  
  try {
    const where: Record<string, unknown> = {}
    
    if (date) {
      const startOfDay = new Date(date + 'T00:00:00.000Z')
      const endOfDay = new Date(date + 'T23:59:59.999Z')
      where.date = { gte: startOfDay, lte: endOfDay }
    }
    
    if (clientId) where.clientId = clientId
    if (serviceId) where.serviceId = serviceId
    
    const appointments = await prisma.appointment.findMany({
      where,
      include: { client: true, service: true },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    })
    
    return NextResponse.json(appointments)
  } catch (error) {
    console.error('GET /api/appointments error:', error)
    return NextResponse.json({ error: 'Error fetching appointments' }, { status: 500 })
  }
}

// POST /api/appointments — Create appointment and auto-update Client.lastVisit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, startTime, endTime, clientId, serviceId, notes, status } = body
    
    if (!date || !startTime || !endTime || !clientId || !serviceId) {
      return NextResponse.json(
        { error: 'date, startTime, endTime, clientId, serviceId are required' },
        { status: 400 }
      )
    }
    
    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        startTime,
        endTime,
        clientId,
        serviceId,
        notes,
        status: status || 'SCHEDULED',
      },
      include: { client: true, service: true },
    })
    
    // Auto-update Client.lastVisit to the appointment date
    await prisma.client.update({
      where: { id: clientId },
      data: { lastVisit: new Date(date) },
    })
    
    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('POST /api/appointments error:', error)
    return NextResponse.json({ error: 'Error creating appointment' }, { status: 500 })
  }
}
