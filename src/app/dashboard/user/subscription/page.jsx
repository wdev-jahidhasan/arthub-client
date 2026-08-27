"use client"
import React, { useState } from 'react';

const subscriptions = [
  {
    tier: 'Free',
    matchKeys: ['free', 'free (default)', 'default'],
    maxPurchases: '3 paintings',
    price: '$0',
    description: 'Best for exploring the platform and starting your journey.',
    features: ['Up to 3 painting purchases', 'Basic customer support', 'Standard resolution access'],
  },
  {
    tier: 'Pro',
    matchKeys: ['pro'],
    maxPurchases: '9 paintings',
    price: '$9.99',
    priceId: 'price_1U8w6cKHXvLYFDqO6oYLL4tq',
    description: 'Perfect for passionate art collectors and enthusiasts.',
    features: ['Up to 9 painting purchases', 'Priority customer support', 'Early access to new art pieces'],
    popular: true,
  },
  {
    tier: 'Premium',
    matchKeys: ['premium', 'unlimited'],
    maxPurchases: 'Unlimited',
    price: '$19.99',
    priceId: 'price_1U8wusKHXvLYFDqOJRufb6I8',
    description: 'Designed for zero limitations.',
    features: ['Unlimited painting purchases', 'Dedicated VIP support', 'Exclusive premium gallery access'],
  },
];

const UserSubscriptionPage = () => {
  const [userPlanFromDB, setUserPlanFromDB] = useState('free');
  const [loadingTier, setLoadingTier] = useState(null);

  const handleCheckout = async (tier) => {
    if (tier.tier === 'Free') return;

    setLoadingTier(tier.tier);
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          priceId: tier.priceId,
          mode: 'subscription'
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Something went wrong during checkout.');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white p-4 sm:p-6 lg:p-10 overflow-x-hidden">
      {/* Page Header */}
      <div className="max-w-6xl mx-auto text-center mb-10 px-4">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Unlock Your Creative Journey
        </h1>
        <p className="text-gray-400 text-xs sm:text-base max-w-lg mx-auto">
          Choose the right subscription tier to expand your art collection and enjoy exclusive perks.
        </p>
      </div>

      {/* Responsive Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {subscriptions.map((sub, index) => {
          const normalizedUserPlan = userPlanFromDB ? userPlanFromDB.toLowerCase().trim() : '';
          const isCurrent = sub.matchKeys.includes(normalizedUserPlan);
          const isLoading = loadingTier === sub.tier;

          return (
            <div
              key={index}
              className={`rounded-2xl p-6 flex flex-col justify-between border relative ${
                sub.popular
                  ? 'bg-gradient-to-b from-[#161622] to-[#12121a] border-pink-500 shadow-xl shadow-pink-500/10 ring-1 ring-pink-500/50'
                  : 'bg-[#121217] border-gray-800'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-100">{sub.tier}</h3>
                  {sub.popular && !isCurrent && (
                    <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                  {isCurrent && (
                    <span className="bg-pink-500/20 text-pink-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-pink-500/30">
                      Current Plan
                    </span>
                  )}
                </div>

                <p className="text-gray-400 text-xs sm:text-sm mb-6 min-h-[40px]">
                  {sub.description}
                </p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-pink-500">{sub.price}</span>
                  <span className="text-gray-400 text-xs">/month</span>
                </div>

                <div className="bg-[#181822] p-3 rounded-lg mb-6 border border-gray-800/80">
                  <span className="text-gray-400 text-[10px] block uppercase tracking-wider font-semibold mb-1">
                    Max Purchases Allowed
                  </span>
                  <strong className="text-white text-sm">{sub.maxPurchases}</strong>
                </div>

                <ul className="space-y-3 mb-6 text-xs sm:text-sm text-gray-300">
                  {sub.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={isCurrent || isLoading || sub.tier === 'Free'}
                onClick={() => handleCheckout(sub)}
                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md ${
                  isCurrent || sub.tier === 'Free'
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                    : 'bg-pink-600 hover:bg-pink-700 text-white'
                }`}
              >
                {isCurrent ? 'Active Plan' : isLoading ? 'Processing...' : 'Upgrade Now'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserSubscriptionPage;