import { create } from "zustand"
import type {
  FilterState,
  FeeRange,
  IntegrationComplexity,
  PaymentMethodType,
  ComparisonState,
  SortOption,
} from "./types"

interface CountryState {
  selectedCountry: string | null
  setSelectedCountry: (country: string) => void
}

interface FilterStoreState extends CountryState, FilterState, ComparisonState {
  setPaymentMethodType: (type: PaymentMethodType | null) => void
  setIntegrationComplexity: (complexity: IntegrationComplexity | null) => void
  setFeeRange: (range: FeeRange | null) => void
  setSearchQuery: (query: string) => void
  setSortOption: (option: SortOption) => void
  resetFilters: () => void

  // Comparison methods
  toggleGatewaySelection: (gatewayId: string) => void
  clearSelectedGateways: () => void
  setComparisonVisibility: (isVisible: boolean) => void
}

export const useCountryStore = create<FilterStoreState>((set) => ({
  // Country selection
  selectedCountry: null,
  setSelectedCountry: (country) => set({ selectedCountry: country }),

  // Filter states
  paymentMethodType: null,
  integrationComplexity: null,
  feeRange: null,
  searchQuery: "",
  sortOption: "popularity",

  // Filter setters
  setPaymentMethodType: (type) => set({ paymentMethodType: type }),
  setIntegrationComplexity: (complexity) => set({ integrationComplexity: complexity }),
  setFeeRange: (range) => set({ feeRange: range }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortOption: (option) => set({ sortOption: option }),

  // Reset all filters
  resetFilters: () =>
    set({
      paymentMethodType: null,
      integrationComplexity: null,
      feeRange: null,
      searchQuery: "",
    }),

  // Comparison state
  selectedGateways: [],
  isComparisonVisible: false,

  // Comparison methods
  toggleGatewaySelection: (gatewayId) =>
    set((state) => {
      const isSelected = state.selectedGateways.includes(gatewayId)

      if (isSelected) {
        // Remove from selection
        const newSelectedGateways = state.selectedGateways.filter((id) => id !== gatewayId)
        return {
          selectedGateways: newSelectedGateways,
          // If we removed all or all but one gateway, hide the comparison view
          isComparisonVisible: newSelectedGateways.length > 1 && state.isComparisonVisible,
        }
      } else {
        // Add to selection (if under limit)
        if (state.selectedGateways.length < 4) {
          return {
            selectedGateways: [...state.selectedGateways, gatewayId],
            isComparisonVisible: state.selectedGateways.length > 0 || state.isComparisonVisible,
          }
        }
        return state
      }
    }),

  clearSelectedGateways: () =>
    set({
      selectedGateways: [],
      isComparisonVisible: false,
    }),
  setComparisonVisibility: (isVisible) => set({ isComparisonVisible: isVisible }),
}))
