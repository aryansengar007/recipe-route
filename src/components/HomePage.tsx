import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChefHat, Star, Clock, TrendingUp, Utensils, Search, Flame } from 'lucide-react';
import { allRecipes as recipes, type Recipe } from '../data/recipes';
import RecipeCard from './RecipeCard';

import SpotlightCard from './rb/SpotlightCard';
import StarBorder from './rb/StarBorder';
import ClickSpark from './rb/ClickSpark';
import CircularGallery from './rb/CircularGallery';
import Strands from './rb/Strands';
import ImageTrail from './rb/ImageTrail';

import './rb/SpotlightCard.css';
import './rb/StarBorder.css';
import './rb/CircularGallery.css';
import './rb/ImageTrail.css';
import './rb/Strands.css';

type Props = {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onNavigateBrowse: () => void;
  onSearchOpen: () => void;
};

const statCards = [
  { icon: Utensils, label: 'Recipes',       value: '74+',    bg: '#fff7ed', color: '#c2410c' },
  { icon: Star,     label: 'Avg Rating',    value: '4.7★',   bg: '#fffbeb', color: '#b45309' },
  { icon: Clock,    label: 'Avg Cook Time', value: '28 min', bg: '#f0f9ff', color: '#0369a1' },
  { icon: ChefHat,  label: 'Cuisines',      value: '20+',    bg: '#f0fdf4', color: '#15803d' },
];

