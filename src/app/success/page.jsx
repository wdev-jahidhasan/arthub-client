import { redirect } from 'next/navigation'
import { stripe } from '../../lib/stripe'
import Link from 'next/link'

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)')
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  })

  const { status, customer_details } = session
  const customerEmail = customer_details?.email || 'valued customer'

  if (status === 'open') {
    return redirect('/')
  }

  return (
    <div className="bg-[#0b0b0f] text-white flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="max-w-md w-full bg-[#121217] border border-gray-800 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden ring-1 ring-pink-500/20">
        
        {/* Glow Background Effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Success Icon */}
        <div className="w-16 h-16 bg-pink-500/20 border border-pink-500/30 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-500/10">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 text-white">
          Payment Successful!
        </h1>

        <p className="text-gray-400 text-xs sm:text-sm mb-6 leading-relaxed">
          We appreciate your business! A confirmation email has been sent to{' '}
          <strong className="text-gray-200">{customerEmail}</strong>.
        </p>

        {/* Details Box */}
        <div className="bg-[#181822] p-4 rounded-xl mb-6 border border-gray-800/80 text-left text-xs space-y-2">
          <div className="flex justify-between text-gray-400">
            <span>Payment Status:</span>
            <span className="text-emerald-400 font-semibold uppercase">{status}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Support:</span>
            <a href="mailto:orders@example.com" className="text-pink-400 hover:underline">
              orders@example.com
            </a>
          </div>
        </div>

        {/* Back to Dashboard/Home Button */}
        <Link
          href="/dashboard/user/subscription"
          className="block w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-pink-600 hover:bg-pink-700 text-white transition-all shadow-md shadow-pink-600/20"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}