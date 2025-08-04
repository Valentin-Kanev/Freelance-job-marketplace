export const fetchClient = async <T>(
  url: string,
  options?: RequestInit,
  baseUrl: string = process.env.REACT_APP_BASE_URL || "http://localhost:3000"
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
    let errorMessage = "Something went wrong";
    const errorData: Error = await response.json();
    if (errorData && typeof errorData === "object") {
      errorMessage = errorData?.message || errorMessage;
    } else {
      errorMessage = `Error ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};
