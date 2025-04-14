"use client"

import { useCountryStore } from "@/lib/store"
import { countries, paymentMethodTypes, integrationComplexities, feeRanges } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  FilterX,
  Search,
  X,
  Globe,
  CreditCard,
  BarChart2,
  DollarSign,
  SlidersHorizontal,
  ChevronDown,
  ListFilter,
  Check,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import SortDropdown from "@/components/sort-dropdown"

export default function FilterBar() {
  const {
    selectedCountry,
    setSelectedCountry,
    paymentMethodType,
    integrationComplexity,
    feeRange,
    setPaymentMethodType,
    setIntegrationComplexity,
    setFeeRange,
    resetFilters,
    searchQuery,
    setSearchQuery,
  } = useCountryStore()

  const [countryOpen, setCountryOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [highlightedCountry, setHighlightedCountry] = useState<string | null>(null)
  const [isInitialRender, setIsInitialRender] = useState(true)
  const [searchFocused, setSearchFocused] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Mark initial render as complete after mount
  useEffect(() => {
    setIsInitialRender(false)
  }, [])

  // Add a subtle animation when the dropdown first opens
  useEffect(() => {
    if (countryOpen && !hasInteracted) {
      setHasInteracted(true)
    }
  }, [countryOpen, hasInteracted])

  // Get active filters for display
  const getActiveFilters = () => {
    const filters = []

    if (paymentMethodType) {
      const label = paymentMethodTypes.find((t) => t.value === paymentMethodType)?.label
      filters.push(`Payment: ${label}`)
    }

    if (integrationComplexity) {
      const label = integrationComplexities.find((c) => c.value === integrationComplexity)?.label
      filters.push(`Complexity: ${label}`)
    }

    if (feeRange) {
      const label = feeRanges.find((r) => r.value === feeRange)?.label
      filters.push(`Fee: ${label}`)
    }

    return filters
  }

  // Handle country selection with visual feedback
  const handleCountrySelect = (countryCode: string | null) => {
    // If selecting "All Countries", set to null
    if (countryCode === "all") {
      countryCode = null
    }

    // Highlight the selected country briefly for visual feedback
    setHighlightedCountry(countryCode)

    // Update the selected country
    setSelectedCountry(countryCode)
    setCountryOpen(false)

    // Reset highlight after animation completes
    setTimeout(() => setHighlightedCountry(null), 800)
  }

  const activeFilters = getActiveFilters()
  const hasActiveFilters = activeFilters.length > 0 || searchQuery

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 animate-fade-in relative z-20">
      <div className="flex flex-col space-y-4">
        {/* Main filter row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Country Selector */}
          <div className="w-full sm:w-auto">
            <Popover open={countryOpen} onOpenChange={setCountryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={countryOpen}
                  className={cn(
                    "w-full sm:w-[200px] justify-between border-gray-200 hover:border-primary/50 hover:bg-primary/5 shadow-sm transition-all duration-300",
                    selectedCountry && "border-primary/30 bg-primary/5",
                    !isInitialRender && highlightedCountry === selectedCountry && "country-selector-pulse",
                  )}
                >
                  <Globe className={cn("h-4 w-4 mr-2", selectedCountry ? "text-primary" : "text-muted-foreground")} />
                  {selectedCountry ? (
                    <div className="flex items-center">
                      <span className="mr-2">
                        {countries.find((country) => country.code === selectedCountry)?.flag}
                      </span>
                      <span>{countries.find((country) => country.code === selectedCountry)?.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">All Countries</span>
                  )}
                  <ChevronDown
                    className={cn(
                      "ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200",
                      countryOpen && "transform rotate-180",
                    )}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[240px] p-0 shadow-lg border-gray-200 country-dropdown-content"
                align="start"
                sideOffset={5}
                onOpenAutoFocus={(e) => {
                  // Prevent default focus behavior and focus our search input instead
                  e.preventDefault()
                  setTimeout(() => {
                    const searchInput = document.querySelector(".country-search-input input")
                    if (searchInput) {
                      ;(searchInput as HTMLInputElement).focus()
                    }
                  }, 100)
                }}
              >
                <Command className="country-command">
                  <CommandInput
                    placeholder="Search country..."
                    className="country-search-input"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                  <CommandList className={cn("country-command-list", searchFocused && "search-focused")}>
                    <CommandEmpty>
                      <div className="py-6 text-center text-sm text-gray-500">No country found</div>
                    </CommandEmpty>
                    <CommandGroup className="country-command-group">
                      <CommandItem
                        value="all"
                        onSelect={() => handleCountrySelect("all")}
                        className={cn(
                          "cursor-pointer country-item",
                          !selectedCountry && "bg-primary/10 text-primary font-medium",
                          highlightedCountry === null && "highlighted-country",
                        )}
                      >
                        <div className="flex items-center w-full">
                          <Globe
                            className={cn("mr-2 h-4 w-4", !selectedCountry ? "text-primary" : "text-muted-foreground")}
                          />
                          <span>All Countries</span>
                          {!selectedCountry && <Check className="ml-auto h-4 w-4 text-primary" />}
                        </div>
                      </CommandItem>
                      {countries.map((country) => (
                        <CommandItem
                          key={country.code}
                          value={country.code}
                          onSelect={() => handleCountrySelect(country.code)}
                          className={cn(
                            "cursor-pointer country-item",
                            selectedCountry === country.code && "bg-primary/10 text-primary font-medium",
                            highlightedCountry === country.code && "highlighted-country",
                          )}
                        >
                          <div className="flex items-center w-full">
                            <span className="mr-2 text-lg">{country.flag}</span>
                            <span>{country.name}</span>
                            {selectedCountry === country.code && <Check className="ml-auto h-4 w-4 text-primary" />}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-auto sm:flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 search-icon" />
            <Input
              type="text"
              placeholder="Search by gateway name or feature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 border-gray-200 focus:border-primary/50 focus:ring-primary/20 w-full shadow-sm"
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

          {/* Filter Toggle Button */}
          <Button
            variant={showFilters ? "default" : "outline"}
            className={showFilters ? "" : "border-gray-200 hover:border-primary/50 hover:bg-primary/5 shadow-sm"}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {activeFilters.length > 0 && (
              <Badge className="ml-2 bg-white text-primary" variant="secondary">
                {activeFilters.length}
              </Badge>
            )}
          </Button>

          {/* Sort Dropdown */}
          <div className="w-full sm:w-auto">
            <SortDropdown />
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-gray-500 hover:text-gray-700">
              <FilterX className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>

        {/* Expanded Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 animate-fade-in">
            <div>
              <label className="text-sm text-gray-600 mb-1 block flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-primary" />
                Payment Method
              </label>
              <Select
                value={paymentMethodType || ""}
                onValueChange={(value) => setPaymentMethodType(value ? (value as any) : null)}
              >
                <SelectTrigger className="w-full border-gray-200 focus:ring-primary/20 shadow-sm">
                  <SelectValue placeholder="All Payment Methods" />
                </SelectTrigger>
                <SelectContent className="shadow-lg border-gray-200">
                  <SelectItem value="all">All Payment Methods</SelectItem>
                  {paymentMethodTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center">
                        <span className="mr-2">{type.icon}</span>
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block flex items-center">
                <BarChart2 className="h-4 w-4 mr-2 text-primary" />
                Integration Complexity
              </label>
              <Select
                value={integrationComplexity || ""}
                onValueChange={(value) => setIntegrationComplexity(value ? (value as any) : null)}
              >
                <SelectTrigger className="w-full border-gray-200 focus:ring-primary/20 shadow-sm">
                  <SelectValue placeholder="Any Complexity" />
                </SelectTrigger>
                <SelectContent className="shadow-lg border-gray-200">
                  <SelectItem value="any">Any Complexity</SelectItem>
                  {integrationComplexities.map((complexity) => (
                    <SelectItem key={complexity.value} value={complexity.value}>
                      {complexity.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-primary" />
                Fee Range
              </label>
              <Select value={feeRange || ""} onValueChange={(value) => setFeeRange(value ? (value as any) : null)}>
                <SelectTrigger className="w-full border-gray-200 focus:ring-primary/20 shadow-sm">
                  <SelectValue placeholder="Any Fee Range" />
                </SelectTrigger>
                <SelectContent className="shadow-lg border-gray-200">
                  <SelectItem value="any">Any Fee Range</SelectItem>
                  {feeRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100 animate-fade-in">
            {activeFilters.length > 0 && (
              <div className="flex items-center mr-2 text-gray-600">
                <ListFilter className="h-4 w-4 mr-1 text-primary" />
                <span className="text-sm">Active filters:</span>
              </div>
            )}
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                {filter}
              </Badge>
            ))}
            {searchQuery && (
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                Search: "{searchQuery}"
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
