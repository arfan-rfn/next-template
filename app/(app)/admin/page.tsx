"use client"

import { useListUsers } from "@/hooks/use-admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shield, Ban, UserCheck } from "lucide-react"

/**
 * Admin dashboard with overview statistics
 */
export default function AdminDashboardPage() {
	const { data } = useListUsers({ limit: 1000 })

	const stats = {
		totalUsers: data?.users?.length || 0,
		adminUsers: data?.users?.filter(u => u.role === 'admin').length || 0,
		bannedUsers: data?.users?.filter(u => u.banned).length || 0,
		verifiedUsers: data?.users?.filter(u => u.emailVerified).length || 0,
	}

	return (
		<div className="space-y-8">
			{/* Statistics cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalUsers}</div>
						<p className="text-xs text-muted-foreground">
							All registered users
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Admins</CardTitle>
						<Shield className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.adminUsers}</div>
						<p className="text-xs text-muted-foreground">
							Users with admin role
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Banned</CardTitle>
						<Ban className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.bannedUsers}</div>
						<p className="text-xs text-muted-foreground">
							Currently banned users
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Verified</CardTitle>
						<UserCheck className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.verifiedUsers}</div>
						<p className="text-xs text-muted-foreground">
							Email verified users
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Quick actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<p className="text-sm text-muted-foreground">
						Use the navigation above to manage users and sessions.
					</p>
					<ul className="list-disc list-inside space-y-1 text-sm">
						<li>View and manage all users in the <strong>Users</strong> tab</li>
						<li>Monitor active sessions in the <strong>Sessions</strong> tab</li>
						<li>Create, edit, ban, or delete users as needed</li>
						<li>Impersonate users to test their experience</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	)
}
