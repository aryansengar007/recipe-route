import { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal, Grid3X3, List, ChevronDown } from 'lucide-react';
import { allRecipes as recipes, categories, cuisines, difficulties, dietOptions, type Recipe } from '../data/recipes';
import RecipeCard from './RecipeCard';

type Props = {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  initialCategory?: string;
};

type SortKey = 'popular' | 'rating' | 'time_asc' | 'newest' | 'calories_asc';

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'time_asc', label: 'Quickest First' },
  { value: 'calories_asc', label: 'Lowest Calories' },
];

export default function BrowsePage({ favorites, onToggleFavorite, onSelectRecipe, initialCategory }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory ?? 'All');
  const [cuisine, setCuisine] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [activeDiets, setActiveDiets] = useState<string[]>([]);
  const [maxTime, setMaxTime] = useState(120);
  const [sort, setSort] = useState<SortKey>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const toggleDiet = (d: string) => {
    setActiveDiets(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
    setPage(1);
  };

  const filtered = useMemo(() => {
    let list = recipes.filter(r => {
      const q = query.toLowerCase();
      const matchQ = !q || r.title.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q));
      const matchCat = category === 'All' || r.category === category;
      const matchCuisine = cuisine === 'All' || r.cuisine === cuisine;
      const matchDiff = difficulty === 'All' || r.difficulty === difficulty;
      const matchDiet = activeDiets.length === 0 || activeDiets.every(d => r.dietLabels.includes(d));
      const matchTime = r.prepTime + r.cookTime <= maxTime;
      return matchQ && matchCat && matchCuisine && matchDiff && matchDiet && matchTime;
    });

    switch (sort) {
      case 'rating': list = [...list].sort((a, b) => b.rating - a.rating); break;
      case 'time_asc': list = [...list].sort((a, b) => (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime)); break;
      case 'calories_asc': list = [...list].sort((a, b) => a.calories - b.calories); break;
      default: list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
    }
    return list;
  }, [query, category, cuisine, difficulty, activeDiets, maxTime, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const hasFilters = category !== 'All' || cuisine !== 'All' || difficulty !== 'All' || activeDiets.length > 0 || maxTime < 120 || !!query;
  const activeFilterCount = [category !== 'All', cuisine !== 'All', difficulty !== 'All', activeDiets.length > 0, maxTime < 120].filter(Boolean).length;

  const clearFilters = () => {
    setQuery(''); setCategory('All'); setCuisine('All');
    setDifficulty('All'); setActiveDiets([]); setMaxTime(120); setPage(1);
  };

  return (
    <div className="pt-16 min-h-screen bg-stone-50">
      {/* Page header */}
      <div className="bg-white border-b border-stone-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-1">Discover</p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">All Recipes</h1>
              <p className="mt-1 text-stone-500 text-sm">{filtered.length} recipe{filtered.length !== 1 ? 's' : ''} found</p>
            </div>
            {/* Search bar */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
              <input type="text" value={query}
                onChange={e => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search recipes…"
                className="w-full rounded-xl border border-stone-200 bg-white pl-10 pr-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition" />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-3.5 w-3.5 text-stone-400" />
                </button>
              )}
            </div>
          </div>

          {/* Filter bar */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 7).map(c => (
                <button key={c} type="button" onClick={() => { setCategory(c); setPage(1); }}
                  className={`tag-btn ${category === c ? 'active' : ''}`}>
                  {c}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* Sort */}
              <div className="relative">
                <select value={sort} onChange={e => setSort(e.target.value as SortKey)}
                  className="appearance-none rounded-xl border border-stone-200 bg-white px-3 py-2 pr-8 text-xs font-medium text-stone-700 outline-none focus:border-brand-400">
                  {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
              </div>

              {/* Filters toggle */}
              <button type="button" onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${showFilters || activeFilterCount > 0 ? 'border-brand-300 bg-brand-50 text-brand-700' : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'}`}>
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters {activeFilterCount > 0 && <span className="bg-brand-500 text-white rounded-full px-1.5 text-[9px]">{activeFilterCount}</span>}
              </button>

              {/* View mode */}
              <div className="flex items-center rounded-xl border border-stone-200 bg-white overflow-hidden">
                <button type="button" onClick={() => setViewMode('grid')}
                  className={`p-2 transition ${viewMode === 'grid' ? 'bg-brand-50 text-brand-600' : 'text-stone-400 hover:text-stone-600'}`}>
                  <Grid3X3 className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => setViewMode('list')}
                  className={`p-2 transition ${viewMode === 'list' ? 'bg-brand-50 text-brand-600' : 'text-stone-400 hover:text-stone-600'}`}>
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar filters (desktop) */}
          {showFilters && (
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-6 glow-card-sm sticky top-20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-stone-800">Filters</span>
                  {hasFilters && (
                    <button type="button" onClick={clearFilters} className="text-xs text-brand-600 hover:text-brand-700">Clear</button>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">Cuisine</p>
                  <div className="space-y-1 max-h-44 overflow-y-auto">
                    {cuisines.map(c => (
                      <button key={c} type="button" onClick={() => { setCuisine(c); setPage(1); }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-sm transition ${cuisine === c ? 'bg-brand-50 text-brand-700 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">Difficulty</p>
                  <div className="flex flex-wrap gap-1.5">
                    {difficulties.map(d => (
                      <button key={d} type="button" onClick={() => { setDifficulty(d); setPage(1); }}
                        className={`tag-btn ${difficulty === d ? 'active' : ''}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">Max Time: {maxTime}min</p>
                  <input type="range" min={10} max={120} step={5} value={maxTime}
                    style={{ '--val': `${((maxTime - 10) / 110) * 100}%` } as React.CSSProperties}
                    onChange={e => { setMaxTime(Number(e.target.value)); setPage(1); }}
                    className="w-full" />
                  <div className="flex justify-between text-xs text-stone-400 mt-1">
                    <span>10 min</span><span>2 hr</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">Diet</p>
                  <div className="space-y-1.5">
                    {dietOptions.map(d => (
                      <label key={d} className="flex items-center gap-2 text-sm text-stone-600">
                        <input type="checkbox" checked={activeDiets.includes(d)} onChange={() => toggleDiet(d)}
                          className="rounded border-stone-300 text-brand-500 focus:ring-brand-400" />
                        {d}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Mobile filter drawer */}
          {showFilters && (
            <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto border-t border-stone-100">
              <div className="flex items-center justify-between mb-5">
                <span className="font-semibold text-stone-900">Filters</span>
                <button type="button" onClick={() => setShowFilters(false)} className="rounded-full p-1 bg-stone-100">
                  <X className="h-4 w-4 text-stone-600" />
                </button>
              </div>
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase text-stone-400 mb-2">Cuisine</p>
                  <div className="flex flex-wrap gap-2">
                    {cuisines.map(c => (
                      <button key={c} type="button" onClick={() => { setCuisine(c); setPage(1); }}
                        className={`tag-btn ${cuisine === c ? 'active' : ''}`}>{c}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-stone-400 mb-2">Difficulty</p>
                  <div className="flex flex-wrap gap-2">
                    {difficulties.map(d => (
                      <button key={d} type="button" onClick={() => { setDifficulty(d); setPage(1); }}
                        className={`tag-btn ${difficulty === d ? 'active' : ''}`}>{d}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-stone-400 mb-2">Diet</p>
                  <div className="flex flex-wrap gap-2">
                    {dietOptions.map(d => (
                      <button key={d} type="button" onClick={() => toggleDiet(d)}
                        className={`tag-btn ${activeDiets.includes(d) ? 'active' : ''}`}>{d}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-stone-400 mb-2">Max Time: {maxTime}min</p>
                  <input type="range" min={10} max={120} step={5} value={maxTime}
                    style={{ '--val': `${((maxTime - 10) / 110) * 100}%` } as React.CSSProperties}
                    onChange={e => { setMaxTime(Number(e.target.value)); setPage(1); }} className="w-full" />
                </div>
              </div>
              {hasFilters && (
                <button type="button" onClick={clearFilters}
                  className="mt-5 w-full rounded-xl border border-brand-200 py-3 text-sm font-medium text-brand-600">
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Recipe grid */}
          <div className="flex-1 min-w-0">
            {paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-stone-400">
                <Search className="h-12 w-12 opacity-20 mb-4" />
                <p className="text-lg font-medium text-stone-600">No recipes found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
                {hasFilters && (
                  <button type="button" onClick={clearFilters}
                    className="mt-4 text-brand-600 underline underline-offset-2 text-sm">Clear all filters</button>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginated.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} size="md"
                    isFavorite={favorites.includes(recipe.id)}
                    onToggleFavorite={onToggleFavorite}
                    onClick={() => onSelectRecipe(recipe)} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {paginated.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} size="sm"
                    isFavorite={favorites.includes(recipe.id)}
                    onToggleFavorite={onToggleFavorite}
                    onClick={() => onSelectRecipe(recipe)} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 disabled:opacity-40 hover:border-brand-300 transition">
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} type="button" onClick={() => setPage(p)}
                    className={`h-9 w-9 rounded-xl text-sm font-medium transition ${p === page ? 'bg-brand-500 text-white shadow-glow-sm' : 'border border-stone-200 bg-white text-stone-600 hover:border-brand-300'}`}>
                    {p}
                  </button>
                ))}
                <button type="button" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 disabled:opacity-40 hover:border-brand-300 transition">
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
