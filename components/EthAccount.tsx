import { FC } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

/**
 * Ensure that an Ethereum address does not overflow
 * by removing the middle characters
 * @param address An Ethereum address
 * @param shrinkInidicator Visual indicator to show address is only
 * partially displayed
 * @returns A shrinked version of the Ethereum address
 * with the middle characters removed.
 */
export function shrinkAddress(address: string, shrinkInidicator?: string) {
  return address.slice(0, 4) + (shrinkInidicator || '…') + address.slice(-4)
}

/**
 * Ensure the ENS names do not overflow by removing the
 * middle characters
 * @param ensName An ENS name
 * @param shrinkInidicator Visual indicator to show address is only
 * partially displayed
 * @returns A shrinked version of the ENS name if and
 * and only if the ENS name is longer than 24 characters
 * such that the displayed string does not overflow
 */
function shrinkEns(ensName: string, shrinkInidicator?: string) {
  if (ensName.length < 24) return ensName

  return ensName.slice(0, 20) + (shrinkInidicator || '…') + ensName.slice(-3)
}

type Props = {
  address: string
  ens?: {
    avatar: string | null | undefined
    name: string | null | undefined
  }
  title?: string
  side?: 'left' | 'right'
  hideIcon?: boolean
}

const EthAccount: FC<Props> = ({
  address,
  ens,
  title,
  side = 'right',
  hideIcon,
}) => {
  const icon =
    !hideIcon &&
    (ens?.avatar ? (
      <img
        className="block h-6 w-6 rounded-full"
        src={ens.avatar}
        alt="ENS Avatar"
      />
    ) : (
      <Jazzicon diameter={24} seed={jsNumberForAddress(address)} />
    ))

  return (
    <div className="flex items-center gap-2">
      {title && (
        <p className="reservoir-label-l capitalize text-gray-400">{title}</p>
      )}
      {side === 'left' && icon}
      {ens?.name ? (
        <div title={address}>{shrinkEns(ens.name)}</div>
      ) : (
        <div
          className="reservoir-label-l block whitespace-nowrap font-mono"
          title={address}
        >
          {shrinkAddress(address)}
        </div>
      )}
      {side === 'right' && icon}
    </div>
  )
}

export default EthAccount
