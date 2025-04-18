import CustomPieChart from "./CustomPieChart";
import Dashboard from "./Dashboard";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from "axios";

export default function Landing() {
    const location = useLocation();
    interface User {
        secretKey?: string;
        credits?: number;
    }
    interface ServiceData {
        name: string;
        value: number;
    }
    
    const [user, setUser] = useState<User | null>(null);
    const [service, setService] = useState<{ subscription: string; servicesUsed: ServiceData[] } | null>(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const token = query.get('token');
        if (token) {
            localStorage.setItem('token', token);
        }

        const userDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/auth/userDetails', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                setUser(response.data.user);
                setService(response.data.service);
            } catch (err) {
                console.log(err);
            }
        };
        userDetails();
    }, [location]);

    const generateSecretKey = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/auth/generate-secret-key', {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage('Secret key generated. Use it for API requests.');
        } catch (error) {
            console.log('Error generating secret key:', error);
            setMessage('Failed to generate secret key.');
        }
    };

    return (
        <div className="mx-20 py-10">
            <div className="flex items-center mb-10">
                <div className="flex flex-col">
                    <h1 className="text-6xl font-extrabold" style={{ color: "#3F3C3F" }}>Welcome to Your Dashboard</h1>
                    <p className="max-w-4xl mt-2 text-gray-500 dark:text-gray-400 text-2xl font-bold">
                        Streamline your service management with our user-friendly platform
                    </p>
                </div>
                <button className="ml-auto mr-2 px-6 py-3 bg-pink-400 text-white font-semibold rounded-3xl hover:bg-pink-500 border border-pink-200">
                    My Profile
                </button>
            </div>

            <div className="flex gap-4">
                <div className="w-1/4 rounded-lg flex flex-col items-center shadow-xl">
                    <img src="robot3.jpg" alt="hero" className="w-full h-full object-cover rounded-lg" />
                </div>

                <div className="grid grid-cols-2 gap-4 w-3/4 min-h-[200px] md:min-h-[300px] lg:min-h-[400px]">
                    <div className="bg-red-200 rounded-lg p-12 flex flex-col items-center h-full">
                        <h2 className="text-3xl text-red-800 font-extrabold">Monthly Subscription</h2>
                        <h2 className="text-3xl text-red-700 font-extrabold pt-8">{service ? service.subscription : "null"}</h2>
                    </div>
                    <div className="bg-green-200 rounded-lg p-12 flex flex-col items-center h-full">
                        <h3 className="text-3xl font-extrabold text-green-800">Notifications</h3>
                        <p className="text-3xl font-extrabold text-green-700 pt-8">Alerts and updates</p>
                    </div>
                    <div className="bg-yellow-200 rounded-lg p-12 flex flex-col items-center h-full">
                        <h3 className="text-3xl font-extrabold text-yellow-800 text-center">API Key</h3>
                        <p className="text-3xl text-yellow-700 font-extrabold pt-6 text-center break-words overflow-hidden w-full max-w-7xl">
                            {user ? user.secretKey : "null"}
                        </p>
                        {user && !user.secretKey && (<button
                            onClick={generateSecretKey}
                            className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600">
                            Generate Secret Key
                        </button>)}
                        {message && (
                            <p className="mt-4 text-center text-gray-700 italic">
                                {message}
                            </p>
                        )}
                    </div>
                    <div className="bg-purple-200 rounded-lg p-12 flex flex-col items-center h-full">
                        <h3 className="text-3xl font-extrabold text-purple-800">Messages</h3>
                        <p className="text-3xl font-extrabold pt-6 text-purple-700">New messages and chats</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 w-full pt-10 min-h-[200px] md:min-h-[300px] lg:min-h-[400px]">
                <div className="bg-black text-white rounded-lg flex flex-col items-center w-1/2 pt-10 shadow-xl">
                    {user && <Dashboard user={user} />}
                    {<h3 className="text-3xl font-extrabold">API Usage</h3>}
                </div>
                <div className="bg-gray-300 text-black rounded-lg flex flex-col items-center justify-center w-1/2 shadow-xl p-10">
                    <h3 className="text-3xl font-extrabold">Services Used</h3>
                    <p className="text-2xl font-bold pt-5">Account Balance: {user ? user.credits : 0} credits</p>
                    <div className="pt-6 w-full flex justify-center items-center">
                        {service && <CustomPieChart servicesUsed={service.servicesUsed}/>}
                    </div>
                </div>

            </div>
        </div>
    );
}
