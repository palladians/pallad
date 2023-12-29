export const customFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  const response = await fetch(input, init)

  // Check if the response is OK and the content type is JSON
  if (
    response.ok &&
    response.headers.get('content-type')?.includes('application/json')
  ) {
    const json = await response.json()
    const serialized = JSON.stringify(json)
    return new Response(serialized, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers({
        'Content-Type': 'application/json',
        ...response.headers
      })
    })
  } else {
    // If response is not JSON or not OK, return the original response
    console.log('customFetch non-JSON or error response:', response)
    return response
  }
}
