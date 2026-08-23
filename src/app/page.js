// import ArtCarousel from "@/components/ArtCarousel";
import ArtCategories from "@/components/ArtCategories";
import FeaturedArtworks from "@/components/FeaturedArtWorks";
import HeroBanner from "@/components/HeroBanner";
// import HeroSection from "@/components/HeroSection";
import TopArtists from "@/components/TopArtists";

export default function Home() {
  return (
    <div>
      {/* <HeroSection></HeroSection> */}
      {/* <ArtCarousel></ArtCarousel> */}
      <HeroBanner></HeroBanner>
      <FeaturedArtworks></FeaturedArtworks>
      <TopArtists></TopArtists>
      <ArtCategories></ArtCategories>
    </div>
  );
}
