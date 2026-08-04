import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BlogPost, Comment } from '../../types';
import { Planet3D } from '../ui/Planet3D';
import { useLang } from '../../lib/language';
import { 
  BookOpen, 
  Search, 
  Tag, 
  Heart, 
  MessageSquare, 
  Calendar, 
  Clock, 
  User, 
  Sparkles, 
  Send, 
  X, 
  ArrowRight,
  CheckCircle,
  ThumbsUp,
  Share2,
  Copy,
  Check,
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

export const BlogSection: React.FC = () => {
  const { t } = useLang();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // New Comment State
  const [commentAuthor, setCommentAuthor] = useState<string>('');
  const [commentText, setCommentText] = useState<string>('');
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch blog posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: data.likes } : p));
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(prev => prev ? { ...prev, likes: data.likes } : null);
        }
      }
    } catch (err) {
      console.error("Like post error:", err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !commentText.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/posts/${selectedPost.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: commentAuthor,
          text: commentText
        })
      });

      if (res.ok) {
        const data = await res.json();
        const updatedComments = data.comments;
        
        // Update local state
        setPosts(prev => prev.map(p => p.id === selectedPost.id ? { ...p, comments: updatedComments } : p));
        setSelectedPost(prev => prev ? { ...prev, comments: updatedComments } : null);
        setCommentText('');
      }
    } catch (err) {
      console.error("Comment submission error:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Collect unique tags
  const allTags = ['All', ...Array.from(new Set(posts.flatMap(p => p.tags)))];

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = selectedTag === 'All' || post.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const handleShare = (post: BlogPost) => {
    const url = `${window.location.origin}#post-${post.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8" 
      id="section-blog"
    >
      
      {/* Header Banner */}
      <motion.div variants={itemVariants} className="bg-slate-900/70 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_0_40px_rgba(6,182,212,0.1)] relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <Orbit className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
            <span>{t.blogEngineeringLogs}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            {t.blogTitle}
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl font-sans">
            {t.blogDescription}
          </p>
        </div>

        {/* Stats Pills & Planet Badge */}
        <div className="flex items-center gap-4 font-mono text-xs shrink-0 z-10">
          <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-center">
            <div className="text-cyan-400 font-bold text-lg">{posts.length}</div>
            <div className="text-slate-500 text-[10px] uppercase">{t.blogArticles}</div>
          </div>
          <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-center">
            <div className="text-rose-400 font-bold text-lg">
              {posts.reduce((acc, p) => acc + p.likes, 0)}
            </div>
            <div className="text-slate-500 text-[10px] uppercase">{t.blogLikesCount}</div>
          </div>
          <div className="hidden sm:block">
            <Planet3D id="blog-header-planet" category="AI" size={60} isHovered={true} />
          </div>
        </div>
      </motion.div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          
          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.blogSearchPlaceholder}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Tag Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 font-mono text-xs">
            <Tag className="w-3.5 h-3.5 text-cyan-400 shrink-0 mr-1" />
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-lg border text-xs whitespace-nowrap transition-all ${
                  selectedTag === tag
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs">
          {t.blogLoading}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="p-12 bg-slate-900/40 border border-slate-800 rounded-2xl text-center space-y-2">
          <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
          <div className="text-slate-300 font-bold text-sm">{t.blogNoResults}</div>
          <div className="text-slate-500 text-xs">{t.blogTryClear}</div>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/50 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)] relative overflow-hidden"
              >
              <div className="space-y-4">
                {/* Top Meta */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-1.5 text-cyan-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug font-sans">
                  {post.title}
                </h3>

                {/* Summary */}
                <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed font-sans">
                  {post.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800 font-mono"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions Footer */}
              <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-4">
                  {/* Like Button */}
                  <button
                    onClick={(e) => handleLikePost(post.id, e)}
                    className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition-colors p-1 rounded hover:bg-rose-950/30"
                    title="Like article"
                  >
                    <Heart className="w-4 h-4 fill-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform" />
                    <span className="font-bold">{post.likes}</span>
                  </button>

                  {/* Comment Count */}
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>{post.comments.length}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-cyan-400 text-xs font-semibold group-hover:translate-x-1 transition-transform">
                  <span>{t.blogReadArticle}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Article Detail Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col justify-between shadow-2xl overflow-hidden font-sans relative">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 bg-slate-950/90 flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs font-mono text-cyan-400">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                    {t.blogPublished}
                  </span>
                  <span>{selectedPost.date}</span>
                  <span>•</span>
                  <span>{selectedPost.readTime}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  {selectedPost.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.blogBy} {selectedPost.author}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleShare(selectedPost)}
                  className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
                  title="Share link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 text-sm text-slate-300 leading-relaxed">
              
              {/* Summary Callout */}
              <div className="bg-cyan-950/30 border-l-4 border-cyan-500 p-4 rounded-r-xl text-cyan-100 font-sans text-sm italic">
                "{selectedPost.summary}"
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                {selectedPost.tags.map((t, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-950 text-cyan-400 rounded-md border border-slate-800">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Formatted Article Content */}
              <div className="prose prose-invert max-w-none space-y-4 font-sans text-slate-200">
                {selectedPost.content.split('\n\n').map((paragraph, pIdx) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={pIdx} className="text-lg font-bold text-white font-mono pt-3 pb-1 border-b border-slate-800 text-cyan-300">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('```')) {
                    const codeText = paragraph.replace(/```[a-z]*/g, '').trim();
                    return (
                      <pre key={pIdx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-cyan-200 overflow-x-auto">
                        <code>{codeText}</code>
                      </pre>
                    );
                  }
                  return (
                    <p key={pIdx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Interactions Bar */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between font-mono">
                <button
                  onClick={() => handleLikePost(selectedPost.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/40 text-rose-200 rounded-xl transition-colors font-bold text-xs"
                >
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-400 animate-pulse" />
                  <span>{t.blogLikeArticle} ({selectedPost.likes})</span>
                </button>

                <div className="text-xs text-slate-400">
                  {selectedPost.comments.length} {t.blogVisitorComments}
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-6 pt-4 border-t border-slate-800">
                <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>{t.blogDiscussion}</span>
                </h4>

                {/* Comment Form */}
                <form onSubmit={handleAddComment} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono">
                  <div className="text-xs text-slate-400 font-bold uppercase">{t.blogLeaveComment}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      placeholder={t.blogYourName}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>
                  <textarea
                    required
                    rows={2}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={t.blogCommentPlaceholder}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none font-sans"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment || !commentText.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingComment ? t.blogPosting : t.blogPostComment}</span>
                    </button>
                  </div>
                </form>

                {/* Existing Comments List */}
                <div className="space-y-3">
                  {selectedPost.comments.length === 0 ? (
                    <div className="text-xs text-slate-500 italic font-mono p-4 text-center border border-slate-800/50 rounded-xl">
                      {t.blogBeFirst}
                    </div>
                  ) : (
                    selectedPost.comments.map((comm) => (
                      <div key={comm.id} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-1.5 font-sans">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-cyan-300">{comm.author}</span>
                          <span className="text-[10px] text-slate-500">{comm.createdAt}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {comm.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </motion.div>
  );
};
