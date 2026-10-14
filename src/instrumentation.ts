// Use Next's explicit runtime branch so Edge compilation removes Node-only imports.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    if (process.env.NODE_ENV !== "production" || process.env.META_CAPI_ENABLED !== "1" ||
        process.env.NEXT_PHASE === "phase-production-build") return
    const { startTrackingWorker } = await import("./lib/trackingOutbox")
    startTrackingWorker()
  }
}