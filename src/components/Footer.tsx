import { Github, Instagram, Linkedin, ExternalLink } from 'lucide-react';
import { Logo } from './Navbar';

type Page = 'home' | 'browse' | 'favorites' | 'about' | 'contact';
type Props = { onNavigate: (page: Page) => void };

export default function Footer({ onNavigate }: Props) {
  const socials = [
    { Icon: Linkedin, href: 'https://www.linkedin.com/in/aryan-sengar-786b96290/', label: 'LinkedIn' },
    { Icon: Github,   href: 'https://github.com/aryansengar007',                  label: 'GitHub' },
    { Icon: Instagram,href: 'https://www.instagram.com/aryan_sengar007?igsh=a3oydTk0N210MjZ2', label: 'Instagram' },
  ];

  return (
    <footer className="footer-bg text-stone-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-4 lg:col-span-2">
            <button type="button" onClick={() => onNavigate('home')} className="flex items-center gap-2.5">
              <Logo size={38} />
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-bold text-white">Recipe<span className="text-brand-400">Route</span></span>
                <span className="text-[9px] tracking-[0.2em] uppercase text-stone-500 mt-0.5">Cook · Discover · Enjoy</span>
              </div>
            </button>
            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              Your guide to cooking something amazing, every single day. Hand-curated recipes across 12 world cuisines, built for home chefs of every level.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-700 text-stone-400 hover:border-brand-400 hover:text-brand-400 transition-all duration-200">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
              <a href="https://bio.link/aryan_sengar007" target="_blank" rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-700 text-stone-400 hover:border-brand-400 hover:text-brand-400 transition-all duration-200" aria-label="Bio Link">
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-4">Explore</p>
            <ul className="space-y-2.5">
              {([
                { label: 'Home',          page: 'home'      },
                { label: 'All Recipes',   page: 'browse'    },
                { label: 'About Me',      page: 'about'     },
                { label: 'Contact',       page: 'contact'   },
                { label: 'My Favourites', page: 'favorites' },
              ] as { label: string; page: Page }[]).map(item => (
                <li key={item.label}>
                  <button type="button" onClick={() => onNavigate(item.page)}
                    className="text-sm text-stone-400 hover:text-brand-400 transition-colors">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-4">Categories</p>
            <ul className="space-y-2.5">
              {['Breakfast', 'Pasta', 'Curry', 'Salad', 'Soup', 'Dessert', 'Mexican', 'Seafood'].map(cat => (
                <li key={cat}>
                  <button type="button" onClick={() => onNavigate('browse')}
                    className="text-sm text-stone-400 hover:text-brand-400 transition-colors">
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} <span className="text-stone-400 font-medium">RecipeRoute</span>. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Designed &amp; built by <a href="https://aryan-sengar-portfolio-v2.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:text-brand-400 transition-colors">Aryan Sengar</a></span>
            <span className="text-stone-700">·</span>
            <span>Privacy Policy</span>
            <span className="text-stone-700">·</span>
            <span>Terms of Use</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
