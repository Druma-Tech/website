import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

interface User {
    secretKey?: string;
    credits?: number;
}

interface DashboardProps {
    user: User;
}

const Dashboard = ({ user }: DashboardProps) => {
    const [credits, setCredits] = useState(0);
    const [message, setMessage] = useState('');
    const [isRunning, setIsRunning] = useState(false); // Track if the task is running
    const intervalIdRef = useRef<null | NodeJS.Timeout>(null); // useRef to persist interval ID across renders
    const location = useLocation();
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const token = query.get('token');
        if (token) {
            localStorage.setItem('token', token);
        }
    }, [location]);

    useEffect(() => {
        const fetchUserCredits = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/auth/user/credits', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCredits(response.data.credits);
            } catch (err) {
                console.log(err);
            }
        };
        fetchUserCredits();
    }, []);

    const handleApiCall = async (apiEndpoint: string) => {
        try {
            const token = localStorage.getItem('token');
            const secretKey = user?.secretKey;
            console.log(user?.secretKey);
            if (!secretKey) {
                setMessage('Please generate a secret key before using the API.');
                return;
            }
            const startingCredits = user?.credits;

            const initialResponse = await axios.post(`http://localhost:5000/api/auth/${apiEndpoint}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    secretKey: secretKey,
                },
            });

            const remainingCredits = initialResponse.data.credits;
            setCredits(remainingCredits);
            console.log(remainingCredits, initialResponse.data.apiCredits);
            if (!startingCredits || startingCredits < initialResponse.data.apiCredits) {
                setMessage('Not enough credits to start the task.');
                return;
            } else {
                setMessage('Credits deducted. Task started.');
            }

            const clearIntervalIfExists = () => {
                if (intervalIdRef.current !== null) {
                    clearInterval(intervalIdRef.current);
                    intervalIdRef.current = null;
                }
            };

            const handleDeductCreditsError = (err: any) => {
                clearIntervalIfExists();
                const errorMessage = err.message || 'Error during task execution.';
                setMessage(errorMessage);
                setIsRunning(false);
            };

            const deductCredits = async () => {
                try {
                    const response = await axios.post(`http://localhost:5000/api/auth/${apiEndpoint}`, {}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            secretKey: secretKey,
                        },
                    });
                    console.log(response);
                    const newRemainingCredits = response.data.credits;
                    setCredits(newRemainingCredits);

                    const apiCredits = response.data.apiCredits;
                    console.log(newRemainingCredits, apiCredits);
                    if (newRemainingCredits < apiCredits) {
                        setMessage('Not enough credits to continue.');
                        clearIntervalIfExists();
                        setIsRunning(false);
                        return;
                    } else {
                        setMessage('Credits deducted. Task is still running.');
                    }
                } catch (err) {
                    handleDeductCreditsError(err);
                }
            };

            intervalIdRef.current = setInterval(deductCredits, 10000);
            console.log(intervalIdRef.current);
            setIsRunning(true);
        } catch (err) {
            const errorMessage = (err as any).response?.data?.message || 'Task failed to start.';
            setMessage(errorMessage);
        }
    };

    const stopTask = () => {
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
            setIsRunning(false);
            setMessage('Task stopped.');
        }
    };

    const rechargeCall = async (rechargeEndpoint: string) => {
        const response = await axios.post(`http://localhost:5000/api/auth/${rechargeEndpoint}`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                secretKey: user?.secretKey,
            },
        });
        // setCredits(response.data.credits);
        console.log(response.data.credits);
        setMessage('Credits recharged successfully.');
    };
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-full max-w-md flex flex-col items-center p-8 space-y-6 bg-white shadow-lg rounded-lg mx-auto">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Available Credits: <span className="text-blue-600">{credits}</span>
                </h1>

                <div className="flex space-x-4 w-full">
                    <button
                        onClick={() => handleApiCall('api1')}
                        disabled={isRunning || credits < 10}
                        className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isRunning || credits < 10
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                    >
                        Use API One (10 credits)
                    </button>

                    <button
                        onClick={() => handleApiCall('api2')}
                        disabled={isRunning || credits < 20}
                        className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isRunning || credits < 20
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600'
                            }`}
                    >
                        Use API Two (20 credits)
                    </button>

                    <button
                        onClick={() => window.location.href = 'test'}
                        disabled={isRunning || credits < 20}
                        className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isRunning || credits < 20
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600'
                            }`}
                    >
                        Use API Three (20 credits)
                    </button>                    
                </div>

                {message && (
                    <p className="mt-4 text-center text-gray-700 italic">
                        {message}
                    </p>
                )}

                {isRunning && (
                    <button
                        onClick={stopTask}
                        className="w-full px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600"
                    >
                        Stop Task
                    </button>
                )}
            </div>

            <div className="w-full max-w-md flex flex-col items-center p-8 space-y-6 bg-white shadow-lg rounded-lg mx-auto my-10">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Recharge Credits
                </h1>
                <div className="flex space-x-4 w-full">
                    <button
                        onClick={() => rechargeCall('recharge1')}
                        className="w-full px-4 py-2 text-white font-medium rounded-lg bg-blue-500 hover:bg-blue-600"
                    >
                        Recharge 100 credits
                    </button>
                    <button
                        onClick={() => rechargeCall('recharge2')}
                        className="w-full px-4 py-2 text-white font-medium rounded-lg bg-green-500 hover:bg-green-600"
                    >
                        Recharge 200 credits
                    </button>
                </div>
            </div>
        </div>

    )
};

export default Dashboard;
