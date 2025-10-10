"use client"

import { AdminGuard } from "@/components/admin/admin-guard"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePreloadPermissions } from "@/hooks/use-permission"
import { COMMON_ADMIN_PERMISSIONS } from "@/lib/constants/permissions"

interface AdminLayoutProps {
	children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
	// Preload common permissions to cache them before user interacts
	usePreloadPermissions(COMMON_ADMIN_PERMISSIONS as any)

	return (
		<AdminGuard>
			<div className="container py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
					<p className="text-muted-foreground">
						Manage users, roles, and system settings
					</p>
				</div>

				{/* Admin navigation tabs */}
				<nav className="mb-8 flex gap-4 border-b pb-2">
					<AdminNavLink href="/admin">Dashboard</AdminNavLink>
					<AdminNavLink href="/admin/users">Users</AdminNavLink>
					<AdminNavLink href="/admin/sessions">Sessions</AdminNavLink>
				</nav>

				{/* Page content */}
				{children}
			</div>
		</AdminGuard>
	)
}

function AdminNavLink({ href, children }: { href: string; children: React.ReactNode }) {
	// In a real app, use usePathname() from next/navigation to determine active state
	// For now, this is a simple implementation
	return (
		<Link
			href={href}
			className={cn(
				"text-sm font-medium transition-colors hover:text-primary",
				"text-muted-foreground"
			)}
		>
			{children}
		</Link>
	)
}
