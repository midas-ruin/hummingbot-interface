import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

const About = () => {
  return (
    <Layout 
      title="About - Hummingbot Interface" 
      description="Learn about Hummingbot Interface and its features"
    >
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              About Hummingbot Interface
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              A modern, accessible interface for managing and assessing Hummingbot trading bots
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900" id="features-heading">Features</h2>
                <ul className="mt-4 space-y-2 text-gray-500" aria-labelledby="features-heading">
                  <li className="flex items-start">
                    <span className="h-6 flex items-center mr-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Modern Next.js frontend
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 flex items-center mr-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    TypeScript support
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 flex items-center mr-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Tailwind CSS styling
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 flex items-center mr-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Integration with Hummingbot API
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 flex items-center mr-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Secure authentication with Privy
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 flex items-center mr-3">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    WCAG 2.1 AA Accessibility compliance
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900" id="security-heading">Security & Accessibility</h2>
                <div className="mt-4 space-y-4 text-gray-500">
                  <p>
                    Hummingbot Interface prioritizes security and accessibility to provide a safe and inclusive experience for all users.
                  </p>
                  <h3 className="text-md font-medium text-gray-700">Security Features:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Secure authentication with Privy</li>
                    <li>Multi-factor authentication support</li>
                    <li>HTTPS enforcement</li>
                    <li>Content Security Policy (CSP)</li>
                    <li>Server-side token validation</li>
                  </ul>
                  <h3 className="text-md font-medium text-gray-700">Accessibility Features:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>WCAG 2.1 AA compliance</li>
                    <li>Keyboard navigation support</li>
                    <li>Screen reader compatibility</li>
                    <li>High contrast mode</li>
                    <li>Text size adjustment</li>
                    <li>Reduced motion option</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900" id="accessibility-statement">Accessibility Statement</h2>
            <div className="mt-4 text-gray-500 space-y-4">
              <p>
                Hummingbot Interface is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone, and applying the relevant accessibility standards.
              </p>
              <p>
                We aim to conform to level AA of the World Wide Web Consortium (W3C) Web Content Accessibility Guidelines (WCAG) 2.1. These guidelines explain how to make web content more accessible for people with disabilities, and more user-friendly for everyone.
              </p>
              <p>
                The guidelines have three levels of accessibility (A, AA and AAA). We've chosen Level AA as our target.
              </p>
              <h3 className="text-md font-medium text-gray-700 mt-4">How we're achieving this:</h3>
              <ul className="list-disc pl-5 space-y-2" aria-labelledby="accessibility-statement">
                <li>Semantic HTML structure for screen readers</li>
                <li>ARIA attributes to enhance accessibility</li>
                <li>Keyboard navigation support and visible focus states</li>
                <li>Sufficient color contrast ratios</li>
                <li>Text resizing support without loss of functionality</li>
                <li>Alternative text for images</li>
                <li>Form input labels and error handling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
