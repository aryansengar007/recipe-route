import { useState, useEffect, useCallback, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import BrowsePage from './components/BrowsePage';
import FavoritesPage from './components/FavoritesPage';
import RecipeDetailPage from './components/RecipeDetailPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import SearchModal from './components/SearchModal';
import { allRecipes as recipes, type Recipe } from './data/recipes';
import SplashCursor from './components/rb/SplashCursor';
import ClickSpark from './components/rb/ClickSpark';

type Page = 'home' | 'browse' | 'favorites' | 'detail' | 'about' | 'contact';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('rr-favorites') ?? '[]')
  );

  // ── Custom cursor ──
  const cursorRef   = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const mousePos    = useRef({ x: -100, y: -100 });
  const followerPos = useRef({ x: -100, y: -100 });
  const rafRef      = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top  = e.clientY + 'px';
      }
    };

    const onDown = () => followerRef.current?.classList.add('clicking');
    const onUp   = () => followerRef.current?.classList.remove('clicking');

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);

    const animate = () => {
      followerPos.current.x += (mousePos.current.x - followerPos.current.x) * 0.10;
      followerPos.current.y += (mousePos.current.y - followerPos.current.y) * 0.10;
      if (followerRef.current) {
        followerRef.current.style.left = followerPos.current.x + 'px';
        followerRef.current.style.top  = followerPos.current.y + 'px';
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── ⌘K search ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    localStorage.setItem('rr-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [id, ...prev];
      toast(next.includes(id) ? '❤️ Saved to favourites' : '💔 Removed from favourites', { duration: 2000 });
      return next;
    });
  }, []);

  const selectRecipe = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigate = useCallback((p: string) => {
    setPage(p as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const relatedRecipes = selectedRecipe
    ? recipes
        .filter(r => r.id !== selectedRecipe.id && (r.category === selectedRecipe.category || r.cuisine === selectedRecipe.cuisine))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4)
    : [];

  const showFooter = true; // show footer on all pages

  return (
    <>
      {/* SplashCursor — fluid WebGL cursor trail */}
      <SplashCursor
        TRANSPARENT={true}
        RAINBOW_MODE={false}
        COLOR="#f97316"
        SPLAT_RADIUS={0.18}
        SPLAT_FORCE={5000}
        DENSITY_DISSIPATION={4}
        VELOCITY_DISSIPATION={2.5}
        CURL={3}
      />
      {/* Dot cursor on top */}
      <div id="custom-cursor"   ref={cursorRef}   aria-hidden="true" />
      <div id="cursor-follower" ref={followerRef} aria-hidden="true" />

      <Toaster position="bottom-right"
        toastOptions={{ className: 'text-sm font-medium', duration: 2200 }} />

      <Navbar
        favCount={favorites.length}
        onSearchOpen={() => setSearchOpen(true)}
        onNavigate={navigate}
        activePage={page} />

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={selectRecipe} />

      <ClickSpark sparkColor="#f97316" sparkSize={7} sparkRadius={18} sparkCount={8} duration={420}>
      <main>
        {page === 'home' && (
          <HomePage
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onSelectRecipe={selectRecipe}
            onNavigateBrowse={() => navigate('browse')}
            onSearchOpen={() => setSearchOpen(true)} />
        )}
        {page === 'browse' && (
          <BrowsePage
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onSelectRecipe={selectRecipe} />
        )}
        {page === 'favorites' && (
          <FavoritesPage
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onSelectRecipe={selectRecipe}
            onBrowse={() => navigate('browse')} />
        )}
        {page === 'about'   && <AboutPage />}
        {page === 'contact' && <ContactPage />}
        {page === 'detail' && selectedRecipe && (
          <RecipeDetailPage
            recipe={selectedRecipe}
            isFavorite={favorites.includes(selectedRecipe.id)}
            onToggleFavorite={toggleFavorite}
            onBack={() => navigate('browse')}
            relatedRecipes={relatedRecipes}
            onSelectRecipe={selectRecipe} />
        )}
      </main>
      </ClickSpark>

      {showFooter && <Footer onNavigate={navigate} />}
    </>
  );
}
