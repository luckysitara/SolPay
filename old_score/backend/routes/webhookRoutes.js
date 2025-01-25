import express from "express"
import { nanoid } from "nanoid"

const router = express.Router()

router.post("/register-webhook", async (req, res) => {
  try {
    const { merchantAddress, url } = req.body
    const webhookId = nanoid()
    const webhook = {
      id: webhookId,
      merchantAddress,
      url,
      createdAt: new Date(),
    }
    await global.db.collection("webhooks").insertOne(webhook)
    res.json({ webhookId })
  } catch (error) {
    console.error("Error registering webhook:", error)
    res.status(500).json({ error: "Failed to register webhook" })
  }
})

router.delete("/unregister-webhook/:webhookId", async (req, res) => {
  try {
    const { webhookId } = req.params
    await global.db.collection("webhooks").deleteOne({ id: webhookId })
    res.json({ message: "Webhook unregistered successfully" })
  } catch (error) {
    console.error("Error unregistering webhook:", error)
    res.status(500).json({ error: "Failed to unregister webhook" })
  }
})

export default router

