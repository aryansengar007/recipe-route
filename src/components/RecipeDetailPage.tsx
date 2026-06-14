import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Heart, Share2, Printer, Star, Clock, Users, Flame, ChefHat,
  CheckCircle2, Play, Pause, RotateCcw, ChevronDown, ChevronUp, Info,
  Activity, Zap, BookOpen, Check
} from 'lucide-react';
import type { Recipe } from '../data/recipes';

type Props = {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onBack: () => void;
  relatedRecipes: Recipe[];
  onSelectRecipe: (r: Recipe) => void;
};

const difficultyColor: Record<string, string> = {
  Easy: 'bg-sage-100 text-sage-700 border-sage-200',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200',
  Hard: 'bg-rose-100 text-rose-700 border-rose-200',
};

const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

export default function RecipeDetailPage({ recipe, isFavorite, onToggleFavorite, onBack, relatedRecipes, onSelectRecipe }: Props) {
  const [showIngredients, setShowIngredients] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [activeStep, setActiveStep] = useState(0);
  const [servingMult, setServingMult] = useState(1);
  const [cookingMode, setCookingMode] = useState(false);
  const [showChefTip, setShowChefTip] = useState(false);
  const [timerSec, setTimerSec] = useState((recipe.prepTime + recipe.cookTime) * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowIngredients(false); setShowSteps(false);
    setCheckedIngredients(new Set()); setCompletedSteps(new Set());
    setActiveStep(0); setCookingMode(false); setServingMult(1);
    setTimerSec((recipe.prepTime + recipe.cookTime) * 60);
    setTimerRunning(false); setTimerPaused(false);
  }, [recipe.id]);

  useEffect(() => {
    if (!timerRunning || timerPaused) { clearInterval(timerRef.current ?? undefined); return; }
    timerRef.current = window.setInterval(() => {
      setTimerSec(p => { if (p <= 1) { clearInterval(timerRef.current ?? undefined); setTimerRunning(false); return 0; } return p - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current ?? undefined);
  }, [timerRunning, timerPaused]);

  useEffect(() => {
    if (cookingMode && stepRefs.current[activeStep]) {
      stepRefs.current[activeStep]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeStep, cookingMode]);

  const startCooking = () => {
    setShowIngredients(true); setShowSteps(true);
    setCookingMode(true); setActiveStep(0);
    setTimerRunning(true); setTimerPaused(false);
    setTimeout(() => document.getElementById('steps-section')?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  const markStep = (i: number) => {
    setCompletedSteps(prev => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
    if (i === activeStep && i < recipe.instructions.length - 1) setActiveStep(i + 1);
  };

  const share = async () => {
    if (navigator.share) { await navigator.share({ title: recipe.title, url: window.location.href }); return; }
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const checkedCount = checkedIngredients.size;
  const totalParts = recipe.ingredients.length + recipe.instructions.length;
  const doneCount = checkedCount + completedSteps.size;
  const overallPct = Math.round((doneCount / totalParts) * 100);
  const totalTime = recipe.prepTime + recipe.cookTime;
  const timerMax = (recipe.prepTime + recipe.cookTime) * 60;
  const timerPct = Math.round((1 - timerSec / timerMax) * 100);

  const nutrition = [
    { label: 'Calories', value: recipe.calories * servingMult, unit: 'kcal', max: 800, color: 'from-brand-400 to-brand-500' },
    { label: 'Protein', value: recipe.protein * servingMult, unit: 'g', max: 50, color: 'from-sky-400 to-blue-500' },
    { label: 'Carbs', value: recipe.carbs * servingMult, unit: 'g', max: 100, color: 'from-violet-400 to-purple-500' },
    { label: 'Fat', value: recipe.fat * servingMult, unit: 'g', max: 40, color: 'from-amber-400 to-orange-500' },
    { label: 'Fiber', value: recipe.fiber * servingMult, unit: 'g', max: 20, color: 'from-sage-400 to-sage-500' },
  ];

  return (
    <div className="pt-16 min-h-screen bg-stone-50">
      {/* Back bar */}
      <div className="bg-white border-b border-stone-100 sticky top-16 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <button type="button" onClick={onBack}
            className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition font-medium">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="flex items-center gap-2 no-print">
            <button type="button" onClick={() => onToggleFavorite(recipe.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${isFavorite ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-stone-200 bg-white text-stone-600 hover:border-rose-200'}`}>
              <Heart className={`h-3.5 w-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              {isFavorite ? 'Saved' : 'Save'}
            </button>
            <button type="button" onClick={share}
              className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:border-brand-300 transition">
              {copied ? <Check className="h-3.5 w-3.5 text-sage-600" /> : <Share2 className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Share'}
            </button>
            <button type="button" onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:border-brand-300 transition">
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Left */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="pill bg-brand-50 text-brand-700 border border-brand-100">{recipe.category}</span>
                <span className="pill bg-stone-100 text-stone-600">{recipe.cuisine}</span>
                <span className={`pill border ${difficultyColor[recipe.difficulty]}`}>
                  <Flame className="h-3 w-3" /> {recipe.difficulty}
                </span>
                {recipe.dietLabels.map(d => (
                  <span key={d} className="pill bg-sage-50 text-sage-700 border border-sage-100">{d}</span>
                ))}
              </div>

              <div>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight">
                  {recipe.title}
                </h1>
                <p className="mt-3 text-stone-500 leading-relaxed text-base">{recipe.description}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} className={`h-5 w-5 ${n <= Math.round(recipe.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-200'}`} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-stone-700">{recipe.rating.toFixed(1)}</span>
                <span className="text-sm text-stone-400">({recipe.reviewCount.toLocaleString()} reviews)</span>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Clock, label: 'Prep', value: `${recipe.prepTime} min`, color: 'text-sky-600 bg-sky-50' },
                  { icon: Flame, label: 'Cook', value: `${recipe.cookTime} min`, color: 'text-orange-600 bg-orange-50' },
                  { icon: Users, label: 'Serves', value: `${recipe.servings * servingMult}`, color: 'text-sage-600 bg-sage-50' },
                  { icon: Activity, label: 'Calories', value: `${recipe.calories * servingMult}`, color: 'text-violet-600 bg-violet-50' },
                ].map(s => (
                  <div key={s.label} className={`flex items-center gap-2.5 rounded-xl px-3 py-3 ${s.color}`}>
                    <s.icon className="h-4 w-4 shrink-0" />
                    <div>
                      <p className="text-xs opacity-70 font-medium">{s.label}</p>
                      <p className="text-sm font-bold">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Serving scale */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-stone-500 font-medium">Scale:</span>
                <div className="flex items-center gap-1 rounded-xl bg-stone-100 p-1">
                  {[0.5, 1, 2, 3].map(m => (
                    <button key={m} type="button" onClick={() => setServingMult(m)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${servingMult === m ? 'bg-white text-brand-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>
                      {m === 0.5 ? '½×' : `${m}×`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chef tip */}
              <div>
                <button type="button" onClick={() => setShowChefTip(!showChefTip)}
                  className="flex items-center gap-2 text-sm text-brand-600 font-medium hover:text-brand-700 transition">
                  <Info className="h-4 w-4" />
                  Chef's Tip
                  {showChefTip ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
                {showChefTip && (
                  <div className="mt-2 rounded-xl border border-brand-100 bg-brand-50 p-4">
                    <div className="flex gap-3">
                      <ChefHat className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-stone-700 italic leading-relaxed">"{recipe.chefTip}"</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map(tag => (
                  <span key={tag} className="pill bg-stone-100 text-stone-600 text-xs">{tag}</span>
                ))}
              </div>

              {/* Start Cooking CTA */}
              <button type="button" onClick={startCooking}
                className="no-print flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-6 py-3.5 font-semibold shadow-glow hover:shadow-glow-lg transition-all">
                <Play className="h-5 w-5" /> Start Cooking — opens all steps
              </button>
            </div>

            {/* Hero image */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
              <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              {recipe.featured && (
                <div className="absolute top-4 left-4">
                  <span className="pill bg-brand-500 text-white text-xs shadow-lg">✦ Featured Recipe</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          <div className="space-y-6">

            {/* ── INGREDIENTS (collapsible) ── */}
            <div className="bg-white rounded-2xl border border-stone-100 glow-card-sm overflow-hidden">
              <div className="flex items-center justify-between p-5">
                <div>
                  <h2 className="font-display font-semibold text-xl text-stone-900">Ingredients</h2>
                  <p className="text-sm text-stone-400 mt-0.5">{checkedCount}/{recipe.ingredients.length} checked</p>
                </div>
                <button type="button" onClick={() => setShowIngredients(!showIngredients)}
                  className="no-print flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition-all">
                  {showIngredients ? <><ChevronUp className="h-4 w-4" /> Hide</> : <><ChevronDown className="h-4 w-4" /> Show Ingredients</>}
                </button>
              </div>

              {/* Progress */}
              <div className="px-5 pb-4">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(checkedCount / recipe.ingredients.length) * 100}%` }} />
                </div>
              </div>

              {showIngredients && (
                <div className="border-t border-stone-100 p-5 space-y-2">
                  {recipe.ingredients.map(ing => {
                    const checked = checkedIngredients.has(ing.name);
                    const amt = servingMult !== 1 ? ` (×${servingMult})` : '';
                    return (
                      <button key={ing.name} type="button" onClick={() => {
                        setCheckedIngredients(prev => {
                          const n = new Set(prev); n.has(ing.name) ? n.delete(ing.name) : n.add(ing.name); return n;
                        });
                      }}
                        className={`ingredient-row w-full flex items-center gap-3 rounded-xl border p-3 text-left transition ${checked ? 'border-sage-200 bg-sage-50' : 'border-stone-100 bg-white'}`}>
                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${checked ? 'border-sage-500 bg-sage-500 text-white' : 'border-stone-300'}`}>
                          {checked && <Check className="h-3.5 w-3.5" />}
                        </div>
                        <span className={`ingredient-label flex-1 text-sm transition ${checked ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                          {ing.name}
                        </span>
                        <span className="text-sm font-medium text-stone-500 shrink-0">
                          {ing.amount} {ing.unit}{amt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── STEPS (collapsible) ── */}
            <div id="steps-section" className="bg-white rounded-2xl border border-stone-100 glow-card-sm overflow-hidden">
              <div className="flex items-center justify-between p-5">
                <div>
                  <h2 className="font-display font-semibold text-xl text-stone-900">Instructions</h2>
                  <p className="text-sm text-stone-400 mt-0.5">{completedSteps.size}/{recipe.instructions.length} steps done</p>
                </div>
                <button type="button" onClick={() => setShowSteps(!showSteps)}
                  className="no-print flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition-all">
                  {showSteps ? <><ChevronUp className="h-4 w-4" /> Hide</> : <><ChevronDown className="h-4 w-4" /> Show Steps</>}
                </button>
              </div>

              {/* Step bubbles */}
              <div className="px-5 pb-4">
                <div className="flex gap-1.5">
                  {recipe.instructions.map((_, i) => (
                    <button key={i} type="button" onClick={() => { setShowSteps(true); setActiveStep(i); }}
                      title={`Step ${i + 1}`}
                      className={`h-2 flex-1 rounded-full transition-all ${completedSteps.has(i) ? 'bg-sage-400' : i === activeStep && showSteps ? 'bg-brand-400' : 'bg-stone-200'}`} />
                  ))}
                </div>
              </div>

              {showSteps && (
                <div className="border-t border-stone-100 p-5 space-y-3">
                  {recipe.instructions.map((step, i) => {
                    const isActive = i === activeStep && cookingMode;
                    const isDone = completedSteps.has(i);
                    return (
                      <div key={i} ref={el => stepRefs.current[i] = el}
                        className={`step-card rounded-xl border p-4 transition ${isDone ? 'done border-stone-100 bg-stone-50' : isActive ? 'active border-brand-300' : 'border-stone-100 bg-white hover:border-stone-200'}`}>
                        <div className="flex items-start gap-4">
                          <button type="button" onClick={() => markStep(i)}
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition ${isDone ? 'bg-sage-500 text-white' : isActive ? 'bg-brand-500 text-white animate-pulse-glow' : 'bg-stone-100 text-stone-500 hover:bg-brand-50 hover:text-brand-600'}`}>
                            {isDone ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <h3 className={`font-semibold text-sm ${isDone ? 'text-stone-400 line-through' : 'text-stone-900'}`}>{step.title}</h3>
                              <span className="pill bg-stone-100 text-stone-500 text-[10px]">
                                <Clock className="h-3 w-3" /> {step.duration}
                              </span>
                            </div>
                            <p className={`text-sm leading-relaxed ${isDone ? 'text-stone-400' : 'text-stone-600'}`}>{step.detail}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Step nav */}
                  <div className="no-print flex flex-wrap gap-2 pt-2">
                    <button type="button" onClick={() => setActiveStep(p => Math.max(0, p - 1))} disabled={activeStep === 0}
                      className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 disabled:opacity-40 hover:border-stone-300 transition">
                      <ArrowLeft className="h-4 w-4" /> Previous
                    </button>
                    <button type="button"
                      onClick={() => markStep(activeStep)}
                      className="flex items-center gap-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 text-sm font-medium transition">
                      <CheckCircle2 className="h-4 w-4" /> Mark Done & Next
                    </button>
                    <button type="button" onClick={startCooking}
                      className="flex items-center gap-1.5 rounded-xl border border-brand-200 bg-brand-50 text-brand-700 px-4 py-2 text-sm font-medium hover:bg-brand-100 transition">
                      <Zap className="h-4 w-4" /> {cookingMode ? 'Restart' : 'Start Cooking'}
                    </button>
                  </div>
                </div>
              )}

              {!showSteps && (
                <div className="px-5 pb-5">
                  <button type="button" onClick={startCooking}
                    className="no-print flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-glow-sm transition">
                    <Play className="h-4 w-4" /> Start Cooking
                  </button>
                </div>
              )}
            </div>

            {/* Equipment */}
            <div className="bg-white rounded-2xl border border-stone-100 glow-card-sm p-5">
              <h2 className="font-display font-semibold text-lg text-stone-900 mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-brand-500" /> Equipment Needed
              </h2>
              <div className="flex flex-wrap gap-2">
                {recipe.equipment.map(eq => (
                  <span key={eq} className="pill bg-stone-100 text-stone-700 border border-stone-200 text-xs hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 transition">{eq}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <aside className="space-y-5">
            {/* Overall Progress Ring */}
            <div className="bg-white rounded-2xl border border-stone-100 glow-card-sm p-5">
              <h3 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-brand-500" /> Progress
              </h3>
              <div className="flex items-center justify-center my-2">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f0eb" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none"
                      stroke="url(#prog)" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={(1 - overallPct / 100) * 2 * Math.PI * 42}
                      style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
                    <defs>
                      <linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f78c14" />
                        <stop offset="100%" stopColor="#fbc96d" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-stone-800">{overallPct}%</p>
                    <p className="text-[10px] text-stone-400">complete</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="rounded-xl bg-stone-50 p-2.5 text-center">
                  <p className="text-base font-bold text-brand-600">{checkedCount}</p>
                  <p className="text-[10px] text-stone-400">ingredients</p>
                </div>
                <div className="rounded-xl bg-stone-50 p-2.5 text-center">
                  <p className="text-base font-bold text-sage-600">{completedSteps.size}</p>
                  <p className="text-[10px] text-stone-400">steps done</p>
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="bg-white rounded-2xl border border-stone-100 glow-card-sm p-5 no-print">
              <h3 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-500" /> Timer
              </h3>
              <div className="relative flex items-center justify-center h-24 w-24 mx-auto mb-4">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f0eb" strokeWidth="6" />
                  <circle cx="50" cy="50" r="42" fill="none"
                    stroke={timerRunning && !timerPaused ? '#f78c14' : '#d6d3d0'} strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={(1 - timerPct / 100) * 2 * Math.PI * 42}
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
                </svg>
                <div className="text-center relative">
                  <p className={`text-xl font-bold tabular-nums ${timerRunning && !timerPaused ? 'text-brand-600' : 'text-stone-700'}`}>
                    {formatTime(timerSec)}
                  </p>
                  <p className="text-[10px] text-stone-400">{timerRunning ? (timerPaused ? 'paused' : 'running') : 'ready'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => { setTimerRunning(true); setTimerPaused(false); }}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-500 text-white py-2 text-xs font-semibold hover:bg-brand-600 transition">
                  <Play className="h-3.5 w-3.5" /> Start
                </button>
                <button type="button" onClick={() => { if (timerRunning) setTimerPaused(p => !p); }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 transition">
                  {timerPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                  {timerPaused ? 'Resume' : 'Pause'}
                </button>
              </div>
              <button type="button"
                onClick={() => { setTimerSec((recipe.prepTime + recipe.cookTime) * 60); setTimerRunning(false); setTimerPaused(false); }}
                className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white py-2 text-xs font-medium text-stone-500 hover:bg-stone-50 transition">
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>

            {/* Nutrition */}
            <div className="bg-white rounded-2xl border border-stone-100 glow-card-sm p-5">
              <h3 className="text-sm font-semibold text-stone-700 mb-4">Nutrition (per serving)</h3>
              <div className="space-y-3">
                {nutrition.map(n => (
                  <div key={n.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-stone-600">{n.label}</span>
                      <span className="text-xs font-semibold text-stone-700">{n.value} {n.unit}</span>
                    </div>
                    <div className="progress-bar">
                      <div className={`h-full rounded-full bg-gradient-to-r ${n.color} transition-all duration-700`}
                        style={{ width: `${Math.min(100, (n.value / n.max) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related recipes */}
      {relatedRecipes.length > 0 && (
        <div className="bg-white border-t border-stone-100 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-stone-900 mb-6">You might also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedRecipes.map(r => (
                <button key={r.id} type="button" onClick={() => onSelectRecipe(r)}
                  className="group text-left bg-white rounded-2xl overflow-hidden border border-stone-100 glow-card-sm">
                  <div className="relative h-32 overflow-hidden">
                    <img src={r.image} alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-stone-900 group-hover:text-brand-700 transition line-clamp-2">{r.title}</p>
                    <p className="text-xs text-stone-400 mt-1">{r.prepTime + r.cookTime} min · ⭐ {r.rating}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
