import type React from "react"
import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { getBalance, getTransactions, generatePaymentLink, registerWebhook, unregisterWebhook } from "../utils/api"
import QRCode from "qrcode.react"

interface Transaction {
  id: string
  amount: number
  customerAddress: string
  date: Date
  status: "completed" | "pending" | "failed"
}

interface Webhook {
  id: string
  url: string
}

const Dashboard: React.FC = () => {
  const { publicKey } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [paymentLink, setPaymentLink] = useState<string | null>(null)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [newWebhookUrl, setNewWebhookUrl] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      if (publicKey) {
        const address = publicKey.toBase58()
        const balanceData = await getBalance(address)
        setBalance(balanceData.balance)

        const transactionsData = await getTransactions(address)
        setTransactions(transactionsData)

        // Fetch webhooks (this would need to be implemented in the backend)
        // const webhooksData = await getWebhooks(address)
        // setWebhooks(webhooksData)
      }
    }

    fetchData()
  }, [publicKey])

  const handleGeneratePaymentLink = async () => {
    if (publicKey && paymentAmount) {
      const link = await generatePaymentLink(publicKey.toBase58(), Number(paymentAmount))
      setPaymentLink(link)
    }
  }

  const handleRegisterWebhook = async () => {
    if (publicKey && newWebhookUrl) {
      const result = await registerWebhook(publicKey.toBase58(), newWebhookUrl)
      setWebhooks([...webhooks, { id: result.webhookId, url: newWebhookUrl }])
      setNewWebhookUrl("")
    }
  }

  const handleUnregisterWebhook = async (webhookId: string) => {
    await unregisterWebhook(webhookId)
    setWebhooks(webhooks.filter((webhook) => webhook.id !== webhookId))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Merchant Dashboard</h1>
      {publicKey ? (
        <>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-bold mb-4">Wallet Overview</h2>
            <p className="mb-2">Address: {publicKey.toBase58()}</p>
            <p className="mb-4">Balance: {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}</p>
            <div className="mb-4">
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount in SOL"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              />
              <button
                onClick={handleGeneratePaymentLink}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Generate Payment Link
              </button>
            </div>
            {paymentLink && (
              <div className="mt-4">
                <p className="mb-2">Payment Link: {paymentLink}</p>
                <QRCode value={paymentLink} size={128} />
              </div>
            )}
          </div>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Date</th>
                  <th className="text-left">Amount</th>
                  <th className="text-left">Customer</th>
                  <th className="text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.date.toLocaleString()}</td>
                    <td>{tx.amount.toFixed(4)} SOL</td>
                    <td>{tx.customerAddress.slice(0, 8)}...</td>
                    <td>{tx.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-bold mb-4">Webhook Management</h2>
            <div className="mb-4">
              <input
                type="text"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                placeholder="Enter webhook URL"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              />
              <button
                onClick={handleRegisterWebhook}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Register Webhook
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Webhook URL</th>
                  <th className="text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {webhooks.map((webhook) => (
                  <tr key={webhook.id}>
                    <td>{webhook.url}</td>
                    <td>
                      <button
                        onClick={() => handleUnregisterWebhook(webhook.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                      >
                        Unregister
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>Please connect your wallet to view the dashboard.</p>
      )}
    </div>
  )
}

export default Dashboard

