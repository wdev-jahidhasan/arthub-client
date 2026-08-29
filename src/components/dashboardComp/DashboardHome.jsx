'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSession } from '@/lib/auth-client';
import { imageUpload } from '@/lib/imageUpload';
import toast from 'react-hot-toast';

export default function DashboardHome() {
  const { data: session, isPending, error } = useSession();

  // Modal & Edit Form States
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (isPending) {
    return (
      <div className="w-full max-w-2xl mx-auto my-8 p-6 bg-[#0b0f17] border border-zinc-800/80 rounded-2xl animate-pulse flex items-center justify-center min-h-[160px]">
        <div className="h-5 w-40 bg-zinc-800 rounded-md" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="w-full max-w-md mx-auto my-12 p-6 bg-[#0b0f17] border border-zinc-800/80 rounded-2xl text-center text-zinc-400 text-sm">
        Please log in to view your dashboard.
      </div>
    );
  }

  const { user } = session;
  const userName = user?.name || 'User 01';
  const userInitial = userName.charAt(0).toUpperCase();
  const rawRole = user?.role ? user.role.toLowerCase() : 'user';
  const userRoleDisplay = user?.role || 'user';
  const artworksCount = user?.artworksCount || 0;
  const userPlan = user?.plan || 'Free Plan';

  const isUser = rawRole === 'user';
  const isArtist = rawRole === 'artist';
  const isAdmin = rawRole === 'admin';

  // Modal Open Handler
  const handleOpenEditModal = () => {
    setName(user.name || '');
    setPreviewUrl(user.image || '');
    setSelectedFile(null);
    setIsOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Update Functionality
  const handleSave = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    let imageUrl = user.image;

    if (selectedFile) {
      imageUrl = await imageUpload(selectedFile);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        name: name,
        image: imageUrl,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setIsOpen(false);
      toast.success('Profile Updated Successfully!', { duration: 3000 });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

    setIsUploading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 font-sans">
      {/* 1. Dashboard Greeting Header */}
      <div className="w-full bg-[#0b0f17] border border-zinc-800/80 rounded-2xl p-6 shadow-xl">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Hello, <span className="text-pink-500">{userName}</span> 👋
          </h1>

          <div className="text-sm md:text-base text-zinc-300 font-medium">
            Welcome to your{' '}
            <span className="inline-block font-semibold text-pink-400 capitalize px-2 py-0.5 rounded-md bg-pink-500/10 border border-pink-500/20 text-xs">
              {userRoleDisplay}
            </span>{' '}
            dashboard.
          </div>

          <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
            Go to menu tabs to see more about your activities
          </p>
        </div>
      </div>

      {/* 2. Profile Details & Management Card */}
      <div className="w-full bg-[#0b0f17] border border-zinc-800/80 rounded-2xl p-6 shadow-xl text-white">
        {/* Profile Picture */}
        <div className="flex justify-center mb-3">
          <div className="w-20 h-20 rounded-full p-1 border-2 border-purple-500/40 bg-[#0b0f17] shadow-md relative overflow-hidden flex items-center justify-center">
            {user.image ? (
              <Image
                src={user.image}
                alt={userName}
                width={80}
                height={80}
                className="w-full h-full rounded-full object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-900 to-pink-600 text-white flex items-center justify-center text-2xl font-bold">
                {userInitial}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Name */}
        <div className="text-center mb-5">
          <h2 className="text-xl font-bold text-white tracking-wide">{userName}</h2>
        </div>

        {/* Dynamic Details Cards */}
        <div className="space-y-2.5 mb-5">
          <div className="bg-[#121824] p-3 rounded-xl border border-zinc-800/80">
            <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">
              Email Address
            </span>
            <span className="text-xs md:text-sm font-medium text-zinc-200 break-all">{user.email}</span>
          </div>

          <div className={`grid gap-2.5 ${isAdmin ? 'grid-cols-1' : 'grid-cols-2'}`}>
            <div className="bg-[#121824] p-3 rounded-xl border border-zinc-800/80">
              <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">
                Role
              </span>
              <span className="text-xs md:text-sm font-semibold text-purple-300 capitalize">
                {userRoleDisplay}
              </span>
            </div>

            {(isUser || isArtist) && (
              <div className="bg-[#121824] p-3 rounded-xl border border-zinc-800/80">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">
                  Plan
                </span>
                <span className="text-xs md:text-sm font-semibold text-pink-400 capitalize">
                  {userPlan}
                </span>
              </div>
            )}

            {isArtist && (
              <div className="bg-[#121824] p-3 rounded-xl border border-zinc-800/80 col-span-2">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">
                  Artworks
                </span>
                <span className="text-xs md:text-sm font-semibold text-zinc-200">{artworksCount} Items</span>
              </div>
            )}
          </div>
        </div>

        {/* Edit Profile Action Button */}
        <button
          onClick={handleOpenEditModal}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-purple-950/20"
        >
          Edit Profile
        </button>

        {/* Edit Modal */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-[#0b0f17] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-white">
              <div className="p-3.5 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="font-bold text-base">Edit Profile</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-400 hover:text-white text-sm"
                  disabled={isUploading}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="p-4 space-y-3.5">
                <div className="flex flex-col items-center gap-2.5">
                  <div className="w-16 h-16 rounded-full border border-purple-500/50 overflow-hidden bg-[#121824] relative flex items-center justify-center">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
                        No Pic
                      </div>
                    )}
                  </div>

                  <label className="cursor-pointer bg-[#121824] border border-zinc-700 hover:border-purple-500 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white transition">
                    Choose New Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1 font-medium">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#121824] border border-zinc-800 rounded-xl p-2.5 text-xs md:text-sm text-white focus:outline-none focus:border-purple-500"
                    placeholder="Your Name"
                  />
                </div>

                <div className="pt-1 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={isUploading}
                    className="px-3.5 py-2 bg-zinc-800 text-xs font-medium rounded-xl hover:bg-zinc-700 transition text-zinc-300 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-xs font-medium text-white rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {isUploading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}