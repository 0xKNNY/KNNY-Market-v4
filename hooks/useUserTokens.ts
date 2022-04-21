import { paths } from '@reservoir0x/client-sdk'
import fetcher from 'lib/fetcher'
import setParams from 'lib/params'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite'

const PROXY_API_BASE = process.env.NEXT_PUBLIC_PROXY_API_BASE

type Tokens =
  paths['/users/{user}/tokens/v2']['get']['responses']['200']['schema']

export default function useUserTokens(
  collectionId: string | undefined,
  fallbackData: Tokens[],
  mode: string | undefined,
  user: string | undefined
) {
  const { ref, inView } = useInView()

  const pathname = `${PROXY_API_BASE}/users/${user}/tokens/v2`

  const tokens = useSWRInfinite<Tokens>(
    (index, previousPageData) =>
      getKey(
        { pathname, mode, collectionId, proxyApi: PROXY_API_BASE },
        index,
        previousPageData
      ),
    fetcher,
    {
      revalidateFirstPage: false,
      fallbackData,
    }
  )

  // Fetch more data when component is visible
  useEffect(() => {
    if (inView) {
      tokens.setSize(tokens.size + 1)
    }
  }, [inView])

  return { tokens, ref }
}

type InfiniteKeyLoader = (
  custom: {
    pathname: string
    collectionId: string | undefined
    mode: string | undefined
    proxyApi: string | undefined
  },
  ...base: Parameters<SWRInfiniteKeyLoader>
) => ReturnType<SWRInfiniteKeyLoader>

const getKey: InfiniteKeyLoader = (
  custom: {
    pathname: string
    collectionId: string | undefined
    mode: string | undefined
    proxyApi: string | undefined
  },
  index: number,
  previousPageData: paths['/users/{user}/tokens/v2']['get']['responses']['200']['schema']
) => {
  const { pathname, collectionId, mode, proxyApi } = custom
  if (!proxyApi) {
    console.debug(
      'Environment variable NEXT_PUBLIC_PROXY_API_BASE is undefined.'
    )
    return null
  }

  // Reached the end
  if (previousPageData && previousPageData?.tokens?.length === 0) return null

  let query: paths['/users/{user}/tokens/v2']['get']['parameters']['query'] = {
    limit: 20,
    offset: index * 20,
  }

  if (mode === 'community') {
    query.community = collectionId
  }

  if (mode === 'collection') {
    query.collection = collectionId
  }

  const href = setParams(pathname, query)

  return href
}
