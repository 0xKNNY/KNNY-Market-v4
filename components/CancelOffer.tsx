import { Signer } from 'ethers'
import { cancelOrder, Execute, paths } from '@reservoir0x/client-sdk'
import React, { ComponentProps, FC, useEffect, useState } from 'react'
import { SWRResponse } from 'swr'
import * as Dialog from '@radix-ui/react-dialog'
import ModalCard from './modal/ModalCard'
import { useConnect } from 'wagmi'
import Toast from './Toast'
import { SWRInfiniteResponse } from 'swr/infinite/dist/infinite'
import { getCollection, getDetails } from 'lib/fetch/fetch'
import { CgSpinner } from 'react-icons/cg'
import { checkWallet } from 'lib/wallet'

const RESERVOIR_API_BASE = process.env.NEXT_PUBLIC_RESERVOIR_API_BASE

type Details = paths['/tokens/details/v3']['get']['responses']['200']['schema']
type Collection = paths['/collection/v1']['get']['responses']['200']['schema']

type Props = {
  data:
    | {
        details: SWRResponse<Details, any>
        collection: Collection | undefined
      }
    | {
        collectionId: string | undefined
        contract?: string | undefined
        tokenId?: string | undefined
        id?: string | undefined
      }
  isInTheWrongNetwork: boolean | undefined
  maker?: string
  mutate?: SWRResponse['mutate'] | SWRInfiniteResponse['mutate']
  setToast: (data: ComponentProps<typeof Toast>['data']) => any
  show: boolean
  signer: Signer | undefined
}

const CancelOffer: FC<Props> = ({
  data,
  isInTheWrongNetwork,
  maker,
  mutate,
  setToast,
  show,
  signer,
}) => {
  const [waitingTx, setWaitingTx] = useState<boolean>(false)
  const [{ data: connectData }, connect] = useConnect()
  const [steps, setSteps] = useState<Execute['steps']>()
  const [open, setOpen] = useState(false)

  // Data from props
  const [collection, setCollection] = useState<Collection>()
  const [details, setDetails] = useState<SWRResponse<Details, any> | Details>()

  useEffect(() => {
    if (data && open) {
      // Load data if missing
      if ('tokenId' in data) {
        const { contract, tokenId, collectionId } = data

        getDetails(contract, tokenId, setDetails)
        getCollection(collectionId, setCollection)
      }
      // Load data if provided
      if ('details' in data) {
        const { details, collection } = data

        setDetails(details)
        setCollection(collection)
      }
    }
  }, [data, open])

  // Set the token either from SWR or fetch
  let token: NonNullable<Details['tokens']>[0] = { token: undefined }

  // From fetch
  if (details && 'tokens' in details && details.tokens?.[0]) {
    token = details.tokens?.[0]
  }

  // From SWR
  if (details && 'data' in details && details?.data?.tokens?.[0]) {
    token = details.data?.tokens?.[0]
  }

  const modalData: ComponentProps<typeof ModalCard>['data'] = {
    collection: {
      name: collection?.collection?.name,
    },
    token: {
      contract: token?.token?.contract,
      id: token?.token?.tokenId,
      image: token?.token?.image,
      name: token?.token?.name,
      topBuyValue: token?.market?.topBid?.value,
      floorSellValue: token?.market?.floorAsk?.price,
    },
  }

  const handleError: Parameters<typeof cancelOrder>[0]['handleError'] = (
    err: any
  ) => {
    setOpen(false)
    setSteps(undefined)
    // Handle user rejection
    if (err?.code === 4001) {
      setToast({
        kind: 'error',
        message: 'You have canceled the transaction.',
        title: 'User canceled transaction',
      })
      return
    }
    setToast({
      kind: 'error',
      message: 'The transaction was not completed.',
      title: 'Could not cancel offer',
    })
  }

  const handleSuccess: Parameters<
    typeof cancelOrder
  >[0]['handleSuccess'] = async () => {
    details && 'mutate' in details && details.mutate()
    mutate && mutate()
  }

  let id: string | undefined = undefined

  if ('details' in data) {
    id = data.details.data?.tokens?.[0]?.market?.topBid?.id
  }

  if ('id' in data) {
    id = data?.id
  }

  const execute = async (id: string, maker: string) => {
    await checkWallet(signer, setToast, connect, connectData)
    setWaitingTx(true)
    await cancelOrder({
      query: { id, maker },
      signer,
      apiBase: RESERVOIR_API_BASE,
      setState: setSteps,
      handleSuccess,
      handleError,
    })
    setWaitingTx(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {show && (
        <Dialog.Trigger
          disabled={waitingTx || isInTheWrongNetwork}
          onClick={() => id && maker && execute(id, maker)}
          className="btn-primary-outline"
        >
          {waitingTx ? (
            <CgSpinner className="h-4 w-4 animate-spin" />
          ) : (
            'Cancel Your Offer'
          )}
        </Dialog.Trigger>
      )}
      {steps && (
        <Dialog.Portal>
          <Dialog.Overlay>
            <ModalCard
              title="Cancel your offer"
              loading={waitingTx}
              steps={steps}
            />
          </Dialog.Overlay>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  )
}

export default CancelOffer
