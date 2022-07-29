import { FC } from 'react'
import LoadingCard from './LoadingCard'
import { SWRInfiniteResponse } from 'swr/infinite/dist/infinite'
import Link from 'next/link'
import { optimizeImage } from 'lib/optmizeImage'
import { useInView } from 'react-intersection-observer'
import FormatEth from './FormatEth'
import Masonry from 'react-masonry-css'
import { paths } from '@reservoir0x/client-sdk'
import { getCollection } from 'lib/fetch/fetch'
import CollectionsGrid from './CollectionsGrid'

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
        default: 3,
        1280: 2,
        1024: 2,
        768: 1,
        640: 1,
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
              <a className="group mb-6 grid border background text self-start overflow-hidden transition">
                {token?.image ? (
                  <img
                    src={optimizeImage(token?.image, 400)}
                    alt={`${token?.name}`}
                    className="w-full"
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
                          className="mx-auto mb-4 h-16 w-16 overflow-hidden background border"
                          width="64"
                          height="64"
                        />
                        <div className="reservoir-h6 text">
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
                
              <div>
                <p
                  className="reservoir-h6 mb-3 overflow-hidden truncate px-6 pt-4 heading background lg:pt-3"
                  title={token?.name || token?.tokenId}
                >
                  {token?.name || `#${token?.tokenId}`}
                </p>
                <div className="flex items-center px-6 pb-4 lg:pb-3">
                  {/*<div>
                    <div className="reservoir-subtitle text">
                      Offer
                    </div>
                    <div className="reservoir-h6 text">
                      <FormatEth
                        amount={token?.topBidValue}
                        maximumFractionDigits={4}
                        logoWidth={7}
                      />
                    </div>
                  </div>*/}

                  
                  <div className="text-right"></div>
                    <div className="reservoir-subtitle text-left text">
                    <div className="reservoir-subtitle text">
                      Price
                    </div>
                   <div className="flex">
                    <div className="reservoir-h6 text">
                      <FormatEth
                        amount={token?.floorAskPrice}
                        maximumFractionDigits={4}
                        logoWidth={7}
                      />
                    </div> 
                    <div className="reservoir-h6 text">  ETH</div>
                    </div>

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
