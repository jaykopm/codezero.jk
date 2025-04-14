"use client"

import { useCountryStore } from "@/lib/store"
import { countries } from "@/lib/data"
import { Check, ChevronsUpDown, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

export default function CountrySelector() {
  const [open, setOpen] = useState(false)
  const { selectedCountry, setSelectedCountry } = useCountryStore()

  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-3 flex items-center text-gray-800">
        <Globe className="h-5 w-5 mr-2 text-primary" />
        Select a country
      </h2>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between border-gray-200 hover:border-primary/50 hover:bg-primary/5"
          >
            {selectedCountry ? (
              <div className="flex items-center">
                <span className="mr-2 text-lg">
                  {countries.find((country) => country.code === selectedCountry)?.flag}
                </span>
                <span>{countries.find((country) => country.code === selectedCountry)?.name}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Select country...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={country.code}
                    onSelect={(currentValue) => {
                      setSelectedCountry(currentValue)
                      setOpen(false)
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 text-primary",
                        selectedCountry === country.code ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="mr-2 text-lg">{country.flag}</span>
                    {country.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
