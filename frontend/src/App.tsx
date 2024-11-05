import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Hero from './components/Hero'
import SignUp from './components/SignUp'
import Login from './components/Login'
import Dashboard from "./components/Dashboard";

function App() {
  return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
