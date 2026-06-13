/// <reference types="vite/client" />

declare module '*/rb/*.jsx' {
  const component: React.ComponentType<any>;
  export default component;
}
declare module './components/rb/ClickSpark' { const C: React.FC<any>; export default C; }
declare module './components/rb/SplashCursor' { const C: React.FC<any>; export default C; }
declare module './components/rb/StarBorder' { const C: React.FC<any>; export default C; }
declare module './components/rb/ImageTrail' { const C: React.FC<any>; export default C; }
declare module './components/rb/Strands' { const C: React.FC<any>; export default C; }
declare module './components/rb/CircularGallery' { const C: React.FC<any>; export default C; }
declare module './components/rb/GooeyNav' { const C: React.FC<any>; export default C; }
declare module './components/rb/SpotlightCard' { const C: React.FC<any>; export default C; }
