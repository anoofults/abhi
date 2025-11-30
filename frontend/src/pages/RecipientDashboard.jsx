import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { Plus } from 'lucide-react';
import config from '../config';

const RecipientDashboard = () => {
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [requests, setRequests] = useState([]);
    const [bloodType, setBloodType] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.API_URL}/requests/my-requests`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            }
        } catch (err) {
            console.error('Failed to fetch requests', err);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.API_URL}/requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ blood_type: bloodType })
            });

            if (response.ok) {
                setShowRequestForm(false);
                fetchRequests();
                setBloodType('');
            }
        } catch (err) {
            console.error('Failed to create request', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'text-green-600 bg-green-50';
            case 'declined': return 'text-red-600 bg-red-50';
            default: return 'text-yellow-600 bg-yellow-50';
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-gray-900">Recipient Dashboard</h1>
                        <p className="text-gray-600">Manage your blood requests</p>
                    </div>
                    <Button onClick={() => setShowRequestForm(!showRequestForm)}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Request
                    </Button>
                </div>

                {showRequestForm && (
                    <Card className="mb-8 border-primary/20 shadow-lg shadow-red-500/5">
                        <h2 className="text-xl font-bold mb-4">Request Blood</h2>
                        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type Needed</label>
                                <select
                                    className="input-field"
                                    value={bloodType}
                                    onChange={(e) => setBloodType(e.target.value)}
                                    required
                                >
                                    <option value="">Select Type</option>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <Button disabled={loading}>{loading ? 'Submitting...' : 'Submit Request'}</Button>
                        </form>
                    </Card>
                )}

                <Card>
                    <h2 className="text-xl font-bold mb-6">My Requests</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="pb-3 font-medium text-gray-500">ID</th>
                                    <th className="pb-3 font-medium text-gray-500">Blood Type</th>
                                    <th className="pb-3 font-medium text-gray-500">Date</th>
                                    <th className="pb-3 font-medium text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {requests.length === 0 ? (
                                    <tr><td colSpan="4" className="py-4 text-center text-gray-500">No requests found.</td></tr>
                                ) : (
                                    requests.map(req => (
                                        <tr key={req.id}>
                                            <td className="py-4">#{req.id}</td>
                                            <td className="py-4 font-bold">{req.blood_type}</td>
                                            <td className="py-4">{new Date(req.created_at).toLocaleDateString()}</td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(req.status)}`}>
                                                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default RecipientDashboard;
