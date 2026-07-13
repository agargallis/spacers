import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import ScrollToTopButton from './components/layout/ScrollToTopButton';
import IntroSplash from './components/layout/IntroSplash';
import { useThemeSync } from './hooks/useThemeSync';
import { useRepositorySync } from './store/useContentRevision';
import { useLiveContentSync } from './services/liveContent';
import { useOverridesSync } from './services/overrides';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import LegalPage from './pages/LegalPage';
import NotFoundPage from './pages/NotFoundPage';
import { legalContent } from './data/legal';

/** Public chrome (navbar + footer + back-to-top) around any public page. */
function PublicLayout({ children }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

export default function App() {
  const location = useLocation();
  useThemeSync();
  useRepositorySync();
  useLiveContentSync();
  useOverridesSync();

  const isAdmin = location.pathname.startsWith('/ndbajcksd');

  return (
    <>
      {!isAdmin && <IntroSplash />}
      <ScrollToTop />
      <Routes>
        {/* Admin is standalone (secret path) — its own chrome */}
        <Route path="/ndbajcksd" element={<AdminPage />} />
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/privacy" element={<PublicLayout><LegalPage {...legalContent.privacy} /></PublicLayout>} />
        <Route path="/cookies" element={<PublicLayout><LegalPage {...legalContent.cookies} /></PublicLayout>} />
        <Route path="/terms" element={<PublicLayout><LegalPage {...legalContent.terms} /></PublicLayout>} />
        {/* Custom 404 for any unknown path */}
        <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
      </Routes>
    </>
  );
}
