'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

export default function ArtistArtworksPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id || session?.user?._id;

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [deletingArtworkId, setDeletingArtworkId] = useState(null);

  // Fetch artworks on load or userId change
  useEffect(() => {
    async function fetchArtworks() {
      if (!userId) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/artworks/user/${userId}`,
          { cache: 'no-store' }
        );
        const data = await res.json();
        if (data.success) {
          setArtworks(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch artworks:', error);
      }
    }
    fetchArtworks();
  }, [userId]);

  // Handle Edit Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingArtwork) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const updatedData = {
      title: formData.get('title'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artworks/${editingArtwork._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Artwork updated successfully!');
        setArtworks(
          artworks.map((item) =>
            item._id === editingArtwork._id ? { ...item, ...updatedData } : item
          )
        );
        setEditingArtwork(null);
      } else {
        throw new Error(data.message || 'Failed to update');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!deletingArtworkId) return;

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artworks/${deletingArtworkId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Artwork deleted successfully!');
        setArtworks(artworks.filter((item) => item._id !== deletingArtworkId));
        setDeletingArtworkId(null);
      } else {
        throw new Error(data.message || 'Failed to delete');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full w-full bg-[#05050d] text-white p-6 md:p-8 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">My Artworks</h1>
          <p className="text-gray-400 text-sm mt-1">Manage and showcase your collection</p>
        </div>
      </div>

      {artworks.length === 0 ? (
        <div className="text-center text-gray-500 py-12">No artworks found.</div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((item) => (
            <div
              key={item._id}
              className="bg-[#0b0b18] border border-gray-800/80 rounded-2xl overflow-hidden hover:border-pink-500/60 transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Next Image wrapper */}
              <div className="relative aspect-4/3 overflow-hidden bg-[#120e24]">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Details */}
              <div className="p-4 flex flex-col gap-2">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{item.category}</span>
                <h3 className="font-semibold text-lg text-gray-100 truncate group-hover:text-pink-400 transition-colors">
                  {item.title}
                </h3>
                
                <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-800/60">
                  <span className="text-xl font-bold text-pink-400">${item.price}</span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingArtwork(item)}
                      className="px-3 py-1.5 text-xs font-medium bg-gray-800/60 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingArtworkId(item._id)}
                      className="px-3 py-1.5 text-xs font-medium bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-lg transition-colors border border-rose-800/30 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {editingArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0b0b18] border border-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-white">Edit Artwork</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Artwork Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingArtwork.title}
                  required
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  defaultValue={editingArtwork.price}
                  required
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={editingArtwork.description}
                  required
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingArtwork(null)}
                  className="px-4 py-2 text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-xs font-medium bg-pink-600 hover:bg-pink-500 text-white rounded-xl disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingArtworkId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0b0b18] border border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-center">
            <h3 className="text-xl font-bold mb-2 text-white">Are you sure?</h3>
            <p className="text-gray-400 text-sm mb-6">
              This action cannot be undone. This will permanently delete your artwork.
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingArtworkId(null)}
                className="px-4 py-2 text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-medium bg-rose-600 hover:bg-rose-500 text-white rounded-xl disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}