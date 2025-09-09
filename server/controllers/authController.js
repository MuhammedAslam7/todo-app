import bcrypt from "bcrypt"
import { User } from "../model/userSchema.js"
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "../utils/jwt-token.js"

export const signupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body
    if (!username || username.trim().length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters" })
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email address" })
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be atleast 8 characters" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use or user exists" })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ username, email, password: hashedPassword })
    await newUser.save()

    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const refreshToken = createRefreshToken(user)
    const accessToken = createAccessToken(user)

    res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        path: "/",
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 60 * 60 * 24 * 7 * 1000, 
      })
      .json({
        success: true,
        message: "You are logged in",
        accessToken,
        data: { user: { id: user._id, username: user.username, email: user.email } },
      })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" })
    }

    const decoded = verifyRefreshToken(refreshToken)
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    const newAccessToken = createAccessToken(user)

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      message: "Token refreshed successfully",
    })
  } catch (error) {
    console.error("Refresh token error:", error)
    res.status(403).json({ message: "Invalid refresh token" })
  }
}
