import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newBook, setNewBook] = useState({ title: '', author: '', price: '', category: '', coverImage: '', description: '' });
    const [csvFile, setCsvFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');
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
            const token = localStorage.getItem('token');
            const [usersRes, ordersRes, booksRes] = await Promise.all([
                fetch('http://localhost:5000/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('http://localhost:5000/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('http://localhost:5000/api/books')
            ]);
            const usersData = await usersRes.json();
            const ordersData = await ordersRes.json();
            const booksData = await booksRes.json();
            setUsers(usersData);
            setOrders(ordersData);
            setBooks(booksData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        }
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(newBook),
            });
            if (response.ok) {
                alert('Book added!');
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
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/admin/books/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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

    const handleBulkUpload = async (e) => {
        e.preventDefault();
        if (!csvFile) {
            setUploadMessage('Please select a CSV file first.');
            return;
        }
        setUploading(true);
        setUploadMessage('');
        const formData = new FormData();
        formData.append('file', csvFile);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/books/bulk', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                setUploadMessage(`Uploaded successfully: ${data.inserted} books added.`);
                setCsvFile(null);
                fetchData();
            } else {
                setUploadMessage(data.error || 'Upload failed.');
            }
        } catch (error) {
            setUploadMessage('An error occurred during upload.');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-white">Loading Admin Panel...</div>;

    return (
        <div className="page-shell space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Control center</p>
                    <h2 className="text-3xl font-extrabold text-white">Admin Dashboard</h2>
                </div>
                <div className="pill">Signed in as {currentUser?.email}</div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Users Management */}
                <div className="card">
                    <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2 text-white">User Management</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-slate-200">
                            <thead>
                                <tr className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
                                    <th className="p-2">ID</th>
                                    <th className="p-2">Username</th>
                                    <th className="p-2">Email</th>
                                    <th className="p-2">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-b border-white/5">
                                        <td className="p-2">{user.id}</td>
                                        <td className="p-2">{user.username}</td>
                                        <td className="p-2">{user.email}</td>
                                        <td className="p-2">
                                            <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-200' : 'bg-blue-500/20 text-blue-200'}`}>
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
                <div className="card">
                    <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2 text-white">Order Management</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-slate-200">
                            <thead>
                                <tr className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
                                    <th className="p-2">ID</th>
                                    <th className="p-2">User</th>
                                    <th className="p-2">Total</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id} className="border-b border-white/5">
                                        <td className="p-2">{order.id}</td>
                                        <td className="p-2">{order.username}</td>
                                        <td className="p-2">${order.total_price}</td>
                                        <td className="p-2">
                                            <span className={`px-2 py-1 rounded text-xs ${order.status === 'completed' ? 'bg-green-500/20 text-green-200' : 'bg-yellow-500/20 text-yellow-100'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-2">
                                            <select
                                                className="text-sm border rounded p-1 bg-white/5 border-white/10"
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

            {/* Book Management */}
            <div className="card">
                <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2 text-white">Book Inventory</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Add Book Form */}
                    <div className="md:col-span-1 bg-white/5 border border-white/10 p-4 rounded-xl space-y-6">
                        <div>
                            <h4 className="font-bold mb-2 text-white">Add New Book</h4>
                            <p className="text-sm text-slate-400 mb-3">Use the form for single books.</p>
                            <form onSubmit={handleAddBook} className="space-y-3">
                                <input type="text" placeholder="Title" className="w-full" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} required />
                                <input type="text" placeholder="Author" className="w-full" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} required />
                                <input type="number" placeholder="Price" className="w-full" value={newBook.price} onChange={e => setNewBook({...newBook, price: e.target.value})} required />
                                <input type="text" placeholder="Category" className="w-full" value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})} required />
                                <input type="text" placeholder="Cover Image URL" className="w-full" value={newBook.coverImage} onChange={e => setNewBook({...newBook, coverImage: e.target.value})} />
                                <textarea placeholder="Description" className="w-full" value={newBook.description} onChange={e => setNewBook({...newBook, description: e.target.value})}></textarea>
                                <button type="submit" className="btn-primary w-full">Add Book</button>
                            </form>
                        </div>

                        <div className="border-t border-white/10 pt-4">
                            <h4 className="font-bold mb-2 text-white">Bulk upload (CSV)</h4>
                            <p className="text-sm text-slate-400 mb-3">Headers: title, author, price, category, coverImage, description</p>
                            <form onSubmit={handleBulkUpload} className="space-y-3">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={(e) => setCsvFile(e.target.files[0] || null)}
                                    className="w-full text-sm file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-none file:bg-purple-600 file:text-white"
                                />
                                <button type="submit" className="btn-primary w-full" disabled={uploading}>
                                    {uploading ? 'Uploading...' : 'Upload CSV'}
                                </button>
                                {uploadMessage && <p className="text-sm text-slate-300">{uploadMessage}</p>}
                            </form>
                        </div>
                    </div>
                    {/* Book List */}
                    <div className="md:col-span-2 overflow-x-auto">
                        <table className="w-full text-left text-slate-200">
                            <thead>
                                <tr className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
                                    <th className="p-2">Title</th>
                                    <th className="p-2">Author</th>
                                    <th className="p-2">Price</th>
                                    <th className="p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map(book => (
                                    <tr key={book.id} className="border-b border-white/5">
                                        <td className="p-2">{book.title}</td>
                                        <td className="p-2">{book.author}</td>
                                        <td className="p-2">${book.price}</td>
                                        <td className="p-2">
                                            <button onClick={() => deleteBook(book.id)} className="text-rose-300 hover:text-rose-200 font-semibold">Delete</button>
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
