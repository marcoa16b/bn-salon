import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/services — List active services
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { title: 'asc' },
    })
    return NextResponse.json(services)
  } catch (error) {
    console.error('GET /api/services error:', error)
    return NextResponse.json({ error: 'Error fetching services' }, { status: 500 })
  }
}

// POST /api/services — Create service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, price, durationMinutes } = body
    
    if (!title || price === undefined || !durationMinutes) {
      return NextResponse.json({ error: 'title, price, and durationMinutes are required' }, { status: 400 })
    }
    
    const service = await prisma.service.create({
      data: { title, description, price: String(price), durationMinutes },
    })
    
    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('POST /api/services error:', error)
    return NextResponse.json({ error: 'Error creating service' }, { status: 500 })
  }
}
