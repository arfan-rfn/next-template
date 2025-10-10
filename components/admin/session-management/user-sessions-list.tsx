"use client"

import { useListUserSessions, useRevokeSession } from "@/hooks/use-admin"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Ban } from "lucide-react"
import { formatDistance } from "date-fns"

interface UserSessionsListProps {
	userId: string
}

/**
 * Table displaying all sessions for a specific user
 */
export function UserSessionsList({ userId }: UserSessionsListProps) {
	const { data, isLoading, error, refetch } = useListUserSessions({ userId })
	const { mutate: revokeSession } = useRevokeSession()

	// Auto-refresh every 30 seconds
	const handleRefresh = () => {
		refetch()
	}

	if (error) {
		return (
			<div className="rounded-lg border border-destructive bg-destructive/10 p-4">
				<p className="text-sm text-destructive">Failed to load sessions: {error.message}</p>
			</div>
		)
	}

	const handleRevoke = (sessionId: string) => {
		revokeSession({ sessionId })
	}

	return (
		<div className="space-y-4">
			{/* Refresh button */}
			<div className="flex justify-end">
				<Button variant="outline" size="sm" onClick={handleRefresh}>
					Refresh
				</Button>
			</div>

			{/* Sessions table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Session ID</TableHead>
							<TableHead>IP Address</TableHead>
							<TableHead>User Agent</TableHead>
							<TableHead>Created</TableHead>
							<TableHead>Expires</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={6} className="h-24 text-center">
									<div className="flex items-center justify-center">
										<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
									</div>
								</TableCell>
							</TableRow>
						) : data?.sessions && data.sessions.length > 0 ? (
							data.sessions.map((session) => (
								<TableRow key={session.id}>
									<TableCell className="font-mono text-xs">{session.id.slice(0, 16)}...</TableCell>
									<TableCell>{session.ipAddress || 'Unknown'}</TableCell>
									<TableCell className="max-w-xs truncate text-xs">
										{session.userAgent || 'Unknown'}
									</TableCell>
									<TableCell>
										<Badge variant="secondary">
											{formatDistance(new Date(session.createdAt), new Date(), { addSuffix: true })}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge variant="outline">
											{formatDistance(new Date(session.expiresAt), new Date(), { addSuffix: true })}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleRevoke(session.id)}
										>
											<Ban className="h-4 w-4 mr-1" />
											Revoke
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
									No active sessions
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Results count */}
			{data?.sessions && (
				<p className="text-sm text-muted-foreground">
					{data.sessions.length} active {data.sessions.length === 1 ? 'session' : 'sessions'}
				</p>
			)}
		</div>
	)
}
