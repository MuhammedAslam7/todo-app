import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { LoginPage } from "./pages/LoginPage"
import { TodoPage } from "./pages/TodoPage"
import { SignupPage } from "./pages/SignupPage"
import { ProtectedRoute } from "./hooks/ProtectedRoute"
import { Provider } from "react-redux"
import { store, persistor } from "./redux/store"
import { PersistGate } from "redux-persist/integration/react"

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/todo"
              element={
                <ProtectedRoute>
                  <TodoPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default App
