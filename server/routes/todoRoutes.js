import express from "express"
import { addTodo, getTodos, updateTodo, deleteTodo } from "../controllers/todoController.js"
import { verifyAccessToken } from "../middlewares/jwtAuthentication.js"

const router = express.Router()

router.use(verifyAccessToken)

router.post("/add-todo", addTodo)
router.get("/", getTodos)
router.put("/:id", updateTodo)
router.delete("/:id", deleteTodo)

export default router
