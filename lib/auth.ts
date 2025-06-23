import { createAuthClient } from "better-auth/react"
import { env } from "@/env"

export const authClient = createAuthClient({
	baseURL: `${env.NEXT_PUBLIC_API_URL}/auth`
})

// Export auth types for better TypeScript support
export type AuthUser = Awaited<ReturnType<typeof authClient.accountInfo>>
export type AuthSession = Awaited<ReturnType<typeof authClient.getSession>>

// Helper functions for common auth operations
export const auth = {
	// Sign in with email and password
	signInWithEmail: async (email: string, password: string) => {
		return await authClient.signIn.email({
			email,
			password,
		})
	},

	// Sign in with Google
	signInWithGoogle: async (callbackURL?: string) => {
		return await authClient.signIn.social({
			provider: "google",
			callbackURL: callbackURL || "/dashboard",
		})
	},

	// Sign up with email and password
	signUpWithEmail: async ({ email, password, name }: { email: string, password: string, name: string }) => {
		return await authClient.signUp.email({
			email,
			password,
			name,
		})
	},

	// Sign out
	signOut: async () => {
		return await authClient.signOut()
	},

	// Get current user
	getUser: async () => {
		const session = await authClient.getSession()
		return session?.data?.user
	},

	// Get current session
	getSession: async () => {
		return await authClient.getSession()
	},

	// Check if user is authenticated
	isAuthenticated: async () => {
		const session = await authClient.getSession()
		return !!session
	},
}
