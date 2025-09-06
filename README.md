# QuantumSecure - Web3 Quantum Security Platform

A comprehensive Web3 security platform featuring quantum key distribution, mainframe integration, and Cloudflare security monitoring.

## Features

### 🔐 Quantum Security
- Real-time quantum key distribution using BB84 protocol simulation
- Quantum entanglement monitoring
- Advanced cryptographic key management

### 🖥️ IBM Z Series Integration
- Mainframe system monitoring
- Job queue management
- Performance analytics
- Enterprise-grade security

### ☁️ Cloudflare Integration
- Real-time traffic monitoring
- DDoS protection analytics
- Global performance metrics
- Security threat detection

### 🌐 Web3 Features
- MetaMask wallet integration
- Blockchain connectivity
- Decentralized authentication

### 📊 Security Analytics
- Live network packet analysis
- Threat intelligence dashboard
- Security incident tracking
- Performance monitoring

### 💳 Payment Integration
- Stripe subscription management
- Premium feature access
- Secure payment processing

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (Supabase)
- **Payments**: Stripe
- **Edge Computing**: Cloudflare Workers
- **Deployment**: Cloudflare Pages

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Connect to Supabase using the "Connect to Supabase" button
5. Start development server: `npm run dev`

## Deployment

### Cloudflare Pages
1. Connect your repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables

### Cloudflare Workers
1. Install Wrangler CLI: `npm install -g wrangler`
2. Authenticate: `wrangler login`
3. Deploy: `wrangler deploy`

## Configuration Files

- `cloudflare.toml` - Cloudflare Pages configuration
- `wrangler.toml` - Cloudflare Workers configuration
- Security headers and caching rules included

## Security Features

- Content Security Policy (CSP)
- CORS protection
- XSS protection
- Frame options security
- SSL/TLS encryption
- DDoS protection via Cloudflare

## License

MIT License - see LICENSE file for details
