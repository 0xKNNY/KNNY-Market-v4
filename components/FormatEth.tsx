import { BigNumberish } from 'ethers'
import { formatBN } from 'lib/numbers'
import { FC } from 'react'

type Props = {
  amount: BigNumberish | null | undefined
  maximumFractionDigits: number
  logoWidth?: number
}

const FormatEth: FC<Props> = ({ amount, maximumFractionDigits, logoWidth }) => {
  const value = formatBN(amount, maximumFractionDigits)
  return (
    <div className="">
      
      <span className="flex-grow text-black">{value}</span>
    </div>
  )
}

export default FormatEth
