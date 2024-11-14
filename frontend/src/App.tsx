import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Hero from './components/Hero'
import SignUp from './components/SignUp'
import Login from './components/Login'
import Landing from "./components/Landing";
import Demo from "./components/Demo";
import Admin from "./components/Admin";

function App() {
  return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/landing" element={<Landing />} />
        <Route path='/demo-request' element={<Demo />} />
        <Route path='/admin' element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
