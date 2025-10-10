"use client"

import { useState } from "react"
import { MoreHorizontal, Edit, Shield, Ban, Trash2, Eye, KeyRound, UserCheck } from "lucide-react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { EditUserDialog } from "./edit-user-dialog"
import { SetRoleDialog } from "./set-role-dialog"
import { BanUserDialog } from "./ban-user-dialog"
import { useRemoveUser, useUnbanUser, useImpersonateUser } from "@/hooks/use-admin"
import { usePermission } from "@/hooks/use-permission"
import { PERMISSIONS } from "@/lib/constants/permissions"
import type { User } from "@/lib/types/auth"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UserActionsMenuProps {
	user: User
}

/**
 * Dropdown menu with actions for a user
 */
export function UserActionsMenu({ user }: UserActionsMenuProps) {
	const [editOpen, setEditOpen] = useState(false)
	const [roleOpen, setRoleOpen] = useState(false)
	const [banOpen, setBanOpen] = useState(false)
	const [deleteOpen, setDeleteOpen] = useState(false)

	// Permission checks
	const { data: canUpdate = false } = usePermission(...PERMISSIONS.USER.UPDATE)
	const { data: canSetRole = false } = usePermission(...PERMISSIONS.USER.SET_ROLE)
	const { data: canBan = false } = usePermission(...PERMISSIONS.USER.BAN)
	const { data: canDelete = false } = usePermission(...PERMISSIONS.USER.DELETE)
	const { data: canImpersonate = false } = usePermission(...PERMISSIONS.USER.IMPERSONATE)

	const { mutate: removeUser, isPending: isDeleting } = useRemoveUser()
	const { mutate: unbanUser, isPending: isUnbanning } = useUnbanUser()
	const { mutate: impersonate, isPending: isImpersonating } = useImpersonateUser()


	const handleDelete = () => {
		removeUser({ userId: user.id })
		setDeleteOpen(false)
	}

	const handleUnban = () => {
		unbanUser({ userId: user.id })
	}

	const handleImpersonate = () => {
		impersonate({ userId: user.id })
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuSeparator />

					{/* Edit - requires update permission */}
					{canUpdate && (
						<DropdownMenuItem onClick={() => setEditOpen(true)}>
							<Edit className="mr-2 h-4 w-4" />
							Edit User
						</DropdownMenuItem>
					)}

					{/* Change Role - requires set-role permission */}
					{canSetRole && (
						<DropdownMenuItem onClick={() => setRoleOpen(true)}>
							<Shield className="mr-2 h-4 w-4" />
							Change Role
						</DropdownMenuItem>
					)}

					{(canUpdate || canSetRole) && <DropdownMenuSeparator />}

					{/* Ban/Unban - requires ban permission */}
					{canBan && (
						user.banned ? (
							<DropdownMenuItem onClick={handleUnban} disabled={isUnbanning}>
								<UserCheck className="mr-2 h-4 w-4" />
								{isUnbanning ? 'Unbanning...' : 'Unban User'}
							</DropdownMenuItem>
						) : (
							<DropdownMenuItem onClick={() => setBanOpen(true)}>
								<Ban className="mr-2 h-4 w-4" />
								Ban User
							</DropdownMenuItem>
						)
					)}

					{/* Impersonate - requires impersonate permission */}
					{canImpersonate && (
						<DropdownMenuItem onClick={handleImpersonate} disabled={isImpersonating}>
							<Eye className="mr-2 h-4 w-4" />
							{isImpersonating ? 'Impersonating...' : 'Impersonate'}
						</DropdownMenuItem>
					)}

					{(canBan || canImpersonate) && canDelete && <DropdownMenuSeparator />}

					{/* Delete - requires delete permission */}
					{canDelete && (
						<DropdownMenuItem
							onClick={() => setDeleteOpen(true)}
							className="text-destructive focus:text-destructive"
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Delete User
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Dialogs */}
			<EditUserDialog user={user} open={editOpen} onOpenChange={setEditOpen} />
			<SetRoleDialog user={user} open={roleOpen} onOpenChange={setRoleOpen} />
			<BanUserDialog user={user} open={banOpen} onOpenChange={setBanOpen} />

			{/* Delete confirmation */}
			<AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the user <strong>{user.name}</strong> ({user.email}).
							This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={isDeleting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isDeleting ? 'Deleting...' : 'Delete User'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
