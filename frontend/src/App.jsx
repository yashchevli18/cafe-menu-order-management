import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/cart/CartDrawer';
import AppRoutes from './routes/AppRoutes';
import useTableFromUrl from './hooks/useTableFromUrl';
import useScrollToTop from './hooks/useScrollToTop';

const App = () => {
  useTableFromUrl();
  useScrollToTop();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-full bg-espresso px-4 py-2 text-cream focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default App;
