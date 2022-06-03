import { toggleOffAttribute } from 'lib/url'
import { useRouter } from 'next/router'
import React from 'react'
import { HiX } from 'react-icons/hi'

type Attribute = {
  key: string
  value: string
}[]

const AttributesFlex = () => {
  const router = useRouter()

  const [filters, setFilters] = React.useState<Attribute>([])

  React.useEffect(() => {
    let filters = Object.keys({ ...router.query }).filter(
      (key) =>
        key.startsWith('attributes[') &&
        key.endsWith(']') &&
        router.query[key] !== ''
    )

    setFilters(
      // Convert the queries into the tokens format
      filters.map((key) => {
        return {
          key: key.slice(11, -1),
          value: `${router.query[key]}`,
        }
      })
    )
  }, [router.query])

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map(({ key, value }) => {
        return (
          <div
            key={key}
            className="relative flex border "
          >
            <div className="reservoir-label-l flex text items-center border background justify-between gap-1.5 px-4 py-1 lg:py-2">
              <p className="capitalize">{key}</p>
              <p>{value}</p>
            </div>
            <button
              className="absolute -top-2.5 -right-2.5 rounded-full p-1 text border background transition hover:background-hover hover:text-transparent"
              onClick={() => toggleOffAttribute(router, key)}
            >
              <HiX className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default AttributesFlex
