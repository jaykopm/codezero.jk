"use client"

import { useCountryStore } from "@/lib/store"
import { sortOptions } from "@/lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownAZ } from "lucide-react"

export default function SortDropdown() {
  const { sortOption, setSortOption } = useCountryStore()

  return (
    <div className="flex items-center">
      <Select value={sortOption} onValueChange={(value) => setSortOption(value as any)}>
        <SelectTrigger className="w-full sm:w-[220px] border-gray-200 focus:ring-primary/20 shadow-sm">
          <div className="flex items-center">
            <ArrowDownAZ className="h-4 w-4 mr-2 text-primary" />
            <SelectValue placeholder="Sort by" />
          </div>
        </SelectTrigger>
        <SelectContent className="shadow-lg border-gray-200">
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
