import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./utils/db.js"

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())

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


