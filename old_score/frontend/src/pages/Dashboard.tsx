import type React from "react"
import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { getBalance, getTransactions, getKycStatus } from "../utils/api"
import TokenSwap from "../components/TokenSwap"

interface Transaction {
  signature: string
  amount: number
  date: Date
}

const Dashboard: React.FC = () => {
  const { publicKey } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [kycStatus, setKycStatus] = useState<"Not Started" | "In Progress" | "Completed">("Not Started")

  useEffect(() => {
    const fetchData = async () => {
      if (publicKey) {
        const address = publicKey.toBase58()
        const balanceData = await getBalance(address)
        setBalance(balanceData.balance)

        const transactionsData = await getTransactions(address)
        setTransactions(transactionsData)

        const kycData = await getKycStatus(address)
        setKycStatus(kycData.status)
      }
    }

    fetchData()
  }, [publicKey])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Merchant Dashboard</h1>
      {publicKey ? (
        <>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-bold mb-2">Wallet Overview</h2>
            <p>Address: {publicKey.toBase58()}</p>
            <p>Balance: {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}</p>
          </div>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-bold mb-2">Recent Transactions</h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Date</th>
                  <th className="text-left">Amount</th>
                  <th className="text-left">Signature</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.signature}>
                    <td>{tx.date.toLocaleString()}</td>
                    <td>{tx.amount.toFixed(4)} SOL</td>
                    <td>{tx.signature.slice(0, 8)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-bold mb-2">KYC Status</h2>
            <p>Status: {kycStatus}</p>
            {kycStatus !== "Completed" && (
              <button
                onClick={() => setKycStatus("In Progress")}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2"
              >
                Start KYC Process
              </button>
            )}
          </div>
          <TokenSwap />
        </>
      ) : (
        <p>Please connect your wallet to view the dashboard.</p>
      )}
    </div>
  )
}

export default Dashboard

