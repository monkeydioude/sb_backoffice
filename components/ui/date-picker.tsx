"use client"

import * as React from "react"
import { Input } from "./input"
import { Label } from "./label"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  startDate?: Date
  endDate?: Date
  onStartDateChange?: (date: Date | undefined) => void
  onEndDateChange?: (date: Date | undefined) => void
  className?: string
}

export function DatePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
}: DatePickerProps) {
  const [startDateStr, setStartDateStr] = React.useState<string>(
    startDate ? startDate.toISOString().split("T")[0] : ""
  )
  const [endDateStr, setEndDateStr] = React.useState<string>(
    endDate ? endDate.toISOString().split("T")[0] : ""
  )

  React.useEffect(() => {
    if (startDate) {
      setStartDateStr(startDate.toISOString().split("T")[0])
    }
  }, [startDate])

  React.useEffect(() => {
    if (endDate) {
      setEndDateStr(endDate.toISOString().split("T")[0])
    }
  }, [endDate])

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setStartDateStr(value)
    if (value && onStartDateChange) {
      onStartDateChange(new Date(value))
    } else if (!value && onStartDateChange) {
      onStartDateChange(undefined)
    }
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEndDateStr(value)
    if (value && onEndDateChange) {
      onEndDateChange(new Date(value))
    } else if (!value && onEndDateChange) {
      onEndDateChange(undefined)
    }
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex items-center gap-2">
        <Label htmlFor="start-date" className="text-sm whitespace-nowrap text-muted-foreground">
          Du :
        </Label>
        <Input
          id="start-date"
          type="date"
          value={startDateStr}
          onChange={handleStartDateChange}
          className="w-[150px]"
        />
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="end-date" className="text-sm whitespace-nowrap text-muted-foreground">
          Au :
        </Label>
        <Input
          id="end-date"
          type="date"
          value={endDateStr}
          onChange={handleEndDateChange}
          min={startDateStr}
          className="w-[150px]"
        />
      </div>
    </div>
  )
}
