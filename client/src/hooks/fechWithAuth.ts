import { store } from "@/redux/store"
import { logout } from "@/redux/authSlice"

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const accessToken = localStorage.getItem("accessToken")

  const headers = {
    ...options.headers,
    Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
    "Content-Type": "application/json",
  }

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Include cookies for refresh token
  })

  if (response.status === 401) {
    const refreshResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })

    if (refreshResponse.ok) {
      const data = await refreshResponse.json()
      localStorage.setItem("accessToken", data.accessToken)

      const retryHeaders = {
        ...options.headers,
        Authorization: `Bearer ${data.accessToken}`,
        "Content-Type": "application/json",
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
