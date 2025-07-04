"use client"

import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-700/50 px-4 py-2">
        <Search className="h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border-0 bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
        />
        <Button variant="ghost" size="sm" className="w-8 h-8 text-slate-400 hover:text-white hover:bg-white/10">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
