import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'
import InfoModal from './InfoModal'

const COLLECTION = process.env.NEXT_PUBLIC_COLLECTION
const COMMUNITY = process.env.NEXT_PUBLIC_COMMUNITY
const NAVBAR_TITLE = process.env.NEXT_PUBLIC_NAVBAR_TITLE
const NAVBAR_LOGO = process.env.NEXT_PUBLIC_NAVBAR_LOGO
const META_TITLE = process.env.NEXT_PUBLIC_META_TITLE
const META_DESCRIPTION = process.env.NEXT_PUBLIC_META_DESCRIPTION
const OG_IMAGE = process.env.NEXT_PUBLIC_META_OG_IMAGE
const BANNER_IMAGE = process.env.NEXT_PUBLIC_BANNER_IMAGE
const TAGLINE = process.env.NEXT_PUBLIC_TAGLINE
const FONT_FAMILY = process.env.NEXT_PUBLIC_FONT_FAMILY
const PRIMARY_COLOR = process.env.NEXT_PUBLIC_PRIMARY_COLOR
const EXTERNAL_LINKS = process.env.NEXT_PUBLIC_EXTERNAL_LINKS

const InfoBanner = () => {
  const [open, setOpen] = useState(true)
  const router = useRouter()

  const envExists =
    COLLECTION ||
    COMMUNITY ||
    NAVBAR_TITLE ||
    NAVBAR_LOGO ||
    META_TITLE ||
    META_DESCRIPTION ||
    OG_IMAGE ||
    BANNER_IMAGE ||
    TAGLINE ||
    FONT_FAMILY ||
    PRIMARY_COLOR ||
    EXTERNAL_LINKS

  if (!envExists && open && router.pathname === '/') {
    
  }
  return null
}

export default InfoBanner
