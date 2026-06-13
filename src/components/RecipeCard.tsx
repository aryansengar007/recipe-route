import { Heart, Clock, Flame, Star, Users } from 'lucide-react';
import type { Recipe } from '../data/recipes';

type Props = {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
};

const difficultyColor: Record<string, string> = {
  Easy: 'bg-sage-100 text-sage-700 border-sage-200',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200',
  Hard: 'bg-rose-100 text-rose-700 border-rose-200',
};

export default function RecipeCard({ recipe, isFavorite, onToggleFavorite, onClick, size = 'md' }: Props) {
  const totalTime = recipe.prepTime + recipe.cookTime;

  if (size === 'lg') {
    return (
      <div className="group relative bg-white rounded-2xl overflow-hidden glow-card border border-stone-100">
        <div className="relative overflow-hidden h-64 sm:h-72">
          <img src={recipe.image} alt={recipe.title}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {recipe.featured && (
            <div className="absolute top-3 left-3">
              <span className="pill bg-brand-500 text-white text-[11px] shadow-lg animate-pulse-glow">
                ✦ Featured
              </span>
            </div>
          )}

          <button type="button" onClick={e => { e.stopPropagation(); onToggleFavorite(recipe.id); }}
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:scale-110">
            <Heart className={`h-4 w-4 transition-colors ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
          </button>

          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex flex-wrap gap-2">
              {recipe.tags.slice(0, 3).map(tag => (
                <span key={tag} className="pill bg-white/20 text-white backdrop-blur-sm text-[10px]">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <button type="button" onClick={onClick} className="block w-full text-left p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-display font-semibold text-lg text-stone-900 group-hover:text-brand-700 transition-colors leading-snug">
              {recipe.title}
            </h3>
            <div className="shrink-0 flex items-center gap-1 text-sm font-semibold text-stone-700">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {recipe.rating.toFixed(1)}
            </div>
          </div>
          <p className="text-sm text-stone-500 leading-relaxed line-clamp-2 mb-3">{recipe.description}</p>
          <div className="flex items-center gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-brand-400" /> {totalTime} min</span>
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-brand-400" /> {recipe.servings} servings</span>
            <span className={`pill border ${difficultyColor[recipe.difficulty]} text-[10px]`}>
              <Flame className="h-3 w-3" /> {recipe.difficulty}
            </span>
          </div>
        </button>
      </div>
    );
  }

  if (size === 'sm') {
    return (
      <button type="button" onClick={onClick}
        className="group flex items-center gap-3 w-full bg-white rounded-xl p-3 glow-card-sm border border-stone-100 text-left">
        <img src={recipe.image} alt={recipe.title} className="h-14 w-14 rounded-lg object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-stone-900 group-hover:text-brand-700 transition-colors truncate">{recipe.title}</p>
          <p className="text-xs text-stone-500 mt-0.5">{recipe.cuisine} · {totalTime} min</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-stone-600">{recipe.rating.toFixed(1)}</span>
          </div>
        </div>
        <button type="button" onClick={e => { e.stopPropagation(); onToggleFavorite(recipe.id); }}
          className="shrink-0 p-1.5 rounded-full hover:bg-rose-50 transition">
          <Heart className={`h-3.5 w-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-300'}`} />
        </button>
      </button>
    );
  }

  // md (default)
  return (
    <div className="group bg-white rounded-2xl overflow-hidden glow-card border border-stone-100">
      <div className="relative overflow-hidden h-48">
        <img src={recipe.image} alt={recipe.title}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {recipe.featured && (
          <div className="absolute top-2 left-2">
            <span className="pill bg-brand-500 text-white text-[10px]">✦ Featured</span>
          </div>
        )}

        <button type="button" onClick={e => { e.stopPropagation(); onToggleFavorite(recipe.id); }}
          className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-110">
          <Heart className={`h-3.5 w-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
        </button>

        <div className="absolute bottom-2 left-2">
          <span className={`pill border text-[10px] bg-white/95 ${difficultyColor[recipe.difficulty]}`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>

      <button type="button" onClick={onClick} className="block w-full text-left p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-stone-900 text-sm leading-snug group-hover:text-brand-700 transition-colors line-clamp-2">
            {recipe.title}
          </h3>
          <div className="shrink-0 flex items-center gap-0.5 text-xs font-semibold text-stone-600">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {recipe.rating.toFixed(1)}
          </div>
        </div>
        <p className="text-xs text-stone-500 mb-2 line-clamp-1">{recipe.cuisine} · {recipe.category}</p>
        <div className="flex items-center justify-between text-xs text-stone-400">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-brand-400" /> {totalTime} min</span>
          <span>{recipe.calories} kcal</span>
          <span className="text-stone-300">({recipe.reviewCount.toLocaleString()})</span>
        </div>
      </button>
    </div>
  );
}
