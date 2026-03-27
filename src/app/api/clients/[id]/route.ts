import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface Params {
  params: Promise<{ id: string }>
}

// GET /api/clients/[id]
export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params
  
  try {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        appointments: {
          orderBy: { date: 'desc' },
          take: 10,
          include: { service: true },
        },
      },
    })
    
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }
    
    return NextResponse.json(client)
  } catch (error) {
    console.error('GET /api/clients/[id] error:', error)
    return NextResponse.json({ error: 'Error fetching client' }, { status: 500 })
  }
}

// PUT /api/clients/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params
  
  try {
    const body = await request.json()
    const { name, phone, email, notes } = body
    
    const client = await prisma.client.update({
      where: { id },
      data: { name, phone, email, notes },
    })
    
    return NextResponse.json(client)
  } catch (error) {
    console.error('PUT /api/clients/[id] error:', error)
    return NextResponse.json({ error: 'Error updating client' }, { status: 500 })
  }
}

// DELETE /api/clients/[id]
export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params
  
  try {
    await prisma.client.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/clients/[id] error:', error)
    return NextResponse.json({ error: 'Error deleting client' }, { status: 500 })
  }
}
