# Admin Integration Documentation

This document provides comprehensive information about the admin functionality integrated into the Next.js frontend, which connects to the Better Auth admin plugin on your API server.

## Overview

The admin integration allows users with admin roles to:
- View and manage all system users
- Create, edit, and delete user accounts
- Assign and change user roles
- Ban and unban users with reasons and expiration dates
- View and manage user sessions
- Impersonate users to test their experience
- Revoke user sessions for security purposes

## Architecture

### Backend
- API server uses Better Auth with the admin plugin configured
- All admin operations are validated server-side
- Role-based access control is enforced at the API level

### Frontend
- Better Auth client with `adminClient` plugin
- React Query for data fetching and state management
- Protected admin routes using `AdminGuard` component
- Admin panel at `/admin` route

## Making a User an Admin

Since the admin plugin is configured on your API server, you need to update a user's role on the backend. There are several ways to do this:

### Method 1: Direct Database Update
Connect to your MongoDB database and update the user's role:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Method 2: Using Better Auth API
If you have access to your API server, you can use the Better Auth admin API:

```typescript
await auth.api.setRole({
  userId: "user_id_here",
  role: "admin"
})
```

### Method 3: Environment Configuration
You can configure admin users by ID in your Better Auth server configuration:

```typescript
admin({
  adminUserIds: ["user_id_1", "user_id_2"]
})
```

## Available Admin Operations

### User Management

#### List Users
```typescript
const { data, isLoading } = useListUsers({
  search: "john",
  limit: 100,
  sortBy: "createdAt",
  sortDirection: "desc",
  role: "admin",
  banned: false
})
```

#### Create User
```typescript
const { mutate: createUser } = useCreateUser()

createUser({
  name: "John Doe",
  email: "john@example.com",
  password: "securePassword123",
  role: "user"
})
```

#### Update User
```typescript
const { mutate: updateUser } = useUpdateUser()

updateUser({
  userId: "user_id",
  data: {
    name: "Jane Doe",
    email: "jane@example.com"
  }
})
```

#### Set User Role
```typescript
const { mutate: setRole } = useSetUserRole()

setRole({
  userId: "user_id",
  role: "admin"
})
```

#### Delete User
```typescript
const { mutate: removeUser } = useRemoveUser()

removeUser({ userId: "user_id" })
```

### Ban Management

#### Ban User
```typescript
const { mutate: banUser } = useBanUser()

banUser({
  userId: "user_id",
  reason: "Violation of terms",
  expiresAt: new Date("2025-12-31")
})
```

#### Unban User
```typescript
const { mutate: unbanUser } = useUnbanUser()

unbanUser({ userId: "user_id" })
```

### Session Management

#### List User Sessions
```typescript
const { data } = useListUserSessions({
  userId: "user_id"
})
```

#### Revoke Single Session
```typescript
const { mutate: revokeSession } = useRevokeSession()

revokeSession({ sessionId: "session_id" })
```

#### Revoke All User Sessions
```typescript
const { mutate: revokeSessions } = useRevokeUserSessions()

revokeSessions({ userId: "user_id" })
```

### Impersonation

#### Impersonate User
```typescript
const { mutate: impersonate } = useImpersonateUser()

impersonate({ userId: "user_id" })
// Page will reload and you'll be logged in as that user
```

#### Stop Impersonating
```typescript
const { mutate: stopImpersonating } = useStopImpersonating()

stopImpersonating()
// Returns you to your admin session
```

## Using Admin Components

### Protecting Admin Routes

Wrap your admin pages with the `AdminGuard` component:

```tsx
import { AdminGuard } from "@/components/admin/admin-guard"

export default function AdminPage() {
  return (
    <AdminGuard>
      <div>Admin content here</div>
    </AdminGuard>
  )
}
```

### Checking Admin Access

The recommended way to check admin panel access is using semantic, intent-based functions:

