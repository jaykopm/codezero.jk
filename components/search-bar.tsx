"use client"

import { useCountryStore } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useCountryStore()

  return (
    <div className="relative mb-6">
      <h2 className="text-lg font-medium mb-3 flex items-center text-gray-800">
        <Search className="h-5 w-5 mr-2 text-primary" />
        Search
      </h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 search-icon" />
        <Input
          type="text"
          placeholder="Search by gateway name or feature..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 border-gray-200 focus:border-primary/50 focus:ring-primary/20"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
