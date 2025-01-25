import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { Connection } from "@solana/web3.js"
import { MongoClient } from "mongodb"
import rateLimit from "express-rate-limit"
import balanceRoutes from "./routes/balanceRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js"
import recurringPaymentRoutes from "./routes/recurringPaymentRoutes.js"
import supportRoutes from "./routes/supportRoutes.js"
import kycRoutes from "./routes/kycRoutes.js"
import tokenSwapRoutes from "./routes/tokenSwapRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import webhookRoutes from "./routes/webhookRoutes.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

const mongoClient = new MongoClient(process.env.MONGODB_URI)
let db

export const solanaConnection = new Connection(process.env.SOLANA_RPC_URL)

app.use("/api", balanceRoutes)
app.use("/api", transactionRoutes)
app.use("/api", recurringPaymentRoutes)
app.use("/api", supportRoutes)
app.use("/api", kycRoutes)
app.use("/api", tokenSwapRoutes)
app.use("/api", paymentRoutes)
app.use("/api", webhookRoutes)

async function startServer() {
  try {
    await mongoClient.connect()
    console.log("Connected to MongoDB")
    db = mongoClient.db("solpay")
    global.db = db

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    process.exit(1)
  }
}

startServer()

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

