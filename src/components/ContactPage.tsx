import { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Instagram, Linkedin, Code2, Globe, MessageCircle, ExternalLink, CheckCircle2 } from 'lucide-react';

const contactDetails = [
  { Icon: Mail,    label: 'Email',    value: 'sengararyan997@gmail.com', href: 'mailto:sengararyan997@gmail.com' },
  { Icon: Phone,   label: 'Phone',    value: '+91 93183 05645',           href: 'tel:+919318305645' },
  { Icon: MapPin,  label: 'Location', value: 'Gurugram, Haryana – 122001', href: 'https://maps.google.com/?q=Rajiv+Nagar+Gurugram' },
];

const socials = [
  { Icon: Linkedin,      label: 'LinkedIn',   sub: 'aryan-sengar',        href: 'https://www.linkedin.com/in/aryan-sengar-786b96290/',        color: 'text-sky-600 bg-sky-50 border-sky-100' },
  { Icon: Github,        label: 'GitHub',     sub: 'aryansengar007',      href: 'https://github.com/aryansengar007',                          color: 'text-stone-700 bg-stone-50 border-stone-200' },
  { Icon: Instagram,     label: 'Instagram',  sub: '@aryan_sengar007',    href: 'https://www.instagram.com/aryan_sengar007?igsh=a3oydTk0N210MjZ2', color: 'text-pink-600 bg-pink-50 border-pink-100' },
  { Icon: Code2,         label: 'LeetCode',   sub: 'aryan_sengar007',     href: 'https://leetcode.com/u/aryan_sengar007/',                    color: 'text-amber-600 bg-amber-50 border-amber-100' },
  { Icon: Globe,         label: 'Portfolio',  sub: 'aryan-sengar-portfolio-v2',href: 'https://aryan-sengar-portfolio-v2.netlify.app/',         color: 'text-brand-600 bg-brand-50 border-brand-100' },
  { Icon: MessageCircle, label: 'WhatsApp',   sub: 'Message me',          href: 'https://wa.me/message/XMEQKCUSBI3HJ1',                       color: 'text-green-600 bg-green-50 border-green-100' },
  { Icon: ExternalLink,  label: 'Bio Link',   sub: 'bio.link/aryan',      href: 'https://bio.link/aryan_sengar007',                           color: 'text-violet-600 bg-violet-50 border-violet-100' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setSending(true);
    // Submit via FormBold
    try {
      await fetch('https://formbold.com/s/3wBrW', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch (_) {}
    setSending(false);
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  const inputCls = (field: string) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition-all duration-200 bg-white focus:ring-2 focus:ring-brand-100 ${errors[field] ? 'border-rose-300 focus:border-rose-400' : 'border-stone-200 focus:border-brand-400'}`;

  return (
    <div className="pt-16 min-h-screen bg-stone-50">

      {/* Header */}
      <div className="bg-white border-b border-stone-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-1">Get in touch</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">Contact Me</h1>
          <p className="mt-2 text-stone-500 max-w-lg text-sm leading-relaxed">
            Have a question, collaboration idea, or just want to say hello? I'd love to hear from you. Fill out the form or reach me directly through any channel below.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[1fr_400px] gap-10">

          {/* Left — form */}
          <div ref={el => revealRefs.current[0] = el} className="reveal">
            <div className="bg-white rounded-2xl border border-stone-100 p-8 glow-card-sm">
              <h2 className="font-display text-xl font-bold text-stone-900 mb-6">Send a Message</h2>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-14 text-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-50">
                    <CheckCircle2 className="h-8 w-8 text-sage-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-stone-800">Message sent!</p>
                    <p className="text-sm text-stone-500 mt-1">Thanks for reaching out. I'll get back to you soon.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">Full Name <span className="text-rose-400">*</span></label>
                      <input type="text" placeholder="Your full name" value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        className={inputCls('name')} />
                      {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">Email Address <span className="text-rose-400">*</span></label>
                      <input type="email" placeholder="your@email.com" value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                        className={inputCls('email')} />
                      {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">Subject</label>
                    <input type="text" placeholder="What's this about?" value={form.subject}
                      onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                      className={inputCls('subject')} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">Message <span className="text-rose-400">*</span></label>
                    <textarea rows={6} placeholder="Write your message here…" value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      className={`${inputCls('message')} resize-none`} />
                    {errors.message && <p className="text-xs text-rose-500 mt-1">{errors.message}</p>}
                  </div>

                  <button type="button" onClick={handleSubmit} disabled={sending}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold py-3.5 shadow-glow-sm transition-all duration-200">
                    {sending ? (
                      <><span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Sending…</>
                    ) : (
                      <><Send className="h-4 w-4" /> Send Message</>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right — details + map + socials */}
          <div ref={el => revealRefs.current[1] = el} className="reveal space-y-5">

            {/* Contact details */}
            <div className="bg-white rounded-2xl border border-stone-100 p-6 glow-card-sm space-y-4">
              <h3 className="font-semibold text-stone-800 text-sm uppercase tracking-wide mb-2">Contact Details</h3>
              {contactDetails.map(({ Icon, label, value, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 group rounded-xl p-3 hover:bg-brand-50 transition-all duration-200 -mx-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 group-hover:bg-brand-100 transition-colors">
                    <Icon className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">{label}</p>
                    <p className="text-sm font-medium text-stone-700 group-hover:text-brand-700 transition-colors">{value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden glow-card-sm">
              <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-500" />
                  <span className="text-sm font-semibold text-stone-700">Rajiv Nagar, Gurugram</span>
                </div>
                <a href="https://maps.google.com/?q=Rajiv+Nagar+Sector+13+Gurugram" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                  Open <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="relative h-52">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6517.168704008459!2d77.04391807444593!3d28.475574143153626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19b4064d92d5%3A0x223a9f8f7832e658!2sRajiv%20Nagar%2C%20Sector%2013%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1769375052506!5m2!1sen!2sin"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" title="Aryan's Location" />
              </div>
            </div>

            {/* Socials grid */}
            <div className="bg-white rounded-2xl border border-stone-100 p-5 glow-card-sm">
              <h3 className="font-semibold text-stone-800 text-sm uppercase tracking-wide mb-4">Find Me On</h3>
              <div className="grid grid-cols-2 gap-2">
                {socials.map(({ Icon, label, sub, href, color }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all duration-200 hover:scale-[1.02] hover:shadow-sm ${color}`}>
                    <Icon className="h-4 w-4 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-none">{label}</p>
                      <p className="text-[10px] opacity-60 truncate mt-0.5">{sub}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
