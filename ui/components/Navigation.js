/* eslint no-unused-vars: [ "off", { "argsIgnorePattern": "tw" } ] */
import React from 'react'
// import styled, { css } from 'styled-components'
import NavBar from '@hummingbot/hbui/components/navigation/NavBar'
// import NavBar from './NavBar'
import Link from 'next/link'
// console.log('tw', tw)
// console.log('css', css)
const userData = null
const siteNameA = 'HBUI'
const siteNameB = 'Next.js Boilerplate'
const linksLeft = null
const linksRight = [
  { url: "/", label: "Home" },
  { url: "/instructions", label: "Instructions" },
]
const linkCTA = {
  label: 'CTA',
  url: '/instructions',
  external: false,
  buttonVariant: 'success',
}

function Navigation() {
  return (
    <NavBar
      linkClass={Link}
      showThemeToggle={true}
      siteNameA={siteNameA}
      siteNameB={siteNameB}
      userData={userData}
      linksLeft={linksLeft}
      linksRight={linksRight}
      linkCTA={linkCTA}
      position='relative'
      bgColor='transparent'
      containerVariant='short'
    />
  )
}

export default Navigation
