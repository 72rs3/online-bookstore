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
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/orders/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    if (loading) return <div className="p-8 text-center text-white">Loading your orders...</div>;

    return (
        <div className="page-shell max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Library</p>
                    <h2 className="text-3xl font-extrabold text-white">My Orders</h2>
                </div>
                <button onClick={() => navigate('/')} className="btn-primary">Start Shopping</button>
            </div>
            {orders.length === 0 ? (
                <div className="card text-center py-16">
                    <p className="text-slate-300 mb-4">You haven't placed any orders yet.</p>
                    <button onClick={() => navigate('/')} className="btn-primary">Browse books</button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="card flex justify-between items-center">
                            <div>
                                <p className="text-sm text-slate-400">Order #{order.id}</p>
                                <p className="font-bold text-xl text-white">Total: ${order.total_price}</p>
                                <p className="text-sm text-slate-400">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    order.status === 'completed' ? 'bg-green-500/20 text-green-200' : 
                                    order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-100' : 
                                    'bg-slate-500/20 text-slate-200'
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
