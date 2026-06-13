import { Heart, ArrowRight } from 'lucide-react';
import { allRecipes as recipes, type Recipe } from '../data/recipes';
import RecipeCard from './RecipeCard';

type Props = {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectRecipe: (r: Recipe) => void;
  onBrowse: () => void;
};

export default function FavoritesPage({ favorites, onToggleFavorite, onSelectRecipe, onBrowse }: Props) {
  const favRecipes = recipes.filter(r => favorites.includes(r.id));

  return (
    <div className="pt-16 min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-1">My Collection</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 flex items-center gap-3">
            Saved Recipes
            {favRecipes.length > 0 && (
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-rose-100 text-rose-600 text-sm font-bold">
                {favRecipes.length}
              </span>
            )}
          </h1>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {favRecipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 mb-5">
              <Heart className="h-8 w-8 text-rose-300" />
            </div>
            <h2 className="text-xl font-semibold text-stone-700 mb-2">No saved recipes yet</h2>
            <p className="text-stone-400 mb-6 max-w-sm">
              Tap the heart icon on any recipe to save it here for quick access.
            </p>
            <button type="button" onClick={onBrowse}
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-6 py-3 font-semibold shadow-glow-sm transition">
              Browse Recipes <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {favRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} size="md"
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
                onClick={() => onSelectRecipe(recipe)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
