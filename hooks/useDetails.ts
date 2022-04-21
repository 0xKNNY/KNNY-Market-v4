import { paths } from '@reservoir0x/client-sdk'
import fetcher from 'lib/fetcher'
import setParams from 'lib/params'
import useSWR from 'swr'

const PROXY_API_BASE = process.env.NEXT_PUBLIC_PROXY_API_BASE

export default function useDetails(
  query: paths['/tokens/details/v3']['get']['parameters']['query']
) {
  const pathname = `${PROXY_API_BASE}/tokens/details/v3`

  const href = setParams(pathname, query)

  const details = useSWR<
    paths['/tokens/details/v3']['get']['responses']['200']['schema']
  >(href, fetcher)

  return details
}
