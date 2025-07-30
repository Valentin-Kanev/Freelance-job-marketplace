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
    let errorMessage = "Something went wrong";
    throw new Error(errorMessage);
  }

  return response.json();
};
