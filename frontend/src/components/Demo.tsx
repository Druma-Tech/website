import React, { useState } from "react";
import { FaBuilding, FaUser, FaEnvelope, FaPhone, FaGlobe, FaPen } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

const Demo: React.FC = () => {
    const [formData, setFormData] = useState({
        contactName: "",
        companyName: "",
        email: "",
        phoneNumber: "",
        website: "",
        requestPurpose: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await axios.post('http://localhost:5000/api/auth/demo-request',formData);
        // console.log("Form Data Submitted:", response);
        toast.success(response.data.message);
        setFormData({
            contactName: "",
            companyName: "",
            email: "",
            phoneNumber: "",
            website: "",
            requestPurpose: ""
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
            <form className="max-w-lg w-full bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg space-y-6" onSubmit={handleSubmit}>
                <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white">Request a Demo</h2>

                <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        name="contactName"
                        placeholder="Contact Name"
                        required
                        className="w-full pl-10 p-2.5 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        value={formData.contactName}
                        onChange={handleChange}
                    />
                </div>

                <div className="relative">
                    <FaBuilding className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        name="companyName"
                        placeholder="Company Name"
                        required
                        className="w-full pl-10 p-2.5 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        value={formData.companyName}
                        onChange={handleChange}
                    />
                </div>

                <div className="relative">
                    <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        required
                        className="w-full pl-10 p-2.5 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="relative">
                    <FaPhone className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        required
                        className="w-full pl-10 p-2.5 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                </div>

                <div className="relative">
                    <FaGlobe className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        name="website"
                        placeholder="Company Website"
                        className="w-full pl-10 p-2.5 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        value={formData.website}
                        onChange={handleChange}
                    />
                </div>

                <div className="relative">
                    <FaPen className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                        name="requestPurpose"
                        placeholder="Purpose of Request"
                        required
                        className="w-full pl-10 p-2.5 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        value={formData.requestPurpose}
                        onChange={handleChange}
                        rows={4}
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-700 text-white rounded-lg p-3 font-medium hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Submit Request
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Demo;
