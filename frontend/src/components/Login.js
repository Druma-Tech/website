import React, { useState } from 'react';
import axios from 'axios';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
      });
    
      const { email, password } = formData;
    
      const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleLogin = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
          console.log('Login successful:', response.data);
          localStorage.setItem('token', response.data.token);
          window.location.href = '/dashboard';
        } catch (error) {
          console.error('Error during login:', error.response.data);
        }
      };
  return (
    <form onSubmit={handleLogin}>
      <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
      <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  )
}

export default Login