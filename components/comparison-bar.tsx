"use client"

import { useCountryStore } from "@/lib/store"
import { paymentGateways } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, BarChart2 } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function ComparisonBar() {
  const { selectedGateways, isComparisonVisible, setComparisonVisibility } = useCountryStore()
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const hasSelectedGateways = selectedGateways.length > 0

  // Get names of selected gateways
  const selectedGatewayNames = selectedGateways
    .map((id) => {
      const gateway = paymentGateways.find((g) => g.id === id)
      return gateway ? gateway.name : ""
    })
    .filter(Boolean)

  // Handle animation when selection changes
  useEffect(() => {
    setIsVisible(hasSelectedGateways) // Always set visibility based on gateway selection

    if (hasSelectedGateways) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [selectedGateways, hasSelectedGateways])

  // Auto-show comparison when two gateways are selected
  useEffect(() => {
    if (selectedGateways.length >= 2 && !isComparisonVisible) {
      const timer = setTimeout(() => {
        setComparisonVisibility(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [selectedGateways, isComparisonVisible, setComparisonVisibility])

  // Toggle comparison visibility with proper state management
  const toggleComparisonVisibility = () => {
    if (isComparisonVisible) {
      // If we're closing the comparison view, just hide it without clearing selections
      setComparisonVisibility(false)
    } else {
      // If we're opening the comparison view
      setComparisonVisibility(true)
    }
  }

  return hasSelectedGateways ? (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 comparison-bar py-3 px-4 z-40",
        !isVisible && "hidden-bar",
        isComparisonVisible && "comparison-bar-raised",
      )}
    >
      <div className={cn("container mx-auto flex justify-between items-center", isAnimating && "animate-slide-in-up")}>
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-white opacity-80" />
          <span className="font-medium text-white">Compare ({selectedGateways.length}):</span>
          <span className="text-white/80 text-sm hidden sm:inline">{selectedGatewayNames.join(", ")}</span>
          <span className="text-white/80 text-sm sm:hidden">
            {selectedGatewayNames.length > 0
              ? `${selectedGatewayNames[0]}${selectedGatewayNames.length > 1 ? ` + ${selectedGatewayNames.length - 1} more` : ""}`
              : ""}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-white border-white/30 hover:bg-white/10 hover:text-white transition-all duration-300"
          onClick={toggleComparisonVisibility}
        >
          {isComparisonVisible ? (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              View Details
            </>
          )}
        </Button>
      </div>
    </div>
  ) : null
}
