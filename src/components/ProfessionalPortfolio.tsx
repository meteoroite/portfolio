import React from 'react';
import { ArrowUpRight, Check, Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { PROFILE, PROJECTS, SKILLS, EDUCATION } from '../data/professionalProfile';

interface Props { language: Language; onLanguageChange: (language: Language) => void; }

export const ProfessionalPortfolio: React.FC<Props> = ({ language, onLanguageChange }) => {
  const ar = language === 'ar';
  const t = (x: { en: string; ar: string }) => x[language];

  return <div dir={ar ? 'rtl' : 'ltr'} className="min-h-screen bg-[#070b10] text-white">
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070b10]/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="font-bold tracking-tight">MW<span className="text-sky-400">.</span></a>
        <div className="hidden gap-6 text-sm text-slate-400 md:flex">
          <a href="#work" className="hover:text-white">{ar ? 'الأعمال' : 'Work'}</a>
          <a href="#skills" className="hover:text-white">{ar ? 'المهارات' : 'Skills'}</a>
          <a href="#about" className="hover:text-white">{ar ? 'عنّي' : 'About'}</a>
          <a href="#contact" className="hover:text-white">{ar ? 'تواصل' : 'Contact'}</a>
        </div>
        <button onClick={() => onLanguageChange(ar ? 'en' : 'ar')} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5">{ar ? 'EN' : 'عربي'}</button>
      </nav>
    </header>

    <main id="top">
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-24">
        <div className="max-w-4xl">
          <p className="text-sm font-mono text-sky-400">{ar ? 'مهندس برمجيات وذكاء اصطناعي' : 'Software & AI Engineer'}</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-7xl">{PROFILE.name}</h1>
          <p className="mt-7 max-w-3xl text-xl leading-9 text-slate-300">{t(PROFILE.summary)}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#work" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200">{ar ? 'مشاريعي' : 'View my work'} <ArrowUpRight className="h-4 w-4" /></a>
            <a href="https://github.com/meteoroite" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-semibold hover:bg-white/5"><Github className="h-4 w-4" /> GitHub</a>
            <a href="https://www.linkedin.com/in/mahmoud-wehaiba-628a42221/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-semibold hover:bg-white/5"><Linkedin className="h-4 w-4" /> LinkedIn</a>
          </div>
        </div>
      </section>

      <section id="work" className="border-y border-white/10 bg-white/[.02] py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading eyebrow={ar ? 'الأعمال' : 'Selected work'} title={ar ? 'مشاريع مصنفة بوضوح، بدون تضخيم.' : 'Projects with clear status, without inflated claims.'} />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {PROJECTS.map(p => <article key={p.name} className="rounded-2xl border border-white/10 bg-[#0a1017] p-6">
              <div className="flex items-start justify-between gap-4"><h3 className="text-xl font-bold">{p.name}</h3><span className="text-right text-[11px] font-mono text-sky-400">{t(p.status)}</span></div>
              <p className="mt-2 text-xs text-slate-500">{t(p.role)}</p>
              <p className="mt-5 text-sm leading-7 text-slate-300">{t(p.description)}</p>
              <div className="mt-5 border-t border-white/10 pt-4 text-xs font-mono text-slate-500">{p.stack}</div>
            </article>)}
          </div>
        </div>
      </section>

      <section id="skills" className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading eyebrow={ar ? 'المهارات' : 'Engineering stack'} title={ar ? 'المهارات كأدوات مستخدمة، لا كدرجات مصطنعة.' : 'Skills as working tools, not artificial ratings.'} />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SKILLS.map(([name, detail]) => <div key={name} className="rounded-2xl border border-white/10 bg-white/[.025] p-5"><h3 className="font-bold">{name}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{detail}</p></div>)}
          </div>
        </div>
      </section>

      <section id="about" className="border-y border-white/10 bg-white/[.02] py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1.1fr_.9fr]">
          <div><SectionHeading align="left" eyebrow={ar ? 'عنّي' : 'About'} title={t(PROFILE.title)} /><p className="mt-6 max-w-2xl text-sm leading-8 text-slate-300">{t(PROFILE.summary)}</p><div className="mt-8 space-y-3">{PROFILE.principles[language].map(x => <div key={x} className="flex gap-3 text-sm text-slate-300"><Check className="mt-0.5 h-4 w-4 text-sky-400" />{x}</div>)}</div></div>
          <div className="rounded-2xl border border-white/10 bg-[#0a1017] p-6"><p className="text-xs font-mono uppercase tracking-widest text-sky-400">{ar ? 'التعليم والخلفية' : 'Education & background'}</p><div className="mt-6 space-y-6">{EDUCATION.map(x => <div key={x.period}><div className="text-xs font-mono text-slate-500">{x.period}</div><h3 className="mt-1 font-bold">{t(x.title)}</h3><p className="mt-1 text-sm text-slate-400">{t(x.detail)}</p></div>)}</div></div>
        </div>
      </section>

      <section id="contact" className="py-24">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-sky-400">{ar ? 'تواصل' : 'Contact'}</p>
          <h2 className="mt-3 text-4xl font-black">{ar ? 'تريد مناقشة مشروع أو فرصة؟' : 'Have a project or engineering opportunity?'}</h2>
          <p className="mt-4 text-slate-400">{ar ? 'أرسل التفاصيل الأساسية وسأرد عندما أستطيع.' : 'Send the essential details and I will get back to you.'}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="mailto:mahmoudwheba22@gmail.com" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950"><Mail className="h-4 w-4" />Email</a>
            <a href="https://github.com/meteoroite" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3"><Github className="h-4 w-4" />GitHub</a>
            <a href="https://terracode.vercel.app/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3"><ExternalLink className="h-4 w-4" />TerraCode</a>
          </div>
        </div>
      </section>
    </main>
    <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-600">© {new Date().getFullYear()} Mahmoud Wehaiba</footer>
  </div>;
};

const SectionHeading = ({ eyebrow, title, align = 'center' }: { eyebrow: string; title: string; align?: 'left' | 'center' }) => <div className={align === 'left' ? '' : 'text-center'}><p className="text-xs font-mono uppercase tracking-widest text-sky-400">{eyebrow}</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{title}</h2></div>;