import { GoogleOAuthProvider } from '@react-oauth/google';
import { useState } from 'react';
import axios from 'axios';
function SignUp() {
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
    
      const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          console.log('Signup form data:', formData);
          const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
          console.log('Signup successful:', response.data);
          localStorage.setItem('token', response.data.token);
          window.location.href = '/login';
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            console.error('Error during signup:', error.response.data);
          } else {
            console.error('Error during signup:', error);
          }
        }
      };
    
      const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
      };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
            <form className="max-w-md w-full bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md space-y-4" onSubmit={handleSignup}>
                <input type="text" name="firstName" placeholder="First Name" required
                    className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"  value={firstName} onChange={onChange}/>

                <input type="text" name="lastName" placeholder="Last Name" required
                    className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500" value={lastName} onChange={onChange} />

                <input type="text" name="username" placeholder="Username" required
                    className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500" value={username} onChange={onChange}/>

                <input type="email" name="email" placeholder="Email" required
                    className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500" value={email} onChange={onChange}/>

                <input type="text" name="phoneNumber" placeholder="Phone Number" required
                    className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500" value={phoneNumber} onChange={onChange}/>

                <input type="text" name="country" placeholder="Country" required
                    className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500" value={country} onChange={onChange}/>

                <input type="password" name="password" placeholder="Password" required
                    className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500" value={password} onChange={onChange}/>

                <button type="submit"
                    className="w-full bg-blue-700 text-white rounded-lg p-2.5 font-medium hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >Sign Up</button>

                <div className="w-full flex justify-center">
                    <GoogleOAuthProvider clientId="440747020610-2ckk9q2nsbk0s9977nmf7crvpgsf5uki.apps.googleusercontent.com">
                        <button type="button" onClick={handleGoogleLogin}
                            className="mt-4 w-full bg-red-600 text-white rounded-lg p-2.5 font-medium hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-700">Login with Google</button>
                    </GoogleOAuthProvider>
                </div>
            </form>
        </div>

    )
}

export default SignUp