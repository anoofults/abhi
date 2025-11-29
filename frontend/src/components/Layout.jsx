import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, LogOut, Bell } from 'lucide-react';
import Button from './Button';

const Layout = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const fetchNotifications = async () => {
        if (!token) return;
        try {
            const res = await fetch('http://localhost:5000/api/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.is_read).length);
            }
        } catch (err) {
            console.error('Error fetching notifications', err);
        }
    };

    const markAsRead = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (err) {
            console.error('Error marking read', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-secondary flex flex-col">
            {/* Navbar */}
            <nav className="bg-white shadow-soft sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-2">
                                <div className="bg-red-50 p-2 rounded-full">
                                    <Heart className="h-6 w-6 text-primary fill-current" />
                                </div>
                                <span className="text-2xl font-heading font-bold text-gray-900">LifeFlow</span>
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className="text-gray-600 hover:text-primary font-medium transition-colors">Home</Link>
                            {user ? (
                                <>
                                    <Link to={user.role === 'admin' ? '/admin' : user.role === 'donor' ? '/donor' : '/recipient'} className="text-gray-600 hover:text-primary font-medium transition-colors">
                                        Dashboard
                                    </Link>

                                    {/* Notification Bell */}
                                    <div className="relative">
                                        <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-full hover:bg-gray-100 relative">
                                            <Bell className="w-5 h-5 text-gray-600" />
                                            {unreadCount > 0 && (
                                                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center border-2 border-white">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </button>

                                        {showNotifications && (
                                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                                                <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                                                    <h3 className="font-bold text-sm">Notifications</h3>
                                                    <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="max-h-64 overflow-y-auto">
                                                    {notifications.length === 0 ? (
                                                        <p className="px-4 py-4 text-sm text-gray-500 text-center">No notifications</p>
                                                    ) : (
                                                        notifications.map(n => (
                                                            <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors ${!n.is_read ? 'bg-red-50/50' : ''}`}>
                                                                <p className="text-sm text-gray-800">{n.message}</p>
                                                                <div className="flex justify-between items-center mt-1">
                                                                    <span className="text-xs text-gray-400">{new Date(n.created_at).toLocaleDateString()}</span>
                                                                    {!n.is_read && (
                                                                        <button onClick={() => markAsRead(n.id)} className="text-xs text-primary font-medium hover:underline">
                                                                            Mark read
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm font-medium text-gray-700">Hi, {user.name}</span>
                                        <Button variant="outline" size="sm" onClick={handleLogout}>
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition-colors">Login</Link>
                                    <Link to="/register">
                                        <Button>Register as Donor</Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-600 hover:text-primary p-2"
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100">
                        <div className="px-4 pt-2 pb-3 space-y-1">
                            <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md">Home</Link>
                            {user ? (
                                <>
                                    <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md">Dashboard</Link>
                                    <button onClick={handleLogout} className="w-full text-left block px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md">Login</Link>
                                    <Link to="/register" className="block px-3 py-2 text-base font-medium text-primary hover:bg-red-50 rounded-md">Register</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <div className="bg-red-50 p-2 rounded-full">
                                <Heart className="h-5 w-5 text-primary fill-current" />
                            </div>
                            <span className="text-xl font-heading font-bold text-gray-900">LifeFlow</span>
                        </div>
                        <div className="text-gray-500 text-sm">
                            © 2024 LifeFlow. Connecting donors, saving lives.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
