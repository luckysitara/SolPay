import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"

dotenv.config()

const mongoClient = new MongoClient(process.env.MONGODB_URI)
let db

const solanaConnection = new Connection(process.env.SOLANA_RPC_URL)

async function connectToDatabase() {
  try {
    await mongoClient.connect()
    console.log("Connected to MongoDB")
    db = mongoClient.db("solpay")
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    process.exit(1)
  }
}

async function processRecurringPayments() {
  try {
    const now = new Date()
    const payments = await db
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

        // In a real-world scenario, you would need to implement a secure way to manage and use private keys
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

        await db.collection("recurringPayments").updateOne({ _id: payment._id }, { $set: { nextPayment } })
      } catch (error) {
        console.error(`Error processing payment for ${payment.walletAddress}:`, error)
      }
    }
  } catch (error) {
    console.error("Error processing recurring payments:", error)
  }
}

async function startRecurringPaymentsProcessor() {
  await connectToDatabase()

  setInterval(processRecurringPayments, 60000) // Run every minute
}

startRecurringPaymentsProcessor()

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    await mongoClient.close()
    console.log("MongoDB connection closed")
    process.exit(0)
  } catch (error) {
    console.error("Error during shutdown:", error)
    process.exit(1)
  }
})

