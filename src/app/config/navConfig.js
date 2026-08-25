import { 
  Users, Palette, Receipt, BarChart3, PlusCircle, History, 
  Grid, Crown, Globe, LayoutDashboard, DollarSign, Heart, 
  Star, Settings 
} from 'lucide-react';

export const navConfig = {
  admin: [
    { label: "Dashboard Home Page", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/manage-users", icon: Users },
    { label: "Manage Artworks", href: "/dashboard/admin/artworks", icon: Palette },
    { label: "Manage Transactions", href: "/dashboard/admin/transactions", icon: Receipt },
    { label: "Analytics Overview", href: "/dashboard/admin/analytics", icon: BarChart3 },
    { label: "Platform Settings", href: "/dashboard/admin/settings", icon: Settings },
    { label: "ArtHub Home Page", href: "/", icon: Globe },
  ],
  artist: [
    { label: "Dashboard Home Page", href: "/dashboard/artist", icon: LayoutDashboard },
    { label: "My Artworks", href: "/dashboard/artist/artworks", icon: Palette },
    { label: "Add New Artwork", href: "/dashboard/artist/add-artwork", icon: PlusCircle },
    { label: "Sales History", href: "/dashboard/artist/sales-history", icon: DollarSign },
    { label: "Analytics & Earnings", href: "/dashboard/artist/analytics", icon: BarChart3 },
    { label: "ArtHub Home Page", href: "/", icon: Globe },
  ],
  user: [
    { label: "Dashboard Home Page", href: "/dashboard/user", icon: LayoutDashboard },
    { label: "Purchase History", href: "/dashboard/user/purchase-history", icon: History },
    { label: "My Collection", href: "/dashboard/user/bought-artworks", icon: Grid },
    // { label: "Wishlist", href: "/dashboard/user/wishlist", icon: Heart },
    { label: "Subscription Tier", href: "/dashboard/user/subscription", icon: Crown },
    { label: "My Reviews", href: "/dashboard/user/reviews", icon: Star },
    { label: "ArtHub Home Page", href: "/", icon: Globe },
  ],
};