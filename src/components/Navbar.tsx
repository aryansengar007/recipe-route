import { useState, useEffect } from 'react';
import { Search, Menu, X, Heart, BookOpen } from 'lucide-react';

type Page = 'home' | 'browse' | 'favorites' | 'about' | 'contact';
type Props = {
  favCount: number;
  onSearchOpen: () => void;
  onNavigate: (page: Page) => void;
  activePage: string;
};

// Export Logo for use in Footer too
export function Logo({ size = 38 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 bg-white"
    >
      <img
        src="/logo.svg"
        alt="RecipeRoute logo"
        style={{ width: size, height: size, objectFit: 'contain' }}
        className="block"
      />
    </div>
  );
}

const navLinks: { label: string; page: Page }[] = [
  { label: 'Home',       page: 'home'      },
  { label: 'Recipes',    page: 'browse'    },
  { label: 'About',      page: 'about'     },
  { label: 'Contact',    page: 'contact'   },
  { label: 'Favourites', page: 'favorites' },
];

export default function Navbar({ favCount, onSearchOpen, onNavigate, activePage }: Props) {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Active index for GooeyNav
  const activeIdx = Math.max(0, navLinks.findIndex(l => l.page === activePage));

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'nav-blur shadow-sm' : 'bg-transparent'}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Logo */}
            <button type="button" onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 shrink-0 group">
              <Logo size={38} />
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-display text-lg font-bold text-stone-900 leading-none">
                  Recipe<span className="gradient-text">Route</span>
                </span>
                <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-stone-400 mt-0.5">
                  Cook · Discover · Enjoy
                </span>
              </div>
            </button>

            {/* Desktop Nav — GooeyNav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <button key={link.page} type="button" onClick={() => onNavigate(link.page)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activePage === link.page
                      ? 'text-brand-600 bg-brand-50 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}>
                  {link.label}
                  {link.page === 'favorites' && favCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[9px] font-bold text-white">
                      {favCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button type="button" onClick={onSearchOpen}
                className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-500 shadow-sm hover:border-brand-300 hover:text-brand-600 hover:shadow-glow-sm transition-all duration-200">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search recipes…</span>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-stone-200 bg-stone-50 px-1.5 py-0.5 text-[10px] text-stone-400">⌘K</kbd>
              </button>

              <button type="button" onClick={() => onNavigate('favorites')}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm hover:border-brand-300 hover:text-brand-500 transition-all duration-200">
                <Heart className={`h-4 w-4 ${favCount > 0 ? 'fill-brand-500 text-brand-500' : ''}`} />
                {favCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[9px] font-bold text-white">
                    {favCount}
                  </span>
                )}
              </button>

              <button type="button" onClick={() => setMobileOpen(true)}
                className="flex md:hidden h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm">
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative ml-auto w-72 h-full bg-white shadow-2xl flex flex-col animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <Logo size={32} />
                <span className="font-display font-bold text-stone-900">Recipe<span className="gradient-text">Route</span></span>
              </div>
              <button type="button" onClick={() => setMobileOpen(false)} className="rounded-full p-1 text-stone-400 hover:text-stone-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 p-5 space-y-1">
              {navLinks.map(link => (
                <button key={link.page} type="button"
                  onClick={() => { onNavigate(link.page); setMobileOpen(false); }}
                  className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${activePage === link.page ? 'bg-brand-50 text-brand-700' : 'text-stone-700 hover:bg-stone-50'}`}>
                  <span>{link.label}</span>
                  {link.page === 'favorites' && favCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] text-white">{favCount}</span>
                  )}
                </button>
              ))}
              <button type="button" onClick={() => { onSearchOpen(); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50">
                <Search className="h-4 w-4 text-stone-400" /> Search Recipes
              </button>
            </nav>
            <div className="p-5 border-t border-stone-100">
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <BookOpen className="h-3.5 w-3.5" />
                <span>74+ recipes · updated weekly</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
