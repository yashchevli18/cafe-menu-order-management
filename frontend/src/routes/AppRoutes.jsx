import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loader from '../components/common/Loader';
import HomePage from '../pages/HomePage';
import MenuPage from '../pages/MenuPage';

const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('../pages/OrderConfirmationPage'));
const OrderTrackingPage = lazy(() => import('../pages/OrderTrackingPage'));
const TableQrPage = lazy(() => import('../pages/TableQrPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const AppRoutes = () => (
  <Suspense fallback={<Loader fullScreen label="Brewing the page..." />}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
      <Route path="/track-order" element={<OrderTrackingPage />} />
      <Route path="/table-qr" element={<TableQrPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
