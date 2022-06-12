import React, { FC, ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { HiX } from 'react-icons/hi'
import { optimizeImage } from 'lib/optmizeImage'
import Steps from 'components/Steps'
import { Execute } from '@reservoir0x/client-sdk'
import FormatEth from 'components/FormatEth'

type Props = {
  data?: {
    token?: {
      image?: string | undefined
      name?: string | undefined
      id?: string | undefined
      contract?: string | undefined
      topBuyValue?: number | undefined
      floorSellValue?: number | undefined
    }
    collection?: {
      id?: string | undefined
      image?: string | undefined
      name?: string | undefined
      tokenCount?: number
    }
    attribute?: {
      key?: string | undefined
      value?: string | undefined
    }
  }
  loading: boolean
  onCloseCallback?: () => any
  orderbook?: ('opensea' | 'reservoir')[]
  actionButton?: ReactNode
  onContinue?: () => any
  steps: Execute['steps']
  title: string
}

const orderbooks = {
  opensea: 'OpenSea',
  reservoir: 'reservoir.market',
}

const ModalCard: FC<Props> = ({
  actionButton,
  children,
  data,
  loading,
  orderbook,
  onCloseCallback,
  onContinue,
  steps,
  title,
}) => {
  // SUBTITLE
  // Attribute Offer -> Loot (for Adventurers)
  // Collection Offer -> Collection
  // Token Offer -> Loot (for Adventurers)
  const subTitle =
    data?.attribute || data?.token ? data?.collection?.name : 'Collection'

  // If all executed succesfully, then success is true
  const success =
    !loading && steps && !steps.find(({ status }) => status === 'incomplete')

  const orderbookTitle =
    orderbook && `Submitting to ${orderbooks[orderbook[0]]}`
  const modalTitle = steps && orderbook ? orderbookTitle : title

  return (
    <Dialog.Content className="fixed inset-0 bg-[#000000b6]">
      <div className="border lg:w-[460px] md:w-[460px] w-full h-full transform text background p-11 shadow-md ">
        <div className="mb-4 flex center justify-between">
          <Dialog.Title className="reservoir-h4 text">{modalTitle}</Dialog.Title>
          <Dialog.Close
            onClick={onCloseCallback}
            className="btn-primary-outline text p-1.5"
          >
            <HiX className="h-5 w-5 " />
          </Dialog.Close>
        </div>
        {data && (
          <div className="mb-5 flex items-center gap-4">
            <img
              src={optimizeImage(
                data?.collection?.image || data?.token?.image,
                50
              )}
              className="w-[50px]"
            />
            <div className="overflow-auto">
              <div className="reservoir-body">{subTitle}</div>
              <div className="reservoir-h4 my-1.5">
                {/* If this is an offer modal, change */}
                {/* the header based on the type of offer */}
                {data?.attribute ? (
                  <>
                    <span>{data?.attribute?.key}: </span>
                    <span>{data?.attribute?.value}</span>
                  </>
                ) : data?.token ? (
                  data?.token?.name
                ) : (
                  data?.collection?.name
                )}
              </div>
              {data?.collection?.tokenCount && (
                <div className="reservoir-body mb-1.5">
                  {`${data?.collection?.tokenCount} Eligible Tokens`}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="reservoir-body mb-5 flex flex-wrap items-stretch gap-1.5">
          <TopOffer topBuyValue={data?.token?.topBuyValue} />
          <ListPrice floorSellValue={data?.token?.floorSellValue} />
        </div>
        {steps ? <Steps steps={steps} /> : children}
        {success ? (
          orderbook && orderbook?.length > 1 ? (
            <button onClick={onContinue} className="btn-primary-fill border w-full">
              Continue
            </button>
          ) : (
            <Dialog.Close
              onClick={onCloseCallback}
              className="btn-primary-outline w-full"
            >
              Success, Close this menu
            </Dialog.Close>
          )
        ) : (
          <div className="flex gap-4">
            <Dialog.Close
              onClick={onCloseCallback}
              className="btn-primary-outline text border w-full"
            >
              Cancel
            </Dialog.Close>
            {actionButton}
          </div>
        )}
      </div>
    </Dialog.Content>
  )
}

export default ModalCard

export const ListPrice = ({
  floorSellValue,
}: {
  floorSellValue: number | undefined
}) => {
  if (floorSellValue) {
    return (
      <div className="reservoir-label-m flex items-center gap-2 rounded-[8px] bg-[#E2CCFF] px-2 py-0.5 text-[#111827]">
        <span className="whitespace-nowrap">List Price</span>
        <div>
          <FormatEth
            amount={floorSellValue}
            maximumFractionDigits={4}
            logoWidth={7}
          />
        </div>
      </div>
    )
  }

  return null
}

export const TopOffer = ({
  topBuyValue,
}: {
  topBuyValue: number | undefined
}) => {
  if (topBuyValue) {
    return (
      <div className="reservoir-label-m flex items-center gap-2 rounded-[8px] bg-[#E2CCFF] px-2 py-0.5">
        <span className="whitespace-nowrap">Current Top Offer</span>
        <div>
          <FormatEth
            amount={topBuyValue}
            maximumFractionDigits={4}
            logoWidth={7}
          />
        </div>
      </div>
    )
  }

  return null
}
