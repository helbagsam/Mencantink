import React, { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

import { NavTab, BatikMotif, ForumThread, ReviewItem, CartItem, Order, Currency } from './types';
import { MOCK_FORUM_THREADS } from './data/mockData';
import { PRODUCT_ARTISAN_MAP } from './data/trustSeed';
import { ROUTES } from './routes';
import { useSession } from './hooks/useSession';
import {
  getCart,
  getMotifs,
  getOrders,
  saveCart,
  saveMotifs,
  saveOrders,
} from './services/shopService';

import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { MotifModal } from './components/MotifModal';
import { StartDiscussionModal } from './components/StartDiscussionModal';
import { WriteReviewModal } from './components/WriteReviewModal';
import { AuthModal } from './components/AuthModal';
import { RequireRole } from './components/RequireRole';

import { HomeView } from './views/HomeView';
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
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { ArtisanProfileView } from './views/ArtisanProfileView';
import { VerificationQueueView } from './views/VerificationQueueView';

/**
 * Jembatan dari penamaan tab lama ke alamat halaman.
 *
 * Sepuluh berkas tampilan masih memanggil onNavigateTab('catalog') dan
 * sejenisnya. Daripada menyunting kesepuluhnya sekaligus — pekerjaan yang
 * berisiko menjelang peragaan — nama tab lama dipetakan ke alamat baru di satu
 * tempat ini. Tampilannya tidak perlu tahu bahwa aplikasi sekarang punya URL.
 */
const TAB_TO_ROUTE: Record<NavTab, string> = {
  home: ROUTES.home,
  education: ROUTES.learn,
  catalog: ROUTES.learn,
  marketplace: ROUTES.market,
  heritage: ROUTES.heritage,
  community: ROUTES.community,
  artisans: ROUTES.artisans,
  portal: ROUTES.portal,
  onboarding: ROUTES.portalUpload,
  cart: ROUTES.cart,
  checkout: ROUTES.checkout,
  tracking: ROUTES.orders,
};

/** Kembali ke atas setiap berpindah halaman. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

export function App() {
  const navigate = useNavigate();
  const { session } = useSession();

  const [motifs, setMotifs] = useState<BatikMotif[]>([]);
  const [threads, setThreads] = useState<ForumThread[]>(MOCK_FORUM_THREADS);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [currency, setCurrency] = useState<Currency>('IDR');
  const [discountIDR, setDiscountIDR] = useState<number>(0);
  const [hydrated, setHydrated] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [selectedMotifModal, setSelectedMotifModal] = useState<BatikMotif | null>(null);
  const [isStartDiscussionOpen, setIsStartDiscussionOpen] = useState(false);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  /* Memuat data tersimpan sekali di awal. */
  useEffect(() => {
    (async () => {
      const [storedMotifs, storedCart, storedOrders] = await Promise.all([
        getMotifs(),
        getCart(),
        getOrders(),
      ]);
      setMotifs(storedMotifs);
      setCartItems(storedCart);
      setOrders(storedOrders);
      setActiveOrder(storedOrders[0] ?? null);
      setHydrated(true);
    })();
  }, []);

  /* Menyimpan setiap kali berubah — tetapi tidak sebelum data awal selesai
     dimuat, supaya keadaan kosong sesaat tidak menimpa data tersimpan. */
  useEffect(() => {
    if (hydrated) void saveCart(cartItems);
  }, [cartItems, hydrated]);

  useEffect(() => {
    if (hydrated) void saveOrders(orders);
  }, [orders, hydrated]);

  useEffect(() => {
    if (hydrated) void saveMotifs(motifs);
  }, [motifs, hydrated]);


  /* Penyaringan kepemilikan pesanan.
     Sebelumnya daftar pesanan bersifat global: portal setiap pengrajin
     menampilkan seluruh penjualan berikut data pembeli pengrajin lain, dan
     halaman pelacakan menampilkan pesanan siapa pun sebagai milik pengunjung. */
  const pesananSayaSebagaiPembeli = orders.filter(
    (o) => session && o.buyerAccountId === session.accountId,
  );
  const pesananUntukKainSaya = orders.filter(
    (o) => session?.artisanId && o.items.some((i) => i.artisanId === session.artisanId),
  );

  const goTab = useCallback(
    (tab: NavTab) => {
      navigate(TAB_TO_ROUTE[tab]);
    },
    [navigate],
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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
          item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      const newItem: CartItem = {
        id: `cart-${Date.now()}`,
        name: motif.name,
        motifId: motif.id,
        technique: motif.technique,
        fabricType: 'Kain Sutra Halus Primissima',
        priceIDR,
        quantity: 1,
        imageUrl: motif.imageUrl,
        // Nama pengrajin diambil dari motifnya, bukan diseragamkan menjadi
        // "Komunitas Pengrajin Batik" seperti sebelumnya. Nama pembuat justru
        // hal pertama yang dihapus pedagang white label — di sini tidak boleh
        // hilang, apalagi oleh aplikasi kita sendiri.
        artisanName: motif.artisanName ?? 'Pengrajin belum tercatat',
        // Mengikat kain ke pengrajinnya, supaya pesanan nanti hanya masuk ke
        // portal pengrajin yang bersangkutan.
        artisanId: PRODUCT_ARTISAN_MAP[motif.id],
        region: motif.region,
      };
      return [...prev, newItem];
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
        .filter((item): item is CartItem => item !== null),
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
    navigate(ROUTES.orders);
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
        if (ord.id !== orderId) return ord;
        const updatedOrder: Order = {
          ...ord,
          status: nextStatus,
          timeline: [
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
          ],
        };
        if (activeOrder && activeOrder.id === orderId) setActiveOrder(updatedOrder);
        return updatedOrder;
      }),
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
        if (t.id !== threadId) return t;
        return {
          ...t,
          repliesCount: t.repliesCount + 1,
          replies: [
            ...(t.replies || []),
            {
              id: `r-${Date.now()}`,
              authorName: 'Pengrajin Terverifikasi (Anda)',
              authorAvatar: t.authorAvatar,
              timeAgo: 'Baru saja',
              content: replyContent,
            },
          ],
        };
      }),
    );
  };

  const handleAddReview = (_newReview: ReviewItem) => {
    showToast('Ulasan Anda berhasil dikirim!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f5] text-[#1b1c1a] font-sans">
      <ScrollToTop />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#000666] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in border border-[#ffe088]/40">
          <CheckCircle2 className="w-5 h-5 text-[#ffe088]" />
          <span className="text-xs font-bold uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      <Navigation
        onOpenAuth={() => setIsAuthOpen(true)}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      <div className="flex-1">
        <Routes>
          <Route path={ROUTES.home} element={<HomeView onNavigateTab={goTab} />} />

          <Route
            path={ROUTES.learn}
            element={
              <EducationView
                motifs={motifs}
                onSelectMotif={setSelectedMotifModal}
                onAddToCart={handleAddToCart}
                onNavigateTab={goTab}
              />
            }
          />

          <Route path={ROUTES.heritage} element={<HeritageView onNavigateTab={goTab} />} />

          <Route
            path={ROUTES.market}
            element={
              <PasarNusantaraView
                motifs={motifs}
                currency={currency}
                onAddToCart={handleAddToCart}
                onNavigateTab={goTab}
                onSelectMotifDetail={setSelectedMotifModal}
              />
            }
          />

          <Route path={ROUTES.artisans} element={<ArtisansView />} />
          <Route path="/pengrajin/:slug" element={<ArtisanProfileView />} />

          <Route
            path={ROUTES.community}
            element={
              <CommunityView
                threads={threads}
                onOpenStartDiscussion={() => setIsStartDiscussionOpen(true)}
                onAddReply={handleAddReply}
              />
            }
          />

          <Route
            path={ROUTES.cart}
            element={
              <CartView
                items={cartItems}
                currency={currency}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveCartItem}
                onNavigateTab={goTab}
                discountIDR={discountIDR}
                onApplyDiscount={setDiscountIDR}
              />
            }
          />

          <Route
            path={ROUTES.checkout}
            element={
              <CheckoutView
                items={cartItems}
                currency={currency}
                discountIDR={discountIDR}
                onNavigateTab={goTab}
                onCompleteCheckout={handleCompleteCheckout}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            }
          />

          <Route
            path={ROUTES.orders}
            element={
              <OrderTrackingView
                activeOrder={
                  activeOrder && pesananSayaSebagaiPembeli.some((o) => o.id === activeOrder.id)
                    ? activeOrder
                    : (pesananSayaSebagaiPembeli[0] ?? null)
                }
                currency={currency}
                onNavigateTab={goTab}
                onUpdateOrderStatus={handleUpdateOrderStatus}
              />
            }
          />

          <Route
            path={ROUTES.portal}
            element={
              <RequireRole
                allow={['artisan']}
                reason="Portal memuat daftar pesanan berikut nama dan kota pembeli, jadi hanya terbuka untuk pengrajin yang bersangkutan."
                onOpenAuth={() => setIsAuthOpen(true)}
              >
                <DashboardView
                  onNavigateTab={goTab}
                  onOpenWriteReview={() => setIsWriteReviewOpen(true)}
                  onOpenStartDiscussion={() => setIsStartDiscussionOpen(true)}
                  orders={pesananUntukKainSaya}
                />
              </RequireRole>
            }
          />

          <Route
            path={ROUTES.portalUpload}
            element={
              <RequireRole
                allow={['artisan']}
                reason="Hanya pengrajin terdaftar yang boleh menerbitkan kain beserta paket buktinya."
                onOpenAuth={() => setIsAuthOpen(true)}
              >
                <OnboardingView
                  onNavigateTab={goTab}
                  onAddProductToCatalog={handleAddProductToCatalog}
                />
              </RequireRole>
            }
          />

          <Route
            path={ROUTES.verification}
            element={
              <RequireRole
                allow={['verifier']}
                reason="Ruang tinjauan hanya untuk verifikator, karena di sinilah keputusan keaslian dibuat dan dicatat atas nama seseorang."
                onOpenAuth={() => setIsAuthOpen(true)}
              >
                <VerificationQueueView />
              </RequireRole>
            }
          />

          <Route path={ROUTES.login} element={<LoginView />} />
          <Route path={ROUTES.register} element={<RegisterView />} />

          {/* Alamat tak dikenal dikembalikan ke beranda. */}
          <Route path="*" element={<HomeView onNavigateTab={goTab} />} />
        </Routes>
      </div>

      <Footer onTabChange={goTab} />

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

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}

export default App;
