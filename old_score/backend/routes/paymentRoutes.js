import express from "express"
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { nanoid } from "nanoid"
import { solanaConnection } from "../server.js"

const router = express.Router()

// Basic fraud detection
const isSuspiciousTransaction = (amount, customerAddress) => {
  // Example: Flag transactions above 1000 SOL as suspicious
  if (amount > 1000) return true

  // Example: Flag if a customer makes more than 10 transactions in the last hour
  // This would require keeping track of transactions per customer in a database
  // const recentTransactions = getRecentTransactions(customerAddress, 1) // 1 hour
  // if (recentTransactions > 10) return true

  return false
}

router.post("/generate-payment-link", async (req, res) => {
  try {
    const { merchantAddress, amount } = req.body
    const paymentId = nanoid()
    const paymentDetails = {
      id: paymentId,
      merchantAddress,
      amount,
      status: "pending",
      createdAt: new Date(),
    }
    await global.db.collection("payments").insertOne(paymentDetails)
    const paymentLink = `${process.env.FRONTEND_URL}/payment/${paymentId}`
    res.json({ paymentLink })
  } catch (error) {
    console.error("Error generating payment link:", error)
    res.status(500).json({ error: "Failed to generate payment link" })
  }
})

router.get("/payment-details/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params
    const paymentDetails = await global.db.collection("payments").findOne({ id: paymentId })
    if (!paymentDetails) {
      return res.status(404).json({ error: "Payment not found" })
    }
    res.json(paymentDetails)
  } catch (error) {
    console.error("Error fetching payment details:", error)
    res.status(500).json({ error: "Failed to fetch payment details" })
  }
})

router.post("/execute-payment", async (req, res) => {
  try {
    const { customerAddress, merchantAddress, amount } = req.body

    if (isSuspiciousTransaction(amount, customerAddress)) {
      console.warn(`Suspicious transaction detected: ${amount} SOL from ${customerAddress}`)
      // You might want to flag this transaction for review or take other actions
    }

    const fromPubkey = new PublicKey(customerAddress)
    const toPubkey = new PublicKey(merchantAddress)

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      }),
    )

    const { blockhash } = await solanaConnection.getRecentBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = fromPubkey

    res.json({ transaction: transaction.serialize({ requireAllSignatures: false }) })
  } catch (error) {
    console.error("Error executing payment:", error)
    res.status(500).json({ error: "Failed to execute payment" })
  }
})

export default router

