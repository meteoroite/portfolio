import React from 'react';
import { ShieldCheck, Zap, X } from 'lucide-react';
import { useLang } from '../../lib/language';

interface RecruiterBannerProps {
  onDisableRecruiterMode: () => void;
}

export const RecruiterBanner: React.FC<RecruiterBannerProps> = ({ onDisableRecruiterMode }) => {
  const { t } = useLang();
  return (
    <div className="bg-emerald-950/80 border-b border-emerald-500/40 text-emerald-200 px-4 py-2 text-xs md:text-sm font-mono flex items-center justify-between gap-3 shadow-md backdrop-blur-md z-50 relative">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong className="text-white">{t.recruiterFastView}</strong> {t.recruiterDesc}
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onDisableRecruiterMode}
          className="flex items-center gap-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 px-2.5 py-1 rounded text-xs border border-emerald-500/50 transition-colors"
          title="Switch back to Full Visual Experience"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-300" />
          <span>{t.recruiterExit}</span>
        </button>
      </div>
    </div>
  );
};
