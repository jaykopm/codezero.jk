"use client"

import { useCountryStore } from "@/lib/store"
import { paymentGateways, type FeeRange, type IntegrationComplexity } from "@/lib/data"
import GatewayCard from "@/components/gateway-card"
import { ListFilter } from "lucide-react"

export default function GatewayList() {
  const { selectedCountry, paymentMethodType, integrationComplexity, feeRange, searchQuery, sortOption } =
    useCountryStore()

  // Filter gateways based on all criteria
  const filteredGateways = paymentGateways.filter((gateway) => {
    // Country filter
    if (selectedCountry && !gateway.countries.includes(selectedCountry)) {
      return false
    }

    // Payment method type filter
    if (paymentMethodType && !gateway.supportedPaymentMethods.includes(paymentMethodType)) {
      return false
    }

    // Integration complexity filter
    if (integrationComplexity && gateway.integrationComplexity !== integrationComplexity) {
      return false
    }

    // Fee range filter
    if (feeRange && gateway.feeRange !== feeRange) {
      return false
    }

    // Search query filter (case insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const nameMatch = gateway.name.toLowerCase().includes(query)
      const descMatch = gateway.shortDescription.toLowerCase().includes(query)
      const featureMatch = gateway.features.some((feature) => feature.toLowerCase().includes(query))

      if (!nameMatch && !descMatch && !featureMatch) {
        return false
      }
    }

    return true
  })

  // Sort gateways based on selected sort option
  const sortedGateways = [...filteredGateways].sort((a, b) => {
    switch (sortOption) {
      case "popularity":
        return b.popularity - a.popularity
      case "fee_low_to_high":
        return getFeeValue(a.feeRange) - getFeeValue(b.feeRange)
      case "fee_high_to_low":
        return getFeeValue(b.feeRange) - getFeeValue(a.feeRange)
      case "complexity_simple_to_complex":
        return getComplexityValue(a.integrationComplexity) - getComplexityValue(b.integrationComplexity)
      case "complexity_complex_to_simple":
        return getComplexityValue(b.integrationComplexity) - getComplexityValue(a.integrationComplexity)
      default:
        return 0
    }
  })

  // Helper functions for sorting
  function getFeeValue(feeRange: FeeRange): number {
    switch (feeRange) {
      case "low":
        return 1
      case "medium":
        return 2
      case "high":
        return 3
      default:
        return 0
    }
  }

  function getComplexityValue(complexity: IntegrationComplexity): number {
    switch (complexity) {
      case "simple":
        return 1
      case "moderate":
        return 2
      case "complex":
        return 3
      default:
        return 0
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 rounded-xl shadow-md border border-gray-100 animate-fade-in">
        <h2 className="text-2xl font-semibold text-gray-900">
          {selectedCountry ? `Available Payment Gateways` : "All Payment Gateways"}
          <span className="ml-2 text-lg text-primary/80">({sortedGateways.length})</span>
        </h2>
      </div>

      {sortedGateways.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-md animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
            <ListFilter className="h-10 w-10 text-primary/70" />
          </div>
          <p className="text-gray-700 font-medium mb-2 text-lg">No payment gateways match your criteria.</p>
          <p className="text-gray-500">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedGateways.map((gateway, index) => (
            <div key={gateway.id} className={`animate-fade-in-delay-${(index % 3) + 1}`}>
              <GatewayCard gateway={gateway} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
