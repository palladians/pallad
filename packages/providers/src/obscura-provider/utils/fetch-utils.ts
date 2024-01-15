export const fetchGraphQL = async (
  url: string,
  query: string,
  variables?: Record<string, any>
) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
    })

    if (!response.ok) {
      return { ok: false, message: `HTTP error! status: ${response.status}` }
    }

    const data = await response.json()

    if (data.errors) {
      return {
        ok: false,
        message: `GraphQL error: ${data.errors
          .map((e: any) => e.message)
          .join(', ')}`
      }
    }

    return { ok: true, data: data.data }
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, message: `Error: ${error.message}` }
    }
    return { ok: false, message: 'An unknown error occurred' }
  }
}
