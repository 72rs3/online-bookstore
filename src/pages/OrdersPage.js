import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/${user.id}`);
            const data = await response.json();
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading your orders...</div>;

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <h2 className="text-3xl font-bold mb-8">My Orders</h2>
            {orders.length === 0 ? (
                <div className="bg-blue-50 p-8 rounded-lg text-center">
                    <p className="text-blue-600 mb-4">You haven't placed any orders yet.</p>
                    <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow border flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">Order #{order.id}</p>
                                <p className="font-bold text-lg">Total: ${order.total_price}</p>
                                <p className="text-sm text-gray-600">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                    {order.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
