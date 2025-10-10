"use client"

import { useState } from "react"
import { UserSessionsList } from "@/components/admin/session-management/user-sessions-list"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Search } from "lucide-react"

/**
 * Session management page
 */
export default function AdminSessionsPage() {
	const [userId, setUserId] = useState("")

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
				Session Management
			</h1>

			{/* Search Card */}
			<Card className="border-border/40 overflow-hidden">
				<CardHeader className="border-b bg-muted/30">
					<div className="flex items-center gap-2">
						<Search className="h-4 w-4 text-muted-foreground" />
						<CardTitle className="text-lg">View User Sessions</CardTitle>
					</div>
					<CardDescription>
						Enter a user ID to view their active sessions
					</CardDescription>
				</CardHeader>
				<CardContent className="pt-6">
					<div className="space-y-2 max-w-xl">
						<Label htmlFor="userId" className="text-sm font-medium">
							User ID
						</Label>
						<Input
							id="userId"
							type="text"
							placeholder="Enter user ID..."
							value={userId}
							onChange={(e) => setUserId(e.target.value)}
							className="h-11"
						/>
						{!userId && (
							<p className="text-xs text-muted-foreground">
								Paste or type the user ID to view their session information
							</p>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Results Card */}
			{userId && (
				<Card className="border-border/40 overflow-hidden animate-in fade-in-50 slide-in-from-bottom-4">
					<CardHeader className="border-b bg-muted/30">
						<CardTitle className="text-lg">Active Sessions</CardTitle>
						<CardDescription>
							Sessions for user: <span className="font-mono text-foreground">{userId}</span>
						</CardDescription>
					</CardHeader>
					<CardContent className="pt-6">
						<UserSessionsList userId={userId} />
					</CardContent>
				</Card>
			)}
		</div>
	)
}
