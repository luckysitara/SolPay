import type React from "react"
import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import QRCode from "qrcode.react"

const QRCodeGenerator: React.FC = () => {
  const { publicKey } = useWallet()
  const [amount, setAmount] = useState("")
  const [qrValue, setQrValue] = useState("")

  const handleGenerateQR = () => {
    if (!publicKey) {
      alert("Please connect your wallet first")
      return
    }

    const solanaPayUrl = `solana:${publicKey.toBase58()}?amount=${Number(amount) * LAMPORTS_PER_SOL}&label=SolPay&message=Payment%20for%20services`
    setQrValue(solanaPayUrl)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">QR Code Generator</h1>
      <div className="mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount in SOL"
          className="border rounded px-2 py-1 mr-2"
        />
        <button
          onClick={handleGenerateQR}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Generate QR Code
        </button>
      </div>
      {qrValue && (
        <div>
          <QRCode value={qrValue} size={256} />
          <p className="mt-2 text-sm text-gray-600">Scan this QR code to make a payment</p>
        </div>
      )}
    </div>
  )
}

export default QRCodeGenerator

