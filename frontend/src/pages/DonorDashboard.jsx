import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { User, Calendar, Droplet, Clock } from 'lucide-react';
import config from '../config';

const DonorDashboard = () => {
    const [user, setUser] = useState(null);
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${config.API_URL}/users/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${config.API_URL}/donations/my-history`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setDonations(data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchProfile();
        fetchHistory();
    }, []);

    if (!user) return <Layout><div className="p-8 text-center">Loading...</div></Layout>;

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8">Donor Dashboard</h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="md:col-span-1">
                        <Card className="sticky top-24">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <User className="w-10 h-10 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold">{user.name}</h2>
                                <p className="text-gray-500">{user.email}</p>
                                <div className="mt-4 px-4 py-2 bg-red-50 text-primary rounded-full font-bold">
                                    Blood Type: {user.blood_type}
                                </div>
                            </div>
                            <div className="space-y-4 border-t pt-6">
                                <div className="flex items-center text-gray-600">
                                    <Droplet className="w-5 h-5 mr-3 text-gray-400" />
                                    <span>Total Donations: {donations.length}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                                    <span>Last Donation: {donations.length > 0 ? new Date(donations[0].donation_date).toLocaleDateString() : 'Never'}</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Action Card */}
                        <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white border-none">
                            <div className="flex flex-col md:flex-row items-center justify-between">
                                <div className="mb-6 md:mb-0">
                                    <h2 className="text-2xl font-bold mb-2">Ready to save a life?</h2>
                                    <p className="text-red-100">Your donation can save up to 3 lives. Check local camps or visit our center.</p>
                                </div>
                                <Button className="bg-white text-red-600 hover:bg-gray-100 border-none shadow-xl">
                                    Find Donation Center
                                </Button>
                            </div>
                        </Card>

                        {/* Donation History */}
                        <Card>
                            <h2 className="text-xl font-bold mb-6 flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-primary" />
                                Donation History
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="pb-3 font-medium text-gray-500">Date</th>
                                            <th className="pb-3 font-medium text-gray-500">Units</th>
                                            <th className="pb-3 font-medium text-gray-500">Location</th>
                                            <th className="pb-3 font-medium text-gray-500">Certificate</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {donations.length === 0 ? (
                                            <tr><td colSpan="4" className="py-4 text-center text-gray-500">No donations recorded yet.</td></tr>
                                        ) : (
                                            donations.map(d => (
                                                <tr key={d.id}>
                                                    <td className="py-4">{new Date(d.donation_date).toLocaleDateString()}</td>
                                                    <td className="py-4">{d.units} Unit(s)</td>
                                                    <td className="py-4 text-gray-600">Main Center</td>
                                                    <td className="py-4">
                                                        <button className="text-primary hover:underline font-medium text-sm">Download</button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DonorDashboard;
