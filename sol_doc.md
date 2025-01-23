SolPay

---

# **SolPay Documentation**

## **Introduction**
SolPay is a decentralized payment gateway built on the Solana blockchain. It enables merchants to accept and manage payments seamlessly in Solana tokens with low fees, fast transactions, and user-friendly wallet integration. SolPay integrates key features like Tiplink wallets and Jupiter for token swaps, ensuring a smooth payment experience for merchants and customers alike.

---

## **Table of Contents**
1. [Key Features](#key-features)  
2. [System Architecture](#system-architecture)  
3. [Tech Stack](#tech-stack)  
4. [Installation and Setup](#installation-and-setup)  
5. [Smart Contract Design](#smart-contract-design)  
6. [Backend Development](#backend-development)  
7. [Frontend Development](#frontend-development)  
8. [Integration of Tiplink and Jupiter](#integration-of-tiplink-and-jupiter)  
9. [Testing](#testing)  
10. [Deployment](#deployment)  

---

## **1. Key Features**
### **For Merchants:**
- Simple account creation and wallet setup.  
- Low transaction fees powered by the Solana blockchain.  
- Real-time analytics for payment tracking.  

### **For Customers:**
- Secure, fast payments using Solana tokens.  
- Ability to swap tokens seamlessly during payment.  

---

## **2. System Architecture**
### **High-Level Architecture:**
1. **Frontend**: React + Vite for a responsive UI.  
2. **Backend**: Node.js handles APIs, wallet authentication, and transaction processing.  
3. **Smart Contracts**: Deployed on Solana using Anchor to manage payment transactions.  
4. **Integration Services**:  
   - Tiplink: Simplifies wallet onboarding.  
   - Jupiter: Enables token swaps for flexible payments.  

---

## **3. Tech Stack**
- **Blockchain**: Solana (Anchor Framework).  
- **Frontend**: React, Vite, Tailwind CSS.  
- **Backend**: Node.js with Express.  
- **Database**: PostgreSQL (for storing user data, payment history).  
- **Wallet Integration**: Tiplink APIs.  
- **Swap Integration**: Jupiter APIs.  

---

## **4. Installation and Setup**
### Prerequisites:
- Node.js >= 18.0.0  
- Yarn or npm  
- Solana CLI v1.18.26  
- Anchor CLI  

### Steps:
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/luckysitara/SolPay.git
   cd SolPay
   ```

2. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. **Set Environment Variables**:
   Create a `.env` file for both `frontend` and `backend`:
   ```env
   REACT_APP_BACKEND_URL=http://localhost:5000
   DATABASE_URL=postgresql://username:password@localhost:5432/solpay
   TIPLINK_API_KEY=your_tiplink_api_key
   JUPITER_API_KEY=your_jupiter_api_key
   ```

4. **Start the Services**:
   - **Frontend**:
     ```bash
     cd frontend
     npm start
     ```
   - **Backend**:
     ```bash
     cd backend
     npm run dev
     ```

5. **Deploy Smart Contracts**:
   ```bash
   anchor build
   anchor deploy
   ```

---

## **5. Smart Contract Design**
### Key Components:
1. **Merchant Account Initialization**:  
   Handles merchant registration and wallet setup.  
2. **Payment Processor**:  
   Manages customer payments, token swaps, and escrow for refunds.  
3. **Fee Distribution**:  
   Allocates transaction fees to platform owners and merchants.  

### Code Example:
**`processor.rs`**:
```rust
pub fn process_payment(ctx: Context<ProcessPayment>, amount: u64) -> Result<()> {
    let merchant = &ctx.accounts.merchant;
    let user = &ctx.accounts.user;
    let platform_fee = amount / 100; // 1% fee

    // Transfer amount minus fee to merchant
    token::transfer(ctx.accounts.into_transfer_to_merchant(), amount - platform_fee)?;

    // Transfer fee to platform
    token::transfer(ctx.accounts.into_transfer_to_platform(), platform_fee)?;

    Ok(())
}
```

---

## **6. Backend Development**
### Features:
1. **User Authentication**:  
   Implement OAuth or JWT for secure login.  

2. **Payment API**:  
   Endpoints to handle payment requests, status checks, and refund processing.

**Sample Route**:
```javascript
app.post('/api/payments', async (req, res) => {
  const { merchantId, amount } = req.body;

  // Interact with Solana smart contract
  const transaction = await processPayment(merchantId, amount);
  res.status(200).send({ transaction });
});
```

---

## **7. Frontend Development**
### Features:
1. **Merchant Dashboard**:  
   Displays transaction history, analytics, and wallet balance.  

2. **Customer Payment Flow**:  
   User-friendly interface for selecting tokens, swapping, and completing payments.  

**Sample Code**:
```jsx
import React, { useState } from 'react';

function PaymentForm() {
  const [amount, setAmount] = useState('');

  const handlePayment = async () => {
    const response = await fetch('/api/payments', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
}

export default PaymentForm;
```

---

## **8. Integration of Tiplink and Jupiter**
### **Tiplink Integration**:
- Simplifies wallet setup for new users.  
- Use Tiplink SDK to generate wallet links during onboarding.

**Code**:
```javascript
const tiplink = new Tiplink({ apiKey: process.env.TIPLINK_API_KEY });
const wallet = await tiplink.createWallet();
```

### **Jupiter Integration**:
- Enables token swaps during payment.

**Code**:
```javascript
const jupiter = new Jupiter({ apiKey: process.env.JUPITER_API_KEY });
const swapResult = await jupiter.swap({
  fromToken: 'USDC',
  toToken: 'SOL',
  amount: 1000,
});
```

---

## **9. Testing**
### **Smart Contracts**:
Run Anchor tests:
```bash
anchor test
```

### **Backend**:
Use Jest or Mocha:
```bash
npm test
```

### **Frontend**:
Test UI components with React Testing Library:
```bash
npm run test
```

---

## **10. Deployment**
### **Smart Contracts**:
Deploy to **Devnet**:
```bash
solana config set --url https://api.devnet.solana.com
anchor deploy
```

### **Backend**:
Deploy on **Vercel** or **Render**.

### **Frontend**:
Deploy React app using **Vercel** or **Netlify**:
```bash
npm run build
```

---

SolPay
