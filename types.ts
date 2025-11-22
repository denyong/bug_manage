export enum DefectStatus {
  OPEN = '待处理',
  IN_PROGRESS = '处理中',
  RESOLVED = '已解决',
  CLOSED = '已关闭',
}

export enum DefectPriority {
  LOW = '低',
  MEDIUM = '中',
  HIGH = '高',
  CRITICAL = '严重',
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Defect {
  id: string;
  title: string;
  description: string;
  status: DefectStatus;
  priority: DefectPriority;
  assignee: string;
  reporter: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  tags: string[];
  aiAnalysis?: string; // Field to store AI suggestions
}

export type ViewState = 'dashboard' | 'list' | 'detail';

export interface DashboardStats {
  total: number;
  open: number;
  resolved: number;
  critical: number;
}