import express from "express"
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { solanaConnection } from "../server.js"

const router = express.Router()

router.get("/balance/:address", async (req, res) => {
  try {
    const { address } = req.params
    const publicKey = new PublicKey(address)
    const balance = await solanaConnection.getBalance(publicKey)
    res.json({ balance: balance / LAMPORTS_PER_SOL })
  } catch (error) {
    console.error("Error fetching balance:", error)
    res.status(500).json({ error: "Failed to fetch balance" })
  }
})

export default router

