import { Todo } from "../model/todoSchema.js"

export const addTodo = async (req, res) => {
  try {
    const { title, description } = req.body

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" })
    }

    const todo = new Todo({
      user: req.user.id,
      title: title.trim(),
      description: description?.trim() || "",
    })

    await todo.save()
    res.status(201).json({ message: "Todo created successfully", todo })
  } catch (error) {
    console.error("Add Todo Error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.status(200).json({ todos })
  } catch (error) {
    console.error("Get Todos Error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, completed } = req.body

    const todo = await Todo.findOne({ _id: id, user: req.user.id })

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" })
    }

    if (title !== undefined) todo.title = title.trim()
    if (description !== undefined) todo.description = description.trim()
    if (completed !== undefined) todo.completed = completed

    await todo.save()
    res.status(200).json({ message: "Todo updated successfully", todo })
  } catch (error) {
    console.error("Update Todo Error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params

    const todo = await Todo.findOneAndDelete({ _id: id, user: req.user.id })

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" })
    }

    res.status(200).json({ message: "Todo deleted successfully" })
  } catch (error) {
    console.error("Delete Todo Error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}