```tsx
import { useCanAccessAdmin, useIsAdmin, useHasRole } from "@/hooks/use-admin"
import { ROLES } from "@/lib/constants/roles"

function MyComponent() {
  // ✅ Recommended: Check if user can access admin panel
  const { canAccess, isLoading } = useCanAccessAdmin()

  if (canAccess) {
    return <AdminFeature />
  }

  return <RegularFeature />
}

// Check strictly for admin role only (not moderator)
function StrictAdminComponent() {
  const { isAdmin } = useIsAdmin()

  if (isAdmin) {
    return <SuperAdminFeature />
  }

  return <RegularFeature />
}

// Check for custom role combinations
function CustomRoleComponent() {
  const { hasRole } = useHasRole([ROLES.ADMIN, ROLES.MODERATOR, ROLES.SUPPORT])

  if (hasRole) {
    return <CustomFeature />
  }

  return <RegularFeature />
}
```

**Why semantic naming matters:**
- `useCanAccessAdmin()` describes **intent** (what user can do) not **implementation** (what roles they have)
- Future-proof: Add new roles by updating `ROLE_GROUPS.ADMIN_PANEL_ACCESS` array only
- More intuitive: `if (canAccess)` reads better than checking specific role combinations
- Maintainable: Single source of truth in `lib/constants/roles.ts`

## Role Management

The system uses a centralized role configuration for maintainability and future-proofing.

### Centralized Role Definitions

All roles are defined in `lib/constants/roles.ts`:

```typescript
export const ROLES = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  // Add future roles here:
  // SUPER_ADMIN: 'super-admin',
  // SUPPORT: 'support',
}

export const ROLE_GROUPS = {
  ADMIN_PANEL_ACCESS: [ROLES.ADMIN, ROLES.MODERATOR],
  // Add future role groups:
  // USER_MANAGEMENT: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  // CONTENT_MODERATION: [ROLES.ADMIN, ROLES.MODERATOR, ROLES.SUPPORT],
}
```

### Adding a New Role

To add a new role with admin panel access:

1. **Add role to constants:**
```typescript
// lib/constants/roles.ts
export const ROLES = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  SUPPORT: 'support',  // ← New role
}
```

2. **Add to appropriate role group:**
```typescript
export const ROLE_GROUPS = {
  ADMIN_PANEL_ACCESS: [ROLES.ADMIN, ROLES.MODERATOR, ROLES.SUPPORT],  // ← Add here
}
```

3. **Configure permissions on backend:**
```typescript
// Backend Better Auth config
const support = ac.newRole({
  user: ['list', 'get'],     // Can view users
  session: ['list'],          // Can view sessions
  ui: ['admin-dashboard'],    // Can access admin panel
})
```

That's it! No need to update components - they all use `useCanAccessAdmin()` which reads from `ROLE_GROUPS.ADMIN_PANEL_ACCESS`.

### Role vs Permission: When to Use Which

| Use Case | Solution | Example |
|----------|----------|---------|
| Check if user can access admin panel | **Role** with `useCanAccessAdmin()` | Navigation menu, route guards |
| Check if user can perform specific action | **Permission** with `usePermission()` | Create user button, delete button |
| Check for specific role combination | **Role** with `useHasRole()` | Features for admin+moderator only |
| UI that differs by permission level | **Permission** with multiple checks | Advanced vs basic admin features |

**Best Practice:** Use roles for coarse-grained access (sections), permissions for fine-grained actions (buttons).

## Permission System

The admin integration uses a granular permission system powered by Better Auth's access control. This allows fine-grained control over what each admin/moderator can do.

### How It Works

1. **Roles for broad access**: `admin` and `moderator` roles determine if users can access the admin panel
2. **Permissions for specific actions**: Each action (create user, ban user, etc.) requires a specific permission
3. **Lazy loading + caching**: Permissions are checked when needed and cached for 5 minutes
4. **React Query powered**: Automatic caching, deduplication, and background updates

### Checking Permissions

Use the `usePermission` hook to check if the current user has a specific permission:

```tsx
import { usePermission } from "@/hooks/use-permission"
import { PERMISSIONS } from "@/lib/constants/permissions"

function UserActionsMenu({ user }) {
  // Check if user can set roles
  const { data: canSetRole = false, isLoading } = usePermission(...PERMISSIONS.USER.SET_ROLE)
  const { data: canBan = false } = usePermission(...PERMISSIONS.USER.BAN)

  return (
    <DropdownMenu>
      {canSetRole && <MenuItem>Change Role</MenuItem>}
      {canBan && <MenuItem>Ban User</MenuItem>}
    </DropdownMenu>
  )
}
```

### Available Permissions

All permissions are defined in `lib/constants/permissions.ts`:

