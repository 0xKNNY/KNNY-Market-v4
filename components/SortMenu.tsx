import { toggleOffItem, toggleOnItem } from 'lib/router'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FC } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { FiChevronDown } from 'react-icons/fi'

type Props = {
  setSize: any
}

type Options = 'Highest Offer' | 'Lowest Price'

const options: { [x: string]: Options } = {
  lowest_price: 'Lowest Price',
  highest_offer: 'Highest Offer',
}

const SortMenu: FC<Props> = ({ setSize }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [sortSelection, setSortSelection] = useState<Options>('Highest Offer')

  useEffect(() => {
    const sort = router?.query['sort']?.toString()
    if (sort && options[sort]) {
      setSortSelection(options[sort])
      return
    }
    setSortSelection('Highest Offer')
  }, [router.query])

  return (
    <DropdownMenu.Root onOpenChange={setOpen}>
      <DropdownMenu.Trigger className="btn-primary-outline w-[228px] border justify-between text background px-4 py-3">
        <span className=" text">{sortSelection}</span>
        <FiChevronDown
          className={`h-5 w-5 text border background text transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        align="end"
        sideOffset={12}
        className="w-48 divide-y-[1px] divide-[#D1D5DB] overflow-hidden border background shadow-md radix-side-bottom:animate-slide-down md:w-56"
      >
        {Object.keys(options).map((key) => (
          <DropdownMenu.Item
            key={key}
            onClick={() => {
              setSize(0)
              if (key === 'highest_offer') {
                toggleOffItem(router, 'sort')
              } else {
                toggleOnItem(router, 'sort', key)
              }
            }}
            disabled={sortSelection === options[key]}
            className={`reservoir-h6 reservoir-gray-dropdown-item text background rounded-none ${
              sortSelection === options[key]
                ? 'cursor-not-allowed bg-gray-100'
                : ''
            }`}
            aria-label={`Sort by ${options[key]}`}
          >
            {options[key]}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default SortMenu
