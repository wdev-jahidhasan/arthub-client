export const subscriptionConfig = [
  {
    tier: 'Free',
    maxPurchases: 3,
    price: '$0',
    description: 'Best for exploring the platform and starting your journey.',
    features: ['Up to 3 painting purchases', 'Basic customer support', 'Standard resolution access'],
  },
  {
    tier: 'Pro',
    maxPurchases: 10,
    price: '$9.99',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    description: 'Perfect for passionate art collectors and enthusiasts.',
    features: ['Up to 9 painting purchases', 'Priority customer support', 'Early access to new art pieces'],
    popular: true,
  },
  {
    tier: 'Premium',
    maxPurchases: 'Unlimited',
    price: '$19.99',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
    description: 'Designed for zero limitations.',
    features: ['Unlimited painting purchases', 'Dedicated VIP support', 'Exclusive premium gallery access'],
  },
];