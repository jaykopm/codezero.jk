import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Southeast Asia Payment Landscape",
  description: "Compare payment gateways across Southeast Asia",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-background ${inter.className}`}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}


import './globals.css'