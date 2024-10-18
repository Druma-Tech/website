import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ApiUsageComponent = () => {
  const [credits, setCredits] = useState(0);
  const [message, setMessage] = useState('');
  const [isRunning, setIsRunning] = useState(false); // Track if the task is running
  const intervalIdRef = useRef(null); // useRef to persist interval ID across renders
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

  const handleApiCall = async (apiEndpoint) => {
    try {
      const token = localStorage.getItem('token');
      
      const startingCredits = await axios.get('http://localhost:5000/api/auth/user/credits', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      const initialResponse = await axios.post(`http://localhost:5000/api/auth/${apiEndpoint}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
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

      const deductCredits = async () => {
        try {
          const response = await axios.post(`http://localhost:5000/api/auth/${apiEndpoint}`, {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response);
          const newRemainingCredits = response.data.credits;
          setCredits(newRemainingCredits);

          const apiCredits = response.data.apiCredits;
          console.log(newRemainingCredits, apiCredits);
          if (newRemainingCredits < apiCredits) {
            setMessage('Not enough credits to continue.');
            clearInterval(intervalIdRef.current);
            setIsRunning(false);
            intervalIdRef.current = null;
            return;
          } else {
            setMessage('Credits deducted. Task is still running.');
          }
        } catch (err) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null; 
          setMessage(err.message||'Error during task execution.');
          setIsRunning(false);
        }
      };

      intervalIdRef.current = setInterval(deductCredits, 10000);
      console.log(intervalIdRef.current);
      setIsRunning(true);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Task failed to start.');
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
    <div>
      <h1>User Credits: {credits}</h1>
      <button
        onClick={() => handleApiCall('api1')}
        disabled={isRunning} 
      >
        Use API One (10 credits)
      </button>

      <button
        onClick={() => handleApiCall('api2')}
        disabled={isRunning} 
      >
        Use API Two (20 credits)
      </button>

      {isRunning && (
        <button onClick={stopTask}>Stop Task</button>
      )}

      <p>{message}</p>
    </div>
  );
};

export default ApiUsageComponent;
