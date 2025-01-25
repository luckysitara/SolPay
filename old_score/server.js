import dotenv from "dotenv"
dotenv.config()
// ... (previous imports)
import { getJupiterQuote, executeJupiterSwap } from "./tokenSwap.js"
import { Connection } from "@solana/web3.js"

// ... (previous code)

const solanaConnection = new Connection(process.env.SOLANA_RPC_URL)

app.post("/api/token-swap/quote", async (req, res) => {
  try {
    const { inputMint, outputMint, amount, slippage } = req.body
    const quote = await getJupiterQuote(inputMint, outputMint, amount, slippage, solanaConnection)
    res.json(quote)
  } catch (error) {
    console.error("Error getting token swap quote:", error)
    res.status(500).json({ error: "Failed to get token swap quote" })
  }
})

app.post("/api/token-swap/execute", async (req, res) => {
  try {
    const { routeInfo, userPublicKey } = req.body
    const result = await executeJupiterSwap(routeInfo, userPublicKey, solanaConnection)
    res.json(result)
  } catch (error) {
    console.error("Error executing token swap:", error)
    res.status(500).json({ error: "Failed to execute token swap" })
  }
})

// ... (rest of the code)

