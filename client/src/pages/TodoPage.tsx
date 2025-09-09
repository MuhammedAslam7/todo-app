"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Trash2, Edit, Plus, CheckCircle, Circle } from "lucide-react"

// Types
interface TodoItem {
  id: string
  title: string
  description: string
  status: "pending" | "completed"
  createdAt: Date
  updatedAt: Date
}


const todoAPI = {
  // Get all todos
  getTodos: async (): Promise<TodoItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem("todos")
        const todos = stored ? JSON.parse(stored) : []
        resolve(todos)
      }, 300)
    })
  },

  // Create a new todo
  createTodo: async (data: { title: string; description: string }): Promise<TodoItem> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTodo: TodoItem = {
          id: Date.now().toString(),
          title: data.title,
          description: data.description,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        const stored = localStorage.getItem("todos")
        const todos = stored ? JSON.parse(stored) : []
        todos.push(newTodo)
        localStorage.setItem("todos", JSON.stringify(todos))

        resolve(newTodo)
      }, 300)
    })
  },

  // Update a todo
  updateTodo: async (id: string, data: Partial<TodoItem>): Promise<TodoItem> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const stored = localStorage.getItem("todos")
        const todos = stored ? JSON.parse(stored) : []
        const index = todos.findIndex((todo: TodoItem) => todo.id === id)

        if (index === -1) {
          reject(new Error("Todo not found"))
          return
        }

        todos[index] = { ...todos[index], ...data, updatedAt: new Date() }
        localStorage.setItem("todos", JSON.stringify(todos))

        resolve(todos[index])
      }, 300)
    })
  },

  // Delete a todo
  deleteTodo: async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const stored = localStorage.getItem("todos")
        const todos = stored ? JSON.parse(stored) : []
        const filteredTodos = todos.filter((todo: TodoItem) => todo.id !== id)

        if (filteredTodos.length === todos.length) {
          reject(new Error("Todo not found"))
          return
        }

        localStorage.setItem("todos", JSON.stringify(filteredTodos))
        resolve()
      }, 300)
    })
  },
}

export function TodoPage() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null)
  const [formData, setFormData] = useState({ title: "", description: "" })

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    try {
      setLoading(true)
      const data = await todoAPI.getTodos()
      setTodos(data)
    } catch (error) {
      console.error("Failed to load todos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTodo = async () => {
    if (!formData.title.trim()) {
      return
    }

    try {
      const newTodo = await todoAPI.createTodo(formData)
      setTodos((prev) => [...prev, newTodo])
      setFormData({ title: "", description: "" })
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Failed to create todo:", error)
    }
  }

  const handleEditTodo = async () => {
    if (!editingTodo || !formData.title.trim()) {
      return
    }

    try {
      const updatedTodo = await todoAPI.updateTodo(editingTodo.id, formData)
      setTodos((prev) => prev.map((todo) => (todo.id === editingTodo.id ? updatedTodo : todo)))
      setFormData({ title: "", description: "" })
      setEditingTodo(null)
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Failed to update todo:", error)
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      await todoAPI.deleteTodo(id)
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    } catch (error) {
      console.error("Failed to delete todo:", error)
    }
  }

  const handleToggleStatus = async (todo: TodoItem) => {
    const newStatus = todo.status === "pending" ? "completed" : "pending"
    try {
      const updatedTodo = await todoAPI.updateTodo(todo.id, { status: newStatus })
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updatedTodo : t)))
    } catch (error) {
      console.error("Failed to update todo status:", error)
    }
  }

  const openEditDialog = (todo: TodoItem) => {
    setEditingTodo(todo)
    setFormData({ title: todo.title, description: todo.description })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({ title: "", description: "" })
    setEditingTodo(null)
  }

  const pendingTodos = todos.filter((todo) => todo.status === "pending")
  const completedTodos = todos.filter((todo) => todo.status === "completed")

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading todos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Todo List</h1>
            <p className="text-muted-foreground mt-1">Manage your tasks efficiently</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Todo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Todo</DialogTitle>
                <DialogDescription>Add a new task to your todo list</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter todo title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter todo description (optional)"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTodo}>Create Todo</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                  <p className="text-2xl font-bold">{todos.length}</p>
                </div>
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Circle className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingTodos.length}</p>
                </div>
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Circle className="h-4 w-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{completedTodos.length}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Todo Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Todos */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Circle className="h-5 w-5 text-orange-600" />
              Pending Tasks ({pendingTodos.length})
            </h2>
            <div className="space-y-3">
              {pendingTodos.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No pending tasks</p>
                  </CardContent>
                </Card>
              ) : (
                pendingTodos.map((todo) => (
                  <Card key={todo.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <button
                              onClick={() => handleToggleStatus(todo)}
                              className="text-orange-600 hover:text-orange-700"
                            >
                              <Circle className="h-4 w-4" />
                            </button>
                            <h3 className="font-medium text-foreground">{todo.title}</h3>
                            <Badge variant="secondary">Pending</Badge>
                          </div>
                          {todo.description && (
                            <p className="text-sm text-muted-foreground mb-2 ml-6">{todo.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground ml-6">
                            Created: {new Date(todo.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(todo)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Completed Todos */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Completed Tasks ({completedTodos.length})
            </h2>
            <div className="space-y-3">
              {completedTodos.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No completed tasks</p>
                  </CardContent>
                </Card>
              ) : (
                completedTodos.map((todo) => (
                  <Card key={todo.id} className="hover:shadow-md transition-shadow opacity-75">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <button
                              onClick={() => handleToggleStatus(todo)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <h3 className="font-medium text-foreground line-through">{todo.title}</h3>
                            <Badge variant="default" className="bg-green-600">
                              Completed
                            </Badge>
                          </div>
                          {todo.description && (
                            <p className="text-sm text-muted-foreground mb-2 ml-6 line-through">{todo.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground ml-6">
                            Completed: {new Date(todo.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(todo)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Todo</DialogTitle>
              <DialogDescription>Update your task details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter todo title"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter todo description (optional)"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditTodo}>Update Todo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
