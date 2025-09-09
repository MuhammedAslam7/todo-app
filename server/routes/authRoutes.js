import express from "express"
import { loginUser, signupUser, refreshToken } from "../controllers/authController.js"

const router = express.Router()

router.post("/signup", signupUser)
router.post("/login", loginUser)
router.post("/refresh", refreshToken)

export default router
