import { useEffect, useRef } from 'react';
import { Download, ExternalLink, Github, Instagram, Linkedin, Code2, Palette, Camera, Trophy, Globe, MessageCircle } from 'lucide-react';

const skills = [
  { name: 'Artificial Intelligence', level: 75, color: 'from-violet-400 to-purple-500' },
  { name: 'Machine Learning', level: 70, color: 'from-sky-400 to-blue-500' },
  { name: 'Java', level: 72, color: 'from-orange-400 to-red-500' },
  { name: 'Web Development (HTML/CSS)', level: 82, color: 'from-brand-400 to-brand-500' },
  { name: 'UI/UX Design', level: 78, color: 'from-pink-400 to-rose-500' },
  { name: 'React & TypeScript', level: 74, color: 'from-cyan-400 to-sky-500' },
];

const hobbies = [
  { emoji: '🎨', label: 'Graphic Design', desc: 'Digital poster creation & visual art' },
  { emoji: '📸', label: 'Photography', desc: 'Capturing moments & video editing' },
  { emoji: '♟️', label: 'Strategy Games', desc: 'Logic-based puzzles & chess' },
  { emoji: '🧑‍💻', label: 'Exploring Tech', desc: 'Emerging tech & reading tech blogs' },
];

const links = [
  { Icon: Globe,          label: 'Portfolio',  href: 'https://aryan-sengar-portfolio-v2.netlify.app/', color: 'bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100' },
  { Icon: Linkedin,       label: 'LinkedIn',   href: 'https://www.linkedin.com/in/aryan-sengar-786b96290/', color: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100' },
  { Icon: Github,         label: 'GitHub',     href: 'https://github.com/aryansengar007', color: 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100' },
  { Icon: Code2,          label: 'LeetCode',   href: 'https://leetcode.com/u/aryan_sengar007/', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
  { Icon: Instagram,      label: 'Instagram',  href: 'https://www.instagram.com/aryan_sengar007?igsh=a3oydTk0N210MjZ2', color: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100' },
  { Icon: MessageCircle,  label: 'WhatsApp',   href: 'https://wa.me/message/XMEQKCUSBI3HJ1', color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' },
];

export default function AboutPage() {
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    revealRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="pt-16 min-h-screen bg-stone-50">

      {/* Hero banner */}
      <div className="bg-gradient-to-br from-brand-500 via-brand-600 to-orange-700 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                👋 &nbsp;Hello, I'm
              </div>
              <div>
                <h1 className="font-display text-5xl sm:text-6xl font-bold leading-tight">
                  Aryan Sengar
                </h1>
                <p className="mt-3 text-brand-100 text-lg font-medium">
                  CS Student · AI & ML · UI/UX · Web Dev
                </p>
                <p className="mt-1 text-brand-200 text-sm">
                  The NorthCap University, Gurugram 🎓
                </p>
              </div>
              <p className="text-white/80 text-base leading-relaxed max-w-lg">
                A curious, motivated learner who turns complex challenges into creative and efficient solutions. I value honesty, creativity, and collaboration.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://drive.google.com/file/d/1X2BYcPlmSUZa4RIqfeWUIm2-UKfPNCUp/view?usp=sharing"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-brand-700 font-semibold rounded-xl px-5 py-3 shadow-lg hover:bg-brand-50 transition-all duration-200">
                  <Download className="h-4 w-4" /> Download Resume
                </a>
                <a href="https://aryan-sengar-portfolio-v2.netlify.app/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-white/30 text-white rounded-xl px-5 py-3 hover:bg-white/10 transition-all duration-200">
                  <ExternalLink className="h-4 w-4" /> View Portfolio
                </a>
              </div>
            </div>

            {/* Profile photo */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-3 rounded-full bg-white/20 blur-xl animate-pulse-slow" />
                <div className="relative h-64 w-64 sm:h-72 sm:w-72 rounded-full overflow-hidden border-4 border-white/40 shadow-2xl">
                  <img src="/aryan.jpg" alt="Aryan Sengar"
                    className="w-full h-full object-cover object-top" />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-2 -right-2 bg-white rounded-2xl px-3 py-2 shadow-xl flex items-center gap-2">
                  <span className="text-xl">🎓</span>
                  <div>
                    <p className="text-xs font-bold text-stone-800 leading-none">B.Tech CSE</p>
                    <p className="text-[10px] text-stone-500">AI & ML</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 space-y-14">

        {/* About text */}
        <div ref={el => revealRefs.current[0] = el} className="reveal grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-1">About Me</p>
              <h2 className="font-display text-3xl font-bold text-stone-900">Who I Am</h2>
            </div>
            <div className="space-y-4 text-stone-600 leading-relaxed text-[15px]">
              <p>
                Hi, I'm <strong className="text-stone-800">Aryan Sengar</strong>, a Computer Science student specializing in Artificial Intelligence & Machine Learning at The NorthCap University. I'm deeply interested in how technology can be used to solve real-world problems and improve people's lives.
              </p>
              <p>
                While I'm still growing my technical skills, I enjoy working on projects that combine innovation, design, and smart thinking. From AI-powered interfaces to system design ideas, I love turning concepts into something real and impactful.
              </p>
              <p>
                I'm currently exploring areas like AI, Java, UI/UX design, and web development, and taking part in internships that help me learn through practical experience. My goal is to keep expanding my understanding of tech and build solutions that are both intelligent and user-friendly.
              </p>
              <p>
                I describe myself as a curious, motivated learner who enjoys turning complex challenges into creative and efficient solutions. I value honesty, creativity, and collaboration, and I strive to bring these principles into every project I take on.
              </p>
              <p>
                Currently, I'm sharpening my skills through internships, side projects, and hands-on experimentation. I believe in <em>learning by doing</em>, and I'm excited to keep exploring, building, and improving every day.
              </p>
            </div>
          </div>

          {/* Quick info card */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-stone-100 p-6 glow-card-sm space-y-4">
              <h3 className="font-semibold text-stone-800 text-sm uppercase tracking-wide">Quick Info</h3>
              {[
                { label: 'Degree', value: 'B.Tech CSE (AI & ML)' },
                { label: 'University', value: 'The NorthCap University' },
                { label: 'Location', value: 'Gurugram, India' },
                { label: 'Email', value: 'sengararyan997@gmail.com' },
                { label: 'Status', value: 'Open to Internships' },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5 pb-3 border-b border-stone-50 last:border-0 last:pb-0">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">{label}</span>
                  <span className="text-sm font-medium text-stone-700">{value}</span>
                </div>
              ))}
            </div>
            <a href="https://drive.google.com/file/d/1X2BYcPlmSUZa4RIqfeWUIm2-UKfPNCUp/view?usp=sharing"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl py-3 shadow-glow-sm transition-all duration-200">
              <Download className="h-4 w-4" /> Download Resume
            </a>
          </div>
        </div>

        {/* Skills */}
        <div ref={el => revealRefs.current[1] = el} className="reveal bg-white rounded-2xl border border-stone-100 p-8 glow-card-sm">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-1">Expertise</p>
            <h2 className="font-display text-2xl font-bold text-stone-900">Skills & Technologies</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {skills.map(skill => (
              <div key={skill.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-stone-700">{skill.name}</span>
                  <span className="text-xs font-semibold text-stone-500">{skill.level}%</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000`}
                    style={{ width: `${skill.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hobbies */}
        <div ref={el => revealRefs.current[2] = el} className="reveal">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-1">Beyond Coding</p>
            <h2 className="font-display text-2xl font-bold text-stone-900">Interests & Hobbies</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {hobbies.map(h => (
              <div key={h.label} className="bg-white rounded-2xl border border-stone-100 p-6 glow-card-sm text-center group hover:border-brand-200 transition-all">
                <span className="text-4xl group-hover:scale-110 inline-block transition-transform duration-300">{h.emoji}</span>
                <p className="mt-3 font-semibold text-stone-800 text-sm">{h.label}</p>
                <p className="mt-1 text-xs text-stone-500 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social links */}
        <div ref={el => revealRefs.current[3] = el} className="reveal">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-1">Connect</p>
            <h2 className="font-display text-2xl font-bold text-stone-900">Find Me Online</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {links.map(({ Icon, label, href, color }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${color}`}>
                <Icon className="h-4 w-4" /> {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
