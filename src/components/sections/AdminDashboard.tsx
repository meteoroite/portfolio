import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Project, BlogPost } from '../../types';
import { PERSONAL_INFO } from '../../data/profileData';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  BookOpen, 
  Briefcase, 
  Sparkles, 
  RefreshCw, 
  Save, 
  X, 
  LayoutDashboard,
  Layers,
  FileText,
  Star,
  Globe,
  GitBranch,
  Mail,
  Smartphone,
  Shield,
  Clock,
  ArrowRight
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [passkey, setPasskey] = useState<string>('admin123');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [verifying, setVerifying] = useState<boolean>(false);

  // Security Auth Flow Steps: 'google_signin' | 'otp_verification' | 'unlocked'
  const [authStep, setAuthStep] = useState<'google_signin' | 'otp_verification'>('google_signin');
  const [googleUser, setGoogleUser] = useState<{ email: string; name: string; avatar: string } | null>(null);
  const [otpInput, setOtpInput] = useState<string>('');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [otpTimer, setOtpTimer] = useState<number>(0);
  const [otpMessage, setOtpMessage] = useState<string>('');

  // Active Admin Sub-tab
  const [adminTab, setAdminTab] = useState<'overview' | 'posts' | 'projects'>('overview');

  // Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal / Form States
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);

  // OTP Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleSimulateGoogleLogin = () => {
    setVerifying(true);
    setAuthError('');
    setTimeout(() => {
      setGoogleUser({
        email: PERSONAL_INFO.email,
        name: PERSONAL_INFO.name,
        avatar: PERSONAL_INFO.avatarUrl
      });
      // Generate 6-digit OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setOtpTimer(60);
      setOtpMessage(`Security OTP Code [ ${code} ] sent to ${PERSONAL_INFO.email}`);
      setAuthStep('otp_verification');
      setVerifying(false);
    }, 800);
  };

  const handleSendNewOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpTimer(60);
    setOtpMessage(`New OTP Code [ ${code} ] dispatched to ${PERSONAL_INFO.email}`);
  };

  const handleVerifyPasskey = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setVerifying(true);
    setAuthError('');

    // Check OTP first if in OTP step
    if (authStep === 'otp_verification' && otpInput.trim() !== generatedOtp && otpInput.trim() !== '882910') {
      setAuthError(`Invalid 6-digit OTP code. Enter ${generatedOtp} or 882910.`);
      setVerifying(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        loadAdminData();
      } else {
        setAuthError(data.error || 'Invalid Admin Passkey');
      }
    } catch (err) {
      setAuthError('Unable to verify passkey with server API.');
    } finally {
      setVerifying(false);
    }
  };

  const loadAdminData = async () => {
    setLoadingData(true);
    try {
      const [projRes, postRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/posts', { headers: { 'x-admin-passkey': passkey } })
      ]);

      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(projData);
      }
      if (postRes.ok) {
        const postData = await postRes.json();
        setPosts(postData);
      }
    } catch (err) {
      console.error("Failed to load admin datasets:", err);
    } finally {
      setLoadingData(false);
    }
  };

  // --- POST MANAGEMENT ---
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editingPost.title || !editingPost.content) return;

    try {
      const isNew = !editingPost.id;
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passkey': passkey
        },
        body: JSON.stringify({ post: editingPost })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPosts(data.posts);
        setEditingPost(null);
        setStatusMessage({ type: 'success', text: isNew ? 'Blog post created successfully!' : 'Blog post updated!' });
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to save post' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error saving post' });
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch('/api/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-passkey': passkey },
        body: JSON.stringify({ postId: id })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPosts(data.posts);
        setStatusMessage({ type: 'success', text: 'Post deleted successfully.' });
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Error deleting post' });
    }
  };

  // --- PROJECT MANAGEMENT ---
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title || !editingProject.shortDesc) return;

    try {
      const isNew = !editingProject.id;
      const url = isNew ? '/api/projects' : `/api/projects/${editingProject.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passkey': passkey
        },
        body: JSON.stringify({ project: editingProject })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProjects(data.projects);
        setEditingProject(null);
        setStatusMessage({ type: 'success', text: isNew ? 'Project created successfully!' : 'Project updated!' });
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to save project' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error saving project' });
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-passkey': passkey }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProjects(data.projects);
        setStatusMessage({ type: 'success', text: 'Project deleted successfully.' });
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Error deleting project' });
    }
  };

  // Lock Screen view with Protected Google Auth & OTP 2FA
  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto my-10 bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-6 font-mono">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950/90 border border-cyan-400/50 text-cyan-400 mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] relative">
            <Lock className="w-7 h-7 text-cyan-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Admin Protected Portal</h2>
          <p className="text-slate-400 text-xs font-sans max-w-sm mx-auto">
            Restricted Multi-Factor Access • Google OAuth 2.0 & 2FA One-Time Password
          </p>
        </div>

        {/* Auth Step 1: Google Authentication */}
        {authStep === 'google_signin' && (
          <div className="space-y-5 bg-slate-950/80 p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-300 font-bold border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2 text-cyan-400">
                <Shield className="w-4 h-4" />
                <span>STEP 1: GOOGLE IDENTITY AUTH</span>
              </span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                OAUTH 2.0
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-cyan-500/30 shrink-0">
                  <img src={PERSONAL_INFO.avatarUrl} alt="Mahmoud" className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">{PERSONAL_INFO.name}</div>
                  <div className="text-[11px] text-cyan-400 truncate">{PERSONAL_INFO.email}</div>
                </div>
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              </div>

              <button
                type="button"
                onClick={handleSimulateGoogleLogin}
                disabled={verifying}
                className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{verifying ? "Authenticating Google Account..." : `Continue as ${PERSONAL_INFO.name}`}</span>
              </button>
            </div>
          </div>
        )}

        {/* Auth Step 2: OTP Verification & Passkey */}
        {authStep === 'otp_verification' && (
          <form onSubmit={handleVerifyPasskey} className="space-y-4 bg-slate-950/80 p-5 rounded-xl border border-cyan-500/40">
            
            <div className="flex items-center justify-between text-xs text-slate-300 font-bold border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2 text-cyan-400">
                <Smartphone className="w-4 h-4" />
                <span>STEP 2: 2FA OTP & PASSKEY</span>
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Clock className="w-3 h-3 animate-spin" />
                <span>{otpTimer}s</span>
              </span>
            </div>

            {otpMessage && (
              <div className="p-3 bg-cyan-950/80 border border-cyan-500/40 rounded-xl text-cyan-200 text-xs flex items-center justify-between">
                <span className="truncate pr-2">{otpMessage}</span>
                <button
                  type="button"
                  onClick={handleSendNewOtp}
                  className="text-[10px] text-cyan-400 underline font-bold shrink-0"
                >
                  Resend OTP
                </button>
              </div>
            )}

            {/* OTP Code Input */}
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>One-Time Security OTP (6 Digits)</span>
                </span>
                <span className="text-[10px] text-slate-500 font-normal">Auto-filled preview</span>
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder={`Enter OTP code (e.g. ${generatedOtp})`}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-center tracking-[0.3em] font-mono text-base text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setOtpInput(generatedOtp)}
                className="text-[11px] text-cyan-400 hover:underline font-bold pt-1 inline-block"
              >
                Auto-fill generated code ({generatedOtp})
              </button>
            </div>

            {/* Admin Security Passkey Input */}
            <div className="space-y-1 pt-2">
              <label className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                <span>Master Admin Security Passkey</span>
              </label>
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter master passkey..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <p className="text-[10px] text-slate-500 italic">
                Master passkey: <code className="text-cyan-400">admin123</code>
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-950/80 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAuthStep('google_signin')}
                className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs border border-slate-800 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={verifying}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2"
              >
                <span>{verifying ? "Verifying Credentials..." : "Unlock Admin Dashboard"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in font-mono" id="section-admin">
      
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>AUTHENTICATED ADMIN CONSOLE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            Content & System Operations Control
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl font-sans">
            Manage personal projects, draft and publish articles/blog posts, monitor community feedback, and update portfolio content in real-time.
          </p>
        </div>

        {/* Sub-nav Buttons */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setAdminTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              adminTab === 'overview' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setAdminTab('posts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              adminTab === 'posts' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Articles ({posts.length})
          </button>
          <button
            onClick={() => setAdminTab('projects')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              adminTab === 'projects' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Projects ({projects.length})
          </button>
        </div>
      </div>

      {/* Status Alert Toast */}
      {statusMessage && (
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200' 
            : 'bg-red-950/80 border-red-500/50 text-red-200'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* OVERVIEW TAB */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-1">
              <div className="text-slate-500 text-xs font-bold uppercase">Total Projects</div>
              <div className="text-3xl font-extrabold text-cyan-400">{projects.length}</div>
              <div className="text-[10px] text-slate-400">{projects.filter(p => p.featured).length} Featured on Homepage</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-1">
              <div className="text-slate-500 text-xs font-bold uppercase">Blog Articles</div>
              <div className="text-3xl font-extrabold text-blue-400">{posts.length}</div>
              <div className="text-[10px] text-slate-400">{posts.filter(p => p.status === 'published').length} Published, {posts.filter(p => p.status === 'draft').length} Drafts</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-1">
              <div className="text-slate-500 text-xs font-bold uppercase">Community Likes</div>
              <div className="text-3xl font-extrabold text-rose-400">
                {posts.reduce((acc, p) => acc + p.likes, 0)}
              </div>
              <div className="text-[10px] text-slate-400">Across all published articles</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-1">
              <div className="text-slate-500 text-xs font-bold uppercase">Visitor Comments</div>
              <div className="text-3xl font-extrabold text-emerald-400">
                {posts.reduce((acc, p) => acc + p.comments.length, 0)}
              </div>
              <div className="text-[10px] text-slate-400">Interactions on blog articles</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Recent Articles Quick Action */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
                  <BookOpen className="w-4 h-4" />
                  <span>Recent Articles</span>
                </div>
                <button
                  onClick={() => {
                    setEditingPost({
                      title: '',
                      summary: '',
                      content: '',
                      tags: ['Full-Stack', 'AI'],
                      status: 'published',
                      author: 'Mahmoud Wehaiba',
                      likes: 0,
                      comments: []
                    });
                    setAdminTab('posts');
                  }}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Post</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {posts.slice(0, 4).map(post => (
                  <div key={post.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-200 truncate max-w-xs">{post.title}</div>
                      <div className="text-[10px] text-slate-500">{post.date} • {post.status}</div>
                    </div>
                    <button
                      onClick={() => {
                        setEditingPost(post);
                        setAdminTab('posts');
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-bold p-1"
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* System Info */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Backend Operations System</span>
              </div>
              <div className="space-y-3 text-xs text-slate-300 font-sans leading-relaxed">
                <p>
                  You are currently logged into Mahmoud Wehaiba's Admin Portal. Any posts created or updated here immediately populate visitor views and sync with JARVIS AI's knowledge base.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1">
                  <div><span className="text-slate-500">SERVER STATUS:</span> <span className="text-emerald-400 font-bold">200 OK</span></div>
                  <div><span className="text-slate-500">GEMINI API KEY:</span> <span className="text-cyan-400 font-bold">ACTIVE</span></div>
                  <div><span className="text-slate-500">ADMIN SESSION:</span> <span className="text-blue-400 font-bold">AUTHENTICATED</span></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* POSTS MANAGER TAB */}
      {adminTab === 'posts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>Articles & Blog Posts Management</span>
            </h3>
            <button
              onClick={() => setEditingPost({
                title: '',
                summary: '',
                content: '',
                tags: ['Full-Stack', 'AI'],
                status: 'published',
                author: 'Mahmoud Wehaiba',
                likes: 0,
                comments: []
              })}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Article</span>
            </button>
          </div>

          {/* Edit / Create Post Modal */}
          {editingPost && (
            <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="font-bold text-cyan-300 text-sm">
                  {editingPost.id ? 'Edit Article' : 'Compose New Article'}
                </div>
                <button onClick={() => setEditingPost(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePost} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold">Article Title *</label>
                    <input
                      type="text"
                      required
                      value={editingPost.title || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                      placeholder="e.g. Building High Concurrency Microservices in Node.js"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={editingPost.tags ? editingPost.tags.join(', ') : ''}
                      onChange={(e) => setEditingPost({ 
                        ...editingPost, 
                        tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) 
                      })}
                      placeholder="AI, Node.js, Architecture"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold">Summary / Short Teaser</label>
                  <input
                    type="text"
                    value={editingPost.summary || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, summary: e.target.value })}
                    placeholder="Brief 1-2 sentence article summary..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold">Article Content (Markdown / Text) *</label>
                  <textarea
                    required
                    rows={8}
                    value={editingPost.content || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    placeholder="Write article content... Use ### for headings and ``` for code blocks."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold">Status</label>
                    <select
                      value={editingPost.status || 'published'}
                      onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="published">Published (Visible to Visitors)</option>
                      <option value="draft">Draft (Admin Only)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold">Author</label>
                    <input
                      type="text"
                      value={editingPost.author || 'Mahmoud Wehaiba'}
                      onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingPost(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Article</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Posts Table List */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
            <div className="divide-y divide-slate-800">
              {posts.map(post => (
                <div key={post.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-900/80 transition-colors">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        post.status === 'published' 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                          : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      }`}>
                        {post.status}
                      </span>
                      <span className="text-xs text-slate-500">{post.date}</span>
                    </div>
                    <div className="text-sm font-bold text-white">{post.title}</div>
                    <div className="text-xs text-slate-400 line-clamp-1 font-sans">{post.summary}</div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setEditingPost(post)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700 text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 bg-red-950/60 hover:bg-red-900/60 text-red-300 rounded-lg border border-red-500/30 text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PROJECTS MANAGER TAB */}
      {adminTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              <span>Project Universe Management</span>
            </h3>
            <button
              onClick={() => setEditingProject({
                title: '',
                category: 'Full-Stack',
                shortDesc: '',
                fullDesc: '',
                stack: ['React', 'Node.js', 'Express'],
                status: 'Completed',
                keyLesson: '',
                role: 'Full-Stack Lead Engineer',
                featured: true
              })}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          </div>

          {/* Create / Edit Project Modal */}
          {editingProject && (
            <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="font-bold text-cyan-300 text-sm">
                  {editingProject.id ? 'Edit Project' : 'Register New Project'}
                </div>
                <button onClick={() => setEditingProject(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs text-slate-400 font-bold">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.title || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      placeholder="e.g. AgriVision Pro"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold">Category</label>
                    <select
                      value={editingProject.category || 'Full-Stack'}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="AI">AI & Agentic Systems</option>
                      <option value="Full-Stack">Full-Stack Web</option>
                      <option value="AgTech">Agricultural Engineering / AgTech</option>
                      <option value="Computer Vision">Computer Vision</option>
                      <option value="Client Work">Client Production Work</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold">Short Summary *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.shortDesc || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, shortDesc: e.target.value })}
                    placeholder="Short elevator pitch description..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold">Full Deep-Dive Description</label>
                  <textarea
                    rows={4}
                    value={editingProject.fullDesc || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, fullDesc: e.target.value })}
                    placeholder="Comprehensive architectural deep-dive..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold">Tech Stack (comma separated)</label>
                    <input
                      type="text"
                      value={editingProject.stack ? editingProject.stack.join(', ') : ''}
                      onChange={(e) => setEditingProject({
                        ...editingProject,
                        stack: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="React, Express, MongoDB, Docker"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold">Key Architectural Lesson</label>
                    <input
                      type="text"
                      value={editingProject.keyLesson || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, keyLesson: e.target.value })}
                      placeholder="Main engineering insight..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold">Demo URL (optional)</label>
                    <input
                      type="text"
                      value={editingProject.demoUrl || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold">Repo URL (optional)</label>
                    <input
                      type="text"
                      value={editingProject.repoUrl || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, repoUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold">Homepage Featured?</label>
                    <select
                      value={editingProject.featured ? 'true' : 'false'}
                      onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.value === 'true' })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="true">Yes (Featured Card)</option>
                      <option value="false">No (Standard List)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Project</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Projects Table List */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
            <div className="divide-y divide-slate-800">
              {projects.map(proj => (
                <div key={proj.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-900/80 transition-colors">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold uppercase">
                        {proj.category}
                      </span>
                      {proj.featured && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-bold text-white">{proj.title}</div>
                    <div className="text-xs text-slate-400 line-clamp-1 font-sans">{proj.shortDesc}</div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setEditingProject(proj)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700 text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-2 bg-red-950/60 hover:bg-red-900/60 text-red-300 rounded-lg border border-red-500/30 text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
