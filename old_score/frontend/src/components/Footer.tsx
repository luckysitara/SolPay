import type React from "react"

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-md mt-8">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">&copy; 2023 SolPay. All rights reserved.</p>
          </div>
          <div>
            <a href="#" className="text-gray-600 hover:text-gray-800 px-3">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800 px-3">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

