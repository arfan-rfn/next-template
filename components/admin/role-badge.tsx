import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface RoleBadgeProps {
	role: string
	className?: string
}

/**
 * Display user role as a styled badge
 */
export function RoleBadge({ role, className }: RoleBadgeProps) {
	const getRoleColor = (role: string) => {
		switch (role.toLowerCase()) {
			case 'admin':
				return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
			case 'moderator':
				return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
			case 'user':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
		}
	}

	return (
		<Badge
			variant="secondary"
			className={cn(getRoleColor(role), className)}
		>
			{role}
		</Badge>
	)
}
