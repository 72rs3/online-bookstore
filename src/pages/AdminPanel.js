import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newBook, setNewBook] = useState({ title: '', author: '', price: '', category: '', coverImage: '', description: '' });
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, ordersRes, booksRes] = await Promise.all([
                fetch('http://localhost:5000/api/admin/users'),
                fetch('http://localhost:5000/api/admin/orders'),
                fetch('http://localhost:5000/api/books')
            ]);
            setUsers(await usersRes.json());
            setOrders(await ordersRes.json());
            setBooks(await booksRes.json());
            setLoading(false);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        }
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/admin/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBook),
            });
            if (response.ok) {
                setNewBook({ title: '', author: '', price: '', category: '', coverImage: '', description: '' });
                fetchData();
            }
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    const deleteBook = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await fetch(`http://localhost:5000/api/admin/books/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            fetchData();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    if (loading) return <div className="p-20 text-center">Loading Dashboard...</div>;

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">Admin <span className="text-blue-600">Dashboard</span></h2>
                    <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border font-bold text-gray-600">
                        Total Revenue: <span className="text-green-600">${orders.reduce((acc, o) => acc + parseFloat(o.total_price), 0).toFixed(2)}</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
                    {/* Users Management */}
                    <div className="xl:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-6 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            User Directory
                        </h3>
                        <div className="space-y-4">
                            {users.map(user => (
                                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                    <div>
                                        <p className="font-bold text-gray-900">{user.username}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {user.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Orders Management */}
                    <div className="xl:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-6 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            Recent Orders
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-400 text-xs uppercase tracking-widest border-b">
                                        <th className="pb-4 font-bold">Order ID</th>
                                        <th className="pb-4 font-bold">Customer</th>
                                        <th className="pb-4 font-bold">Total</th>
                                        <th className="pb-4 font-bold">Status</th>
                                        <th className="pb-4 font-bold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {orders.map(order => (
                                        <tr key={order.id} className="border-b last:border-0">
                                            <td className="py-4 font-bold text-gray-900">#{order.id}</td>
                                            <td className="py-4 text-gray-600">{order.username}</td>
                                            <td className="py-4 font-black text-gray-900">${order.total_price}</td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                    order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <select 
                                                    className="bg-gray-50 border-0 rounded-lg text-xs font-bold p-2 outline-none focus:ring-2 focus:ring-blue-500"
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

                {/* Inventory Management */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-8 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        Inventory Management
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                        <div className="lg:col-span-1">
                            <h4 className="font-black text-gray-900 mb-6 uppercase text-xs tracking-widest">Add New Title</h4>
                            <form onSubmit={handleAddBook} className="space-y-4">
                                <input type="text" placeholder="Book Title" className="w-full p-3 bg-gray-50 border-0 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} required />
                                <input type="text" placeholder="Author Name" className="w-full p-3 bg-gray-50 border-0 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} required />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" placeholder="Price" className="w-full p-3 bg-gray-50 border-0 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={newBook.price} onChange={e => setNewBook({...newBook, price: e.target.value})} required />
                                    <input type="text" placeholder="Category" className="w-full p-3 bg-gray-50 border-0 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})} required />
                                </div>
                                <input type="text" placeholder="Cover Image URL" className="w-full p-3 bg-gray-50 border-0 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={newBook.coverImage} onChange={e => setNewBook({...newBook, coverImage: e.target.value})} />
                                <textarea placeholder="Book Description" className="w-full p-3 bg-gray-50 border-0 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-32" value={newBook.description} onChange={e => setNewBook({...newBook, description: e.target.value})}></textarea>
                                <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-black hover:bg-blue-700 transition shadow-lg shadow-blue-100">Add to Library</button>
                            </form>
                        </div>
                        <div className="lg:col-span-3">
                            <h4 className="font-black text-gray-900 mb-6 uppercase text-xs tracking-widest">Current Stock</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {books.map(book => (
                                    <div key={book.id} className="flex items-center p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-200 transition group">
                                        <img src={book.coverImage} className="w-12 h-16 object-cover rounded shadow-sm mr-4" alt="" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 truncate">{book.title}</p>
                                            <p className="text-xs text-gray-500">{book.author} • ${book.price}</p>
                                        </div>
                                        <button onClick={() => deleteBook(book.id)} className="p-2 text-gray-400 hover:text-red-600 transition opacity-0 group-hover:opacity-100">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
