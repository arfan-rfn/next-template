"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

const settingsNav = [
  {
    title: "Account",
    href: "/settings/account",
    icon: Icons.User,
    description: "Profile and account management"
  }
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Settings Navigation - Mobile and Desktop */}
          <aside className="lg:w-64 space-y-1">
            <nav className="space-y-1">
              {settingsNav.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive 
                        ? "bg-accent text-accent-foreground font-medium" 
                        : "text-muted-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground hidden lg:block">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Settings Content */}
          <main className="flex-1 space-y-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}