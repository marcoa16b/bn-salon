'use client'

import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday } from 'date-fns'
import { es } from 'date-fns/locale'

interface DayInfo {
  day: number
  count: number
}

interface CalendarMonthProps {
  year: number
  month: number
  selectedDate: Date
  onSelectDate: (date: Date) => void
  onPrevMonth: () => void
  onNextMonth: () => void
}

export function CalendarMonth({ year, month, selectedDate, onSelectDate, onPrevMonth, onNextMonth }: CalendarMonthProps) {
  const [dayInfo, setDayInfo] = useState<DayInfo[]>([])
  const [loading, setLoading] = useState(true)

  const firstDay = startOfMonth(new Date(year, month - 1))
  const lastDay = endOfMonth(firstDay)
  const days = eachDayOfInterval({ start: firstDay, end: lastDay })
  const startDayOfWeek = getDay(firstDay) // 0=Sun

  // Offset for Monday-first week (0=Mon ... 6=Sun)
  const weekDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1

  useEffect(() => {
    async function fetchCalendarData() {
      setLoading(true)
      try {
        const res = await fetch(`/api/calendar/${year}/${month}`)
        const data = await res.json()
        setDayInfo(data.days || [])
      } finally {
        setLoading(false)
      }
    }
    fetchCalendarData()
  }, [year, month])

  function getCountForDay(day: number): number {
    return dayInfo.find(d => d.day === day)?.count || 0
  }

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
      {/* Month header with navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPrevMonth}
          className="p-1.5 hover:bg-rose-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-rose-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <p className="text-lg font-semibold text-rose-900 capitalize">
          {format(firstDay, 'MMMM yyyy', { locale: es })}
        </p>
        <button
          onClick={onNextMonth}
          className="p-1.5 hover:bg-rose-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-rose-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map(d => (
          <div key={d} className="text-center text-xs font-medium text-rose-500 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: weekDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Day cells */}
          {days.map(day => {
            const dayNum = day.getDate()
            const count = getCountForDay(dayNum)
            const isSelected = isSameDay(day, selectedDate)
            const isTodayDate = isToday(day)

            return (
              <button
                key={dayNum}
                onClick={() => onSelectDate(day)}
                className={`
                  aspect-square rounded-full flex flex-col items-center justify-center
                  relative transition-colors
                  ${isSelected ? 'bg-rose-500 text-white' : isTodayDate ? 'bg-rose-200 text-rose-900' : 'hover:bg-rose-100 text-rose-800'}
                `}
              >
                <span className="text-sm font-medium">{dayNum}</span>
                {count > 0 && (
                  <span className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-rose-500'}`} />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}