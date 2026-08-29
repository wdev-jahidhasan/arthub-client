"use client"
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const AdminManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for Confirmation Modal
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    userId: null,
    userName: '',
    newRole: '',
  });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Triggered when dropdown changes
  const handleSelectChange = (userId, userName, newRole) => {
    const user = users.find(u => u._id === userId);
    // If the selected role is the same as current role, do nothing
    if (user?.role === newRole) return;

    setConfirmModal({
      isOpen: true,
      userId,
      userName: userName || 'this user',
      newRole,
    });
  };

  // Actual API Call after confirmation
  const confirmRoleChange = async () => {
    const { userId, newRole } = confirmModal;
    setConfirmModal({ isOpen: false, userId: null, userName: '', newRole: '' });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/role/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('User role updated successfully!');
        fetchUsers(); // Refresh the list
      } else {
        toast.error(data.message || 'Failed to update role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Something went wrong!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center w-full bg-[#05050d] text-white py-28 gap-4">
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
        <p className="text-gray-400 text-sm font-medium tracking-wide animate-pulse">Loading</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070913] p-6 md:p-10 text-left text-white relative">
      {/* Toast Container */}
      <Toaster toastOptions={{ style: { background: '#121826', color: '#fff' } }} />

      <div className="w-full">
        <h2 className="text-2xl font-bold mb-6 text-white tracking-wide">Manage Users</h2>
        
        {/* Table Container with Dark Background */}
        <div className="overflow-x-auto bg-[#0b0f19] border border-gray-800 shadow-2xl rounded-xl">
          <table className="min-w-full divide-y divide-gray-800 text-left">
            <thead className="bg-[#101726]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">NAME</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">EMAIL</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ROLE</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="bg-[#0b0f19] divide-y divide-gray-800/60">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-900/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200 text-left">
                      {user.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-left">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-left">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-gray-800 text-purple-400 border border-purple-800/50' :
                        user.role === 'artist' ? 'bg-gray-800 text-green-400 border border-green-800/50' : 
                        'bg-gray-800 text-yellow-300 border border-yellow-800/50'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-left">
                      <select
                        value={user.role || 'user'}
                        onChange={(e) => handleSelectChange(user._id, user.name, e.target.value)}
                        className="border border-gray-700 bg-[#121826] text-gray-200 rounded-lg px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="user" className="bg-[#121826] text-white">user</option>
                        <option value="artist" className="bg-[#121826] text-white">artist</option>
                        <option value="admin" className="bg-[#121826] text-white">admin</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Confirmation Dialog Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#121826] border border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl text-left">
            <h3 className="text-xl font-bold text-white mb-3">Confirm Role Change</h3>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Are you sure you want to change <span className="text-pink-400 font-semibold">{confirmModal.userName}</span>'s role to <span className="text-indigo-400 uppercase font-semibold">{confirmModal.newRole}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal({ isOpen: false, userId: null, userName: '', newRole: '' })}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmRoleChange}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-pink-600 text-white hover:bg-pink-700 transition-colors cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageUsersPage;