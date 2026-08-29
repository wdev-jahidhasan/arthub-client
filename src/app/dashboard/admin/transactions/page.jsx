"use client"
import React, { useEffect, useState } from 'react';
import { Loader2, Search } from 'lucide-react';

const AdminTransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/transactions`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTransactions(data.data);
          setFilteredTransactions(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = transactions.filter(tx => 
      (tx.transactionId && tx.transactionId.toLowerCase().includes(query)) ||
      (tx.email && tx.email.toLowerCase().includes(query)) ||
      (tx.type && tx.type.toLowerCase().includes(query))
    );
    setFilteredTransactions(filtered);
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
    <div className="p-6 md:p-10 text-white bg-[#070913] min-h-screen text-left">
      {/* Header & Search Bar Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-wide">Transactions Overview</h2>
          <p className="text-gray-400 text-sm mt-1">View all user purchases and subscription transactions.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by ID, email or type..."
            className="w-full bg-[#0b0f19] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>
      </div>

      {/* Transactions Table Container */}
      <div className="bg-[#0b0f19] border border-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider bg-[#121826]/50">
                <th className="py-4 px-6 w-2/5">Transaction ID</th>
                <th className="py-4 px-6 w-32">Type</th>
                <th className="py-4 px-6 w-1/4">User/Artist Email</th>
                <th className="py-4 px-6 w-28">Amount</th>
                <th className="py-4 px-6 w-44">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-sm">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-[#121826]/30 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-gray-300 break-all">
                      {tx.transactionId || 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        tx.type === 'subscription' 
                          ? 'bg-purple-950/60 text-purple-400 border border-purple-800/40' 
                          : 'bg-pink-950/60 text-pink-400 border border-pink-800/40'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-300 truncate" title={tx.email}>
                      {tx.email}
                    </td>
                    <td className="py-4 px-6 font-bold text-green-400">
                      ${Number(tx.amount).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-gray-400 text-xs">
                      {tx.date ? new Date(tx.date).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500 text-sm">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactionPage;