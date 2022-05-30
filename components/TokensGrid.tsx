import { FC } from 'react'
import LoadingCard from './LoadingCard'
import { SWRInfiniteResponse } from 'swr/infinite/dist/infinite'
import Link from 'next/link'
import { optimizeImage } from 'lib/optmizeImage'
import { useInView } from 'react-intersection-observer'
import FormatEth from './FormatEth'
import Masonry from 'react-masonry-css'
import { paths } from '@reservoir0x/client-sdk'

type Props = {
  tokens: SWRInfiniteResponse<
    paths['/tokens/v2']['get']['responses']['200']['schema'],
    any
  >
  collectionImage: string | undefined
  viewRef: ReturnType<typeof useInView>['ref']
  tokenCount: number
}

const TokensGrid: FC<Props> = ({
  tokens,
  viewRef,
  tokenCount,
  collectionImage,
}) => {
  const { data, isValidating, size } = tokens

  // Reference: https://swr.vercel.app/examples/infinite-loading
  const mappedTokens = data ? data.map(({ tokens }) => tokens).flat() : []
  const isEmpty = mappedTokens.length === 0
  const didReactEnd = isEmpty || (data && mappedTokens.length < tokenCount)

  return (
    <Masonry
      breakpointCols={{
        default: 4,
        1280: 3,
        1024: 2,
        768: 2,
        640: 2,
        500: 1,
      }}
      className="masonry-grid"
      columnClassName="masonry-grid_column"
    >
      {size === 1 && isValidating
        ? Array(20).map((_, index) => (
            <LoadingCard key={`loading-card-${index}`} />
          ))
        : mappedTokens?.map((token, idx) => (
            <Link
              key={`${token?.collection?.name}${idx}`}
              href={`/${token?.contract}/${token?.tokenId}`}
            >
              <a className="group mb-6 grid border-[2px] self-start overflow-hidden rounded-[6px] bg-white shadow-neutral-200 transition">
                {token?.image ? (
                  <img
                    src={optimizeImage(token?.image, 250)}
                    alt={`${token?.name}`}
                    className="w-full "
                    width="250"
                    height="250"
                  />
                ) : (
                  <div className="relative w-full">
                    <div className="absolute inset-0 grid place-items-center hover-blur-lg backdrop-blur-lg">
                      <div>
                        <img
                          src={optimizeImage(collectionImage, 250)}
                          alt={`${token?.collection?.name}`}
                          className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full border-2 border-white"
                          width="64"
                          height="64"
                        />
                        <div className="reservoir-h6 text-black">
                          No Content Available
                        </div>
                      </div>
                    </div>
                    <img
                      src={optimizeImage(collectionImage, 250)}
                      alt={`${token?.collection?.name}`}
                      className="aspect-square w-full object-cover"
                      width="250"
                      height="250"
                    />
                  </div>
                )}

                <p
                  className="reservoir-h6 mb-3 overflow-hidden truncate px-6 pt-4 text-black text-[12pt] lg:pt-3"
                  title={token?.name || token?.tokenId}
                >
                  {token?.name || `#${token?.tokenId}`}
                </p>
                <div className="flex items-center justify-between px-6 pb-4 lg:pb-3">
                  <div>
                    <div className="reservoir-subtitle text-black">
                      Offer
                    </div>
                    <div className="reservoir-h6">
                      <FormatEth
                        amount={token?.topBidValue}
                        maximumFractionDigits={4}
                        logoWidth={7}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="reservoir-subtitle text-black">
                      ETH
                    </div>
                    <div className="reservoir-h6 text-[16pt] text-black">
                      <FormatEth
                        amount={token?.floorAskPrice}
                        maximumFractionDigits={4}
                        logoWidth={7}
                      />
                    </div>
                  </div>
                </div>
              </a> 
            </Link>
          ))}
      {didReactEnd &&
        Array(20)
          .fill(null)
          .map((_, index) => {
            if (index === 0) {
              return (
                <LoadingCard viewRef={viewRef} key={`loading-card-${index}`} />
              )
            }
            return <LoadingCard key={`loading-card-${index}`} />
          })}
    </Masonry>
  )
}

export default TokensGrid
