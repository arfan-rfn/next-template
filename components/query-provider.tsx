'use client'
import { env } from '@/env.mjs'
import { getQueryClient } from '@/lib/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import type * as React from 'react'

export default function QueryProviders({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient()

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{env.NODE_ENV !== "production" && <ReactQueryDevtools />}
		</QueryClientProvider>
	)
}