import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import { useThemeSync } from './hooks/useThemeSync';
import { useRepositorySync } from './store/useContentRevision';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';

/** Public site: single continuous page with a sticky, scroll-spy navbar. */
function PublicApp() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <div className="flex-1">
        <HomePage />
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  useThemeSync();
  useRepositorySync();

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Admin is standalone — its own chrome, no public navbar/footer */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<PublicApp />} />
        {/* Old per-section paths now live on the one-page site */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
