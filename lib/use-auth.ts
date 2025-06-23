"use client"

import { useEffect, useState } from "react"
import { authClient, type AuthUser, type AuthSession, auth } from "@/lib/auth"

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

	useEffect(() => {
		// Initialize auth state
		const initializeAuth = async () => {
			try {
				const [user, session] = await Promise.all([
					auth.getUser(),
					authClient.getSession(),
				])

				setAuthState({
					user,
					session,
					isLoading: false,
					isAuthenticated: !!session?.data?.user,
				})
			} catch (error) {
				console.error("Failed to initialize auth:", error)
				setAuthState({
					user: null,
					session: null,
					isLoading: false,
					isAuthenticated: false,
				})
			}
		}

		initializeAuth()
	}, [])

	return {
		...authState,
		signIn: authClient.signIn,
		signUp: authClient.signUp,
		signOut: authClient.signOut,
	}
}
