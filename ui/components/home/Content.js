/* eslint no-unused-vars: [ "off", { "argsIgnorePattern": "tw" } ] */
import React from 'react'
import Link from 'next/link'
import { Container, Window } from '@hummingbot/hbui/elements/layout'
import { H5, P } from '@hummingbot/hbui/elements/typography'

const Content = () => (
  <Container variant='short'>
    <br/>
    <br/>
    <br/>
    <Window>
      <H5>Tips</H5>
      <br/>
      <P>This is a dark+light mode enabled project. Try clicking the sun/moon switcher in the navigation to try it out!</P>
      <br/>
      <P>Visit the <Link href='/instructions'>Instructions</Link> page to learn how to get started!</P>
    </Window>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
  </Container>
)

export default Content
