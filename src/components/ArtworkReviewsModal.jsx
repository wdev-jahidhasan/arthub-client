'use client';
import React, { useState, useEffect } from 'react';

export default function ArtworkReviewsModal({ artworkId, artworkTitle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && artworkId) {
      fetchReviews();
    }
  }, [isOpen, artworkId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews?artworkId=${artworkId}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-pink-400 font-semibold hover:underline text-sm sm:text-base inline-flex items-center gap-1 bg-transparent border-none cursor-pointer"
      >
        See Reviews &rarr;
      </button>

      {/* Modal Box */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-3xl p-6 shadow-2xl text-slate-100 relative">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white truncate max-w-[80%]">
                Reviews for "{artworkTitle}"
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white text-xl font-bold px-2 py-1"
              >
                &times;
              </button>
            </div>

            {/* Reviews List */}
            <div className="py-4 max-h-[60vh] overflow-y-auto space-y-4 pr-1">
              {loading ? (
                <p className="text-center text-slate-400 py-6">Loading reviews...</p>
              ) : reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev._id} className="bg-slate-950/60 border border-white/5 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-pink-400">
                        {rev.userEmail || "Anonymous User"}
                      </span>
                      <span>
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 space-y-2">
                  <p className="text-slate-400 text-sm">No reviews found for this artwork yet.</p>
                </div>
              )}
            </div>

            {/* Highlighted Footer Notice */}
            <div className="pt-4 border-t border-white/10 text-center">
              <span className="inline-block bg-pink-500/10 border border-pink-500/30 text-yellow-400 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide">
                General users also can leave a review after purchasing
              </span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}