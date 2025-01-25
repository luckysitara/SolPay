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

export const generatePaymentLink = async (merchantAddress: string, amount: number) => {
  const response = await api.post("/api/generate-payment-link", { merchantAddress, amount })
  return response.data.paymentLink
}

export const getPaymentDetails = async (paymentId: string) => {
  const response = await api.get(`/api/payment-details/${paymentId}`)
  return response.data
}

export const executePayment = async (customerAddress: string, merchantAddress: string, amount: number) => {
  const response = await api.post("/api/execute-payment", { customerAddress, merchantAddress, amount })
  return response.data.transaction
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

export const registerWebhook = async (merchantAddress: string, url: string) => {
  const response = await api.post("/api/register-webhook", { merchantAddress, url })
  return response.data
}

export const unregisterWebhook = async (webhookId: string) => {
  const response = await api.delete(`/api/unregister-webhook/${webhookId}`)
  return response.data
}

export default api

