"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { imageUpload } from "@/lib/imageUpload";
import toast from "react-hot-toast";

export default function ProfileDetails() {
  const { data: session, isPending, error } = useSession();

  // Modal & Edit Form States
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  if (isPending) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-[#0b0f17] border border-gray-800/80 rounded-3xl animate-pulse text-center">
        <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4" />
        <div className="h-6 bg-gray-800 rounded w-1/2 mx-auto mb-6" />
        <div className="space-y-3">
          <div className="h-12 bg-gray-800 rounded-xl" />
          <div className="h-12 bg-gray-800 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-[#0b0f17] border border-gray-800/80 rounded-3xl text-center text-gray-400">
        Please log in to view your profile details.
      </div>
    );
  }

  const { user } = session;
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  // Role Logic Check
  const rawRole = user.role ? user.role.toLowerCase() : "user";
  const userRoleDisplay = user.role || "User";
  const artworksCount = user.artworksCount || 0;
  const userPlan = user.plan || "Free Plan"; // API/Session static fallback

  const isUser = rawRole === "user";
  const isArtist = rawRole === "artist";
  const isAdmin = rawRole === "admin";

  // Modal Open Handler
  const handleOpenEditModal = () => {
    setName(user.name || "");
    setPreviewUrl(user.image || "");
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
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
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
      toast.success("Profile Updated Successfully!", {
        duration: 3000,
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

    setIsUploading(false);
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-[#0b0f17] border border-gray-800/60 rounded-3xl shadow-2xl text-white font-sans">
      {/* 1. Profile Picture */}
      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 rounded-full p-1 border-2 border-purple-500/40 bg-[#0b0f17] shadow-lg shadow-purple-950/20 relative overflow-hidden flex items-center justify-center">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "Profile Image"}
              width={96}
              height={96}
              className="w-full h-full rounded-full object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-900 to-pink-600 text-white flex items-center justify-center text-3xl font-bold">
              {userInitial}
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Name */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white tracking-wide">
          {user.name}
        </h2>
      </div>

      {/* Dynamic Details Cards */}
      <div className="space-y-3 mb-6">
        {/* Email */}
        <div className="bg-[#121824] p-4 rounded-xl border border-gray-800/80">
          <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Email Address
          </span>
          <span className="text-sm font-medium text-gray-200 break-all">
            {user.email}
          </span>
        </div>

        {/* Dynamic Details Grid based on Role */}
        <div className={`grid gap-3 ${isAdmin ? "grid-cols-1" : "grid-cols-2"}`}>
          {/* Role (All Users) */}
          <div className="bg-[#121824] p-4 rounded-xl border border-gray-800/80">
            <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Role
            </span>
            <span className="text-sm font-semibold text-purple-300 capitalize">
              {userRoleDisplay}
            </span>
          </div>

          {/* Plan (Visible for User and Artist) */}
          {(isUser || isArtist) && (
            <div className="bg-[#121824] p-4 rounded-xl border border-gray-800/80">
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Plan
              </span>
              <span className="text-sm font-semibold text-pink-400 capitalize">
                {userPlan}
              </span>
            </div>
          )}

          {/* Artworks Count (Visible ONLY for Artist) */}
          {isArtist && (
            <div className="bg-[#121824] p-4 rounded-xl border border-gray-800/80 col-span-2">
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Artworks
              </span>
              <span className="text-sm font-semibold text-gray-200">
                {artworksCount} Items
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Action Button */}
      <button
        onClick={handleOpenEditModal}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-950/30"
      >
        Edit Profile
      </button>

      {/* Edit Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0b0f17] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden text-white">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="font-bold text-lg">Edit Profile</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
                disabled={isUploading}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              {/* Image Picker Section */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full border border-purple-500/50 overflow-hidden bg-[#121824] relative flex items-center justify-center">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                      No Pic
                    </div>
                  )}
                </div>

                <label className="cursor-pointer bg-[#121824] border border-gray-700 hover:border-purple-500 px-4 py-2 rounded-xl text-xs font-medium text-gray-300 hover:text-white transition">
                  Choose New Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#121824] border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500"
                  placeholder="Your Name"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isUploading}
                  className="px-4 py-2 bg-gray-800 text-sm font-medium rounded-xl hover:bg-gray-700 transition text-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-medium text-white rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploading ? "Uploading & Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}