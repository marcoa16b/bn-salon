import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface Params {
  params: Promise<{ year: string; month: string }>
}

// GET /api/calendar/[year]/[month] — Returns days in month with appointment counts
export async function GET(request: NextRequest, { params }: Params) {
  const { year, month } = await params
  
  try {
    const yearNum = parseInt(year)
    const monthNum = parseInt(month) // 1-12
    
    // Calculate start and end of month
    const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1))
    const endDate = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59, 999))
    
    const appointments = await prisma.appointment.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
        status: { not: 'CANCELLED' },
      },
      select: { date: true },
    })
    
    // Group by day
    const dayMap: Record<number, number> = {}
    for (const apt of appointments) {
      const day = new Date(apt.date).getUTCDate()
      dayMap[day] = (dayMap[day] || 0) + 1
    }
    
    const days = Object.entries(dayMap).map(([day, count]) => ({
      day: parseInt(day),
      count,
    }))
    
    return NextResponse.json({ year: yearNum, month: monthNum, days })
  } catch (error) {
    console.error('GET /api/calendar/[year]/[month] error:', error)
    return NextResponse.json({ error: 'Error fetching calendar data' }, { status: 500 })
  }
}
