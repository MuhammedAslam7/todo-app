import type React from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import type { RootState } from "@/redux/store"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token, user } = useSelector((state: RootState) => state.auth)

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
