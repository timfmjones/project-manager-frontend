// src/lib/types.ts - Complete types with Q&A interfaces
export interface Project {
  id: string;
  userId: string;
  name: string;
  summaryBanner: string;
  createdAt: string;
  updatedAt: string;
}

export interface IdeaDump {
  id: string;
  projectId: string;
  userId: string;
  contentText?: string;
  audioUrl?: string;
  transcript?: string;
  createdAt: string;
}

export interface Insight {
  id: string;
  ideaDumpId: string;
  shortSummary: string[];
  recommendations: string[];
  suggestedTasks: Array<{ title: string; description?: string }>;
  pinned: boolean;
  createdAt: string;
  ideaDump?: {
    contentText?: string;
    transcript?: string;
    audioUrl?: string;
    createdAt: string;
  };
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  dueDate?: string;
  createdAt: string;
}

export interface QAQuestion {
  id: string;
  projectId: string;
  question: string;
  answer: string;
  suggestions: string[];
  examples?: string[];
  helpful?: boolean | null;
  createdAt: string;
  suggestedTasks?: Array<{ title: string; description?: string }>;
}