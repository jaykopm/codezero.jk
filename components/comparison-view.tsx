"use client"

import { useCountryStore } from "@/lib/store"
import { paymentGateways, countries, integrationComplexities } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { X, HelpCircle, ExternalLink, DollarSign, BarChart2 } from "lucide-react"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function ComparisonView() {
  const { selectedGateways, isComparisonVisible, setComparisonVisibility, clearSelectedGateways } = useCountryStore()
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [isAnimating, setIsAnimating] = useState(false)
  const [animatedRows, setAnimatedRows] = useState<number[]>([])
  const [isExiting, setIsExiting] = useState(false)
  const tableRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle visibility changes
  useEffect(() => {
    if (isComparisonVisible) {
      setIsExiting(false)
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isComparisonVisible])

  // Handle close with exit animation
  const handleClose = () => {
    setIsExiting(true)
    // Wait for animation to complete before hiding and clearing selections
    setTimeout(() => {
      clearSelectedGateways()
      setIsExiting(false)
    }, 300)
  }

  // Animate table rows sequentially
  useEffect(() => {
    if (isComparisonVisible && tableRef.current && !isExiting) {
      setAnimatedRows([])
      const rows = tableRef.current.querySelectorAll("tbody tr")

      rows.forEach((row, index) => {
        setTimeout(
          () => {
            setAnimatedRows((prev) => [...prev, index])
          },
          100 + index * 50,
        )
      })
    }
  }, [isComparisonVisible, selectedGateways, isExiting])

  // Reset scroll position when opening
  useEffect(() => {
    if (isComparisonVisible && containerRef.current) {
      containerRef.current.scrollTop = 0
    }
  }, [isComparisonVisible])

  if (!isComparisonVisible && !isExiting) {
    return null
  }

  // Get the selected gateway objects
  const gatewaysToCompare = paymentGateways.filter((gateway) => selectedGateways.includes(gateway.id))

  // Handle image error
  const handleImageError = (gatewayId: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [gatewayId]: true,
    }))
  }

  return (
    <TooltipProvider>
      <div
        ref={containerRef}
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 transition-all duration-300 ease-in-out comparison-view",
          isExiting && "comparison-view-exiting",
        )}
        aria-hidden={!isComparisonVisible}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4 comparison-header">
            <h2 className="text-xl font-semibold flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-white opacity-80" />
              Gateway Comparison
            </h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-white hover:bg-white/10 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
                <span className="ml-2">Close</span>
              </Button>
            </div>
          </div>

          <div className={cn("overflow-x-auto", isAnimating && "animate-slide-in-up")} ref={tableRef}>
            <table className="w-full border-collapse comparison-table">
              <thead>
                <tr>
                  <th className="text-left p-3 border-b border-gray-200"></th>
                  {gatewaysToCompare.map((gateway, index) => (
                    <th
                      key={gateway.id}
                      className={cn(
                        "text-center p-3 border-b border-gray-200 min-w-[180px]",
                        isAnimating && `animate-fade-in-delay-${index + 1}`,
                      )}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center shadow-sm">
                          {gateway.logo && !imageErrors[gateway.id] ? (
                            <Image
                              src={gateway.logo || "/placeholder.svg"}
                              alt={`${gateway.name} logo`}
                              fill
                              className="object-contain p-1"
                              onError={() => handleImageError(gateway.id)}
                            />
                          ) : (
                            <span className="text-2xl">{gateway.logoFallback}</span>
                          )}
                        </div>
                        <span className="font-semibold text-gray-900">{gateway.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Payment Methods */}
                <tr className={cn("comparison-row", animatedRows.includes(0) && "comparison-row-animated")}>
                  <td className="p-3 border-b border-gray-200 font-medium text-gray-700">Payment Methods</td>
                  {gatewaysToCompare.map((gateway) => (
                    <td key={gateway.id} className="p-3 border-b border-gray-200 text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {gateway.supportedPaymentMethods.map((method) => (
                          <span
                            key={method}
                            className="inline-block px-2 py-1 bg-primary/5 text-primary rounded-full text-xs"
                          >
                            {method.replace("_", " ")}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Integration Complexity */}
                <tr className={cn("comparison-row", animatedRows.includes(1) && "comparison-row-animated")}>
                  <td className="p-3 border-b border-gray-200 font-medium text-gray-700">
                    <div className="flex items-center gap-1">
                      Integration Complexity
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-primary/70 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs shadow-lg">
                          <p className="font-normal text-sm">
                            Simple: Easy to integrate with minimal technical knowledge
                            <br />
                            Moderate: Requires some development experience
                            <br />
                            Complex: Requires significant technical expertise
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </td>
                  {gatewaysToCompare.map((gateway) => {
                    const complexityInfo = integrationComplexities.find(
                      (c) => c.value === gateway.integrationComplexity,
                    )
                    return (
                      <td key={gateway.id} className="p-3 border-b border-gray-200 text-center">
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs cursor-help ${
                                gateway.integrationComplexity === "simple"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : gateway.integrationComplexity === "moderate"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {complexityInfo?.label}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="shadow-lg">
                            <p>{complexityInfo?.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                    )
                  })}
                </tr>

                {/* Supported Countries */}
                <tr className={cn("comparison-row", animatedRows.includes(2) && "comparison-row-animated")}>
                  <td className="p-3 border-b border-gray-200 font-medium text-gray-700">Supported Countries</td>
                  {gatewaysToCompare.map((gateway) => (
                    <td key={gateway.id} className="p-3 border-b border-gray-200 text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {gateway.countries.map((countryCode) => {
                          const country = countries.find((c) => c.code === countryCode)
                          return (
                            <span key={countryCode} className="inline-block" title={country?.name}>
                              {country?.flag}
                            </span>
                          )
                        })}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Setup Fee */}
                <tr className={cn("comparison-row", animatedRows.includes(3) && "comparison-row-animated")}>
                  <td className="p-3 border-b border-gray-200 font-medium text-gray-700">Setup Fee</td>
                  {gatewaysToCompare.map((gateway) => (
                    <td key={gateway.id} className="p-3 border-b border-gray-200 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-medium">{gateway.fees.setup}</span>
                        <Link
                          href={gateway.feeStructureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="fee-link mt-1"
                        >
                          <DollarSign className="h-3 w-3 mr-1" />
                          Fee details
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Transaction Fee */}
                <tr className={cn("comparison-row", animatedRows.includes(4) && "comparison-row-animated")}>
                  <td className="p-3 border-b border-gray-200 font-medium text-gray-700">Transaction Fee</td>
                  {gatewaysToCompare.map((gateway) => (
                    <td key={gateway.id} className="p-3 border-b border-gray-200 text-center font-medium">
                      {gateway.fees.transaction}
                    </td>
                  ))}
                </tr>

                {/* Monthly Fee */}
                <tr className={cn("comparison-row", animatedRows.includes(5) && "comparison-row-animated")}>
                  <td className="p-3 border-b border-gray-200 font-medium text-gray-700">Monthly Fee</td>
                  {gatewaysToCompare.map((gateway) => (
                    <td key={gateway.id} className="p-3 border-b border-gray-200 text-center font-medium">
                      {gateway.fees.monthly}
                    </td>
                  ))}
                </tr>

                {/* Features */}
                <tr className={cn("comparison-row", animatedRows.includes(6) && "comparison-row-animated")}>
                  <td className="p-3 border-b border-gray-200 font-medium text-gray-700">Key Features</td>
                  {gatewaysToCompare.map((gateway) => (
                    <td key={gateway.id} className="p-3 border-b border-gray-200">
                      <ul className="list-disc list-inside text-left text-sm space-y-1">
                        {gateway.features.map((feature, index) => (
                          <li key={index} className="text-gray-700">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
