import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { Users, Droplet, Activity, ChevronDown, ChevronUp, Plus } from 'lucide-react';

const AdminDashboard = () => {
    const [inventory, setInventory] = useState([]);
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [showUsers, setShowUsers] = useState(false);
    const [showDonationForm, setShowDonationForm] = useState(false);
    const [stats, setStats] = useState({ users: 0, units: 0, pending: 0 });

    // Donation Form State
    const [donationData, setDonationData] = useState({ donor_email: '', blood_type: 'O+', units: 1 });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            // Fetch Inventory
            const invRes = await fetch('http://localhost:5000/api/inventory', { headers });
            if (invRes.ok) {
                const invData = await invRes.json();
                setInventory(invData);
                const totalUnits = invData.reduce((acc, curr) => acc + curr.units_available, 0);
                setStats(prev => ({ ...prev, units: totalUnits }));
            }

            // Fetch Requests
            const reqRes = await fetch('http://localhost:5000/api/requests/all', { headers });
            if (reqRes.ok) {
                const reqData = await reqRes.json();
                setRequests(reqData);
                const pendingCount = reqData.filter(r => r.status === 'pending').length;
                setStats(prev => ({ ...prev, pending: pendingCount }));
            }

            // Fetch User Count
            const userRes = await fetch('http://localhost:5000/api/users/count', { headers });
            if (userRes.ok) {
                const userData = await userRes.json();
                setStats(prev => ({ ...prev, users: userData.count }));
            }

            // Fetch All Users
            const allUsersRes = await fetch('http://localhost:5000/api/users/all', { headers });
            if (allUsersRes.ok) {
                const allUsersData = await allUsersRes.json();
                setUsers(allUsersData);
            }

        } catch (err) {
            console.error('Error fetching admin data', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/requests/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            fetchData(); // Refresh data
        } catch (err) {
            console.error('Error updating status', err);
        }
    };

    const handleRecordDonation = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/donations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(donationData)
            });

            if (res.ok) {
                alert('Donation recorded successfully!');
                setShowDonationForm(false);
                setDonationData({ donor_email: '', blood_type: 'O+', units: 1 });
                fetchData();
            } else {
                const err = await res.json();
                alert(err.message);
            }
        } catch (err) {
            console.error('Error recording donation', err);
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-heading font-bold text-gray-900">Admin Dashboard</h1>
                    <Button onClick={() => setShowDonationForm(!showDonationForm)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Record Donation
                    </Button>
                </div>

                {showDonationForm && (
                    <Card className="mb-8 border-primary/20 shadow-lg shadow-red-500/5 animate-in fade-in slide-in-from-top-4">
                        <h2 className="text-xl font-bold mb-4">Record New Donation</h2>
                        <form onSubmit={handleRecordDonation} className="grid gap-4 md:grid-cols-4 items-end">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Donor Email</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    placeholder="donor@example.com"
                                    value={donationData.donor_email}
                                    onChange={(e) => setDonationData({ ...donationData, donor_email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                                <select
                                    className="input-field"
                                    value={donationData.blood_type}
                                    onChange={(e) => setDonationData({ ...donationData, blood_type: e.target.value })}
                                >
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Units</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    min="1"
                                    value={donationData.units}
                                    onChange={(e) => setDonationData({ ...donationData, units: parseInt(e.target.value) })}
                                />
                            </div>
                            <Button className="md:col-span-4">Save Record</Button>
                        </form>
                    </Card>
                )}

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowUsers(!showUsers)}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-50 p-3 rounded-full">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Users</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
                                </div>
                            </div>
                            {showUsers ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center gap-4">
                            <div className="bg-red-50 p-3 rounded-full">
                                <Droplet className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Units</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.units}</p>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center gap-4">
                            <div className="bg-green-50 p-3 rounded-full">
                                <Activity className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Pending Requests</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {showUsers && (
                    <Card className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h2 className="text-xl font-bold mb-6">All Users</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b">
                                        <th className="pb-3 font-medium text-gray-500">Name</th>
                                        <th className="pb-3 font-medium text-gray-500">Email</th>
                                        <th className="pb-3 font-medium text-gray-500">Role</th>
                                        <th className="pb-3 font-medium text-gray-500">Phone</th>
                                        <th className="pb-3 font-medium text-gray-500">Blood Type</th>
                                        <th className="pb-3 font-medium text-gray-500">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td className="py-3 font-medium">{user.name}</td>
                                            <td className="py-3 text-gray-600">{user.email}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                        user.role === 'donor' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="py-3 text-gray-600">{user.phone}</td>
                                            <td className="py-3 font-bold text-gray-800">{user.blood_type || '-'}</td>
                                            <td className="py-3 text-gray-500 text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card className="h-full">
                            <h2 className="text-xl font-bold mb-6">Recent Requests</h2>
                            <div className="space-y-4">
                                {requests.length === 0 ? (
                                    <p className="text-gray-500">No requests found.</p>
                                ) : (
                                    requests.map(req => (
                                        <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <p className="font-medium">Request - {req.blood_type}</p>
                                                <p className="text-sm text-gray-500">
                                                    By {req.user_name} ({req.user_email}) • {new Date(req.created_at).toLocaleDateString()}
                                                </p>
                                                <p className={`text-xs font-bold mt-1 ${req.status === 'approved' ? 'text-green-600' :
                                                    req.status === 'declined' ? 'text-red-600' : 'text-yellow-600'
                                                    }`}>
                                                    {req.status.toUpperCase()}
                                                </p>
                                            </div>
                                            {req.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                                        onClick={() => handleStatusUpdate(req.id, 'declined')}
                                                    >
                                                        Deny
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleStatusUpdate(req.id, 'approved')}
                                                    >
                                                        Approve
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>

                    <div>
                        <Card className="h-full">
                            <h2 className="text-xl font-bold mb-6">Blood Inventory</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {inventory.map(item => (
                                    <div key={item.id} className="p-3 bg-gray-50 rounded-lg text-center">
                                        <p className="text-lg font-bold text-primary">{item.blood_type}</p>
                                        <p className="text-sm text-gray-600">{item.units_available} Units</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
