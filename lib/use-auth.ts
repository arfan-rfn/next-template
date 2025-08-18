"use client"

import { useEffect, useState } from "react"
import { authClient, type AuthUser, type AuthSession } from "@/lib/auth"

interface AuthState {
	user: AuthUser | null
	session: AuthSession | null
	isLoading: boolean
	isAuthenticated: boolean
}

export function useAuth() {
	const [authState, setAuthState] = useState<AuthState>({
		user: null,
		session: null,
		isLoading: true,
		isAuthenticated: false,
	})

	const refreshAuthState = async () => {
		try {
			const session = await authClient.getSession()
			const user = session?.data?.user || null

			setAuthState({
				user,
				session,
				isLoading: false,
				isAuthenticated: !!user,
			})
		} catch (error) {
			console.error("Failed to refresh auth state:", error)
			setAuthState({
				user: null,
				session: null,
				isLoading: false,
				isAuthenticated: false,
			})
		}
	}

	useEffect(() => {
		let mounted = true
		let timeoutId: NodeJS.Timeout

		const updateAuthState = async () => {
			try {
				const session = await authClient.getSession()
				const user = session?.data?.user || null

				if (mounted) {
					setAuthState({
						user,
						session,
						isLoading: false,
						isAuthenticated: !!user,
					})
				}
			} catch (error) {
				console.error("Failed to update auth state:", error)
				if (mounted) {
					setAuthState({
						user: null,
						session: null,
						isLoading: false,
						isAuthenticated: false,
					})
				}
			}
		}


		const initAuth = async () => {
			try {
				// Initial session check with timeout
				const sessionPromise = authClient.getSession()
				const timeoutPromise = new Promise((_, reject) => {
					timeoutId = setTimeout(() => reject(new Error('Auth timeout')), 5000)
				})

				const session = await Promise.race([sessionPromise, timeoutPromise]) as AuthSession
				clearTimeout(timeoutId)

				const user = session?.data?.user || null

				if (mounted) {
					setAuthState({
						user,
						session,
						isLoading: false,
						isAuthenticated: !!user,
					})
				}

				// Set up session event listener for reactive updates
				if (mounted) {
					try {
						authClient.$store.listen("$sessionSignal", () => {
							updateAuthState()
						})
					} catch (error) {
						console.error("Failed to set up auth listener:", error)
					}
				}
			} catch (error) {
				console.error("Failed to initialize auth:", error)
				if (mounted) {
					setAuthState({
						user: null,
						session: null,
						isLoading: false,
						isAuthenticated: false,
					})
				}
			}
		}

		initAuth()

		return () => {
			mounted = false
			if (timeoutId) clearTimeout(timeoutId)
		}
	}, [])

	// Wrapped signOut - the session listener will handle state updates
	const signOut = async () => {
		try {
			await authClient.signOut()
		} catch (error) {
			console.error("Failed to sign out:", error)
		}
	}

	return {
		...authState,
		signIn: authClient.signIn,
		signUp: authClient.signUp,
		signOut,
		refresh: refreshAuthState,
	}
}
