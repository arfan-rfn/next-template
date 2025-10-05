"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import posthog from "posthog-js"
import { env } from "@/env"
import { useAuthContext } from "./auth-provider"

interface PostHogProviderProps {
  children: React.ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuthContext()

  // Initialize PostHog
  useEffect(() => {
    if (typeof window !== "undefined" && env.NEXT_PUBLIC_POSTHOG_KEY) {
      const apiPath = env.NEXT_PUBLIC_POSTHOG_API_PATH || "/t"
      const apiHost = env.NEXT_PUBLIC_POSTHOG_HOST || `${env.NEXT_PUBLIC_API_URL}${apiPath}`

      posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: apiHost,
        capture_pageview: false, // We'll do it manually
        person_profiles: "identified_only", // Only track logged-in users
      })
    }
  }, [])

  // Track pageviews
  useEffect(() => {
    if (pathname && posthog.__loaded) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture("$pageview", { $current_url: url })
    }
  }, [pathname, searchParams])

  // Identify user
  useEffect(() => {
    if (posthog.__loaded) {
      if (isAuthenticated && user) {
        posthog.identify(user.id, {
          email: user.email,
          name: user.name,
        })
      } else {
        posthog.reset()
      }
    }
  }, [isAuthenticated, user])

  return <>{children}</>
}
