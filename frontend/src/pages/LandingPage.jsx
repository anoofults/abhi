import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import { Heart, Activity, Users, Calendar } from 'lucide-react';

const LandingPage = () => {
    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-red-50 to-white py-20 lg:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-red-100 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                            <Heart className="w-4 h-4 fill-current" />
                            <span>Save a life today</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-heading font-bold text-gray-900 mb-6 leading-tight">
                            Your Blood Can <span className="text-primary">Save Lives</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                            Join our community of heroes. Whether you're a donor or someone in need,
                            LifeFlow connects you instantly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register">
                                <Button className="w-full sm:w-auto text-lg px-8 py-4 shadow-xl shadow-red-500/20">
                                    Register as Donor
                                </Button>
                            </Link>
                            <Link to="/register?role=recipient">
                                <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-4">
                                    Request Blood
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-red-200/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-red-200/30 rounded-full blur-3xl"></div>
            </section>

            {/* Features */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Users className="w-8 h-8 text-primary" />}
                            title="Community Driven"
                            description="Connect directly with donors and recipients in your local area."
                        />
                        <FeatureCard
                            icon={<Activity className="w-8 h-8 text-primary" />}
                            title="Real-time Availability"
                            description="Check blood inventory and donor availability instantly."
                        />
                        <FeatureCard
                            icon={<Calendar className="w-8 h-8 text-primary" />}
                            title="Easy Scheduling"
                            description="Book appointments and manage requests with a few clicks."
                        />
                    </div>
                </div>
            </section>
        </Layout>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <Card className="hover:-translate-y-1 transition-transform duration-300 border-none shadow-lg shadow-gray-100 bg-gray-50/50">
        <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </Card>
);

export default LandingPage;
