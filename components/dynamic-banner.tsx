"use client"

import { useCountryStore } from "@/lib/store"
import { countries } from "@/lib/data"
import { Wallet, Globe, CreditCard } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Define a default image path that we know exists
const DEFAULT_IMAGE = "/images/sea-default.jpg"

export default function DynamicBanner() {
  const { selectedCountry } = useCountryStore()
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [currentBgImage, setCurrentBgImage] = useState(DEFAULT_IMAGE)
  const [prevBgImage, setPrevBgImage] = useState("")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Get country name for display
  const countryName = selectedCountry ? countries.find((c) => c.code === selectedCountry)?.name : "Southeast Asia"

  // Update background image when country changes
  useEffect(() => {
    if (selectedCountry) {
      const countryObj = countries.find((c) => c.code === selectedCountry)
      if (countryObj) {
        // Reset error state when trying a new image
        setImageError(false)
        
        // Format the image filename with country code and lowercase name
        const newImage = `/images/${selectedCountry.toLowerCase()}-${countryObj.name.toLowerCase().replace(/\s+/g, '')}.jpg`
        
        // Start transition
        if (currentBgImage) {
          setPrevBgImage(currentBgImage)
        }
        setCurrentBgImage(newImage)
        setIsImageLoading(true)
        setIsTransitioning(true)
      }
    } else {
      // Set to default image
      if (currentBgImage !== DEFAULT_IMAGE) {
        setPrevBgImage(currentBgImage)
        setCurrentBgImage(DEFAULT_IMAGE)
        setIsImageLoading(true)
        setIsTransitioning(true)
        setImageError(false)
      }
    }

    // Reset transition state after animation completes
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [selectedCountry, currentBgImage])

  return (
    <div className="page-header-container relative overflow-hidden rounded-2xl mb-8 shadow-lg">
      {/* Previous image (fading out) */}
      {isTransitioning && prevBgImage && (
        <div className="absolute inset-0 transition-opacity duration-1000 ease-out opacity-0">
          <Image
            src={prevBgImage}
            alt="Previous country background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary/60 mix-blend-multiply" />
        </div>
      )}

      {/* Current image (fading in) */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-1000 ease-in",
          isImageLoading ? "opacity-0" : "opacity-100",
        )}
      >
        <Image
          src={imageError ? DEFAULT_IMAGE : currentBgImage}
          alt={`${countryName} background`}
          fill
          className="object-cover"
          priority
          onLoad={() => setIsImageLoading(false)}
          onError={() => {
            console.error(`Failed to load image: ${currentBgImage}, falling back to default`);
            setImageError(true);
            setIsImageLoading(false);
          }}
        />
        <div className="absolute inset-0 bg-primary/60 mix-blend-multiply" />
      </div>

      {/* Content */}
      <div className="page-header relative z-10 py-10 px-8">
        <div className="page-header-content">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Wallet className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              {selectedCountry ? `${countryName} Payment Landscape` : "Southeast Asia Payment Landscape"}
            </h1>
          </div>
          <p className="text-white/90 max-w-2xl">
            {selectedCountry
              ? `Explore and compare payment gateways available in ${countryName}. Filter by payment method, integration complexity, and more to find the perfect solution for your business.`
              : "Explore and compare payment gateways across Southeast Asia. Filter by country, payment method, integration complexity, and more to find the perfect solution for your business."}
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm">
              <Globe className="h-4 w-4" />
              <span>6 Countries</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm">
              <CreditCard className="h-4 w-4" />
              <span>12 Payment Gateways</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm">
              <Wallet className="h-4 w-4" />
              <span>5 Payment Methods</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