**User Permissions (synced with backend):**
- `USER.CREATE` - Create new users
- `USER.LIST` - View user list
- `USER.UPDATE` - Edit user information
- `USER.DELETE` - Delete users
- `USER.SET_ROLE` - Change user roles
- `USER.SET_PASSWORD` - Reset passwords
- `USER.BAN` - Ban users
- `USER.UNBAN` - Unban users
- `USER.IMPERSONATE` - Impersonate users

**Session Permissions (synced with backend):**
- `SESSION.LIST` - View user sessions
- `SESSION.REVOKE` - Revoke specific sessions
- `SESSION.REVOKE_ALL` - Revoke all user sessions

**UI Permissions (Custom):**
- `UI.ADMIN_DASHBOARD` - Access admin dashboard
- `UI.USER_MANAGEMENT` - Access user management
- `UI.SETTINGS` - Access admin settings

### Permission Preloading

Common permissions are preloaded in the admin layout to avoid loading states:

```tsx
// app/(app)/admin/layout.tsx
import { usePreloadPermissions } from "@/hooks/use-permission"
import { COMMON_ADMIN_PERMISSIONS } from "@/lib/constants/permissions"

export default function AdminLayout({ children }) {
  // Preload permissions - they'll be cached before user clicks anything
  usePreloadPermissions(COMMON_ADMIN_PERMISSIONS)

  return <>{children}</>
}
```

### Multiple Permission Check

To check if user has ALL permissions at once:

```tsx
import { usePermissions } from "@/hooks/use-permission"

function MyComponent() {
  // Returns true ONLY if user has all these permissions
  const { data: hasAll = false } = usePermissions({
    user: ['create', 'delete'],
    session: ['list']
  })

  if (hasAll) {
    return <AdvancedFeature />
  }
}
```

### Example: Moderator vs Admin

Configure permissions on your backend to differentiate roles:

```typescript
// Backend configuration
const moderator = ac.newRole({
  user: ["list", "get", "ban"],     // Can view and ban users
  session: ["list"],                 // Can view sessions
  ui: ["admin-dashboard"]            // Can access admin panel
})

const admin = ac.newRole({
  user: ["*"],                       // All user permissions
  session: ["*"],                    // All session permissions
  ui: ["*"]                          // All UI permissions
})
```

With this setup:
- **Moderators** can see the admin panel and ban users, but **cannot** change roles or delete users
- **Admins** have full permissions

The frontend automatically adapts the UI based on each user's permissions.

### Adding New Permissions

1. **Define permission in constants:**
```typescript
// lib/constants/permissions.ts
export const CUSTOM_PERMISSIONS = {
  EXPORT_DATA: ['reports', 'export'] as const,
}
```

2. **Use in component:**
```typescript
const { data: canExport } = usePermission('reports', 'export')
```

3. **Configure on backend:**
```typescript
// Backend Better Auth config
const admin = ac.newRole({
  reports: ["export"]
})
```

### Permission Caching

- Permissions are cached for **5 minutes** after first check
- Cache is automatically invalidated when:
  - User logs out
  - User role changes
  - Manual refresh via React Query
- No API calls are made during cache lifetime

### Displaying User Roles

```tsx
import { RoleBadge } from "@/components/admin/role-badge"

function UserCard({ user }) {
  return (
    <div>
      <p>{user.name}</p>
      <RoleBadge role={user.role} />
    </div>
  )
}
```

### User List Component

```tsx
import { UserList } from "@/components/admin/user-management/user-list"

export default function UsersPage() {
  return (
    <div>
      <h1>Users</h1>
      <UserList />
    </div>
  )
}
```

## Security Considerations

### Important Security Notes

1. **Client-side checks are for UI only** - Never rely on `useCanAccessAdmin()` or `useIsAdmin()` for security. All admin operations are validated on the server.

2. **Server-side validation** - Your API server already validates all admin operations through Better Auth's admin plugin.

3. **Sensitive operations require confirmation** - Dialogs are shown before destructive actions like banning or deleting users.

4. **Impersonation tracking** - When impersonating, the session stores the original admin's ID in `impersonatedBy` field.

5. **Session security** - Revoke sessions immediately if you suspect unauthorized access.

### Best Practices

