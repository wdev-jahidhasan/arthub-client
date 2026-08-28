'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from '@/lib/auth-client';

const UserReviewsPage = () => {
  const { data: session, isPending } = useSession();

  const [artworksList, setArtworksList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [commentInput, setCommentInput] = useState('');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const userId = session?.user?.id;

  useEffect(() => {
    if (isPending) return;

    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [purchaseRes, reviewsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/purchases/user-safe/${userId}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/user/${userId}`)
        ]);

        const purchaseData = await purchaseRes.json();
        const reviewsData = await reviewsRes.json();

        if (purchaseData.success) {
          const purchases = purchaseData.data || [];
          const reviews = reviewsData.success ? (reviewsData.data || []) : [];

          const combined = purchases.map((purchase) => {
            const artwork = purchase.artworkDetails || {};

            const artworkId = artwork._id || purchase.artworkId || purchase.metadata?.artworkId || purchase._id;
            const title = artwork.title || purchase.metadata?.artworkTitle || purchase.metadata?.title || 'Untitled Artwork';
            
            let rawImage = artwork.image || purchase.metadata?.artworkImage || purchase.metadata?.imageUrl || '/placeholder.png';
            const image = rawImage.startsWith('http') 
              ? rawImage 
              : `${process.env.NEXT_PUBLIC_API_URL || ''}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;

            const matchedReview = reviews.find((rev) => rev.artworkId === artworkId);

            return {
              artworkId,
              title,
              image,
              review: matchedReview || null,
            };
          });

          setArtworksList(combined);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [userId, isPending]);

  const handleSaveReview = async (artworkId, reviewId = null) => {
    try {
      const method = reviewId ? 'PATCH' : 'POST';
      const endpoint = reviewId
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${reviewId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/reviews`;

      const bodyData = reviewId
        ? { comment: commentInput }
        : { artworkId, userId, userEmail: session?.user?.email, comment: commentInput };

      const res = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      const data = await res.json();

      if (data.success) {
        setArtworksList(
          artworksList.map((item) => {
            if (item.artworkId === artworkId) {
              return {
                ...item,
                review: reviewId
                  ? { ...item.review, comment: commentInput }
                  : { _id: data.result?.insertedId, artworkId, comment: commentInput, createdAt: new Date() }
              };
            }
            return item;
          })
        );
        setEditingId(null);
        setCommentInput('');
      }
    } catch (err) {
      console.error("Error saving review:", err);
    }
  };

  const promptDelete = (reviewId) => {
    setReviewToDelete(reviewId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${reviewToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setArtworksList(
          artworksList.map((item) => {
            if (item.review && item.review._id === reviewToDelete) {
              return { ...item, review: null };
            }
            return item;
          })
        );
      }
    } catch (err) {
      console.error("Error deleting review:", err);
    } finally {
      setDeleteModalOpen(false);
      setReviewToDelete(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 text-sm tracking-wide animate-pulse">Loading your purchased artworks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-6 sm:p-12 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">My Purchased Artworks & Reviews</h1>
          <p className="text-gray-400 text-sm sm:text-base">Manage your bought art pieces and feedback.</p>
        </div>

        {artworksList.length === 0 ? (
          <div className="bg-[#111726] border border-gray-800 rounded-2xl shadow-xl p-10 sm:p-14 text-center max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-2">No Purchased Artworks Found</h3>
            <p className="text-gray-400 text-sm mb-8">
              You haven't purchased any artworks yet.
            </p>
            <Link
              href="/artworks"
              className="inline-block w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md bg-pink-600 hover:bg-pink-700 text-white text-center"
            >
              Explore Artworks
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {artworksList.map((item) => {
              const hasReview = Boolean(item.review);
              const isEditing = editingId === item.artworkId;

              return (
                <div
                  key={item.artworkId}
                  className="bg-[#111726] border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row gap-6 items-center sm:items-start"
                >
                  <div className="relative w-full sm:w-40 h-48 sm:h-40 rounded-xl overflow-hidden border border-gray-800 flex-shrink-0 bg-[#0b0f19]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 160px"
                      className="object-cover"
                      priority={false}
                    />
                  </div>

                  <div className="w-full flex flex-col justify-between flex-grow">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-white">{item.title}</h3>
                        <span className="text-xs text-gray-400">
                          {item.review?.createdAt ? new Date(item.review.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>

                      {isEditing ? (
                        <div className="mt-3">
                          <textarea
                            className="w-full p-3 bg-[#0b0f19] border border-gray-700 text-white rounded-xl mb-3 focus:outline-none focus:border-pink-600 text-sm"
                            rows={3}
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            placeholder="Write your review here..."
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleSaveReview(item.artworkId, item.review?._id)}
                              className="py-2 px-4 rounded-xl font-semibold text-xs transition-all shadow-md bg-pink-600 hover:bg-pink-700 text-white"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => { setEditingId(null); setCommentInput(''); }}
                              className="py-2 px-4 rounded-xl font-semibold text-xs transition-all shadow-md bg-gray-800 text-gray-400 border border-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {hasReview ? (
                            <p className="text-gray-200 text-sm bg-[#0b0f19]/60 p-3 rounded-xl border border-gray-800/80 my-2">
                              {item.review.comment}
                            </p>
                          ) : (
                            <p className="text-gray-500 text-sm italic my-2">
                              No review added yet for this artwork.
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800/60">
                        <Link
                          href={`/artworks/${item.artworkId}`}
                          className="text-xs font-semibold text-pink-500 hover:text-pink-400 transition"
                        >
                          View Artwork Details →
                        </Link>

                        <div className="flex gap-2">
                          {!hasReview ? (
                            <>
                              <button
                                onClick={() => { setEditingId(item.artworkId); setCommentInput(''); }}
                                className="py-1.5 px-3 rounded-lg font-semibold text-xs transition-all shadow-md bg-pink-600 hover:bg-pink-700 text-white"
                              >
                                Add
                              </button>
                              <button disabled className="py-1.5 px-3 rounded-lg font-semibold text-xs bg-gray-800 text-gray-600 border border-gray-800 cursor-not-allowed">Edit</button>
                              <button disabled className="py-1.5 px-3 rounded-lg font-semibold text-xs bg-gray-800 text-gray-600 border border-gray-800 cursor-not-allowed">Delete</button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => { setEditingId(item.artworkId); setCommentInput(item.review.comment); }}
                                className="py-1.5 px-3 rounded-lg font-semibold text-xs transition-all shadow-md bg-pink-600 hover:bg-pink-700 text-white"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => promptDelete(item.review._id)}
                                className="py-1.5 px-3 rounded-lg font-semibold text-xs transition-all shadow-md bg-gray-800 text-red-400 border border-gray-700 hover:bg-red-950/50"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111726] border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center">
            <h3 className="text-xl font-bold text-white mb-2">Delete Review?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="py-2.5 px-5 rounded-xl font-semibold text-xs sm:text-sm bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="py-2.5 px-5 rounded-xl font-semibold text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white transition shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserReviewsPage;