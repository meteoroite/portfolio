import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CV_VARIANTS, PERSONAL_INFO, SKILL_CATEGORIES, PROJECTS_DATA, TIMELINE_DATA } from '../../data/profileData';
import { CVVariant } from '../../types';
import { Planet3D } from '../ui/Planet3D';
import { 
  FileText, 
  Download, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  Printer, 
  X,
  FileCode2,
  Mail,
  Orbit
} from 'lucide-react';
import { useLang } from '../../lib/language';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 } 
  },
};

export const CVArchiveSection: React.FC = () => {
  const [activePreview, setActivePreview] = useState<CVVariant | null>(null);
  const { t } = useLang();

  const handleDownloadPDF = (cv: CVVariant) => {
    const relevantSkills = SKILL_CATEGORIES.map(cat => 
      `<div style="margin-bottom:8px"><strong style="color:#1a1a2e">${cat.name}:</strong> ${cat.skills.map(s => `${s.name} (${s.level})`).join(', ')}</div>`
    ).join('');

    const relevantProjects = PROJECTS_DATA.filter(p => 
      cv.id === 'fullstack-ai' ? ['AI', 'Full-Stack'].includes(p.category) :
      cv.id === 'backend-systems' ? ['Full-Stack', 'AgTech'].includes(p.category) :
      ['AgTech', 'Computer Vision', 'Client Work'].includes(p.category)
    ).map(p => 
      `<div style="margin-bottom:6px"><strong>${p.title}</strong> (${p.category}) — ${p.shortDesc}. <em>Stack:</em> ${p.stack.join(', ')}. <em>Role:</em> ${p.role}.</div>`
    ).join('');

    const relevantTimeline = TIMELINE_DATA.map(t => 
      `<div style="margin-bottom:4px"><strong>${t.period}:</strong> ${t.title} — ${t.description}</div>`
    ).join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${PERSONAL_INFO.name} — ${cv.title}</title>
<style>
  @page { size: A4; margin: 20mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; color: #1a1a2e; line-height: 1.5; font-size: 11px; }
  .header { border-bottom: 2px solid #0891b2; padding-bottom: 12px; margin-bottom: 16px; }
  .name { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
  .title { font-size: 13px; color: #0891b2; font-weight: 600; margin-bottom: 8px; }
  .contact { font-size: 10px; color: #475569; display: flex; flex-wrap: wrap; gap: 12px; }
  .section { margin-bottom: 14px; }
  .section-title { font-size: 12px; font-weight: 700; color: #0891b2; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px; }
  .item { margin-bottom: 6px; }
  .item-title { font-weight: 700; color: #0f172a; }
  .item-subtitle { font-size: 10px; color: #64748b; }
  .item-desc { font-size: 10.5px; color: #334155; margin-top: 2px; }
  ul { padding-left: 16px; }
  li { margin-bottom: 3px; font-size: 10.5px; color: #334155; }
  .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; }
  .highlight { background: #f0fdfa; padding: 8px 10px; border-left: 3px solid #0891b2; margin-bottom: 6px; font-size: 10.5px; }
  @media print { body { font-size: 10px; } }
</style>
</head>
<body>
<div class="header">
  <div class="name">${PERSONAL_INFO.name}</div>
  <div class="title">${cv.title}</div>
  <div class="contact">
    <span>${PERSONAL_INFO.email}</span>
    <span>${PERSONAL_INFO.location}</span>
    <span>github.com/meteoroite</span>
    <span>linkedin.com/in/mahmoud-wehaiba</span>
  </div>
</div>

<div class="section">
  <div class="section-title">Professional Summary</div>
  <div class="highlight">${cv.summary}</div>
</div>

<div class="section">
  <div class="section-title">Target Focus</div>
  <div style="font-size:10.5px; color:#334155">${cv.focus}</div>
</div>

<div class="section">
  <div class="section-title">Education</div>
  <div class="item">
    <div class="item-title">${PERSONAL_INFO.education.degree}</div>
    <div class="item-subtitle">${PERSONAL_INFO.education.institution} — Graduated ${PERSONAL_INFO.education.graduated}</div>
  </div>
</div>

<div class="section">
  <div class="section-title">Military Service</div>
  <div class="item">
    <div class="item-title">Mandatory Military Service</div>
    <div class="item-subtitle">${PERSONAL_INFO.militaryService}</div>
  </div>
</div>

<div class="section">
  <div class="section-title">Technical Skills</div>
  <div class="skills-grid">${relevantSkills}</div>
</div>

<div class="section">
  <div class="section-title">Key Projects</div>
  ${relevantProjects}
</div>

<div class="section">
  <div class="section-title">Career Timeline</div>
  ${relevantTimeline}
</div>

<div class="section">
  <div class="section-title">Key Achievements</div>
  <ul>
    ${cv.highlights.map(h => `<li>${h}</li>`).join('\n    ')}
  </ul>
</div>

<div class="section">
  <div class="section-title">Recommended For</div>
  <div class="highlight">${cv.recommendedFor}</div>
</div>

<div style="margin-top:20px; padding-top:8px; border-top:1px solid #e2e8f0; font-size:9px; color:#94a3b8; text-align:center">
  Generated via Mahmoud Wehaiba Portfolio System — ${new Date().toISOString().split('T')[0]}
</div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Mahmoud_Wehaiba_CV_${cv.id}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8" 
      id="section-cv"
    >
      
      {/* Header */}
      <motion.div variants={itemVariants} className="bg-slate-900/70 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-2 shadow-[0_0_40px_rgba(6,182,212,0.1)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-2">
            <Orbit className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
            <span>{t.cvHeader}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.cvTitle}
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl font-sans mt-1">
            {t.cvDescription}
          </p>
        </div>

        <div className="shrink-0 hidden md:block">
          <Planet3D id="cv-archive-planet" category="Full-Stack" size={65} isHovered={true} />
        </div>
      </motion.div>

      {/* CV Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CV_VARIANTS.map((cv, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            key={cv.id}
            className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between space-y-6 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)] group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-cyan-400 font-bold uppercase tracking-wider bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                  {t.cvTargetProfile}
                </span>
                <FileCode2 className="w-4 h-4 text-cyan-400" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {cv.title}
                </h3>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  Focus: <span className="text-slate-200">{cv.focus}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {cv.summary}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-800 font-mono text-xs">
                <div className="text-[11px] text-slate-400 font-semibold">{t.cvRecommendedFor}</div>
                <div className="bg-slate-950 p-2 rounded text-[11px] text-emerald-300 border border-slate-800">
                  {cv.recommendedFor}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center gap-2 font-mono text-xs">
              <button
                onClick={() => setActivePreview(cv)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-xl border border-slate-700 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.cvPreview}</span>
              </button>

              <button
                onClick={() => handleDownloadPDF(cv)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-xl transition-colors shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.cvDownload}</span>
              </button>
            </div>

          </motion.div>
        ))}
      </div>

      {/* CV Preview Modal */}
      {activePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-mono">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setActivePreview(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-950 border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Document Header */}
            <div className="border-b border-slate-800 pb-4 space-y-2">
              <div className="text-xs text-cyan-400 font-bold uppercase tracking-widest">
                {t.cvOfficialResume} // {activePreview.id.toUpperCase()}
              </div>
              <h3 className="text-2xl font-bold text-white">
                {PERSONAL_INFO.name} — {activePreview.title}
              </h3>
              <div className="text-xs text-slate-400 flex flex-wrap gap-4">
                <span>Email: {PERSONAL_INFO.email}</span>
                <span>Degree: {PERSONAL_INFO.education.degree}</span>
              </div>
            </div>

            {/* Document Body */}
            <div className="space-y-4 text-xs font-sans text-slate-200">
              <div>
                <h4 className="font-mono font-bold text-cyan-400 text-xs uppercase mb-1">
                  {t.cvExecutiveSummary}
                </h4>
                <p className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                  {activePreview.summary}
                </p>
              </div>

              <div>
                <h4 className="font-mono font-bold text-emerald-400 text-xs uppercase mb-2">
                  {t.cvKeyAchievements}
                </h4>
                <ul className="space-y-2 font-mono">
                  {activePreview.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-bold">{t.cvEducation}:</div>
                  <div className="text-slate-200 font-semibold mt-0.5">{PERSONAL_INFO.education.degree}</div>
                  <div className="text-[10px] text-slate-400">{PERSONAL_INFO.education.institution} ({PERSONAL_INFO.education.graduated})</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-bold">{t.cvMilitaryStatus}:</div>
                  <div className="text-slate-200 font-semibold mt-0.5">{PERSONAL_INFO.militaryService}</div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setActivePreview(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono"
              >
                {t.cvClosePreview}
              </button>

              <button
                onClick={() => handleDownloadPDF(activePreview)}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-mono font-bold transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{t.cvSaveProfile}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </motion.div>
  );
};
