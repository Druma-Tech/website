import React, { useState } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider} from '@react-oauth/google';
// import env from 'react-dotenv';

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    country: '',
    password: '',
  });

  const { firstName, lastName, username, email, phoneNumber, country, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      console.log('Signup form data:', formData);
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      console.log('Signup successful:', response.data);
      localStorage.setItem('token', response.data.token);
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during signup:', error.response.data);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  // Handle Google OAuth response
  const handleGoogleSuccess = async (response) => {
    try {
      console.log(response)
      const res = await axios.get('http://localhost:5000/api/auth/google', { token: response.credential }, { withCredentials: true });
      console.log(res);
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error during Google login:', error.message);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google login failed:', error);
  };

  return (
    <form onSubmit={handleSignup}>
      <input type="text" name="firstName" value={firstName} onChange={onChange} placeholder="First Name" required />
      <input type="text" name="lastName" value={lastName} onChange={onChange} placeholder="Last Name" required />
      <input type="text" name="username" value={username} onChange={onChange} placeholder="Username" required />
      <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
      <input type="text" name="phoneNumber" value={phoneNumber} onChange={onChange} placeholder="Phone Number" required />
      <input type="text" name="country" value={country} onChange={onChange} placeholder="Country" required />
      <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
      <button type="submit">Sign Up</button>

      {/* Google OAuth Component */}
      <GoogleOAuthProvider clientId="440747020610-2ckk9q2nsbk0s9977nmf7crvpgsf5uki.apps.googleusercontent.com">
        <button onClick={handleGoogleLogin}>Login with Google</button>
      </GoogleOAuthProvider>
    </form>
  );
}

export default Signup;
