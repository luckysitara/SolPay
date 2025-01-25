import express from "express"

const router = express.Router()

router.post("/support", async (req, res) => {
  try {
    const { walletAddress, message } = req.body
    const ticket = {
      walletAddress,
      message,
      createdAt: new Date(),
      status: "Open",
    }
    await global.db.collection("supportTickets").insertOne(ticket)
    res.status(201).json({ message: "Support ticket created successfully" })
  } catch (error) {
    console.error("Error creating support ticket:", error)
    res.status(500).json({ error: "Failed to create support ticket" })
  }
})

export default router

