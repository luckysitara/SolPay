import { Connection, PublicKey } from "@solana/web3.js"
import { Jupiter } from "@jup-ag/core"
import dotenv from "dotenv"

dotenv.config()

const connection = new Connection(process.env.SOLANA_RPC_URL)

async function setupJupiter() {
  const jupiter = await Jupiter.load({
    connection,
    cluster: "mainnet-beta",
    userPublicKey: null, // We'll set this for each request
  })

  return jupiter
}

let jupiterInstance

export async function getJupiterQuote(inputMint, outputMint, amount, slippage) {
  if (!jupiterInstance) {
    jupiterInstance = await setupJupiter()
  }

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

  return routes.routesInfos[0]
}

export async function executeJupiterSwap(routeInfo, userPublicKey) {
  if (!jupiterInstance) {
    jupiterInstance = await setupJupiter()
  }

  const { execute } = await jupiterInstance.exchange({
    routeInfo,
    userPublicKey: new PublicKey(userPublicKey),
  })

  const swapResult = await execute()

  if ("txid" in swapResult) {
    return {
      success: true,
      transactionId: swapResult.txid,
      outputAmount: swapResult.outputAmount,
    }
  } else {
    throw new Error("Swap failed")
  }
}

