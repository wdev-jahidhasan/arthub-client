'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ReviewModal({ artworkId, userId, userEmail, customerEmail, status }) {
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artworkId,
          comment,
          userId,
          userEmail,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          router.push('/dashboard/user/bought-artworks');
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to save comment', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0b0b0f] text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 selection:bg-pink-500 selection:text-white">
      
      {/* Success Card */}
      <div className="max-w-md w-full bg-[#121217] border border-gray-800/80 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden ring-1 ring-pink-500/20 backdrop-blur-xl mb-6">
        
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

        {/* Action Button - Updated Link */}
        <Link
          href="/dashboard/user/bought-artworks"
          className="block w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white transition-all shadow-lg shadow-pink-600/25 active:scale-[0.98]"
        >
          Go to Dashboard
        </Link>
      </div>

      {/* Review / Comment Section */}
      <div className="max-w-md w-full bg-[#121217] border border-gray-800 rounded-3xl p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-1">Leave a Review</h3>
        <p className="text-gray-400 text-xs mb-4">
          How was your experience with this artwork? Let the artist know your thoughts.
        </p>

        {submitted ? (
          <div className="py-4 text-emerald-400 font-semibold text-xs text-center bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            Thank you! Your comment has been posted successfully. Redirecting...
          </div>
        ) : (
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review here..."
              required
              className="w-full bg-[#181822] border border-gray-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-pink-500 transition-all"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-white transition-all border border-gray-700 disabled:opacity-55"
            >
              {submitting ? 'Submitting...' : 'Post Comment'}
            </button>
          </form>
        )}
      </div>

    </div>
  );
}