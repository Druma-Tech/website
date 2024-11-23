// DemoRequesters.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface DemoRequest {
    _id: number;
    contactName: string,
    companyName: string,
    email: string;
    phoneNumber: string,
    requestPurpose: string,
    website: string,
    status: 'pending' | 'accepted' | 'declined';
}

const DemoRequesters: React.FC = () => {
    const [requests, setRequests] = useState<DemoRequest[]>([]);
    useEffect(() => {
        const fetchPendingRequests = async () => {
            const response = await fetch('http://localhost:5000/api/auth/pending-requests');
            const data = await response.json();
            setRequests(data.requests);
        };

        fetchPendingRequests();
    }, []); 

    const handleStatusChange = async (id: number, status: 'accepted' | 'declined') => {
        console.log(id, status);
        const response = await axios.put(`http://localhost:5000/api/auth/update-request-status`,{
            id: id,
            status: status
        });
        console.log(response.data);
        setRequests(requests.filter((request) => request._id !== id));
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Demo Requesters</h2>
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table className="min-w-full text-left">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-gray-500 font-medium">Name</th>
                            <th className="px-4 py-2 text-gray-500 font-medium">Email</th>
                            <th className="px-4 py-2 text-gray-500 font-medium">Company</th>
                            <th className="px-4 py-2 text-gray-500 font-medium">Purpose</th>
                            <th className="px-4 py-2 text-gray-500 font-medium">Status</th>
                            <th className="px-4 py-2 text-gray-500 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request._id} className="border-t">
                                <td className="px-4 py-2">{request.contactName}</td>
                                <td className="px-4 py-2">{request.email}</td>
                                <td className="px-4 py-2">{request.companyName}</td>
                                <td className="px-4 py-2">{request.requestPurpose}</td>
                                <td className="px-4 py-2 capitalize">{request.status}</td>
                                <td className="px-4 py-2 space-x-2">
                                    <button
                                        onClick={() => handleStatusChange(request._id, 'accepted')}
                                        className={`px-3 py-1 rounded-lg text-white ${request.status === 'accepted' ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                                        disabled={request.status === 'accepted'}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(request._id, 'declined')}
                                        className={`px-3 py-1 rounded-lg text-white ${request.status === 'declined' ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                                        disabled={request.status === 'declined'}
                                    >
                                        Decline
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DemoRequesters;
