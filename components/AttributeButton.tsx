import { toggleOffAttribute, toggleOnAttribute, updateAttribute } from 'lib/url'
import { useRouter } from 'next/router'
import { toggleOffItem } from 'lib/router'
import { FC } from 'react'
import { SWRInfiniteResponse } from 'swr/infinite/dist/infinite'

type Props = {
  children: React.ReactNode
  attribute: string
  value: string
  setTokensSize: SWRInfiniteResponse['setSize']
}

const AttributeButton: FC<Props> = ({
  children,
  attribute,
  value,
  setTokensSize,
}) => {
  const router = useRouter()

  return (
    <button
      onClick={() => {
        router.query?.attribute_key && toggleOffItem(router, 'attribute_key')
        // Update the URL queries
        if (!router.query[`attributes[${attribute}]`]) {
          toggleOnAttribute(router, attribute, value)
        } else {
          if (router.query[`attributes[${attribute}]`] === value) {
            toggleOffAttribute(router, attribute)
          } else {
            updateAttribute(router, attribute, value)
          }
        }
        setTokensSize(0)
      }}
      className={`flex w-full items-center justify-between gap-3 px-3 py-1 text-left ${
        router.query[`attributes[${attribute}]`] &&
        `${router.query[`attributes[${attribute}]`]}` === value
          ? 'bg-primary-100 hover:bg-primary-300'
          : 'hover:bg-primary-100'
      } 
        `}
    >
      {children}
    </button>
  )
}

export default AttributeButton
