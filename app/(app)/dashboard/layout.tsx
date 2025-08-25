import { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
  profileModal: ReactNode
  welcomeModal: ReactNode
}

export default function DashboardLayout({
  children,
  profileModal,
  welcomeModal,
}: DashboardLayoutProps) {
  return (
    <div>
      {children}
      {profileModal}
      {welcomeModal}
    </div>
  )
}