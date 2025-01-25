import type React from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import "@solana/wallet-adapter-react-ui/styles.css"

const WalletConnect: React.FC = () => {
  const { wallet } = useWallet()

  return (
    <div>
      <WalletMultiButton />
      {wallet && <span className="ml-2 text-sm text-gray-600">Connected: {wallet.adapter.name}</span>}
    </div>
  )
}

export default WalletConnect

