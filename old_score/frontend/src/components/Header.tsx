import type React from "react"
import { Link } from "react-router-dom"
import WalletConnect from "./WalletConnect"

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-gray-800 text-xl font-bold md:text-2xl hover:text-gray-700">
              SolPay
            </Link>
          </div>
          <WalletConnect />
        </div>
      </div>
    </header>
  )
}

export default Header