- **Audit logging**: Consider adding logging for admin actions on the backend
- **Two-factor authentication**: Enable 2FA for admin accounts
- **Regular access reviews**: Periodically review who has admin access
- **Principle of least privilege**: Only grant admin access when necessary
- **Session timeouts**: Configure appropriate session expiration times

## Troubleshooting

### "Access Denied" when accessing /admin

**Cause**: User doesn't have admin role

**Solution**:
1. Check the user's role in the database
2. Update the role to "admin" using one of the methods above
3. Sign out and sign back in to refresh the session

### Admin operations failing with 403 errors

**Cause**: Backend admin plugin not properly configured

**Solution**:
1. Verify Better Auth admin plugin is installed on API server
2. Check that admin roles are configured correctly
3. Ensure session cookies are being sent to the API

### Impersonation not working

**Cause**: Session not refreshing properly

**Solution**:
1. The hooks automatically reload the page after impersonation
2. If it doesn't work, manually sign out and sign back in
3. Check browser console for errors

### User list not loading

**Cause**: API connection issues

**Solution**:
1. Check network tab for failed requests
2. Verify NEXT_PUBLIC_API_URL is configured correctly
3. Ensure CORS is properly configured on API server
4. Check that credentials are being included in requests

## Available Roles

By default, the following roles are supported:
- `user` - Regular user (default)
- `admin` - Full administrative access
- `moderator` - Limited administrative access (if configured)

You can customize roles in your Better Auth admin plugin configuration on the API server.

## Admin Panel Routes

- `/admin` - Admin dashboard with statistics
- `/admin/users` - User management page
- `/admin/sessions` - Session management page

## Data Types

### User Object
```typescript
interface User {
  id: string
  email: string
  name: string
  image?: string | null
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  role: string
  banned: boolean
  banReason: string | null
  banExpires: Date | null
}
```

### Session Object
```typescript
interface Session {
  id: string
  userId: string
  expiresAt: Date
  token: string
  ipAddress?: string
  userAgent?: string
  impersonatedBy: string | null
}
```

## Future Enhancements

Potential features to add:
- Bulk user operations (ban multiple users at once)
- Advanced user search and filtering
- Export user data as CSV/JSON
- User activity logs and analytics
- Email notifications for admin actions
- Custom role permissions
- Admin permission levels (super admin vs. moderator)

## Related Files

### Hooks
- `hooks/use-admin.ts` - All admin operations (consolidated)
- `hooks/use-permission.ts` - Permission checking with caching

### Components
- `components/admin/admin-guard.tsx` - Route protection
- `components/admin/role-badge.tsx` - Role display
- `components/admin/impersonation-banner.tsx` - Impersonation indicator
- `components/admin/user-management/*` - User management UI
- `components/admin/session-management/*` - Session management UI

### Pages
- `app/(app)/admin/layout.tsx` - Admin layout with navigation
- `app/(app)/admin/page.tsx` - Admin dashboard
- `app/(app)/admin/users/page.tsx` - User management
- `app/(app)/admin/sessions/page.tsx` - Session management

### Types and Constants
- `lib/types/auth.ts` - TypeScript type definitions
- `lib/constants/roles.ts` - Centralized role definitions and groups
- `lib/constants/permissions.ts` - Permission constants synced with backend
- `lib/types/better-auth.d.ts` - Better Auth type extensions

## Support

For issues or questions:
1. Check the Better Auth documentation: https://www.better-auth.com/docs/plugins/admin
2. Review this documentation
3. Check browser console for error messages
4. Verify API server logs for backend issues

## Changelog

### Initial Implementation
- Added Better Auth admin client plugin
- Created all admin hooks and components
- Built admin pages for user and session management
- Added impersonation functionality
- Protected admin routes with AdminGuard
- Added admin navigation to account menu

### Permission System Implementation
- Added granular permission checking with `usePermission` hook
- Implemented React Query-based caching (5min TTL)
- Created permission constants for type safety
- Added permission preloading in admin layout
- Updated components with permission-based rendering
- Consolidated all admin hooks into single file

### Role Management Refactor
- Created centralized role configuration in `lib/constants/roles.ts`
- Introduced semantic function naming with `useCanAccessAdmin()` and `useHasRole()`
- Synced frontend permissions with backend statement exactly
- Updated all components to use semantic hooks for role checking
- Made system future-proof: add new roles by updating single array in `ROLE_GROUPS`
- Added comprehensive role management documentation with best practices
