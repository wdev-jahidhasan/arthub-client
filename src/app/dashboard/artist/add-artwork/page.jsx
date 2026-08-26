"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { imageUpload } from "@/lib/imageUpload";

const ART_CATEGORIES = [
  { key: "painting", label: "Painting" },
  { key: "digital", label: "Digital Art" },
  { key: "sculpture", label: "Sculpture" },
  { key: "sketch", label: "Sketch" },
];

export default function ArtistAddArtworkPage() {
  const { data: session, isPending } = authClient.useSession();

  const [category, setCategory] = useState("painting");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!session?.user) {
      setError("You must be logged in as an artist to publish artwork.");
      return;
    }

    if (!imageFile) {
      setError("Please upload an artwork image!");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    const price = formData.get("price");
    const medium = formData.get("medium");
    const dimensions = formData.get("dimensions");
    const description = formData.get("description");

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await imageUpload(imageFile);
      }

      const artworkData = {
        title,
        category,
        price: Number(price),
        medium,
        imageUrl,
        dimensions,
        description,
        artistId: session.user.id,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artworks/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(artworkData),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || "Failed to publish artwork.");
      }

      toast.success("Artwork published successfully!");

      // Form Reset
      e.target.reset();
      setImageFile(null);
      setImagePreview(null);
      setCategory("painting");
    } catch (err) {
      console.error("Failed to publish artwork:", err);
      setError(err.message || "Failed to publish artwork. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="bg-slate-950 flex items-center justify-center px-4 py-8 min-h-screen">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-100">Add New Artwork</h2>
          <p className="text-xs text-slate-400 mt-1">
            Share your masterpiece with the art community
          </p>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Image Upload Input */}
          <div className="flex flex-col items-center justify-center space-y-2 mb-2">
            <label className="relative cursor-pointer flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-slate-800 hover:border-[#E641B2] bg-slate-950 transition-colors overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-300">
                  <svg
                    className="w-8 h-8 mb-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-xs font-medium">Upload Artwork Image</span>
                </div>
              )}
              <input
                type="file"
                name="image"
                accept="image/*"
                required
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Artwork Title
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g., Starry Night over the Sea"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#7A156E] transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Category
            </label>
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#7A156E] transition-colors cursor-pointer"
            >
              {ART_CATEGORIES.map((cat) => (
                <option
                  key={cat.key}
                  value={cat.key}
                  className="bg-slate-900 text-slate-100"
                >
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price & Medium (Side by side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="1"
                required
                placeholder="250"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#7A156E] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Medium / Tools
              </label>
              <input
                type="text"
                name="medium"
                required
                placeholder="e.g., Oil on Canvas, Photoshop"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#7A156E] transition-colors"
              />
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Dimensions <span className="text-slate-500">(Optional)</span>
            </label>
            <input
              type="text"
              name="dimensions"
              placeholder='e.g., 24" x 36" or 1080x1920 px'
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#7A156E] transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Tell the story behind this artwork..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#7A156E] transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7A156E] hover:bg-[#A31D93] text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-md shadow-[#7A156E]/30 border border-[#A31D93] active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Publishing Artwork..." : "Publish Artwork"}
          </button>
        </form>

      </div>
    </div>
  );
}