import { ComponentProps, FC } from 'react'
import { DateTime } from 'luxon'
import Link from 'next/link'
import { optimizeImage } from 'lib/optmizeImage'
import FormatEth from 'components/FormatEth'
import { useAccount, useSigner } from 'wagmi'
import Toast from 'components/Toast'
import CancelListing from 'components/CancelListing'
import useUserAsks from 'hooks/useUserAsks'

type Props = {
  data: ReturnType<typeof useUserAsks>
  isOwner: boolean
  maker: string
  mutate: () => any
  modal: {
    accountData: ReturnType<typeof useAccount>[0]['data']
    collectionId: string | undefined
    isInTheWrongNetwork: boolean | undefined
    setToast: (data: ComponentProps<typeof Toast>['data']) => any
    signer: ReturnType<typeof useSigner>[0]['data']
  }
}

const UserListingsTable: FC<Props> = ({
  maker,
  modal,
  mutate,
  isOwner,
  data: { orders, ref },
}) => {
  const { data } = orders
  const ordersFlat = data ? data.flatMap(({ orders }) => orders) : []

  if (ordersFlat.length === 0) {
    return (
      <div className="reservoir-body mt-14 grid justify-center">
        You don&apos;t have any items listed for sale.
      </div>
    )
  }

  return (
    <div className="mb-11 overflow-x-auto border-b border-gray-200 shadow sm:rounded-lg">
      <table className="min-w-full table-auto divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Item', 'Price', 'Expiration'].map((item) => (
              <th
                key={item}
                scope="col"
                className="reservoir-label-l px-6 py-3 text-left"
              >
                {item}
              </th>
            ))}
            {isOwner && (
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {ordersFlat?.map((position, index, arr) => {
            const {
              collectionName,
              contract,
              expiration,
              id,
              image,
              name,
              tokenHref,
              tokenId,
              value,
            } = processPosition(position)

            return (
              <tr
                key={`${position?.id}-${index}`}
                ref={index === arr.length - 5 ? ref : null}
                className="group h-[80px] even:bg-neutral-100 dark:even:bg-neutral-900"
              >
                {/* ITEM */}
                <td className="reservoir-body whitespace-nowrap px-6 py-4">
                  <Link href={tokenHref}>
                    <a className="flex items-center gap-2">
                      <div className="relative h-10 w-10">
                        {image && (
                          <div className="aspect-w-1 aspect-h-1 relative">
                            <img
                              src={optimizeImage(image, 35)}
                              className="w-[35px] object-contain"
                              width="35"
                              height="35"
                            />
                          </div>
                        )}
                      </div>
                      <span className="whitespace-nowrap">
                        <div className="reservoir-body">{collectionName}</div>
                        <div className="reservoir-h6">{name}</div>
                      </span>
                    </a>
                  </Link>
                </td>

                {/* PRICE */}
                <td className="reservoir-body whitespace-nowrap px-6 py-4">
                  <FormatEth amount={value} maximumFractionDigits={4} />
                </td>

                {/* EXPIRATION */}
                <td className="reservoir-body whitespace-nowrap px-6 py-4">
                  {expiration}
                </td>
                {isOwner && (
                  <td className="reservoir-body whitespace-nowrap px-6 py-4">
                    <CancelListing
                      data={{
                        collectionId: modal?.collectionId,
                        id,
                        contract,
                        tokenId,
                      }}
                      maker={maker}
                      signer={modal.signer}
                      show={true}
                      isInTheWrongNetwork={modal.isInTheWrongNetwork}
                      setToast={modal.setToast}
                      mutate={mutate}
                    />
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default UserListingsTable

function processPosition(
  position:
    | NonNullable<NonNullable<Props['data']['orders']['data']>[0]['orders']>[0]
    | undefined
) {
  const tokenId = position?.tokenSetId?.split(':')[2]
  const contract = position?.tokenSetId?.split(':')[1]

  const data = {
    contract,
    tokenId,
    image: position?.metadata?.data?.image,
    name: position?.metadata?.data?.tokenName,
    expiration:
      position?.expiration === 0
        ? 'Never'
        : DateTime.fromMillis(+`${position?.expiration}000`).toRelative(),
    id: position?.id,
    collectionName: position?.metadata?.data?.collectionName,
    value: position?.value,
  }

  const tokenHref =
    // data.contract && data.tokenId && `/${data.contract}/${data.tokenId}`
    `/${data.contract}/${data.tokenId}`

  return { ...data, tokenHref }
}
