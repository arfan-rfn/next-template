"use client"

import { Suspense, useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { useAuthContext } from "@/components/providers/auth-provider"
import { authConfig } from "@/config/auth"
import { toast } from "sonner"

function VerifyContent() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { refresh } = useAuthContext()
	const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
	const [errorMessage, setErrorMessage] = useState<string>("")

	// Reusable error handler
	const handleError = useCallback((message: string) => {
		setStatus("error")
		setErrorMessage(message)
		toast.error(message)
		// Redirect to sign-in after 3 seconds
		setTimeout(() => {
			router.push("/auth/sign-in")
		}, 3000)
	}, [router])

	useEffect(() => {
		const verifyMagicLink = async () => {
			// Extract token from URL
			const token = searchParams.get("token")
			const redirect = searchParams.get("redirect") || authConfig.redirects.afterSignIn

			// Validate token exists
			if (!token) {
				handleError("No verification token found in the URL. Please try requesting a new magic link.")
				return
			}

			try {
				// Verify the magic link token
				const { data, error } = await auth.verifyMagicLink(token, redirect)

				if (error) {
					// Handle specific error cases
					let errorMsg = ""
					if (error.message?.includes("expired")) {
						errorMsg = "This magic link has expired. Please request a new one."
					} else if (error.message?.includes("invalid")) {
						errorMsg = "This magic link is invalid. Please request a new one."
					} else {
						errorMsg = error.message || "Failed to verify magic link. Please try again."
					}
					handleError(errorMsg)
					return
				}

				// Verification successful
				setStatus("success")

				// Refresh auth context to update session
				await refresh()

				// Redirect to intended destination after a brief delay
				setTimeout(() => {
					router.push(redirect)
				}, 1000)
			} catch (err) {
				console.error("Magic link verification error:", err)
				handleError("An unexpected error occurred. Please try requesting a new magic link.")
			}
		}

		verifyMagicLink()
	}, [searchParams, router, refresh, handleError])

	const handleRetry = () => {
		router.push("/auth/sign-in")
	}

	return (
		<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					{status === "verifying" && (
						<>
							<div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
								<Icons.Circle className="h-8 w-8 text-blue-600 animate-spin" />
							</div>
							<h2 className="text-2xl font-bold text-foreground mb-2">
								Verifying your magic link
							</h2>
							<p className="text-sm text-muted-foreground">
								Please wait while we verify your email...
							</p>
						</>
					)}

					{status === "success" && (
						<>
							<div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
								<Icons.Check className="h-8 w-8 text-green-600" />
							</div>
							<h2 className="text-2xl font-bold text-foreground mb-2">
								Verification successful!
							</h2>
							<p className="text-sm text-muted-foreground">
								Redirecting you to your dashboard...
							</p>
						</>
					)}

					{status === "error" && (
						<>
							<div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
								<Icons.AlertCircle className="h-8 w-8 text-red-600" />
							</div>
							<h2 className="text-2xl font-bold text-foreground mb-2">
								Verification failed
							</h2>
							<p className="text-sm text-muted-foreground mb-2">
								{errorMessage}
							</p>
							<p className="text-xs text-muted-foreground mb-6">
								Redirecting to sign-in page...
							</p>
							<Button onClick={handleRetry} size="lg">
								<Icons.Mail className="mr-2 h-5 w-5" />
								Request new magic link
							</Button>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

function VerifyLoadingFallback() {
	return (
		<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<Icons.Circle className="mx-auto h-8 w-8 animate-spin" />
					<p className="mt-2 text-sm text-muted-foreground">Loading...</p>
				</div>
			</div>
		</div>
	)
}

export default function MagicLinkVerifyPage() {
	return (
		<Suspense fallback={<VerifyLoadingFallback />}>
			<VerifyContent />
		</Suspense>
	)
}
