"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronLeft, ChevronRight, CalendarIcon, Cloud } from "lucide-react"
import { format } from "date-fns"

interface DateControlsProps {
  selectedDate: Date
  cloudCoverage: number
  onDateChange: (direction: "prev" | "next") => void
  onDateSelect: (date: Date) => void
}

export function DateControls({ selectedDate, cloudCoverage, onDateChange, onDateSelect }: DateControlsProps) {
  return (
    <Card className="bg-slate-900/90 backdrop-blur-md border-slate-700/50 text-white">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          {/* Previous Date */}
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 text-white hover:bg-white/10 hover:text-cyan-400"
            onClick={() => onDateChange("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Date Display with Calendar Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-white/10 font-mono text-sm px-4">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {format(selectedDate, "yyyy-MM-dd")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && onDateSelect(date)}
                initialFocus
                className="text-white"
              />
            </PopoverContent>
          </Popover>

          {/* Next Date */}
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 text-white hover:bg-white/10 hover:text-cyan-400"
            onClick={() => onDateChange("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Cloud Coverage */}
          <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-slate-800/50 rounded-full">
            <Cloud className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium">{cloudCoverage}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
