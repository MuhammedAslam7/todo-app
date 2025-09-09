# 📝 To-Do List Application with User Authentication

This is a **full-stack To-Do List Application** built with **Node.js, Express, MongoDB, React, JWT, and Bcrypt**.  
Users can **sign up, log in, and manage their own to-do items**.

---

## 🚀 Features
- 🔐 User signup & login with JWT authentication  
- 🔑 Secure password hashing with bcrypt  
- 📝 CRUD operations for to-dos (Create, Read, Update, Delete)  
- 👤 Each user can only manage their own todos  
- ✅ To-do status: `pending` or `completed`  

---

## 🛠 Tech Stack
- **Backend:** Node.js, Express, MongoDB, JWT, Bcrypt  
- **Frontend:** React (Vite), 
- **Database:** MongoDB  

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/MuhammedAslam7/todo-app.git
cd todo-app
2️⃣ Backend Setup (Server)
bash
Copy code
cd server
npm install
Create a .env file inside the server/ folder:

env
Copy code
PORT=4001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
Run the backend:

bash
Copy code
npm run dev
The backend will start at 👉 http://localhost:4001

3️⃣ Frontend Setup (Client)
Open a new terminal and run:

bash
Copy code
cd client
npm install
Create a .env file inside the client/ folder:

env
Copy code
VITE_API_URL=http://localhost:4001
Run the frontend:

bash
Copy code
npm run dev
The frontend will start at 👉 http://localhost:5173

📌 API Endpoints
Auth
POST /auth/signup → Register user

POST /auth/login → Login (returns JWT)

Todos
GET /todo → Get all user todos

POST /todo/add-todo → Create a new todo

PUT /todo/:id → Update a todo

DELETE /todo/:id → Delete a todo

✅ Deliverables
GitHub repository link (this repo contains both client & server)


👨‍💻 Author
Muhammed Aslam

