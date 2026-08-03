import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CV_VARIANTS, PERSONAL_INFO } from '../../data/profileData';
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

  const handleDownloadTextCV = (cv: CVVariant) => {
    const textContent = `
===================================================================
${PERSONAL_INFO.name.toUpperCase()} - ${cv.title.toUpperCase()}
===================================================================
Contact: ${PERSONAL_INFO.email} | Location: ${PERSONAL_INFO.location}
GitHub: ${PERSONAL_INFO.github} | LinkedIn: ${PERSONAL_INFO.linkedin}
Education: ${PERSONAL_INFO.education.degree} (${PERSONAL_INFO.education.institution}, ${PERSONAL_INFO.education.graduated})
Military Service: ${PERSONAL_INFO.militaryService}

TARGET FOCUS:
${cv.focus}

PROFILE SUMMARY:
${cv.summary}

KEY HIGHLIGHTS & ACCOMPLISHMENTS:
${cv.highlights.map((h, i) => `${i + 1}. ${h}`).join('\n')}

RECOMMENDED FOR:
${cv.recommendedFor}
===================================================================
Generated via Mahmoud Wehaiba's Portfolio System
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Mahmoud_Wehaiba_CV_${cv.id}.txt`;
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
            <span>CELESTIAL CV & RESUME ARCHIVE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Role-Specific Resume Profiles
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl font-sans mt-1">
            To respect recruiters' time, Mahmoud provides 3 tailored CV variations optimized for specific engineering roles: Full-Stack & AI Systems, Backend Infrastructure, and AgTech Innovation.
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
                  Target Profile
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
                <div className="text-[11px] text-slate-400 font-semibold">Recommended For:</div>
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
                <span>Preview</span>
              </button>

              <button
                onClick={() => handleDownloadTextCV(cv)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-xl transition-colors shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
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
                OFFICIAL RESUME // {activePreview.id.toUpperCase()}
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
                  Executive Summary
                </h4>
                <p className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                  {activePreview.summary}
                </p>
              </div>

              <div>
                <h4 className="font-mono font-bold text-emerald-400 text-xs uppercase mb-2">
                  Key Achievements & Credentials
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
                  <div className="text-[11px] text-slate-400 font-bold">Education:</div>
                  <div className="text-slate-200 font-semibold mt-0.5">{PERSONAL_INFO.education.degree}</div>
                  <div className="text-[10px] text-slate-400">{PERSONAL_INFO.education.institution} ({PERSONAL_INFO.education.graduated})</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-bold">Military Status:</div>
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
                Close Preview
              </button>

              <button
                onClick={() => handleDownloadTextCV(activePreview)}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-mono font-bold transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Save Profile (.TXT)</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </motion.div>
  );
};
