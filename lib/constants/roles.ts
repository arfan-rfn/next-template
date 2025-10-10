/**
 * Centralized role definitions and access control groups
 * This is the single source of truth for all role-based access control
 */

/**
 * All available roles in the system
 * Add new roles here as your application grows
 */
export const ROLES = {
	USER: 'user',
	MODERATOR: 'moderator',
	ADMIN: 'admin',
	// Future roles can be added here:
	// SUPER_ADMIN: 'super-admin',
	// SUPPORT: 'support',
	// EDITOR: 'editor',
} as const

/**
 * Role groups define which roles have access to specific features
 * To add a new role to admin panel access, just add it to this array
 */
export const ROLE_GROUPS = {
	/**
	 * Roles that can access the admin panel
	 * Add new privileged roles here to grant admin panel access
	 */
	ADMIN_PANEL_ACCESS: [ROLES.ADMIN, ROLES.MODERATOR] as const,

	// Future role groups:
	// USER_MANAGEMENT: [ROLES.ADMIN, ROLES.SUPER_ADMIN] as const,
	// CONTENT_MODERATION: [ROLES.ADMIN, ROLES.MODERATOR, ROLES.SUPPORT] as const,
} as const

/**
 * TypeScript types for type-safe role checking
 */
export type Role = typeof ROLES[keyof typeof ROLES]
export type AdminPanelRole = typeof ROLE_GROUPS.ADMIN_PANEL_ACCESS[number]

/**
 * Helper function to check if a user has one of the allowed roles
 *
 * @param userRole - The user's current role (from session)
 * @param allowedRoles - Array of roles that are allowed
 * @returns true if user has one of the allowed roles
 *
 * @example
 * hasRole(session.user.role, ROLE_GROUPS.ADMIN_PANEL_ACCESS)
 * hasRole(session.user.role, [ROLES.ADMIN])
 */
export function hasRole(
	userRole: string | null | undefined,
	allowedRoles: readonly string[]
): boolean {
	return !!userRole && allowedRoles.includes(userRole)
}
