import React, { useState } from 'react';
import { PERSONAL_INFO } from '../../data/profileData';
import { useLang } from '../../lib/language';
import { 
  Terminal, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  Mail, 
  GitBranch, 
  Globe,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const ContactTerminal: React.FC = () => {
  const { t } = useLang();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "INITIALIZING DISPATCH PROTOCOL...",
    "READY FOR USER TRANSMISSION."
  ]);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmissionStatus('error');
      setErrorMessage("Missing required parameters: Name, Email, and Message.");
      return;
    }

    setLoading(true);
    setSubmissionStatus('idle');
    setErrorMessage('');
    
    setTerminalLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ENCRYPTING PAYLOAD FOR ${formData.email}...`,
      `[${new Date().toLocaleTimeString()}] TRANSMITTING TO SERVER API /api/contact...`
    ]);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmissionStatus('success');
        setTerminalLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] DISPATCH VERIFIED: 200 OK.`,
          `[${new Date().toLocaleTimeString()}] MESSAGE PLACED IN MAHMOUD'S DIRECT QUEUE.`
        ]);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmissionStatus('error');
        setErrorMessage(data.error || 'Server rejected message payload.');
        setTerminalLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ERROR: TRANSMISSION FAILED.`
        ]);
      }
    } catch (err: any) {
      setSubmissionStatus('error');
      setErrorMessage("Network error: Unable to reach backend server.");
      setTerminalLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] NETWORK FAILURE: SERVICE UNREACHABLE.`
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="section-contact">
      
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.contactDirectDispatch}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          {t.contactTitle}
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl font-sans">
          {t.contactDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Direct Contact Details & Links */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-6 flex flex-col justify-between font-mono">
          <div className="space-y-5">
            
            {/* Engineer Profile Card */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-cyan-500/40 shrink-0 relative">
                <img 
                  src={PERSONAL_INFO.avatarUrl} 
                  alt={PERSONAL_INFO.name} 
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="truncate">{PERSONAL_INFO.name}</span>
                  {PERSONAL_INFO.logoUrl && (
                    <img src={PERSONAL_INFO.logoUrl} alt="Logo" className="w-4 h-4 rounded shrink-0" referrerPolicy="no-referrer" />
                  )}
                </div>
                <div className="text-[11px] text-cyan-400 truncate">
                  {t.contactProfileRole}
                </div>
                <div className="text-[10px] text-slate-400">
                  {PERSONAL_INFO.location}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold uppercase tracking-wider">
              <Mail className="w-4 h-4" />
              <span>{t.contactDirectLine}</span>
            </div>

            {/* Email Copy Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">
                {t.contactEmailLabel}
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-100 select-all truncate">
                  {PERSONAL_INFO.email}
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700 transition-colors shrink-0"
                  title="Copy Email Address"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Response Availability */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>{t.contactResponseTime}</span>
              </div>
              <p className="text-slate-300 font-sans leading-relaxed">
                {t.contactResponseDesc}
              </p>
            </div>
          </div>

          {/* Social Icons */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              {t.contactExternalPortals}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-800 text-slate-200 transition-colors"
              >
                <GitBranch className="w-4 h-4 text-cyan-400" />
                <span>{t.contactGitHub}</span>
              </a>

              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-800 text-slate-200 transition-colors"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{t.contactLinkedIn}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Terminal Input Form */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-6 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>{t.contactTerminalInterface}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold">
                  {t.contactSenderName} <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Mercer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold">
                  {t.contactSenderEmail} <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. alex@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold">
                {t.contactSubjectLabel}
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Full-Stack / AI Role Opportunity or Project Quote"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold">
                {t.contactMessageBody} <span className="text-cyan-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your message here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors resize-none font-sans"
              />
            </div>

            {/* Error Message */}
            {submissionStatus === 'error' && (
              <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Terminal Live Output Window */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-[10px] text-slate-400 font-mono">
              <div className="text-slate-500 font-bold uppercase tracking-wider">
                {t.contactConsoleLog}
              </div>
              {terminalLogs.slice(-3).map((log, lIdx) => (
                <div key={lIdx} className="text-cyan-400/90 truncate">
                  &gt; {log}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? t.contactTransmitting : t.contactDispatchTo}</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
