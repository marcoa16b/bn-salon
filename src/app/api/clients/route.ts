import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/clients — List all clients, optional search param
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  
  try {
    const clients = await prisma.client.findMany({
      where: search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ],
      } : undefined,
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { appointments: true } },
      },
    })
    
    return NextResponse.json(clients)
  } catch (error) {
    console.error('GET /api/clients error:', error)
    return NextResponse.json({ error: 'Error fetching clients' }, { status: 500 })
  }
}

// POST /api/clients — Create client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, notes } = body
    
    if (!name || !phone) {
      return NextResponse.json({ error: 'name and phone are required' }, { status: 400 })
    }
    
    const client = await prisma.client.create({
      data: { name, phone, email, notes },
    })
    
    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error('POST /api/clients error:', error)
    return NextResponse.json({ error: 'Error creating client' }, { status: 500 })
  }
}
