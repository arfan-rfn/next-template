"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { toast } from "sonner"
import { auth } from "@/lib/auth"
import { useAuthContext } from "@/components/providers/auth-provider"
import { useAuthConfig } from "@/lib/hooks/use-auth-config"

export default function SignInPage() {
	const router = useRouter()
	const { refresh, isAuthenticated, isLoading: authLoading } = useAuthContext()
	const authConfig = useAuthConfig()
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	})
	const [magicLinkEmail, setMagicLinkEmail] = useState("")
	const [magicLinkSent, setMagicLinkSent] = useState(false)

	// Redirect authenticated users to dashboard
	useEffect(() => {
		if (!authLoading && isAuthenticated) {
			router.push(authConfig.redirects.afterSignIn)
		}
	}, [authLoading, isAuthenticated, router, authConfig.redirects.afterSignIn])

	const handleGoogleSignIn = async () => {
		try {
			setIsLoading(true)
			await auth.signInWithGoogle(authConfig.redirects.afterSignIn)
			// Refresh auth state after successful Google sign-in
			setTimeout(() => {
				refresh()
			}, 500)
		} catch (error) {
			console.error("Google sign-in error:", error)
			toast.error("Failed to sign in with Google")
		} finally {
			setIsLoading(false)
		}
	}

	const handleEmailSignIn = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!formData.email || !formData.password) {
			toast.error("Please fill in all fields")
			return
		}

		try {
			setIsLoading(true)
			await auth.signInWithEmail(formData.email, formData.password)
			toast.success("Signed in successfully!")
			// Refresh auth state after successful email sign-in
			setTimeout(() => {
				refresh()
			}, 100)
			router.push(authConfig.redirects.afterSignIn)
		} catch (error) {
			console.error("Email sign-in error:", error)
			toast.error("Invalid email or password")
		} finally {
			setIsLoading(false)
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	const handleMagicLinkSignIn = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!magicLinkEmail) {
			toast.error("Please enter your email address")
			return
		}

		try {
			setIsLoading(true)
			await auth.signInWithMagicLink(magicLinkEmail)
			setMagicLinkSent(true)
			toast.success("Magic link sent! Check your email to sign in.")
		} catch (error) {
			console.error("Magic link error:", error)
			toast.error("Failed to send magic link. Please try again.")
		} finally {
			setIsLoading(false)
		}
	}

	// Show loading while checking auth status
	if (authLoading) {
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

	// Don't render sign-in form if user is authenticated (redirect will handle navigation)
	if (isAuthenticated) {
		return null
	}

	return (
		<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				{/* Header */}
				<div className="text-center">
					<h1 className="text-3xl font-bold tracking-tight text-foreground">
						Welcome back
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Sign in to your account to continue
					</p>
				</div>

				{/* Sign In Form */}
				<div className="mt-8 space-y-6">
					<div className="space-y-4">
						{/* Magic Link Section - First Priority */}
						{authConfig.methods.magicLink && !magicLinkSent ? (
							<>
								{/* Magic Link Form */}
								<form onSubmit={handleMagicLinkSignIn} className="space-y-4">
									<div>
										<label
											htmlFor="magicLinkEmail"
											className="block text-sm font-medium text-foreground"
										>
											Email address
										</label>
										<input
											id="magicLinkEmail"
											name="magicLinkEmail"
											type="email"
											autoComplete="email"
											required
											value={magicLinkEmail}
											onChange={(e) => setMagicLinkEmail(e.target.value)}
											className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
											placeholder="Enter your email for magic link"
											disabled={isLoading}
										/>
									</div>

									<Button
										type="submit"
										size="lg"
										className="w-full"
										disabled={isLoading}
									>
										{isLoading ? (
											<>
												<Icons.Circle className="mr-2 h-5 w-5 animate-spin" />
												Sending magic link...
											</>
										) : (
											<>
												<Icons.Mail className="mr-2 h-5 w-5" />
												Send magic link
											</>
										)}
									</Button>
								</form>
							</>
						) : authConfig.methods.magicLink && magicLinkSent ? (
							<div className="text-center py-6">
								<div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
									<Icons.Mail className="h-8 w-8 text-green-600" />
								</div>
								<h3 className="text-lg font-medium text-foreground mb-2">
									Check your email
								</h3>
								<p className="text-sm text-muted-foreground mb-4">
									We&apos;ve sent a magic link to <strong>{magicLinkEmail}</strong>
								</p>
								<Button
									variant="outline"
									onClick={() => {
										setMagicLinkSent(false)
										setMagicLinkEmail("")
									}}
									className="text-sm"
								>
									Try different email
								</Button>
							</div>
						) : null}

						{/* Social Sign In - Second Priority */}
						{authConfig.methods.google && (
							<>
								{/* Divider */}
								{authConfig.hasMultipleMethods() && (authConfig.methods.magicLink || authConfig.methods.emailPassword) && (
								<div className="relative">
									<div className="absolute inset-0 flex items-center">
										<span className="w-full border-t" />
									</div>
									<div className="relative flex justify-center text-xs uppercase">
										<span className="bg-background px-2 text-muted-foreground">
											Or continue with social
										</span>
									</div>
								</div>
								)}

								<Button
									variant="outline"
									size="lg"
									className="w-full"
									onClick={handleGoogleSignIn}
									disabled={isLoading}
								>
									{isLoading ? (
										<Icons.Circle className="mr-2 h-5 w-5 animate-spin" />
									) : (
										<Icons.Google className="mr-2 h-5 w-5" />
									)}
									Continue with Google
								</Button>
							</>
						)}

						{/* Email/Password Form - Third Priority */}
						{authConfig.methods.emailPassword && !magicLinkSent && (
							<>
								{/* Divider */}
								{authConfig.hasMultipleMethods() && (authConfig.methods.magicLink || authConfig.methods.google) && (
								<div className="relative">
									<div className="absolute inset-0 flex items-center">
										<span className="w-full border-t" />
									</div>
									<div className="relative flex justify-center text-xs uppercase">
										<span className="bg-background px-2 text-muted-foreground">
											Or continue with password
										</span>
									</div>
								</div>
								)}

								<form onSubmit={handleEmailSignIn} className="space-y-4">
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-foreground"
								>
									Email address
								</label>
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									value={formData.email}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
									placeholder="Enter your email"
									disabled={isLoading}
								/>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-foreground"
								>
									Password
								</label>
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									value={formData.password}
									onChange={handleInputChange}
									className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
									placeholder="Enter your password"
									disabled={isLoading}
								/>
							</div>

							{(authConfig.features.rememberMe || authConfig.features.forgotPassword) && (
							<div className="flex items-center justify-between">
								{authConfig.features.rememberMe && (
								<div className="flex items-center">
									<input
										id="remember-me"
										name="remember-me"
										type="checkbox"
										className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
										disabled={isLoading}
									/>
									<label
										htmlFor="remember-me"
										className="ml-2 block text-sm text-muted-foreground"
									>
										Remember me
									</label>
								</div>
								)}

								{authConfig.features.forgotPassword && (
								<div className="text-sm">
									<a
										href="#"
										className="font-medium text-primary hover:text-primary/80"
									>
										Forgot your password?
									</a>
								</div>
								)}
							</div>
							)}

							<Button
								type="submit"
								className="w-full"
								size="lg"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<Icons.Circle className="mr-2 h-5 w-5 animate-spin" />
										Signing in...
									</>
								) : (
									"Sign in"
								)}
							</Button>
						</form>
							</>
						)}
					</div>

					{/* Footer */}
					{authConfig.methods.emailPassword && (
					<div className="text-center">
						<p className="text-sm text-muted-foreground">
							Don&apos;t have an account?{" "}
							<a
								href="/auth/sign-up"
								className="font-medium text-primary hover:text-primary/80"
							>
								Sign up
							</a>
						</p>
					</div>
					)}
				</div>
			</div>
		</div>
	)
}
