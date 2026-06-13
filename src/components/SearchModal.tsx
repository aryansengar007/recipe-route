import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Clock, Flame, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { allRecipes as recipes, categories, cuisines, difficulties, dietOptions, type Recipe } from '../data/recipes';

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (recipe: Recipe) => void;
};

const difficultyColor: Record<string, string> = {
  Easy: 'bg-sage-100 text-sage-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard: 'bg-rose-100 text-rose-700',
};

export default function SearchModal({ open, onClose, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [cuisine, setCuisine] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [activeDiets, setActiveDiets] = useState<string[]>([]);
  const [maxTime, setMaxTime] = useState(120);
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const toggleDiet = (d: string) => {
    setActiveDiets(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const results = recipes.filter(r => {
    const q = query.toLowerCase();
    const matchQuery = !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) ||
      r.tags.some(t => t.toLowerCase().includes(q)) || r.cuisine.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q);
    const matchCat = category === 'All' || r.category === category;
    const matchCuisine = cuisine === 'All' || r.cuisine === cuisine;
    const matchDiff = difficulty === 'All' || r.difficulty === difficulty;
    const matchDiet = activeDiets.length === 0 || activeDiets.every(d => r.dietLabels.includes(d));
    const matchTime = r.prepTime + r.cookTime <= maxTime;
    return matchQuery && matchCat && matchCuisine && matchDiff && matchDiet && matchTime;
  });

  const clearFilters = () => {
    setQuery(''); setCategory('All'); setCuisine('All');
    setDifficulty('All'); setActiveDiets([]); setMaxTime(120);
  };

  const hasFilters = category !== 'All' || cuisine !== 'All' || difficulty !== 'All' || activeDiets.length > 0 || maxTime < 120;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-16 sm:pt-24 px-4"
      role="dialog" aria-modal="true" aria-label="Search recipes">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="search-panel relative w-full max-w-2xl rounded-2xl overflow-hidden animate-scale-in max-h-[80vh] flex flex-col">

        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-stone-100">
          <Search className="h-5 w-5 text-stone-400 shrink-0" />
          <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search recipes, ingredients, cuisines…"
            className="flex-1 text-base text-stone-900 placeholder:text-stone-400 outline-none bg-transparent" />
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${showFilters || hasFilters ? 'bg-brand-50 text-brand-600' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters {hasFilters && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[9px] text-white">{[category !== 'All', cuisine !== 'All', difficulty !== 'All', activeDiets.length > 0, maxTime < 120].filter(Boolean).length}</span>}
              {showFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            <button type="button" onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="px-4 py-4 border-b border-stone-100 bg-stone-50/60 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-brand-400">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">Cuisine</label>
                <select value={cuisine} onChange={e => setCuisine(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-brand-400">
                  {cuisines.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">Difficulty</label>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-brand-400">
                  {difficulties.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">
                Max time: {maxTime} min
              </label>
              <input type="range" min={10} max={120} step={5} value={maxTime}
                style={{ '--val': `${((maxTime - 10) / 110) * 100}%` } as React.CSSProperties}
                onChange={e => setMaxTime(Number(e.target.value))}
                className="w-full" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">Diet</label>
              <div className="flex flex-wrap gap-2">
                {dietOptions.map(d => (
                  <button key={d} type="button" onClick={() => toggleDiet(d)}
                    className={`tag-btn ${activeDiets.includes(d) ? 'active' : ''}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            {hasFilters && (
              <button type="button" onClick={clearFilters}
                className="text-xs text-brand-600 hover:text-brand-700 font-medium underline underline-offset-2">
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Results */}
        <div className="overflow-y-auto flex-1">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-stone-400">
              <Search className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-base font-medium">No recipes found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <ul className="divide-y divide-stone-100">
              {results.map(r => (
                <li key={r.id}>
                  <button type="button" onClick={() => { onSelect(r); onClose(); }}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-brand-50/50 transition-colors text-left group">
                    <img src={r.image} alt={r.title} className="h-14 w-14 rounded-xl object-cover flex-shrink-0 shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 truncate group-hover:text-brand-700 transition-colors">{r.title}</p>
                      <p className="text-xs text-stone-500 mt-0.5 truncate">{r.cuisine} · {r.category}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-stone-400">
                          <Clock className="h-3 w-3" /> {r.prepTime + r.cookTime} min
                        </span>
                        <span className={`pill text-[10px] py-0.5 ${difficultyColor[r.difficulty]}`}>
                          <Flame className="h-3 w-3" /> {r.difficulty}
                        </span>
                        {r.dietLabels.slice(0, 2).map(d => (
                          <span key={d} className="pill bg-sage-50 text-sage-600 text-[10px] py-0.5">{d}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-stone-700">⭐ {r.rating.toFixed(1)}</p>
                      <p className="text-xs text-stone-400">{r.calories} kcal</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {results.length > 0 && (
          <div className="px-4 py-2 border-t border-stone-100 bg-stone-50/60 text-xs text-stone-400">
            {results.length} recipe{results.length !== 1 ? 's' : ''} found
          </div>
        )}
      </div>
    </div>
  );
}
