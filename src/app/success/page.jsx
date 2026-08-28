import { redirect } from 'next/navigation'
import { stripe } from '../../lib/stripe'
import { subscription } from '@/lib/action/payment'
import Link from 'next/link'

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)')
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'payment_intent']
    })
  } catch (error) {
    return redirect('/')
  }

  const { status, metadata, customer_details } = session
  const customerEmail = customer_details?.email || 'valued customer'

  if (status === 'open') {
    return redirect('/')
  }

  if (status === 'complete') {
    try {
      await subscription({ ...metadata, sessionId: session_id })
    } catch (err) {
      console.error("Subscription sync error:", err.message)
    }

    return (
      <div className="min-h-screen bg-[#0b0b0f] text-white flex items-center justify-center p-4 sm:p-6 lg:p-10 selection:bg-pink-500 selection:text-white">
        <div className="max-w-md w-full bg-[#121217] border border-gray-800/80 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden ring-1 ring-pink-500/20 backdrop-blur-xl">
          
          {/* Background Glow Effect */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Animated Success Icon */}
          <div className="w-16 h-16 bg-gradient-to-tr from-pink-600/20 to-purple-600/20 border border-pink-500/30 text-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-500/10">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 text-white">
            Payment Successful!
          </h1>

          <p className="text-gray-400 text-xs sm:text-sm mb-6 leading-relaxed">
            Congratulations! Your payment is successful. A confirmation email has been sent to{' '}
            <strong className="text-gray-200 font-medium">{customerEmail}</strong>.
          </p>

          {/* Details Box */}
          <div className="bg-[#181822] p-4 rounded-xl mb-6 border border-gray-800 text-left text-xs space-y-2.5">
            <div className="flex justify-between items-center text-gray-400">
              <span>Status:</span>
              <span className="text-emerald-400 font-semibold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                {status}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-400">
              <span>Support Email:</span>
              <a href="mailto:orders@example.com" className="text-pink-400 hover:underline font-medium">
                orders@example.com
              </a>
            </div>
          </div>

          {/* Action Button */}
          <Link
            href="/artworks"
            className="block w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white transition-all shadow-lg shadow-pink-600/25 active:scale-[0.98]"
          >
            Purchase More
          </Link>
        </div>
      </div>
    )
  }
}