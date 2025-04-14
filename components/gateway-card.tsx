"use client"

import { countries, paymentMethodTypes, feeRanges, integrationComplexities } from "@/lib/data"
import type { Gateway } from "@/lib/types"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCountryStore } from "@/lib/store"
import { Check, ExternalLink, Plus, FileText, HelpCircle, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface GatewayCardProps {
  gateway: Gateway
}

export default function GatewayCard({ gateway }: GatewayCardProps) {
  const { selectedGateways, toggleGatewaySelection } = useCountryStore()
  const [showFees, setShowFees] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [justSelected, setJustSelected] = useState(false)

  // Check if this gateway is selected for comparison
  const isSelected = selectedGateways.includes(gateway.id)

  // Get readable labels for the gateway properties
  const paymentMethodLabel = paymentMethodTypes.find((t) => t.value === gateway.paymentMethodType)?.label
  const complexityInfo = integrationComplexities.find((c) => c.value === gateway.integrationComplexity)
  const feeLabel = feeRanges.find((r) => r.value === gateway.feeRange)?.label

  // Handle selection with animation
  const handleSelection = () => {
    toggleGatewaySelection(gateway.id)
    if (!isSelected) {
      setJustSelected(true)
    }
  }

  // Reset animation state
  useEffect(() => {
    if (justSelected) {
      const timer = setTimeout(() => {
        setJustSelected(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [justSelected])

  // Get method class for styling
  const getMethodClass = (method: string) => {
    switch (method) {
      case "credit_card":
        return "credit-card-pill"
      case "e_wallet":
        return "e-wallet-pill"
      case "bank_transfer":
        return "bank-transfer-pill"
      case "crypto":
        return "crypto-pill"
      case "qr_code":
        return "qr-code-pill"
      default:
        return ""
    }
  }

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "gateway-card h-full flex flex-col overflow-hidden",
          isSelected && "selected",
          justSelected && "animate-pulse-once",
        )}
      >
        <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center shadow-sm">
            {gateway.logo && !imageError ? (
              <Image
                src={gateway.logo || "/placeholder.svg"}
                alt={`${gateway.name} logo`}
                fill
                className="object-contain p-1"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-2xl">{gateway.logoFallback}</span>
            )}
          </div>
          <div className="flex-grow">
            <CardTitle className="text-gray-900">{gateway.name}</CardTitle>
            <CardDescription className="text-gray-600">{gateway.shortDescription}</CardDescription>
          </div>
          <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className={`flex-shrink-0 transition-all duration-300 ${
              isSelected ? "bg-primary text-white" : "border-gray-200 hover:border-primary/50 hover:bg-primary/5"
            }`}
            onClick={handleSelection}
            title={isSelected ? "Remove from comparison" : "Add to comparison"}
          >
            {isSelected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </CardHeader>
        <CardContent className="flex-grow pt-4">
          {/* Payment Method Type Indicators */}
          <div className="flex flex-wrap gap-2 mb-4">
            {gateway.supportedPaymentMethods.map((methodType) => {
              const method = paymentMethodTypes.find((t) => t.value === methodType)
              return (
                <div key={methodType} className={`method-pill ${getMethodClass(methodType)}`} title={method?.label}>
                  <div className="flex items-center gap-1">
                    <span className="text-lg">{method?.icon}</span>
                    <span className="hidden sm:inline">{method?.label}</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              {paymentMethodLabel}
            </Badge>

            {/* Integration Complexity Badge with Tooltip */}
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className={`flex items-center gap-1 cursor-help ${
                    gateway.integrationComplexity === "simple"
                      ? "complexity-simple"
                      : gateway.integrationComplexity === "moderate"
                        ? "complexity-moderate"
                        : "complexity-complex"
                  }`}
                >
                  {complexityInfo?.label}
                  <HelpCircle className="h-3 w-3 ml-1 opacity-70" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs shadow-lg">
                <p>{complexityInfo?.description}</p>
              </TooltipContent>
            </Tooltip>

            <Badge
              variant="outline"
              className={
                gateway.feeRange === "low" ? "fee-low" : gateway.feeRange === "medium" ? "fee-medium" : "fee-high"
              }
            >
              {feeLabel}
            </Badge>
          </div>

          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-2 font-medium">Features:</p>
            <div className="flex flex-wrap gap-1">
              {gateway.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="fees" className="border-gray-100">
              <AccordionTrigger className="py-2 text-gray-700 hover:text-primary">
                <span className="text-sm font-medium">Fee Breakdown</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-gray-600">Setup Fee:</span>
                    <span className="font-medium">{gateway.fees.setup}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-gray-600">Transaction Fee:</span>
                    <span className="font-medium">{gateway.fees.transaction}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-gray-600">Monthly Fee:</span>
                    <span className="font-medium">{gateway.fees.monthly}</span>
                  </div>
                  {gateway.fees.other && (
                    <div className="grid grid-cols-2 gap-1">
                      <span className="text-gray-600">Other Fees:</span>
                      <span className="font-medium">{gateway.fees.other}</span>
                    </div>
                  )}

                  {/* Fee Structure Reference Link */}
                  <div className="pt-2 border-t border-gray-100 mt-2">
                    <Link href={gateway.feeStructureUrl} target="_blank" rel="noopener noreferrer" className="fee-link">
                      <DollarSign className="h-3 w-3 mr-1" />
                      View official fee structure
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-4 bg-gray-50/50">
          <div className="w-full">
            <p className="text-sm text-gray-600 mb-2 font-medium">Available in:</p>
            <div className="flex flex-wrap gap-2">
              {gateway.countries.map((countryCode) => {
                const country = countries.find((c) => c.code === countryCode)
                return (
                  <div
                    key={countryCode}
                    className="flex items-center gap-1 text-sm rounded-full px-2 py-1 country-pill"
                  >
                    <span>{country?.flag}</span>
                    <span>{country?.name}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Reference Links */}
          <div className="w-full grid grid-cols-2 gap-2">
            <Link href={gateway.officialUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full border-gray-200 hover:border-primary/50 hover:bg-primary/5">
                Learn More
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href={gateway.apiDocUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full border-gray-200 hover:border-primary/50 hover:bg-primary/5">
                API Docs
                <FileText className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}
