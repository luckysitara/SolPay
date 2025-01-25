import type React from "react"
import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Connection } from "@solana/web3.js"

interface Notification {
  id: string
  message: string
  type: "success" | "error" | "info"
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { publicKey } = useWallet()

  useEffect(() => {
    if (!publicKey) return

    const connection = new Connection(process.env.REACT_APP_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com")

    const subscriptionId = connection.onLogs(
      publicKey,
      (logs) => {
        const newNotification: Notification = {
          id: Date.now().toString(),
          message: `New transaction: ${logs.signature}`,
          type: "success",
        }
        setNotifications((prevNotifications) => [...prevNotifications, newNotification])
      },
      "confirmed",
    )

    return () => {
      connection.removeOnLogsListener(subscriptionId)
    }
  }, [publicKey])

  const removeNotification = (id: string) => {
    setNotifications((prevNotifications) => prevNotifications.filter((notification) => notification.id !== id))
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`mb-2 p-4 rounded-md shadow-md ${
            notification.type === "success"
              ? "bg-green-500"
              : notification.type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
          } text-white`}
        >
          <p>{notification.message}</p>
          <button onClick={() => removeNotification(notification.id)} className="mt-2 text-sm underline">
            Dismiss
          </button>
        </div>
      ))}
    </div>
  )
}

export default Notifications

