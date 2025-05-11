/* eslint no-unused-vars: [ "off", { "argsIgnorePattern": "tw" } ] */
import React from 'react'
import Layout from '../system/layout'
import { PageRoot, Section } from '@hummingbot/hbui/elements/layout'
import Navigation from '../ui/components/Navigation'
import Hero from '../ui/components/home/Hero'
import Content from '../ui/components/home/Content'

const IndexPage = () => (
  <Layout>
    <PageRoot>
      <Navigation />
      <Section>
        <Hero />
        <Content />
      </Section>
    </PageRoot>
  </Layout>
)

export default IndexPage

