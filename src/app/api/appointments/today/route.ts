import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/appointments/today — Get today's appointments
export async function GET() {
  try {
    const today = new Date()
    const startOfDay = new Date(today.toISOString().split('T')[0] + 'T00:00:00.000Z')
    const endOfDay = new Date(today.toISOString().split('T')[0] + 'T23:59:59.999Z')
    
    const appointments = await prisma.appointment.findMany({
      where: { date: { gte: startOfDay, lte: endOfDay } },
      include: { client: true, service: true },
      orderBy: { startTime: 'asc' },
    })
    
    return NextResponse.json(appointments)
  } catch (error) {
    console.error('GET /api/appointments/today error:', error)
    return NextResponse.json({ error: 'Error fetching today appointments' }, { status: 500 })
  }
}
