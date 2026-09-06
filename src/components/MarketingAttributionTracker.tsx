"use client"

import { useEffect } from "react"
import { captureMarketingAttribution } from "@/lib/marketingAttribution"

export default function MarketingAttributionTracker() {
  useEffect(() => {
    captureMarketingAttribution()
  }, [])

  return null
}
