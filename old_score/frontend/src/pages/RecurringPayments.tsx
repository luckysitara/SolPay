import type React from "react"
import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { getRecurringPayments, createRecurringPayment, deleteRecurringPayment } from "../utils/api"

interface RecurringPayment {
  id: string
  description: string
  amount: number
  frequency: "Daily" | "Weekly" | "Monthly"
  nextPayment: Date
  recipient: string
}

const RecurringPayments: React.FC = () => {
  const { publicKey } = useWallet()
  const [payments, setPayments] = useState<RecurringPayment[]>([])

  const [newPayment, setNewPayment] = useState({
    description: "",
    amount: 0,
    frequency: "Monthly" as "Daily" | "Weekly" | "Monthly",
    recipient: "",
  })

  useEffect(() => {
    const fetchPayments = async () => {
      if (publicKey) {
        const address = publicKey.toBase58()
        const paymentsData = await getRecurringPayments(address)
        setPayments(paymentsData)
      }
    }

    fetchPayments()
  }, [publicKey])

  const handleAddPayment = async () => {
    if (publicKey) {
      const paymentData = {
        walletAddress: publicKey.toBase58(),
        ...newPayment,
      }
      await createRecurringPayment(paymentData)
      // Refresh payments after adding
      const updatedPayments = await getRecurringPayments(publicKey.toBase58())
      setPayments(updatedPayments)
      setNewPayment({ description: "", amount: 0, frequency: "Monthly", recipient: "" })
    }
  }

  const handleCancelPayment = async (id: string) => {
    await deleteRecurringPayment(id)
    // Refresh payments after deleting
    if (publicKey) {
      const updatedPayments = await getRecurringPayments(publicKey.toBase58())
      setPayments(updatedPayments)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Recurring Payments</h1>
      {publicKey ? (
        <>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-bold mb-2">Current Recurring Payments</h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Description</th>
                  <th className="text-left">Amount (SOL)</th>
                  <th className="text-left">Frequency</th>
                  <th className="text-left">Next Payment</th>
                  <th className="text-left">Recipient</th>
                  <th className="text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.description}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.frequency}</td>
                    <td>{new Date(payment.nextPayment).toLocaleDateString()}</td>
                    <td>{payment.recipient.slice(0, 8)}...</td>
                    <td>
                      <button
                        onClick={() => handleCancelPayment(payment.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-bold mb-2">Add New Recurring Payment</h2>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newPayment.description}
                onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                placeholder="Description"
                className="border rounded px-2 py-1 flex-grow"
              />
              <input
                type="number"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: Number.parseFloat(e.target.value) })}
                placeholder="Amount (SOL)"
                className="border rounded px-2 py-1 w-24"
              />
              <select
                value={newPayment.frequency}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, frequency: e.target.value as "Daily" | "Weekly" | "Monthly" })
                }
                className="border rounded px-2 py-1"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
              <input
                type="text"
                value={newPayment.recipient}
                onChange={(e) => setNewPayment({ ...newPayment, recipient: e.target.value })}
                placeholder="Recipient address"
                className="border rounded px-2 py-1 flex-grow"
              />
              <button
                onClick={handleAddPayment}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Add Payment
              </button>
            </div>
          </div>
        </>
      ) : (
        <p>Please connect your wallet to manage recurring payments.</p>
      )}
    </div>
  )
}

export default RecurringPayments

