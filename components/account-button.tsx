"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

/**
 * AccountButton displays a sign-in button if not authenticated,
 * or an account dropdown with avatar, dashboard, and sign out if authenticated.
 * Responsive and accessible.
 */
export function AccountButton() {
	const { user, isAuthenticated, isLoading, signOut } = useAuthContext()
	const router = useRouter()

	// Helper: get avatar URL or fallback
	const getAvatar = () => {
		if (user?.image) {
			return (
				<Image
					src={user.image || ''}
					alt={user.name || user.email || "User"}
					width={32}
					height={32}
					className="rounded-full object-cover border size-8"
					loading="lazy"
				/>
			)
		}
		// Fallback: initials or icon
		if (user?.name) {
			const initials = user.name
				.split(" ")
				.map((n: string) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
			return (
				<span className="flex items-center justify-center size-8 rounded-full bg-muted text-xs font-bold text-muted-foreground border">
					{initials}
				</span>
			)
		}
		return (
			<span className="flex items-center justify-center size-8 rounded-full bg-muted text-muted-foreground border">
				<Icons.Circle className="size-5" />
			</span>
		)
	}

	// Handle sign out
	const handleSignOut = async () => {
		await signOut()
		router.push("/auth/sign-in")
	}

	// Loading state: show skeleton
	if (isLoading) {
		return (
			<div className="animate-pulse rounded-md bg-muted h-10 w-24" />
		)
	}

	// Not authenticated: show sign in button
	if (!isAuthenticated) {
		return (
			<Button asChild size="sm" className="w-full md:w-auto">
				<Link href="/auth/sign-in">Sign In</Link>
			</Button>
		)
	}

	// Authenticated: show account dropdown
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="relative flex items-center justify-center size-10 focus-visible:ring-2 focus-visible:ring-ring"
					aria-label="Account menu"
				>
					{getAvatar()}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<div className="flex items-center space-x-3 px-2 py-2">
					{getAvatar()}
					<div className="min-w-0 flex-1">
						<div className="truncate font-medium text-sm">
							{user?.name || user?.email || "Account"}
						</div>
						{user?.email && (
							<div className="truncate text-xs text-muted-foreground">
								{user.email}
							</div>
						)}
					</div>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href="/dashboard">Dashboard</Link>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
					Sign Out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
