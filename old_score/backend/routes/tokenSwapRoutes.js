import express from "express"
import { PublicKey } from "@solana/web3.js"
import { Jupiter } from "@jup-ag/core"
import { solanaConnection } from "../server.js"

const router = express.Router()

let jupiterInstance

async function setupJupiter() {
  jupiterInstance = await Jupiter.load({
    connection: solanaConnection,
    cluster: "mainnet-beta",
    userPublicKey: null,
  })
}

setupJupiter()

router.post("/token-swap/quote", async (req, res) => {
  try {
    const { inputMint, outputMint, amount, slippage } = req.body

    const inputToken = new PublicKey(inputMint)
    const outputToken = new PublicKey(outputMint)

    const routes = await jupiterInstance.computeRoutes({
      inputMint: inputToken,
      outputMint: outputToken,
      amount,
      slippageBps: slippage,
    })

    if (routes.routesInfos.length === 0) {
      throw new Error("No routes found")
    }

    res.json(routes.routesInfos[0])
  } catch (error) {
    console.error("Error getting token swap quote:", error)
    res.status(500).json({ error: "Failed to get token swap quote" })
  }
})

router.post("/token-swap/execute", async (req, res) => {
  try {
    const { routeInfo, userPublicKey } = req.body

    const { execute } = await jupiterInstance.exchange({
      routeInfo,
      userPublicKey: new PublicKey(userPublicKey),
    })

    const swapResult = await execute()

    if ("txid" in swapResult) {
      res.json({
        success: true,
        transactionId: swapResult.txid,
        outputAmount: swapResult.outputAmount,
      })
    } else {
      throw new Error("Swap failed")
    }
  } catch (error) {
    console.error("Error executing token swap:", error)
    res.status(500).json({ error: "Failed to execute token swap" })
  }
})

export default router

