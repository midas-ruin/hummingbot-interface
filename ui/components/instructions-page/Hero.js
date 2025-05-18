/* eslint no-unused-vars: [ "off", { "argsIgnorePattern": "tw" } ] */
import React from 'react'
import HeroBlock from '@hummingbot/hbui/components/hero/Hero'
import { H1, P } from '@hummingbot/hbui/elements/typography'

const Hero = () => (
  <HeroBlock containerVariant='short' tw='bg-window border-b border-body'>
    <H1 tw='leading-none'>Instructions</H1>
    <br/>
    <P>How to use this template</P>
  </HeroBlock>
)

export default Hero
