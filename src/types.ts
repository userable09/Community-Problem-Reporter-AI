export type ProblemCategory =
  | 'Road Damage'
  | 'Garbage'
  | 'Street Lights'
  | 'Water Leakage'
  | 'Sewer Blockage'
  | 'Illegal Parking'
  | 'Traffic Signals'
  | 'Public Safety'
  | 'Electricity'
  | 'Other';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type IssueStatus = 'Pending' | 'In Review' | 'In Progress' | 'Resolved';

export interface AIAnalysisResult {
  summary: string;
  correctedText: string;
  professionalRewrite: string;
  detectedCategory: ProblemCategory;
  priority: PriorityLevel;
  urgencyScore: number; // 1-100
  estimatedResolutionDays: number;
  possibleSolutions: string[];
  responsibleDepartment: string;
  departmentContact: string;
  keyRiskFactors: string[];
  complaintLetter: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  category: ProblemCategory;
  priority: PriorityLevel;
  status: IssueStatus;
  date: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  reporterName?: string;
  reporterContact?: string;
  aiAnalysis?: AIAnalysisResult;
  updatedAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  category: 'Police' | 'Fire Brigade' | 'Ambulance' | 'Municipal Office' | 'Electric Company' | 'Water Department';
  phone: string;
  altPhone?: string;
  email?: string;
  description: string;
  address?: string;
  availableHours: string;
  is24x7: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AppSettings {
  darkMode: boolean;
  groqApiKey: string;
  notificationsEnabled: boolean;
  autoAnalyzeOnReport: boolean;
  defaultLocation: string;
}

export interface IssueStats {
  total: number;
  critical: number;
  resolved: number;
  pending: number;
  inProgress: number;
  categoryCounts: Record<ProblemCategory, number>;
  priorityCounts: Record<PriorityLevel, number>;
}
