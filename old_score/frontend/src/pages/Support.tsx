import type React from "react"
import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { submitSupportTicket } from "../utils/api"

const FAQs = [
  {
    question: "How do I connect my wallet?",
    answer: 'Click on the "Connect Wallet" button in the top right corner and select your preferred wallet provider.',
  },
  {
    question: "What currencies are supported?",
    answer: "We currently support SOL and USDC. More currencies will be added in the future.",
  },
  {
    question: "How do I generate a QR code for payment?",
    answer: 'Go to the QR Code Generator page, enter the amount, and click "Generate QR Code".',
  },
  {
    question: "Is there a fee for using SolPay?",
    answer: "We charge a small fee of 1% per transaction. This fee helps us maintain and improve our services.",
  },
]

const Support: React.FC = () => {
  const [message, setMessage] = useState("")
  const { publicKey } = useWallet()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey) {
      alert("Please connect your wallet before submitting a support ticket.")
      return
    }

    try {
      await submitSupportTicket({
        walletAddress: publicKey.toBase58(),
        message: message,
      })
      alert("Support ticket submitted successfully!")
      setMessage("")
    } catch (error) {
      console.error("Error submitting support ticket:", error)
      alert("Failed to submit support ticket. Please try again later.")
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Support</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-bold mb-2">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQs.map((faq, index) => (
            <div key={index}>
              <h3 className="font-bold">{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-bold mb-2">Contact Support</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={4}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default Support

