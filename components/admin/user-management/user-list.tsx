"use client"

import { useState } from "react"
import { useListUsers } from "@/hooks/use-admin"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RoleBadge } from "@/components/admin/role-badge"
import { UserActionsMenu } from "./user-actions-menu"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

const USERS_PER_PAGE = 20

/**
 * Table displaying all users with search, filtering, and pagination
 */
export function UserList() {
	const [search, setSearch] = useState("")
	const [page, setPage] = useState(1)

	const { data, isLoading, error } = useListUsers({
		search: search.toLowerCase(), // Convert to lowercase for better matching
		limit: USERS_PER_PAGE,
		offset: (page - 1) * USERS_PER_PAGE,
		sortBy: "createdAt",
		sortDirection: "desc"
	})

	// Reset to page 1 when search changes
	const handleSearchChange = (value: string) => {
		setSearch(value)
		setPage(1)
	}

	const totalPages = data?.total ? Math.ceil(data.total / USERS_PER_PAGE) : 1
	const hasNextPage = page < totalPages
	const hasPreviousPage = page > 1

	if (error) {
		return (
			<div className="rounded-lg border border-destructive bg-destructive/10 p-4">
				<p className="text-sm text-destructive">Failed to load users: {error.message}</p>
			</div>
		)
	}

	return (
		<div className="space-y-4">
			{/* Search bar */}
			<div className="relative">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="text"
					placeholder="Search by name or email (case-sensitive)..."
					value={search}
					onChange={(e) => handleSearchChange(e.target.value)}
					className="pl-10"
				/>
			</div>

			{/* Users table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Verified</TableHead>
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
						) : data?.users && data.users.length > 0 ? (
							data.users.map((user) => (
								<TableRow key={user.id}>
									<TableCell className="font-medium">{user.name}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										<RoleBadge role={user.role || "user"} />
									</TableCell>
									<TableCell>
										{user.banned ? (
											<Badge variant="destructive">Banned</Badge>
										) : (
											<Badge variant="secondary">Active</Badge>
										)}
									</TableCell>
									<TableCell>
										{user.emailVerified ? (
											<Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
												Verified
											</Badge>
										) : (
											<Badge variant="outline">Unverified</Badge>
										)}
									</TableCell>
									<TableCell className="text-right">
										<UserActionsMenu user={user} />
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
									No users found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination and results */}
			{data && (
				<div className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						Showing {data.users.length === 0 ? 0 : (page - 1) * USERS_PER_PAGE + 1} to {(page - 1) * USERS_PER_PAGE + data.users.length} of {data.total} {data.total === 1 ? 'user' : 'users'}
					</p>

					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage(p => p - 1)}
							disabled={!hasPreviousPage || isLoading}
						>
							<ChevronLeft className="h-4 w-4 mr-1" />
							Previous
						</Button>

						<span className="text-sm text-muted-foreground">
							Page {page} of {totalPages}
						</span>

						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage(p => p + 1)}
							disabled={!hasNextPage || isLoading}
						>
							Next
							<ChevronRight className="h-4 w-4 ml-1" />
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
