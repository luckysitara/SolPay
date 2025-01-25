import express from "express"
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { solanaConnection } from "../server.js"

const router = express.Router()

router.post("/recurring-payments", async (req, res) => {
  try {
    const { walletAddress, description, amount, frequency, recipient } = req.body
    const payment = {
      walletAddress,
      description,
      amount,
      frequency,
      recipient,
      nextPayment: new Date(),
    }
    await global.db.collection("recurringPayments").insertOne(payment)
    res.status(201).json({ message: "Recurring payment created successfully" })
  } catch (error) {
    console.error("Error creating recurring payment:", error)
    res.status(500).json({ error: "Failed to create recurring payment" })
  }
})

router.get("/recurring-payments/:address", async (req, res) => {
  try {
    const { address } = req.params
    const payments = await global.db.collection("recurringPayments").find({ walletAddress: address }).toArray()
    res.json(payments)
  } catch (error) {
    console.error("Error fetching recurring payments:", error)
    res.status(500).json({ error: "Failed to fetch recurring payments" })
  }
})

router.delete("/recurring-payments/:id", async (req, res) => {
  try {
    const { id } = req.params
    await global.db.collection("recurringPayments").deleteOne({ _id: id })
    res.json({ message: "Recurring payment deleted successfully" })
  } catch (error) {
    console.error("Error deleting recurring payment:", error)
    res.status(500).json({ error: "Failed to delete recurring payment" })
  }
})

// This function should be called periodically (e.g., by a cron job)
async function processRecurringPayments() {
  try {
    const now = new Date()
    const payments = await global.db
      .collection("recurringPayments")
      .find({ nextPayment: { $lte: now } })
      .toArray()

    for (const payment of payments) {
      try {
        const fromPubkey = new PublicKey(payment.walletAddress)
        const toPubkey = new PublicKey(payment.recipient)

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports: payment.amount * LAMPORTS_PER_SOL,
          }),
        )

        const { blockhash } = await solanaConnection.getRecentBlockhash()
        transaction.recentBlockhash = blockhash
        transaction.feePayer = fromPubkey

        // Note: In a real-world scenario, you would need to implement a secure way to manage and use private keys
        // This is just a placeholder and should not be used in production
        const signedTransaction = await solanaConnection.sendAndConfirmTransaction(transaction, [
          /* Add necessary key pair */
        ])

        console.log(`Payment executed: ${signedTransaction}`)

        // Update the next payment date
        const nextPayment = new Date(payment.nextPayment)
        switch (payment.frequency) {
          case "Daily":
            nextPayment.setDate(nextPayment.getDate() + 1)
            break
          case "Weekly":
            nextPayment.setDate(nextPayment.getDate() + 7)
            break
          case "Monthly":
            nextPayment.setMonth(nextPayment.getMonth() + 1)
            break
        }

        await global.db.collection("recurringPayments").updateOne({ _id: payment._id }, { $set: { nextPayment } })
      } catch (error) {
        console.error(`Error processing payment for ${payment.walletAddress}:`, error)
      }
    }
  } catch (error) {
    console.error("Error processing recurring payments:", error)
  }
}

// Call processRecurringPayments every minute
setInterval(processRecurringPayments, 60000)

export default router

