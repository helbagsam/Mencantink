export type NavTab = 'home' | 'education' | 'marketplace' | 'cart' | 'checkout' | 'tracking' | 'portal' | 'onboarding' | 'community' | 'heritage' | 'artisans' | 'catalog';

export type Currency = 'IDR' | 'USD';

export interface EventItem {
  id: string;
  title: string;
  category: 'Festival' | 'Workshop' | 'Webinar' | 'Pameran' | 'Lomba';
  date: string;
  time: string;
  location: string;
  organizer: string;
  description: string;
  imageUrl: string;
  attendeesCount: number;
  isRegistered?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  motifId?: string;
  technique: 'Tulis' | 'Cap' | 'Kombinasi';
  fabricType: string;
  priceIDR: number;
  quantity: number;
  imageUrl: string;
  artisanName?: string;
  region?: string;
}

export interface OrderTimelineItem {
  id: string;
  title: string;
  titleId: string;
  timestamp: string;
  description: string;
  descriptionId: string;
  completed: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotalIDR: number;
  shippingCostIDR: number;
  taxIDR: number;
  discountIDR: number;
  totalIDR: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'bank_transfer' | 'va' | 'card' | 'ewallet';
  paymentBank?: string;
  status: 'placed' | 'crafting' | 'shipped' | 'delivered';
  trackingId: string;
  timeline: OrderTimelineItem[];
}

export interface BatikMotif {
  id: string;
  name: string;
  region: string;
  technique: 'Tulis' | 'Cap' | 'Kombinasi';
  motifType: 'Geometris' | 'Non-Geometris' | 'Abstract / Floral' | 'Satwa & Alam';
  description: string;
  philosophy: string;
  originHistory: string;
  ciriKhas?: string;
  prosesPembuatan?: string[];
  imageUrl: string;
  featured?: boolean;
  priceEstimate?: string;
  priceIDR?: number;
  artisanName?: string;
  tags: string[];
}

export interface ReviewItem {
  id: string;
  itemName: string;
  rating: number;
  reviewText: string;
  reviewerName: string;
  reviewerRole: string;
}

export interface EditorialArticle {
  id: string;
  category: string;
  title: string;
  imageUrl: string;
  readTime: string;
  summary: string;
}

export interface ForumReply {
  id: string;
  authorName: string;
  authorAvatar: string;
  timeAgo: string;
  content: string;
}

export interface ForumThread {
  id: string;
  authorName: string;
  authorAvatar: string;
  timeAgo: string;
  category: 'Teknik Pewarnaan Alami' | 'Filosofi Motif' | 'Tips Sertifikasi' | 'Peralatan & Bahan';
  title: string;
  content: string;
  repliesCount: number;
  viewsCount: number;
  replies?: ForumReply[];
}

export interface ProductListingDraft {
  productName: string;
  price: string;
  description: string;
  imageUrl: string | null;
  technique: 'Tulis' | 'Cap';
  region: string;
  status: 'Draft' | 'Submitted';
}
