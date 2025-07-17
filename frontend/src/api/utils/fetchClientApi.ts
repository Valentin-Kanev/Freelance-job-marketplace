export const fetchClient = async <T>(
  url: string,
  options?: RequestInit,
  baseUrl: string = "http://localhost:3000"
): Promise<T> => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get("Content-Type");
    let errorMessage = "Something went wrong";
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      errorMessage = errorData?.message || errorMessage;
    } else {
      errorMessage = `Error ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};
