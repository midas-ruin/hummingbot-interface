# Hummingbot Interface

A Next.js interface for managing and assessing Hummingbot trading bots. This project aims to provide a modern, user-friendly interface for interacting with Hummingbot's trading functionality.

## Features

- Modern Next.js frontend
- TypeScript support
- Tailwind CSS styling
- Integration with Hummingbot API
- Secure authentication with Privy
- Comprehensive accessibility features
- Multi-factor authentication support
- Social and wallet login options

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   ```
   # Application settings
   NODE_ENV=development
   PORT=3000
   
   # API endpoints
   API_URL=http://localhost:8000
   
   # Privy authentication
   NEXT_PUBLIC_PRIVY_APP_ID=<your-privy-app-id>
   PRIVY_APP_SECRET=<your-privy-app-secret>
   ```
4. Sign up for a Privy account at [privy.io](https://privy.io) and obtain your app ID and secret
5. Run the development server: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Authentication & Security

This application uses Privy for secure authentication. Features include:

- Email, social, and wallet-based login options
- Multi-factor authentication
- Self-custodial embedded wallets
- Non-custodial key management
- Server-side token verification
- Secure session handling
- Content Security Policy (CSP)

## Accessibility

Hummingbot Interface is designed to be accessible for all users, with features including:

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Text size adjustment
- Reduced motion option
- ARIA attributes and landmarks
- Focus management

## Development

This project is under active development. To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Documentation

For more detailed documentation on using Privy authentication:

- [Privy React SDK Documentation](https://docs.privy.io/guide/react/getting-started)
- [Privy Authorization Guide](https://docs.privy.io/guide/react/authorization)
- [Securing Your Integration](https://docs.privy.io/guide/security/integration)

## License

This project is licensed under the MIT License - see the LICENSE file for details.