import { createAuthClient } from "better-auth/react"
import { magicLinkClient } from "better-auth/client/plugins"
import { env } from "@/env"
import { toAbsoluteUrl } from "@/lib/utils"

export const authClient = createAuthClient({
	baseURL: `${env.NEXT_PUBLIC_API_URL}/auth`,
	plugins: [
		magicLinkClient()
	]
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
		const absoluteCallbackURL = toAbsoluteUrl(callbackURL || "/dashboard")

		return await authClient.signIn.social({
			provider: "google",
			callbackURL: absoluteCallbackURL,
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

	// Sign in with magic link
	signInWithMagicLink: async (email: string, callbackURL?: string) => {
		const absoluteCallbackURL = toAbsoluteUrl(callbackURL || "/dashboard")
		const newUserCallbackURL = toAbsoluteUrl("/welcome")
		const errorCallbackURL = toAbsoluteUrl("/auth/sign-in")


		return await authClient.signIn.magicLink({
			email,
			callbackURL: absoluteCallbackURL,
			newUserCallbackURL,
			errorCallbackURL: errorCallbackURL,
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
