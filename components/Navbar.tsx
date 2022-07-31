import { FC } from 'react'
import ConnectWallet from './ConnectWallet'
import Link from 'next/link'
import SearchCollections from './SearchCollections'
import { useRouter } from 'next/router'


type Props = {
  communityId?: string
  mode: 'global' | 'community' | 'collection'
}

const title = process.env.NEXT_PUBLIC_NAVBAR_TITLE
const envLogo = process.env.NEXT_PUBLIC_NAVBAR_LOGO
const EXTERNAL_LINKS = process.env.NEXT_PUBLIC_EXTERNAL_LINKS || null



const Navbar: FC<Props> = ({ communityId, mode}) => {
  const router = useRouter()

  const logo = envLogo || '/reservoir.svg'
  const logoAlt = `${title} Logo` || 'Reservoir Logo'

  const externalLinks: { name: string; url: string }[] = []

  if (typeof EXTERNAL_LINKS === 'string') {
    const linksArray = EXTERNAL_LINKS.split(',')

    linksArray.forEach((link) => {
      let values = link.split('::')
      externalLinks.push({
        name: values[0],
        url: values[1],
      })
    })
  }



  const hasExternalLinks = externalLinks.length > 0

  const rule1 = mode === 'global' && router.pathname !== '/'

  const rule2 = mode === 'community'

  const displaySearch = rule1 || rule2


  
  return (
<div className="col-span-full">

<div>
    <Link href="/">
      <nav className="flex items-center py-2">
        <div className="px-5 flex">
            <h4 className="transparent">.</h4>
        </div>    
    </nav>
    </Link>
</div>

<div className="flex col-span-full items-center navbar border-b py-2">
  <Link href="/">
    <div className="px-5 flex pointer">
      <h4 className="grey">store.knny.io</h4>
      <h4 className="blink">_</h4>
    </div>
  </Link>
<div className="flex home-screen"><ConnectWallet/></div>


    
</div>
</div>
  )
}

export default Navbar
