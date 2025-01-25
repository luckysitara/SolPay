import type React from "react"
import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { getTokenSwapQuote, executeTokenSwap } from "../utils/api"

const TokenSwap: React.FC = () => {
  const { publicKey, signTransaction } = useWallet()
  const [inputAmount, setInputAmount] = useState("")
  const [outputAmount, setOutputAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSwap = async () => {
    if (!publicKey || !signTransaction) {
      alert("Please connect your wallet")
      return
    }

    setIsLoading(true)

    try {
      const quoteData = {
        inputMint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"), // USDC
        outputMint: new PublicKey("So11111111111111111111111111111111111111112"), // SOL
        amount: Number.parseInt(inputAmount) * 1e6, // USDC has 6 decimals
        slippage: 50, // 0.5% slippage
      }

      const quote = await getTokenSwapQuote(quoteData)

      const swapResult = await executeTokenSwap({
        routeInfo: quote,
        userPublicKey: publicKey.toBase58(),
      })

      if (swapResult.success) {
        setOutputAmount((Number(swapResult.outputAmount) / 1e9).toFixed(4)) // SOL has 9 decimals
        alert(`Swap executed successfully. Transaction ID: ${swapResult.transactionId}`)
      } else {
        throw new Error("Swap failed")
      }
    } catch (error) {
      console.error("Error executing swap:", error)
      alert("Error executing swap. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Token Swap</h2>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
          placeholder="USDC amount"
          className="border rounded px-2 py-1"
        />
        <span>USDC</span>
        <span>→</span>
        <input
          type="text"
          value={outputAmount}
          readOnly
          placeholder="SOL amount"
          className="border rounded px-2 py-1 bg-gray-100"
        />
        <span>SOL</span>
        <button
          onClick={handleSwap}
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          {isLoading ? "Swapping..." : "Swap"}
        </button>
      </div>
    </div>
  )
}

export default TokenSwap

