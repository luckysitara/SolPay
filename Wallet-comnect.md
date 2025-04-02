
---

### **Frontend (React) Implementation**

#### **Step 1: Install Dependencies**
Start by installing the required packages for Solana wallet integration.

```bash
npm install @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets
```

#### **Step 2: Set Up Wallet Context**
Create a wallet provider to manage wallet connections.

1. **Add WalletProvider Code:**
   Create a file `WalletContext.js` in your React project:

   ```javascript
   import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
   import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
   import {
       PhantomWalletAdapter,
       SolflareWalletAdapter,
       TorusWalletAdapter,
   } from "@solana/wallet-adapter-wallets";
   import { clusterApiUrl } from "@solana/web3.js";
   import React, { useMemo } from "react";
   import "@solana/wallet-adapter-react-ui/styles.css";

   const WalletContext = ({ children }) => {
       const network = clusterApiUrl("devnet");

       // Initialize wallets
       const wallets = useMemo(
           () => [
               new PhantomWalletAdapter(),
               new SolflareWalletAdapter(),
               new TorusWalletAdapter(),
           ],
           []
       );

       return (
           <ConnectionProvider endpoint={network}>
               <WalletProvider wallets={wallets} autoConnect>
                   <WalletModalProvider>{children}</WalletModalProvider>
               </WalletProvider>
           </ConnectionProvider>
       );
   };

   export default WalletContext;
   ```

2. **Wrap Your App Component with WalletContext:**
   Update `index.js` or `App.js` to include the wallet provider:

   ```javascript
   import React from "react";
   import ReactDOM from "react-dom/client";
   import App from "./App";
   import WalletContext from "./WalletContext";

   ReactDOM.createRoot(document.getElementById("root")).render(
       <React.StrictMode>
           <WalletContext>
               <App />
           </WalletContext>
       </React.StrictMode>
   );
   ```

---

#### **Step 3: Add Wallet Connection Button**
Use the wallet adapter to add a wallet connection button.

1. **In App.js or a New Component:**

   ```javascript
   import React from "react";
   import { useWallet } from "@solana/wallet-adapter-react";
   import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

   const WalletConnect = () => {
       const { publicKey, disconnect } = useWallet();

       return (
           <div>
               <WalletMultiButton />
               {publicKey && (
                   <div>
                       <p>Connected: {publicKey.toBase58()}</p>
                       <button onClick={disconnect}>Disconnect</button>
                   </div>
               )}
           </div>
       );
   };

   export default WalletConnect;
   ```

---

### **Backend (Node.js) Implementation**

#### **Step 1: Handle Wallet Authentication**
Integrate wallet authentication by verifying a signed message.

1. **Install Dependencies:**
   ```bash
   npm install tweetnacl @solana/web3.js
   ```

2. **Create Wallet Verification Logic:**
   Add a route to verify the wallet connection and signature in your Node.js backend:

   ```javascript
   const nacl = require("tweetnacl");
   const { PublicKey } = require("@solana/web3.js");

   app.post("/verify-wallet", (req, res) => {
       const { publicKey, message, signature } = req.body;

       try {
           // Decode base64 strings to Uint8Arrays
           const pubKey = new PublicKey(publicKey).toBytes();
           const msg = new TextEncoder().encode(message);
           const sig = Buffer.from(signature, "base64");

           // Verify the signature
           const isValid = nacl.sign.detached.verify(msg, sig, pubKey);

           if (isValid) {
               return res.status(200).json({ success: true, message: "Wallet verified!" });
           } else {
               return res.status(400).json({ success: false, message: "Invalid signature" });
           }
       } catch (err) {
           return res.status(500).json({ success: false, error: err.message });
       }
   });
   ```

---

### **Step 2: Connect Frontend to Backend**

#### **Sign Message in Frontend:**
Allow users to sign a message using their wallet.

```javascript
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";

const WalletSignMessage = () => {
    const { publicKey, signMessage } = useWallet();
    const { connection } = useConnection();

    const signAndVerify = async () => {
        if (!publicKey || !signMessage) return alert("Wallet not connected!");

        const message = "Authenticate with SolPay";
        const encodedMessage = new TextEncoder().encode(message);

        try {
            const signature = await signMessage(encodedMessage);

            const response = await fetch("http://localhost:3000/verify-wallet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    publicKey: publicKey.toBase58(),
                    message,
                    signature: Buffer.from(signature).toString("base64"),
                }),
            });

            const data = await response.json();
            console.log(data);
        } catch (err) {
            console.error("Error signing message:", err);
        }
    };

    return <button onClick={signAndVerify}>Sign and Verify</button>;
};

export default WalletSignMessage;
```

---

### **Step 3: Manage Wallet State**
