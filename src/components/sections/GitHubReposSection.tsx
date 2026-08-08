import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../../data/profileData';
import { useLang } from '../../lib/language';
import {
  GitBranch,
  Star,
  GitFork,
  ExternalLink,
  Search,
  RefreshCw,
  Code2,
  Terminal,
  Database,
  Globe,
  Box,
  Cpu,
  Lock,
  FileText,
  LockKeyhole,
  Loader2
} from 'lucide-react';

interface GitHubRepo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
  archived: boolean;
  fork: boolean;
  private: boolean;
  topics: string[];
  has_readme: boolean;
  postId: string | null;
  postStale: boolean;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  CSS: '#563d7c',
  HTML: '#e34c26',
  'C#': '#178600',
  'C++': '#f34b7d',
  Shell: '#89e051',
  Dockerfile: '#384d54',
  Jupyter: '#DA5B0B',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  C: '#555555',
  'C++ ': '#f34b7d',
};

const repoCategoryIcon = (repo: GitHubRepo) => {
  const lang = repo.language?.toLowerCase() ?? '';
  if (lang.includes('python')) return <Cpu className="w-4 h-4" />;
  if (lang.includes('typescript') || lang.includes('javascript')) return <Terminal className="w-4 h-4" />;
  if (lang.includes('css') || lang.includes('html')) return <Globe className="w-4 h-4" />;
  return <Box className="w-4 h-4" />;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const GitHubReposSection: React.FC = () => {
  const { t, lang, isArabic } = useLang();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrivate, setShowPrivate] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  const fetchRepos = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/github');
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setRepos(Array.isArray(data.repos) ? data.repos : []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const handleGenerate = async (repo: GitHubRepo) => {
    setGenerating(repo.name);
    try {
      const res = await fetch('/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: repo.full_name })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchRepos();
      } else {
        alert(t.githubGenerateError);
      }
    } catch (err) {
      alert(t.githubGenerateError);
    } finally {
      setGenerating(null);
    }
  };

  const visibleRepos = React.useMemo(() => {
    let list = repos.filter((r) => (showPrivate ? true : !r.private));
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((repo) =>
        repo.name.toLowerCase().includes(q) ||
        (repo.description ?? '').toLowerCase().includes(q) ||
        (repo.language ?? '').toLowerCase().includes(q) ||
        repo.topics.some((topic) => topic.toLowerCase().includes(q))
      );
    }
    return list;
  }, [repos, searchQuery, showPrivate]);

  const filteredRepos = visibleRepos;

  const formatDate = (iso: string) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const SkeletonCard = () => (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-800" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-2/3 bg-slate-800 rounded" />
          <div className="h-2 w-1/3 bg-slate-800/70 rounded" />
        </div>
      </div>
      <div className="h-2 w-full bg-slate-800/70 rounded" />
      <div className="h-2 w-4/5 bg-slate-800/70 rounded" />
      <div className="flex gap-3 pt-2">
        <div className="h-2 w-10 bg-slate-800 rounded" />
        <div className="h-2 w-10 bg-slate-800 rounded" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in relative" id="section-github">

      {/* Header & Controls */}
      <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-4 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-2">
              <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.githubHeader}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.githubTitle}
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl font-sans">
              {t.githubDesc}
            </p>
          </div>

          {/* Search + Count */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.githubSearchPlaceholder}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/60 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] outline-none rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>{repos.filter(r => !r.private).length}</span>
              <span className="text-slate-500">/</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                {repos.filter(r => r.private).length}
              </span>
            </div>

            <button
              onClick={() => setShowPrivate((p) => !p)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                showPrivate
                  ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <LockKeyhole className="w-3.5 h-3.5" />
              <span>{showPrivate ? 'All visible' : 'Public only'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-slate-900/80 border border-red-500/40 rounded-2xl p-6 text-center space-y-4 font-mono">
          <div className="text-sm text-red-300 flex items-center justify-center gap-2">
            <Terminal className="w-4 h-4" />
            <span>{t.githubError}</span>
          </div>
          <button
            onClick={fetchRepos}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-950 hover:bg-red-900 text-red-200 rounded-xl border border-red-500/40 text-xs font-bold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.githubRetry}</span>
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)}
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <>
          {filteredRepos.length === 0 ? (
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
              <Database className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-sm font-mono">{t.githubNoResults}</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredRepos.map((repo) => (
                <motion.div
                  key={repo.name}
                  variants={itemVariants}
                  className="group bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between space-y-4 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)] relative overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Repo Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border ${repo.private ? 'bg-amber-950/60 border-amber-500/40' : 'bg-slate-950 border-slate-800'} text-cyan-400`}
                          style={repo.language ? { color: LANGUAGE_COLORS[repo.language] ?? '#06b6d4', borderColor: `${LANGUAGE_COLORS[repo.language] ?? '#06b6d4'}55` } : undefined}
                        >
                          {repoCategoryIcon(repo)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors truncate font-mono flex items-center gap-1.5">
                            {repo.name}
                            {repo.private && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 font-bold uppercase shrink-0">
                                <Lock className="w-2.5 h-2.5" />
                                {t.githubPrivate}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono truncate">
                            {repo.full_name}
                          </div>
                        </div>
                      </div>
                      <a href={repo.html_url} target="_blank" rel="noreferrer" className="shrink-0">
                        <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                      </a>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-3 min-h-[3rem]">
                      {repo.description || <span className="text-slate-600 italic">—</span>}
                    </p>

                    {/* README → Post action */}
                    <div className="flex flex-wrap gap-1.5">
                      {repo.has_readme && repo.postId ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-mono">
                          <FileText className="w-3 h-3" />
                          <span>{t.githubReadPost}</span>
                          {repo.postStale && <span className="text-amber-300">•</span>}
                        </span>
                      ) : repo.has_readme ? (
                        <button
                          onClick={() => handleGenerate(repo)}
                          disabled={generating === repo.name}
                          className="inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/60 font-mono transition-colors"
                        >
                          {generating === repo.name
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : <FileText className="w-3 h-3" />}
                          <span>{t.githubGenerate}</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-600 italic font-sans">No README</span>
                      )}
                    </div>
                  </div>

                  {/* Meta Footer */}
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-[11px]">
                    <div className="flex items-center gap-3 font-mono text-slate-400 min-w-0">
                      {repo.language && (
                        <span className="flex items-center gap-1.5 truncate">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: LANGUAGE_COLORS[repo.language] ?? '#94a3b8' }}
                          />
                          <span className="truncate">{repo.language}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1 shrink-0">
                        <Star className={`w-3.5 h-3.5 ${repo.stargazers_count > 0 ? 'text-amber-400' : 'text-slate-600'}`} />
                        {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1 shrink-0">
                        <GitFork className={`w-3.5 h-3.5 ${repo.forks_count > 0 ? 'text-cyan-400' : 'text-slate-600'}`} />
                        {repo.forks_count}
                      </span>
                    </div>
                    <span className="text-slate-600 shrink-0 font-mono" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                      {t.githubUpdated} {formatDate(repo.updated_at)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* View All Link */}
          <div className="text-center pt-2">
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]"
            >
              <GitBranch className="w-4 h-4" />
              <span>{t.githubViewAll}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </>
      )}

    </div>
  );
};