import { setParams } from '@reservoir0x/client-sdk'
import type { NextApiRequest, NextApiResponse } from 'next'

const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY
const RESERVOIR_API_BASE = process.env.NEXT_PUBLIC_RESERVOIR_API_BASE

// A proxy API endpoint to redirect all requests to `/api/reservoir/*` to
// MAINNET: https://api.reservoir.tools/{endpoint}/{query-string}
// RINKEBY: https://api-rinkeby.reservoir.tools/{endpoint}/{query-string}
// and attach the `x-api-key` header to the request. This way the
// Reservoir API key is not exposed to the client.

// https://nextjs.org/docs/api-routes/dynamic-api-routes#catch-all-api-routes
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { query, body, method } = req
  const { slug } = query

  // Isolate the query object
  delete query.slug

  let endpoint: string = ''

  // convert the slug array into a path string: [a, b] -> 'a/b'
  if (typeof slug === 'string') {
    endpoint = slug
  } else {
    endpoint = slug.join('/')
  }

  // Construct the API url: `https://api.reservoir.tools/{endpoint}/{query-string}`
  const url = new URL(endpoint, RESERVOIR_API_BASE)

  setParams(url, query)

  try {
    const options: RequestInit | undefined = {
      method,
    }

    const headers = new Headers()

    if (RESERVOIR_API_KEY) headers.set('x-api-key', RESERVOIR_API_KEY)

    if (typeof body === 'object') {
      headers.set('Content-Type', 'application/json')
      options.body = JSON.stringify(body)
    }

    options.headers = headers

    const response = await fetch(url.href, options)

    let data: any

    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    if (!response.ok) throw data

    // 200 OK
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
    res.status(200).json(data)
  } catch (error) {
    // 400 Bad Request
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
    res.status(400).json(error)
  }
}
