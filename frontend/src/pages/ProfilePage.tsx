import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirm: '',
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setError('');
    try {
      await api.put('/users/change-password', form);
      setMsg('Password changed successfully.');
      setForm({ current_password: '', new_password: '', new_password_confirm: '' });
    } catch {
      setError('Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      {user && (
        <div className="mb-8">
          <div><span className="font-semibold">Email:</span> {user.email}</div>
          <div><span className="font-semibold">First Name:</span> {user.first_name}</div>
          <div><span className="font-semibold">Last Name:</span> {user.last_name}</div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        {msg && <div className="mb-2 text-green-600">{msg}</div>}
        {error && <div className="mb-2 text-red-500">{error}</div>}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Current Password</label>
          <input type="password" name="current_password" className="w-full border rounded px-3 py-2" value={form.current_password} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">New Password</label>
          <input type="password" name="new_password" className="w-full border rounded px-3 py-2" value={form.new_password} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Confirm New Password</label>
          <input type="password" name="new_password_confirm" className="w-full border rounded px-3 py-2" value={form.new_password_confirm} onChange={handleChange} required />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition" disabled={loading}>
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
      <button onClick={logout} className="mt-8 text-red-600 hover:underline">Logout</button>
    </div>
  );
};

export default ProfilePage; 