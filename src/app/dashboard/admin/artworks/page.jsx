"use client"
import { Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const AdminArtworksPage = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for Delete Confirmation Modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    artworkId: null,
    artworkTitle: '',
  });

  // Fetch all artworks
  const fetchArtworks = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artworks`);
      const data = await response.json();
      if (data.success) {
        setArtworks(data.data);
      }
    } catch (error) {
      console.error('Error fetching artworks:', error);
      toast.error('Failed to fetch artworks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  // Open Delete Confirmation Modal
  const handleDeleteClick = (artwork) => {
    setDeleteModal({
      isOpen: true,
      artworkId: artwork._id,
      artworkTitle: artwork.title || artwork.name || 'this artwork',
    });
  };

  // Actual Delete API Call
  const confirmDelete = async () => {
    const { artworkId } = deleteModal;
    setDeleteModal({ isOpen: false, artworkId: null, artworkTitle: '' });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artworks/${artworkId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Artwork deleted successfully!');
        fetchArtworks(); // Refresh the list
      } else {
        toast.error(data.message || 'Failed to delete artwork');
      }
    } catch (error) {
      console.error('Error deleting artwork:', error);
      toast.error('Something went wrong!');
    }
  };

  // Helper function to dynamically assign category badge colors
  const getCategoryBadgeStyle = (category) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('painting') || cat.includes('art')) {
      return 'bg-purple-950/80 text-purple-400 border border-purple-800/50';
    } else if (cat.includes('digital') || cat.includes('photo')) {
      return 'bg-blue-950/80 text-blue-400 border border-blue-800/50';
    } else if (cat.includes('sketch') || cat.includes('draw')) {
      return 'bg-yellow-950/80 text-yellow-400 border border-yellow-800/50';
    } else {
      return 'bg-green-950/80 text-green-400 border border-green-800/50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center w-full bg-[#05050d] text-white py-28 gap-4">
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
        <p className="text-gray-400 text-sm font-medium tracking-wide animate-pulse">Loading</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070913] p-6 md:p-10 text-left text-white relative">
      {/* Toast Container */}
      <Toaster toastOptions={{ style: { background: '#121826', color: '#fff' } }} />

      <div className="w-full">
        <h2 className="text-2xl font-bold mb-6 text-white tracking-wide">Manage All Artworks</h2>
        
        {/* Table Container with Dark Background */}
        <div className="overflow-x-auto bg-[#0b0f19] border border-gray-800 shadow-2xl rounded-xl">
          <table className="min-w-full divide-y divide-gray-800 text-left">
            <thead className="bg-[#101726]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">PICTURE</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">TITLE</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">CATEGORY</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">PRICE</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="bg-[#0b0f19] divide-y divide-gray-800/60">
              {artworks.length > 0 ? (
                artworks.map((artwork) => {
                  const categoryName = artwork.category || artwork.genre || 'General';
                  return (
                    <tr key={artwork._id} className="hover:bg-gray-900/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-left">
                        <div className="w-16 h-12 relative rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
                          <Image
                            src={artwork.image || artwork.imageUrl || artwork.photo || '/placeholder.png'}
                            alt={artwork.title || 'Artwork'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200 text-left">
                        {artwork.title || artwork.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-left">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryBadgeStyle(categoryName)}`}>
                          {categoryName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-semibold text-left">
                        ${artwork.price || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-left">
                        <button
                          onClick={() => handleDeleteClick(artwork)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950/60 border border-red-800/50 text-red-400 hover:bg-red-900/60 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                    No artworks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Delete Confirmation Dialog Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#121826] border border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl text-left">
            <h3 className="text-xl font-bold text-white mb-3">Delete Artwork</h3>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Are you sure you want to delete <span className="text-pink-400 font-semibold">"{deleteModal.artworkTitle}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, artworkId: null, artworkTitle: '' })}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArtworksPage;