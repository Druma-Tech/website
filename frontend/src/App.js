import ApiUsageComponent from './components/ApiUsageComponent';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './components/Signup';
import Login from './components/Login';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ApiUsageComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
