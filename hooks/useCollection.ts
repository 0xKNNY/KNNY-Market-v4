import { paths } from '@reservoir0x/client-sdk'
import fetcher from 'lib/fetcher'
import setParams from 'lib/params'
import useSWR from 'swr'

const PROXY_API_BASE = process.env.NEXT_PUBLIC_PROXY_API_BASE

type Collection = paths['/collection/v1']['get']['responses']['200']['schema']

export default function useCollection(
  fallbackData: Collection | undefined,
  collectionId: string | undefined
) {
  function getUrl() {
    if (!collectionId) return undefined

    const pathname = `${PROXY_API_BASE}/collection/v1`

    let query: paths['/collection/v1']['get']['parameters']['query'] = {
      id: collectionId,
    }

    const href = setParams(pathname, query)

    return href
  }

  const href = getUrl()

  const collection = useSWR<Collection>(href, fetcher, {
    fallbackData,
  })

  return collection
}
