"use client"

import { useState, useEffect, useCallback } from "react"

interface RealtimeMetrics {
  totalXP: number
  reputation: number
  rating: number
  skillsTeaching: number
  skillsLearning: number
  sessionsCompleted: number
  badges: number
  lastActivity: string
}

export function useRealtimeDashboard() {
  const [metrics, setMetrics] = useState<RealtimeMetrics | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchMetrics = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard/metrics")
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
        setLastUpdated(new Date())
        return data
      }
    } catch (error) {
      console.error("Error fetching real-time metrics:", error)
    }
    return null
  }, [])

  const startPolling = useCallback(
    (interval = 30000) => {
      if (isPolling) return

      setIsPolling(true)
      const pollInterval = setInterval(fetchMetrics, interval)

      return () => {
        clearInterval(pollInterval)
        setIsPolling(false)
      }
    },
    [fetchMetrics, isPolling],
  )

  const stopPolling = useCallback(() => {
    setIsPolling(false)
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  return {
    metrics,
    lastUpdated,
    isPolling,
    fetchMetrics,
    startPolling,
    stopPolling,
  }
}
