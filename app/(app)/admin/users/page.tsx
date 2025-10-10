"use client"

import { useState } from "react"
import { UserList } from "@/components/admin/user-management/user-list"
import { CreateUserDialog } from "@/components/admin/user-management/create-user-dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { usePermission } from "@/hooks/use-permission"
import { PERMISSIONS } from "@/lib/constants/permissions"

/**
 * User management page
 */
export default function AdminUsersPage() {
	const [createOpen, setCreateOpen] = useState(false)
	const { data: canCreate = false } = usePermission(...PERMISSIONS.USER.CREATE)

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">User Management</h2>
					<p className="text-muted-foreground">
						View and manage all system users
					</p>
				</div>
				{canCreate && (
					<Button onClick={() => setCreateOpen(true)}>
						<PlusCircle className="mr-2 h-4 w-4" />
						Create User
					</Button>
				)}
			</div>

			<UserList />

			<CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} />
		</div>
	)
}
