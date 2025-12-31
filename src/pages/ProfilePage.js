import React, { useState } from 'react';

const ProfilePage = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password: password || undefined }),
            });
            if (response.ok) {
                const updatedUser = { ...user, username, email };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                alert('Profile updated successfully!');
                window.location.reload();
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-blue-600 h-32 relative">
                        <div className="absolute -bottom-12 left-12">
                            <div className="w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center text-4xl border-4 border-white">
                                👤
                            </div>
                        </div>
                    </div>
                    <div className="pt-16 p-12">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-gray-900">Account Settings</h2>
                            <p className="text-gray-500">Manage your personal information and security</p>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-4 focus:ring-blue-500/20 outline-none transition"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-4 focus:ring-blue-500/20 outline-none transition"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 focus:ring-4 focus:ring-blue-500/20 outline-none transition"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Leave blank to keep current"
                                />
                            </div>
                            <div className="pt-4">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-lg transition shadow-xl shadow-blue-600/20 disabled:bg-gray-400"
                                >
                                    {loading ? 'Saving Changes...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
