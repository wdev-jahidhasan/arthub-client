'use client';
import { useState } from 'react';

export default function PurchaseButton({ price, title, artworkId }) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('price', price);
      formData.append('title', title);
      formData.append('artworkId', artworkId);

      const res = await fetch('/api/payment', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned', data);
      }
    } catch (err) {
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePurchase}
      disabled={loading}
      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold tracking-wide shadow-lg shadow-purple-600/30 transition-all duration-300 hover:shadow-pink-500/50 active:scale-95 disabled:opacity-50"
    >
      {loading ? 'Processing...' : 'Purchase Now'}
    </button>
  );
}