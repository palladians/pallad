export const fetchGetJSON = async (
  url: string,
  headers: Record<string, string>,
) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers, // Using only necessary headers provided in the call
    })

    if (!response.ok) {
      return { ok: false, message: `HTTP error! status: ${response.status}` }
    }

    const data = await response.json()
    return { ok: true, data }
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, message: `Error: ${error.message}` }
    }
    return { ok: false, message: "An unknown error occurred" }
  }
}
