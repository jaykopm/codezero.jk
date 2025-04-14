export interface Country {
  code: string
  name: string
  flag: string
}

export interface Gateway {
  id: string
  name: string
  logo?: string
  logoFallback: string
  shortDescription: string
  countries: string[]
  paymentMethodType: PaymentMethodType
  supportedPaymentMethods: PaymentMethodType[]
  integrationComplexity: IntegrationComplexity
  feeRange: FeeRange
  features: string[]
  fees: {
    setup: string
    transaction: string
    monthly: string
    other?: string
  }
  popularity: number // 1-10 scale
  officialUrl: string
  apiDocUrl: string
  feeStructureUrl: string // Added fee structure URL
}

export type PaymentMethodType = "credit_card" | "e_wallet" | "bank_transfer" | "crypto" | "qr_code"
export type IntegrationComplexity = "simple" | "moderate" | "complex"
export type FeeRange = "low" | "medium" | "high"
export type SortOption =
  | "popularity"
  | "fee_low_to_high"
  | "fee_high_to_low"
  | "complexity_simple_to_complex"
  | "complexity_complex_to_simple"

export interface FilterState {
  paymentMethodType: PaymentMethodType | null
  integrationComplexity: IntegrationComplexity | null
  feeRange: FeeRange | null
  searchQuery: string
  sortOption: SortOption
}

export interface ComparisonState {
  selectedGateways: string[]
  isComparisonVisible: boolean
}
