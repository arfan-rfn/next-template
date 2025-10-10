"use client"

import { useState } from "react"
import { UserSessionsList } from "@/components/admin/session-management/user-sessions-list"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Session management page
 */
export default function AdminSessionsPage() {
	const [userId, setUserId] = useState("")

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">Session Management</h2>
				<p className="text-muted-foreground">
					View and manage user sessions
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>View User Sessions</CardTitle>
					<CardDescription>
						Enter a user ID to view their active sessions
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<Label htmlFor="userId">User ID</Label>
						<Input
							id="userId"
							type="text"
							placeholder="Enter user ID..."
							value={userId}
							onChange={(e) => setUserId(e.target.value)}
						/>
					</div>
				</CardContent>
			</Card>

			{userId && (
				<Card>
					<CardHeader>
						<CardTitle>Active Sessions</CardTitle>
						<CardDescription>
							Sessions for user: {userId}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<UserSessionsList userId={userId} />
					</CardContent>
				</Card>
			)}
		</div>
	)
}
