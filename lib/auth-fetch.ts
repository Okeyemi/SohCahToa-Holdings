let refreshPromise: Promise<Response> | null = null;
let abortController: AbortController | null = null;

async function refreshToken(): Promise<Response> {
  if (!refreshPromise) {
    abortController = new AbortController();
    
    refreshPromise = fetch("/api/auth/refresh", {
      method: "POST",
      signal: abortController.signal,
    })
      .finally(() => {
        refreshPromise = null;
        abortController = null;
      });
  }

  return refreshPromise;
}

export function cancelPendingRequests() {
  if (abortController) {
    abortController.abort();
    abortController = null;
    refreshPromise = null;
  }
}

export async function authFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const res = await fetch(input, {
    ...init,
    credentials: "include",
  });

  if (res.status !== 401) {
    return res;
  }

  try {
    const refreshRes = await refreshToken();
    
    if (!refreshRes.ok) {
      throw new Error("Refresh failed");
    }
  } catch (error) {
    cancelPendingRequests();
    
    // Clear cookies client-side (best effort)
    document.cookie = "accessToken=; Max-Age=0; path=/";
    document.cookie = "refreshToken=; Max-Age=0; path=/";
    document.cookie = "tokenExpiry=; Max-Age=0; path=/";
    document.cookie = "userRole=; Max-Age=0; path=/";
    
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  return fetch(input, {
    ...init,
    credentials: "include",
  });
}