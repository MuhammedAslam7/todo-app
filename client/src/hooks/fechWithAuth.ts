import { store } from "@/redux/store"
import { logout } from "@/redux/authSlice"

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const accessToken = localStorage.getItem("accessToken")

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options.headers as Record<string, string>), 
  }

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  })

  if (response.status === 401) {
    const refreshResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })

    if (refreshResponse.ok) {
      const data = await refreshResponse.json()
      localStorage.setItem("accessToken", data.accessToken)

      const retryHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.accessToken}`,
        ...(options.headers as Record<string, string>),
      }

      response = await fetch(url, {
        ...options,
        headers: retryHeaders,
        credentials: "include",
      })
    } else {
      localStorage.removeItem("accessToken")
      store.dispatch(logout())
      window.location.href = "/login"
      return
    }
  }

  return response
}
