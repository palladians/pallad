export const fetchPals = async (
  url: string,
  queryParams?: Record<string, string>,
) => {
  try {
    let queryUrl = url

    // Add query parameters to the URL if they exist
    if (queryParams) {
      const queryParamString = new URLSearchParams(queryParams).toString()
      queryUrl = `${url}?${queryParamString}`
    }

    const response = await fetch(queryUrl, {
      method: "GET",
    })

    if (!response.ok) {
      return { ok: false, message: `HTTP error! status: ${response.status}` }
    }

    const data = await response.json()

    // Checking directly for data in the respose
    if (data) {
      return { ok: true, data: data } // Directly returning the data
    }

    // Additional error handling as per your API's design
    if (data.errors) {
      return {
        ok: false,
        message: `Error: ${data.errors.map((e: any) => e.message).join(", ")}`,
      }
    }

    return { ok: false, message: "Data not found" }
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, message: `Error: ${error.message}` }
    }
    return { ok: false, message: "An unknown error occurred" }
  }
}
