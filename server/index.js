import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import { connectDB } from "./utils/db.js"
import authRoute from "./routes/authRoutes.js"
import todoRoute from "./routes/todoRoutes.js"

dotenv.config()
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
)

app.use("/auth", authRoute)
app.use("/todo", todoRoute)

const PORT = process.env.PORT || 4001;

(async function startServer() {
    try {
        await connectDB()
        app.listen(PORT,() => {
            console.log(`Server listening on port: ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
})();


