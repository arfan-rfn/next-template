"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Icons } from "./icons"

/**
 * AccountButton displays a sign-in button if not authenticated,
 * or an account dropdown with avatar, dashboard, and sign out if authenticated.
 * Responsive and accessible.
 */
export function AccountButton() {
	const { user, isAuthenticated, isLoading, signOut, refresh } = useAuthContext()
	const router = useRouter()

	// Helper: render avatar component
	const renderAvatar = () => {
		return (
			<Avatar className="size-8">
				<AvatarImage
					src={user?.image || undefined}
					alt={user?.name || user?.email || "User"}
				/>
				<AvatarFallback className="text-xs font-medium">
					<Icons.User className="size-4" />
				</AvatarFallback>
			</Avatar>
		)
	}

	// Handle sign out
	const handleSignOut = async () => {
		await signOut()
		// Manual refresh as fallback in case session listener doesn't work
		setTimeout(() => {
			refresh()
		}, 100)
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
					{renderAvatar()}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<div className="flex items-center space-x-3 px-2 py-2">
					{renderAvatar()}
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
					<div className="flex items-center gap-2">
						<Icons.Home className="size-4" />
						<Link href="/dashboard">Dashboard</Link>
					</div>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
					<div className="flex items-center gap-2">
						<Icons.LogOut className="size-4" />
						Sign Out
					</div>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
