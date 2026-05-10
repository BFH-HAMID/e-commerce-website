'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { getTimeRemaining } from '@/lib/format'
import { cn } from '@/lib/utils'

interface FlashSaleTimerProps {
  endDate: string
  compact?: boolean
}

export function FlashSaleTimer({ endDate, compact = false }: FlashSaleTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endDate))

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(endDate)
      setTimeLeft(remaining)
      
      if (!remaining) {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  if (!timeLeft) {
    return (
      <div className={cn(
        "flex items-center gap-1 text-muted-foreground",
        compact ? "text-xs" : "text-sm"
      )}>
        <Clock className={compact ? "h-3 w-3" : "h-4 w-4"} />
        <span>Sale ended</span>
      </div>
    )
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1 text-accent text-xs font-medium">
        <Clock className="h-3 w-3" />
        <span>
          {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 text-accent">
        <Clock className="h-5 w-5" />
        <span className="text-sm font-medium">Ends in:</span>
      </div>
      <div className="flex items-center gap-2">
        <TimeBlock value={timeLeft.hours} label="Hours" />
        <span className="text-accent font-bold">:</span>
        <TimeBlock value={timeLeft.minutes} label="Min" />
        <span className="text-accent font-bold">:</span>
        <TimeBlock value={timeLeft.seconds} label="Sec" />
      </div>
    </div>
  )
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="bg-accent text-accent-foreground px-2 py-1 rounded font-mono font-bold text-lg min-w-[2.5rem] text-center">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  )
}
