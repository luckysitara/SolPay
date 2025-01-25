import axios from "axios"

const API_BASE_URL = "http://localhost:3001" // Adjust this if your backend runs on a different port

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const getBalance = async (address: string) => {
  const response = await api.get(`/api/balance/${address}`)
  return response.data
}

export const getTransactions = async (address: string) => {
  const response = await api.get(`/api/transactions/${address}`)
  return response.data
}

export const createRecurringPayment = async (paymentData: any) => {
  const response = await api.post("/api/recurring-payments", paymentData)
  return response.data
}

export const getRecurringPayments = async (address: string) => {
  const response = await api.get(`/api/recurring-payments/${address}`)
  return response.data
}

export const deleteRecurringPayment = async (id: string) => {
  const response = await api.delete(`/api/recurring-payments/${id}`)
  return response.data
}

export const submitSupportTicket = async (ticketData: any) => {
  const response = await api.post("/api/support", ticketData)
  return response.data
}

export const getKycStatus = async (address: string) => {
  const response = await api.get(`/api/kyc-status/${address}`)
  return response.data
}

export const updateKycStatus = async (address: string, status: string) => {
  const response = await api.post("/api/kyc-status", { walletAddress: address, status })
  return response.data
}

export const getTokenSwapQuote = async (quoteData: any) => {
  const response = await api.post("/api/token-swap/quote", quoteData)
  return response.data
}

export const executeTokenSwap = async (swapData: any) => {
  const response = await api.post("/api/token-swap/execute", swapData)
  return response.data
}

export default api

