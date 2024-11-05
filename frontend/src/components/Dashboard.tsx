import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
    const [credits, setCredits] = useState(0);
    const [message, setMessage] = useState('');
    const [isRunning, setIsRunning] = useState(false); // Track if the task is running
    const intervalIdRef = useRef<null | NodeJS.Timeout>(null); // useRef to persist interval ID across renders
    const location = useLocation();
    const [secretKey, setSecretKey] = useState<string | null>(null);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const token = query.get('token');

        if (token) {
            localStorage.setItem('token', token);
        }

        if(localStorage.getItem('secretKey')) {
            setSecretKey(localStorage.getItem('secretKey'));
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

    const generateSecretKey = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/auth/generate-secret-key', {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSecretKey(response.data.secretKey);
            if (response.data.secretKey) {
                localStorage.setItem('secretKey', response.data.secretKey);
            }
            setMessage('Secret key generated. Use it for API requests.');
        } catch (error) {
            console.log('Error generating secret key:', error);
            setMessage('Failed to generate secret key.');
        }
    };

    const handleApiCall = async (apiEndpoint: string) => {
        try {
            const token = localStorage.getItem('token');
            const secretKey = localStorage.getItem('secretKey');

            if (!secretKey) {
                setMessage('Please generate a secret key before using the API.');
                return;
            }
            const startingCredits = await axios.get('http://localhost:5000/api/auth/user/credits', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            const initialResponse = await axios.post(`http://localhost:5000/api/auth/${apiEndpoint}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    secretKey: secretKey,
                },
            });

            const remainingCredits = initialResponse.data.credits;
            setCredits(remainingCredits);
            console.log(remainingCredits, initialResponse.data.apiCredits);
            if (startingCredits.data.credits < initialResponse.data.apiCredits) {
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

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="flex flex-col items-center p-8 space-y-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Available Credits: <span className="text-blue-600">{credits}</span>
                </h1>

                <div className="flex space-x-4">
                    <button
                        onClick={() => handleApiCall('api1')}
                        disabled={isRunning || credits < 10}
                        className={`px-4 py-2 text-white font-medium rounded-lg ${isRunning || credits < 10
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                    >
                        Use API One (10 credits)
                    </button>

                    <button
                        onClick={() => handleApiCall('api2')}
                        disabled={isRunning || credits < 20}
                        className={`px-4 py-2 text-white font-medium rounded-lg ${isRunning || credits < 20
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600'
                            }`}
                    >
                        Use API Two (20 credits)
                    </button>
                </div>

                {isRunning && (
                    <button
                        onClick={stopTask}
                        className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600"
                    >
                        Stop Task
                    </button>
                )}
                {!secretKey && (<button
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

        </div>
    );
};

export default Dashboard;
