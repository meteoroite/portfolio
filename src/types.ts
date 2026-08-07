export interface Project {
  id: string;
  title: string;
  category: 'AI' | 'Full-Stack' | 'AgTech' | 'Computer Vision' | 'Client Work';
  shortDesc: string;
  fullDesc: string;
  stack: string[];
  status: 'Active' | 'Completed' | 'Paused';
  keyLesson: string;
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
  metrics?: string[];
  architecture?: string;
  role: string;
  /** Show in the agriculture theme's curated AgTech set. */
  agri?: boolean;
}

export interface SkillCategory {
  id: string;
  name: string;
  iconName: string;
  skills: {
    name: string;
    level: 'Expert' | 'Advanced' | 'Proficient' | 'Exploring';
    years?: string;
    note?: string;
  }[];
}

export interface TimelineMilestone {
  year: string;
  period: string;
  title: string;
  role: string;
  organization?: string;
  description: string;
  highlights: string[];
  type: 'education' | 'career' | 'military' | 'achievement';
  /** Include in the agriculture theme's curated experience filter. */
  agri?: boolean;
}

export interface CVVariant {
  id: string;
  title: string;
  focus: string;
  summary: string;
  highlights: string[];
  recommendedFor: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  likes: number;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  date: string;
  readTime: string;
  likes: number;
  comments: Comment[];
  status: 'published' | 'draft';
  author: string;
}

export interface JARVISMessage {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timestamp: string;
}
