import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'admin') {
            alert('Access denied. Admins only.');
            navigate('/');
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, ordersRes] = await Promise.all([
                fetch('http://localhost:5000/api/admin/users'),
                fetch('http://localhost:5000/api/admin/orders')
            ]);
            const usersData = await usersRes.json();
            const ordersData = await ordersRes.json();
            setUsers(usersData);
            setOrders(ordersData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (response.ok) {
                alert('Order updated');
                fetchData();
            }
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Admin Panel...</div>;

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Users Management */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">User Management</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2">ID</th>
                                    <th className="p-2">Username</th>
                                    <th className="p-2">Email</th>
                                    <th className="p-2">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-b">
                                        <td className="p-2">{user.id}</td>
                                        <td className="p-2">{user.username}</td>
                                        <td className="p-2">{user.email}</td>
                                        <td className="p-2">
                                            <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Orders Management */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">Order Management</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2">ID</th>
                                    <th className="p-2">User</th>
                                    <th className="p-2">Total</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id} className="border-b">
                                        <td className="p-2">{order.id}</td>
                                        <td className="p-2">{order.username}</td>
                                        <td className="p-2">${order.total_price}</td>
                                        <td className="p-2">
                                            <span className={`px-2 py-1 rounded text-xs ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-2">
                                            <select 
                                                className="text-sm border rounded p-1"
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
