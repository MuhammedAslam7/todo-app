import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { SignupPage } from "./pages/SignUpPage"
import { LoginPage } from "./pages/LoginPage"
function App() {

 return (
  <>
  <Router>

    <Routes>
      <Route path="/" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

    </Routes>
  </Router>
  
  </>
 )
}

export default App
