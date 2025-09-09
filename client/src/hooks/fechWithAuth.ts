
export async function fetchWithAuth(url, options = {}) {
  const accessToken = localStorage.getItem("accessToken");

  const headers = {
    ...options.headers,
    Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
    "Content-Type": "application/json",
  };

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const refreshResponse = await fetch("/auth/refresh", {
      method: "POST",
      credentials: "include", 
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      localStorage.setItem("accessToken", data.accessToken);

      const retryHeaders = {
        ...options.headers,
        Authorization: `Bearer ${data.accessToken}`,
        "Content-Type": "application/json",
      };
      response = await fetch(url, { ...options, headers: retryHeaders });
    } else {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      return;
    }
  }

  return response;
}
