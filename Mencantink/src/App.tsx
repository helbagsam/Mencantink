import React, { useState } from 'react';
import { NavTab, BatikMotif, ForumThread, ReviewItem, CartItem, Order, Currency } from './types';
import { INITIAL_MOTIFS, MOCK_FORUM_THREADS } from './data/mockData';
import { INITIAL_CART_ITEMS, INITIAL_ORDER_SAMPLE } from './data/cartMock';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { MotifModal } from './components/MotifModal';
import { StartDiscussionModal } from './components/StartDiscussionModal';
import { WriteReviewModal } from './components/WriteReviewModal';
import { AuthModal } from './components/AuthModal';

import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { EducationView } from './views/EducationView';
import { PasarNusantaraView } from './views/PasarNusantaraView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { DashboardView } from './views/DashboardView';
import { OnboardingView } from './views/OnboardingView';
import { CommunityView } from './views/CommunityView';
import { HeritageView } from './views/HeritageView';
import { ArtisansView } from './views/ArtisansView';
import { CheckCircle2 } from 'lucide-react';
import { IMG } from './assets/images';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [motifs, setMotifs] = useState<BatikMotif[]>(INITIAL_MOTIFS);
  const [threads, setThreads] = useState<ForumThread[]>(MOCK_FORUM_THREADS);

  // E-Commerce State
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [orders, setOrders] = useState<Order[]>([INITIAL_ORDER_SAMPLE]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(INITIAL_ORDER_SAMPLE);
  const [currency, setCurrency] = useState<Currency>('IDR');
  const [discountIDR, setDiscountIDR] = useState<number>(0);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal States
  const [selectedMotifModal, setSelectedMotifModal] = useState<BatikMotif | null>(null);
  const [isStartDiscussionOpen, setIsStartDiscussionOpen] = useState(false);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToCart = (motif: BatikMotif) => {
    let priceIDR = motif.priceIDR || 750000;
    if (!motif.priceIDR && motif.priceEstimate) {
      const match = motif.priceEstimate.match(/(\d[\d,.]*)/);
      if (match) {
        const parsed = parseInt(match[1].replace(/[,.]/g, ''), 10);
        if (!isNaN(parsed) && parsed > 100000) {
          priceIDR = parsed;
        }
      }
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.motifId === motif.id || item.name === motif.name);
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        const newItem: CartItem = {
          id: `cart-${Date.now()}`,
          name: motif.name,
          motifId: motif.id,
          technique: motif.technique,
          fabricType: 'Kain Sutra Halus Primissima',
          priceIDR: priceIDR,
          quantity: 1,
          imageUrl: motif.imageUrl,
          artisanName: 'Komunitas Pengrajin Batik',
          region: motif.region,
        };
        return [...prev, newItem];
      }
    });

    showToast(`"${motif.name}" berhasil ditambahkan ke keranjang!`);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Produk dihapus dari keranjang.');
  };

  const handleCompleteCheckout = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setCartItems([]);
    setDiscountIDR(0);
    setCurrentTab('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Pembayaran Berhasil! Pesanan #${newOrder.id} sedang diproses.`);
  };

  const handleUpdateOrderStatus = (orderId: string, nextStatus: Order['status']) => {
    const statusTitles: Record<Order['status'], { en: string; id: string }> = {
      placed: { en: 'Order Placed & Verified', id: 'Pesanan Dibuat & Diverifikasi' },
      crafting: { en: 'Artisan Crafting & Dye Inspection', id: 'Proses Pengerjaan & Pewarnaan' },
      shipped: { en: 'Dispatched via Express Courier', id: 'Diserahkan ke Kurir Ekspedisi' },
      delivered: { en: 'Package Delivered Safely', id: 'Paket Berhasil Diterima' },
    };

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedTimeline = [
            {
              id: `tl-${Date.now()}`,
              title: statusTitles[nextStatus].en,
              titleId: statusTitles[nextStatus].id,
              timestamp: 'Baru saja',
              description: `Status updated to ${nextStatus.toUpperCase()} by Artisan Master Portal.`,
              descriptionId: `Status diperbarui menjadi ${nextStatus.toUpperCase()} oleh Portal Pengrajin.`,
              completed: true,
            },
            ...ord.timeline,
          ];
          const updatedOrder: Order = {
            ...ord,
            status: nextStatus,
            timeline: updatedTimeline,
          };
          if (activeOrder && activeOrder.id === orderId) {
            setActiveOrder(updatedOrder);
          }
          return updatedOrder;
        }
        return ord;
      })
    );

    showToast(`Status Pesanan #${orderId} diperbarui menjadi: ${nextStatus.toUpperCase()}`);
  };

  const handleAddProductToCatalog = (newMotif: BatikMotif) => {
    setMotifs((prev) => [newMotif, ...prev]);
  };

  const handleAddThread = (newThread: ForumThread) => {
    setThreads((prev) => [newThread, ...prev]);
  };

  const handleAddReply = (threadId: string, replyContent: string) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          const updatedReplies = [
            ...(t.replies || []),
            {
              id: `r-${Date.now()}`,
              authorName: 'Pengrajin Terverifikasi (Anda)',
              authorAvatar: IMG['artisan_avatar'],
              timeAgo: 'Baru saja',
              content: replyContent,
            },
          ];
          return {
            ...t,
            repliesCount: t.repliesCount + 1,
            replies: updatedReplies,
          };
        }
        return t;
      })
    );
  };

  const handleAddReview = (newReview: ReviewItem) => {
    showToast('Ulasan Anda berhasil dikirim!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f5] text-[#1b1c1a] font-sans">
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#000666] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in border border-[#ffe088]/40">
          <CheckCircle2 className="w-5 h-5 text-[#ffe088]" />
          <span className="text-xs font-bold uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      {/* Shared Navigation Header */}
      <Navigation
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        currency={currency}
        onCurrencyChange={(c) => setCurrency(c)}
      />

      {/* Main View Router */}
      <div className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {(currentTab === 'education' || currentTab === 'catalog') && (
          <EducationView
            motifs={motifs}
            onSelectMotif={(motif) => setSelectedMotifModal(motif)}
            onAddToCart={handleAddToCart}
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'marketplace' && (
          <PasarNusantaraView
            motifs={motifs}
            currency={currency}
            onAddToCart={handleAddToCart}
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectMotifDetail={(motif) => setSelectedMotifModal(motif)}
          />
        )}

        {currentTab === 'cart' && (
          <CartView
            items={cartItems}
            currency={currency}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            discountIDR={discountIDR}
            onApplyDiscount={(disc) => setDiscountIDR(disc)}
          />
        )}

        {currentTab === 'checkout' && (
          <CheckoutView
            items={cartItems}
            currency={currency}
            discountIDR={discountIDR}
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCompleteCheckout={handleCompleteCheckout}
          />
        )}

        {currentTab === 'tracking' && (
          <OrderTrackingView
            activeOrder={activeOrder}
            currency={currency}
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {currentTab === 'portal' && (
          <DashboardView
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenWriteReview={() => setIsWriteReviewOpen(true)}
            onOpenStartDiscussion={() => setIsStartDiscussionOpen(true)}
            orders={orders}
          />
        )}

        {currentTab === 'onboarding' && (
          <OnboardingView
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAddProductToCatalog={handleAddProductToCatalog}
          />
        )}

        {currentTab === 'community' && (
          <CommunityView
            threads={threads}
            onOpenStartDiscussion={() => setIsStartDiscussionOpen(true)}
            onAddReply={handleAddReply}
          />
        )}

        {currentTab === 'heritage' && (
          <HeritageView
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'artisans' && (
          <ArtisansView
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </div>

      {/* Shared Footer */}
      <Footer
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modals & Overlays */}
      <MotifModal
        motif={selectedMotifModal}
        onClose={() => setSelectedMotifModal(null)}
        onAddToCart={handleAddToCart}
        currency={currency}
      />

      <StartDiscussionModal
        isOpen={isStartDiscussionOpen}
        onClose={() => setIsStartDiscussionOpen(false)}
        onSubmit={handleAddThread}
      />

      <WriteReviewModal
        isOpen={isWriteReviewOpen}
        onClose={() => setIsWriteReviewOpen(false)}
        onSubmit={handleAddReview}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}

export default App;
