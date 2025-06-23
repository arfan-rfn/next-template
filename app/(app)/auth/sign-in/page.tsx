"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { authClient } from "@/lib/auth"
import { toast } from "sonner"
import { env } from "@/env"
import { parse, deserialize } from 'superjson'
import { auth } from "@/lib/auth"

export default function SignInPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	})

	const handleGoogleSignIn = async () => {
		try {
			setIsLoading(true)
			await authClient.signIn.social({
				provider: "google",
				callbackURL: 'http://localhost:3000/dashboard',

			})
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
			await authClient.signIn.email({
				email: formData.email,
				password: formData.password,
			}, {
				onSuccess: (ctx) => {
					toast.success("Signed in successfully!")
					router.push("/dashboard")
				},
				onError: () => {
					toast.error("Invalid email or password")
				},
			})
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
						{/* Google Sign In Button */}
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

						{/* Divider */}
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">
									Or continue with
								</span>
							</div>
						</div>

						{/* Email/Password Form */}
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

							<div className="flex items-center justify-between">
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

								<div className="text-sm">
									<a
										href="#"
										className="font-medium text-primary hover:text-primary/80"
									>
										Forgot your password?
									</a>
								</div>
							</div>

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
					</div>

					{/* Footer */}
					<div className="text-center">
						<p className="text-sm text-muted-foreground">
							Don't have an account?{" "}
							<a
								href="/auth/sign-up"
								className="font-medium text-primary hover:text-primary/80"
							>
								Sign up
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
