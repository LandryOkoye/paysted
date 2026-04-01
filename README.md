# Paysted 🛡️

**Secure International Payments for the Modern Nigerian Workforce.**

Paysted is a specialized financial platform designed to empower gig workers, freelancers, and remote professionals in Nigeria. It bridges the gap between international clients and local financial needs by enabling users to receive funds in any format and instantly convert them into stablecoins (USDC/USDT), protecting their hard-earned income from foreign exchange (FX) instability and inflation.

---

## 🚀 The Mission

In an economy characterized by FX volatility, traditional banking often falls short for international freelancers. Paysted provides a "Safe Vault" where your money retains its value. Receive payments globally, hold them in stablecoin reserves, and withdraw to your local bank account only when you need to—at the best rates.

## ✨ Key Features

### 🏦 Safe Vault
- **Inflation Protection**: Hold your balances in USDC and USDT to hedge against Naira devaluation.
- **Multi-Asset Support**: Seamlessly manage different stablecoin assets in one place.
- **Real-time Valuation**: View your portfolio value in both USD and NGN.

### 📜 Smart Invoicing
- **Global Reach**: Generate professional payment links for international clients.
- **Simplified Receivables**: Clients pay in their preferred format; you receive in stablecoins.
- **Status Tracking**: Monitor pending, completed, and overdue invoices from a unified dashboard.

### 💸 Seamless Payouts
- **Direct-to-Bank**: Withdraw your stablecoin balance directly to any Nigerian bank account.
- **Competitive Rates**: Automated conversion at market-leading FX rates.
- **Instant Processing**: Minimize wait times for local liquidity.

### 📊 Comprehensive Insights
- **Transaction Ledger**: A detailed "Vault Ledger" for auditing every deposit, swap, and withdrawal.
- **Activity Feed**: Stay informed with real-time notifications on payment arrivals and payouts.

---

## 🛠️ Tech Stack

Paysted is built with a modern, high-performance stack:

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: React Context API

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/LandryOkoye/paysted.git
   cd paysted
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your configurations (Integrations for Busha Commerce, Database, etc.).

4. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the results.

---

## 🏗️ Architecture

- `src/app`: Contains the routing logic and page components using Next.js App Router.
- `src/components`: Reusable UI components (Sidebar, VaultCard, QuickActions, etc.).
- `src/context`: Global state management for currency and user preferences.
- `src/app/api`: Backend routes for handling invoices, payouts, and webhooks.

---

## 🗺️ Roadmap

- [ ] Full Integration with **Busha Commerce API**.
- [ ] Automated PostgreSQL balance synchronization.
- [ ] Mobile Application (React Native).
- [ ] Multi-currency support (EUR, GBP invoices).

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Developed with ❤️ for the Nigerian Gig Economy.
