import express from "express"
import { PublicKey } from "@solana/web3.js"
import { solanaConnection } from "../server.js"

const router = express.Router()

router.get("/transactions/:address", async (req, res) => {
  try {
    const { address } = req.params
    const publicKey = new PublicKey(address)
    const signatures = await solanaConnection.getSignaturesForAddress(publicKey, { limit: 10 })
    const transactions = await Promise.all(
      signatures.map(async (sig) => {
        const tx = await solanaConnection.getTransaction(sig.signature)
        return {
          signature: sig.signature,
          amount: tx.meta.postBalances[0] - tx.meta.preBalances[0],
          date: new Date(tx.blockTime * 1000),
        }
      }),
    )
    res.json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    res.status(500).json({ error: "Failed to fetch transactions" })
  }
})

export default router

