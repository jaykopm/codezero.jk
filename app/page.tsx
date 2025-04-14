import FilterBar from "@/components/filter-bar"
import GatewayList from "@/components/gateway-list"
import ComparisonView from "@/components/comparison-view"
import ComparisonBar from "@/components/comparison-bar"
import DynamicBanner from "@/components/dynamic-banner"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 mb-20">
      <DynamicBanner />

      <FilterBar />

      <div className="mt-6">
        <GatewayList />
      </div>

      <ComparisonBar />
      <ComparisonView />
    </main>
  )
}
