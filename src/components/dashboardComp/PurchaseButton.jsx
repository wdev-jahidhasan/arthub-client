'use client';
import { useState } from 'react';

export default function PurchaseButton({ price, title, artworkId, disabled }) {
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
      disabled={loading || disabled} 
      className={`px-8 py-4 rounded-2xl font-bold tracking-wide shadow-lg transition-all duration-300 ${
        disabled
          ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none opacity-50 pointer-events-none'
          : 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-purple-600/30 hover:shadow-pink-500/50 active:scale-95 disabled:opacity-50'
      }`}
    >
      {disabled ? 'Restricted for Artists' : loading ? 'Processing...' : 'Purchase Now'}
    </button>
  );
}