const categoryGalleryItems = [
  { image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80', text: 'Breakfast' },
  { image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=600&q=80', text: 'Pasta' },
  { image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80', text: 'Curry' },
  { image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', text: 'Salads' },
  { image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80', text: 'Soups' },
  { image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80', text: 'Desserts' },
  { image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=600&q=80', text: 'Mexican' },
  { image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', text: 'Seafood' },
  { image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', text: 'Japanese' },
  { image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', text: 'Indian' },
  { image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=600&q=80', text: 'Korean' },
  { image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=600&q=80', text: 'Vietnamese' },
];

const heroImages: string[] = recipes
  .filter(r => r.featured || r.rating >= 4.8)
  .slice(0, 14)
  .map(r => r.image);

/* ── Mobile auto-slideshow ── */
function MobileHeroSlides({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % images.length), 2200);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div className="relative h-[320px] w-full rounded-2xl overflow-hidden shadow-card-hover border border-stone-100">
      {images.map((src, i) => (
        <img key={src} src={src} alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: i === idx ? 1 : 0 }} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
        {images.slice(0, 8).map((_, i) => (
          <button key={i} type="button" onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === idx % 8 ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`} />
        ))}
      </div>
    </div>
  );
}

export default function HomePage({ favorites, onToggleFavorite, onSelectRecipe, onNavigateBrowse, onSearchOpen }: Props) {
  const featuredRecipes = recipes.filter(r => r.featured);
  const popularRecipes  = [...recipes].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);
  const quickRecipes    = recipes.filter(r => r.prepTime + r.cookTime <= 25).slice(0, 4);
  const revealRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    revealRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="pt-16">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden hero-bg bg-hero-pattern min-h-[90vh] flex items-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-200/40 blur-3xl animate-float" />
          <div className="absolute top-1/2 -left-20 w-72 h-72 rounded-full bg-amber-200/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div className="space-y-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700">
                <TrendingUp className="h-4 w-4" /> 74+ hand-curated world recipes
              </div>

              <div>
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-stone-900 leading-[1.05]">
                  Find your next
                  <span className="block gradient-text italic">favourite dish.</span>
                </h1>
                <p className="mt-5 text-lg text-stone-500 leading-relaxed max-w-lg">
                  From quick weeknight dinners to weekend showstoppers — Recipe Route is your guide to cooking something amazing, every single day.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-start">
                {/* Search bar */}
                <button type="button" onClick={onSearchOpen}
                  className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-500 shadow-sm hover:border-brand-300 hover:shadow-glow-sm transition-all w-full sm:w-64">
                  <Search className="h-4 w-4 text-stone-400 shrink-0" />
                  <span className="text-sm">Search any recipe, cuisine…</span>
                </button>

                {/* Browse All — StarBorder wrapping an orange button */}
                <ClickSpark sparkColor="#f78c14" sparkSize={8} sparkRadius={22} sparkCount={12} duration={500}>
                  <StarBorder
                    as="div"
                    color="#f78c14"
                    speed="3s"
                    thickness={3}
                    style={{ borderRadius: '14px', display: 'inline-block' }}
                  >
                    <button
                      type="button"
                      onClick={onNavigateBrowse}
                      style={{
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '14px',
                        padding: '12px 22px',
                        borderRadius: '12px',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 18px rgba(249,115,22,0.4)',
                        transition: 'box-shadow 0.2s, transform 0.2s',
                      }}
                    >
                      Browse All <ArrowRight style={{ width: 16, height: 16 }} />
                    </button>
                  </StarBorder>
                </ClickSpark>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {statCards.map(s => (
                  <div key={s.label} className="flex items-center gap-2.5 rounded-xl border px-3 py-3"
                    style={{ background: s.bg, borderColor: s.color + '30' }}>
                    <s.icon className="h-5 w-5 shrink-0" style={{ color: s.color }} />
                    <div>
                      <p className="font-bold text-sm leading-none" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-xs mt-0.5 text-stone-500">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — ImageTrail (desktop) or slideshow (mobile) */}
            <div className="relative">
              {isMobile ? (
                <MobileHeroSlides images={heroImages} />
              ) : (
                <div
                  className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-card-hover"
                  style={{
                    cursor: 'none',
                    /* Beautiful background pattern when cursor is idle */
                    background: `
                      radial-gradient(circle at 20% 20%, rgba(251,191,96,0.25) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(249,115,22,0.15) 0%, transparent 50%),
                      radial-gradient(circle at 50% 50%, rgba(254,215,170,0.2) 0%, transparent 70%),
                      linear-gradient(135deg, #fef9f0 0%, #fff7ed 50%, #fef3e2 100%)
                    `,
                    border: '1px solid rgba(249,115,22,0.12)',
                  }}
                >
                  {/* Food-pattern decorative background (shown when cursor not active) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                    <div className="grid grid-cols-4 gap-6 opacity-[0.06] scale-110 rotate-6">
                      {[...Array(16)].map((_, i) => (
                        <span key={i} className="text-5xl">{['🍝','🍜','🥘','🍛','🌮','🍣','🥗','🍲','🧆','🍱','🥩','🫕','🥐','🍕','🥞','🧇'][i]}</span>
                      ))}
                    </div>
                  </div>

                  {/* Subtle corner gradients */}
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-brand-200/30 to-transparent rounded-tl-2xl pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-br-2xl pointer-events-none" />

                  {/* ImageTrail layer */}
                  <ImageTrail items={heroImages as any} variant={1} />

                  {/* Idle hint */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/70 backdrop-blur-md text-stone-600 text-sm font-medium rounded-full px-5 py-2.5 shadow-sm border border-white/80 flex items-center gap-2">
                      <span className="text-base">✨</span>
                      Move your cursor to explore recipes
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CIRCULAR GALLERY ── */}
      <section className="bg-white pb-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-6">
          <div ref={el => revealRefs.current[0] = el} className="reveal flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-1">Explore</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">Browse by Category</h2>
            </div>
            <button type="button" onClick={onNavigateBrowse}
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition">
              View all <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div style={{ height: '500px', width: '100%', overflow: 'hidden' }}>
          <CircularGallery
            items={categoryGalleryItems}
            bend={3}
            textColor="#1c1917"
            borderRadius={0.05}
            scrollSpeed={2}
            scrollEase={0.03}
            fontUrl="https://fonts.gstatic.com/s/plusjakartasans/v8/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yw.woff2"
          />
        </div>
      </section>

      {/* ── FEATURED (SpotlightCard) ── */}
      <section className="py-14 bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div ref={el => revealRefs.current[1] = el} className="reveal mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-1">Hand-picked</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">Featured Recipes</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredRecipes.map(recipe => (
              <SpotlightCard key={recipe.id}
                className="!bg-white !border-stone-100 !rounded-2xl !p-0 overflow-hidden"
                spotlightColor="rgba(247,140,20,0.18)">
                <RecipeCard recipe={recipe} size="lg"
                  isFavorite={favorites.includes(recipe.id)}
                  onToggleFavorite={onToggleFavorite}
                  onClick={() => onSelectRecipe(recipe)} />
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK & EASY ── */}
      <section className="py-14 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div ref={el => revealRefs.current[2] = el} className="reveal mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-1">Under 25 min</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">Quick &amp; Easy</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} size="md"
                isFavorite={favorites.includes(recipe.id)}
                onToggleFavorite={onToggleFavorite}
                onClick={() => onSelectRecipe(recipe)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR (SpotlightCard) ── */}
      <section className="py-14 bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div ref={el => revealRefs.current[3] = el} className="reveal flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-1">Most reviewed</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">Most Popular</h2>
            </div>
            <button type="button" onClick={onNavigateBrowse}
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition">
              See all <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularRecipes.map(recipe => (
              <SpotlightCard key={recipe.id}
                className="!bg-white !border-stone-100 !rounded-2xl !p-0 overflow-hidden"
                spotlightColor="rgba(247,140,20,0.14)">
                <RecipeCard recipe={recipe} size="md"
                  isFavorite={favorites.includes(recipe.id)}
                  onToggleFavorite={onToggleFavorite}
                  onClick={() => onSelectRecipe(recipe)} />
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER — orange bg + Strands animation ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '360px' }}>

        {/* Layer 1: Solid orange base */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-700" />

        {/* Layer 2: Strands WebGL on top of orange */}
        <div className="absolute inset-0 z-[1]" style={{ width: '100%', height: '100%' }}>
          <Strands
            colors={['#f97316', '#fb923c', '#fbbf24', '#fed7aa', '#ea580c']}
            count={14}
            amplitude={1.5}
            waviness={0.6}
            speed={0.5}
            thickness={2}
            glow={2}
            opacity={0.65}
            taper={2.5}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          />
        </div>

        {/* Layer 3: Content */}
        <div className="relative z-[2] mx-auto max-w-4xl px-4 sm:px-6 py-20 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <ChefHat className="h-7 w-7 text-white animate-float" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to cook something amazing?
          </h2>
          <p className="text-orange-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Explore 74+ recipes across 20 world cuisines. Save your favourites and start cooking today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">

            {/* Primary CTA — StarBorder with white button */}
            <ClickSpark sparkColor="#fff" sparkSize={9} sparkRadius={24} sparkCount={12} duration={480}>
              <StarBorder
                as="div"
                color="white"
                speed="3s"
                thickness={3}
                style={{ borderRadius: '14px', display: 'inline-block' }}
              >
                <button
                  type="button"
                  onClick={onNavigateBrowse}
                  style={{
                    background: 'white',
                    color: '#c2410c',
                    fontWeight: 700,
                    fontSize: '14px',
                    padding: '12px 28px',
                    borderRadius: '12px',
                    border: 'none',
                    display: 'inline-block',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    transition: 'box-shadow 0.2s',
                    cursor: 'none',
                  }}
                >
                  Browse All Recipes
                </button>
              </StarBorder>
            </ClickSpark>

            {/* Secondary CTA */}
            <ClickSpark sparkColor="#fbbf60" sparkSize={7} sparkRadius={18} sparkCount={8} duration={400}>
              <button type="button" onClick={onSearchOpen}
                className="border-2 border-white/50 text-white font-semibold rounded-xl px-8 py-3 hover:bg-white/15 transition-all duration-200 text-sm backdrop-blur-sm">
                Search Recipes
              </button>
            </ClickSpark>
          </div>
        </div>
      </section>
    </div>
  );
}
