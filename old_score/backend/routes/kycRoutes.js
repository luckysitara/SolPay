import express from "express"

const router = express.Router()

router.get("/kyc-status/:address", async (req, res) => {
  try {
    const { address } = req.params
    const kycStatus = await global.db.collection("kycStatus").findOne({ walletAddress: address })
    res.json({ status: kycStatus ? kycStatus.status : "Not Started" })
  } catch (error) {
    console.error("Error fetching KYC status:", error)
    res.status(500).json({ error: "Failed to fetch KYC status" })
  }
})

router.post("/kyc-status", async (req, res) => {
  try {
    const { walletAddress, status } = req.body
    await global.db.collection("kycStatus").updateOne({ walletAddress }, { $set: { status } }, { upsert: true })
    res.json({ message: "KYC status updated successfully" })
  } catch (error) {
    console.error("Error updating KYC status:", error)
    res.status(500).json({ error: "Failed to update KYC status" })
  }
})

export default router

