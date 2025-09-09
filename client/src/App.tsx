import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { LoginPage } from "./pages/LoginPage"
import { TodoPage } from "./pages/TodoPage"
import { SignupPage } from "./pages/SignupPage"
function App() {

 return (
  <>
  <Router>

    <Routes>
      <Route path="/" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/todo" element={<TodoPage />} />

    </Routes>
  </Router>
  
  </>
 )
}

export default App
