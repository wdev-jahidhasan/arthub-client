import { subscriptionConfig } from '@/app/config/subscriptionConfig';
import PurchaseButton from '@/components/dashboardComp/PurchaseButton';
import ArtworkReviewsModal from '@/components/ArtworkReviewsModal';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

async function getSingleArtwork(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artworks/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

async function getBoughtArtworksCount(userId) {
  if (!userId) return 0;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/purchases?userId=${userId}`, {
      cache: 'no-store',
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.data ? data.data.length : 0;
  } catch (error) {
    return 0;
  }
}

export default async function ArtworkDetailsPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  const session = await auth.api.getSession({
    headers: await headers()
  });

  const userId = session?.user?.id;
  const user = session?.user || null;

  const [artwork, totalBought] = await Promise.all([
    getSingleArtwork(id),
    getBoughtArtworksCount(userId)
  ]);

  if (!artwork) {
    return (
      <div className="bg-slate-950 text-white flex items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-bold tracking-wide">Artwork Not Found!</h2>
      </div>
    );
  }

  const userRole = user?.role;
  const isArtist = userRole === 'artist';

  const artworkArtistId = artwork.artistId || artwork.artistInfo?._id;
  const artistName = artwork.artistInfo?.name || artwork.artistInfo?.email || 'Unknown Artist';

  const isOwnerArtist = isArtist && userId && artworkArtistId && String(userId) === String(artworkArtistId);

  const userPlan = user?.plan || 'Free';
  const currentSub = subscriptionConfig.find(
    (sub) => sub.tier.toLowerCase() === userPlan.toLowerCase()
  );
  const maxPurchases = currentSub ? currentSub.maxPurchases : 3;

  const isLimitExceeded = maxPurchases !== 'Unlimited' && totalBought >= maxPurchases;
  const categoryName = artwork.category ? artwork.category.toUpperCase() : 'ABSTRACT';

  const materialInfo = artwork.medium || artwork.material || artwork.media || 'Canvas';

  const uploadDate = artwork.createdAt
    ? new Date(artwork.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'N/A';

  const imageUrl = artwork.image || artwork.imageUrl || 'https://via.placeholder.com/600x500';

  return (
    <div className="bg-slate-950 text-slate-100 py-16 px-4 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/4 left-1/6 w-[30rem] h-[30rem] bg-purple-600/15 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/6 w-[30rem] h-[30rem] bg-pink-600/15 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-5xl w-full bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 md:p-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          <div className="lg:col-span-5 relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 shadow-inner group w-full h-[380px] sm:h-[450px]">
            <Image
              src={imageUrl}
              alt={artwork.title || 'Artwork'}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {artwork.title || 'Untitled Artwork'}
              </h1>

              {artworkArtistId && (
                <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                  <p className="text-sm text-slate-400">
                    Created by:{' '}
                    <Link
                      href={`/artworks?artistId=${artworkArtistId}`}
                      className="text-pink-400 font-semibold hover:underline"
                    >
                      {artistName}
                    </Link>
                  </p>

                  <p className="text-xl font-bold text-pink-400">
                    {artwork.price ? `$${artwork.price}` : 'N/A'}
                  </p>
                </div>
              )}
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              {artwork.description || artwork.details || 'No description available for this artwork.'}
            </p>

            {/* Specifications Grid: Material, Category, Date Uploaded */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-5 border-y border-white/10 text-sm">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Material</p>
                <p className="font-medium text-slate-100 mt-1 truncate">{materialInfo}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Category</p>
                <p className="font-medium text-slate-100 mt-1 tracking-wide">{categoryName}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Uploaded</p>
                <p className="font-medium text-slate-100 mt-1">{uploadDate}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              {isOwnerArtist ? (
                <div className="flex flex-wrap items-center justify-between w-full pt-2 gap-4">
                  <div className="flex items-center gap-6">
                    <Link
                      href="/dashboard/artist/artworks"
                      className="text-pink-400 font-semibold hover:underline text-sm sm:text-base inline-flex items-center gap-1"
                    >
                      Edit Artwork &rarr;
                    </Link>
                    <Link
                      href="/dashboard/artist/artworks"
                      className="text-red-400 font-semibold hover:underline text-sm sm:text-base inline-flex items-center gap-1"
                    >
                      Delete Artwork &rarr;
                    </Link>
                  </div>
                  <ArtworkReviewsModal artworkId={artwork._id} artworkTitle={artwork.title} />
                </div>
              ) : (
                <div className="w-full flex flex-col gap-2">
                  <div className="w-full flex items-center justify-between">
                    <PurchaseButton
                      price={artwork.price}
                      title={artwork.title}
                      artworkId={artwork._id}
                      imageUrl={imageUrl}
                      disabled={isArtist || isLimitExceeded}
                      isLoggedIn={!!user}
                    />

                    <ArtworkReviewsModal artworkId={artwork._id} artworkTitle={artwork.title} />
                  </div>

                  {isArtist && (
                    <span className="text-xs text-amber-400 tracking-wide font-medium">
                      Artists cannot purchase artworks.
                    </span>
                  )}

                  {!isArtist && isLimitExceeded && (
                    <div className="text-right">
                      <p className="text-xs text-red-400 font-medium">
                        You have reached your plan limit ({totalBought}/{maxPurchases}).
                      </p>
                      <Link
                        href="/dashboard/user/subscription"
                        className="text-xs text-pink-400 underline font-semibold hover:text-pink-300 transition-colors mt-0.5 inline-block"
                      >
                        Upgrade your plan to buy more &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}