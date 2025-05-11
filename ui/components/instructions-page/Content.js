/* eslint no-unused-vars: [ "off", { "argsIgnorePattern": "tw" } ] */
import React from 'react'
import { Container, Window } from '@hummingbot/hbui/elements/layout'
import CodeBlock from '@hummingbot/hbui/components/code/CodeBlock'
import { H5, P } from '@hummingbot/hbui/elements/typography'
import { Button } from '@hummingbot/hbui/elements/buttons'

const Content = () => (
  <Container variant='short'>
    <br/>
    <br/>
    <br/>
    <Window>
      <H5>Getting started</H5>
      <br/>
      <P isBold>Clone the project</P>
      <br/>
      <CodeBlock code={code1} />
      <br/>
      <P isBold>Install dependencies</P>
      <br/>
      <CodeBlock code={code2} />
      <br/>
      <P isBold>Start the project</P>
      <br/>
      <CodeBlock code={code3} />
      <br/>
      <a href='https://github.com/CoinAlpha/hbui-boilerplate-nextjs' target='_blank' rel='noreferrer'>
        <Button variant='info'>
          Visit the Github site
        </Button>
      </a>
    </Window>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
  </Container>
)

export default Content

const code1 = String.raw`// replace some-folder-name with your desired folder name
git clone git@github.com:CoinAlpha/hbui-boilerplate-gatsby.git some-folder-name`

const code2 = String.raw`yarn`

const code3 = String.raw`yarn dev`
