import { INITIAL_ISSUES } from '../constants/data';
import { AppSettings, Issue, IssueStatus } from '../types';

const ISSUES_STORAGE_KEY = 'cpr_ai_community_issues_v1';
const SETTINGS_STORAGE_KEY = 'cpr_ai_app_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  darkMode: true,
  groqApiKey: '',
  notificationsEnabled: true,
  autoAnalyzeOnReport: true,
  defaultLocation: 'Downtown, City Center',
};

export const StorageService = {
  getIssues(): Issue[] {
    try {
      const data = localStorage.getItem(ISSUES_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(ISSUES_STORAGE_KEY, JSON.stringify(INITIAL_ISSUES));
        return INITIAL_ISSUES;
      }
      const issues: Issue[] = JSON.parse(data);
      let updated = false;

      // Migrate any broken image URLs in cached sample data
      issues.forEach((issue) => {
        if (issue.id === 'ISSUE-1002' && (!issue.imageUrl || issue.imageUrl.includes('1541888946425'))) {
          issue.imageUrl = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80';
          updated = true;
        }
        if (issue.id === 'ISSUE-1005' && (!issue.imageUrl || issue.imageUrl.includes('1508873696983'))) {
          issue.imageUrl = 'https://images.unsplash.com/photo-1566232392379-afd9298e6a46?auto=format&fit=crop&w=600&q=80';
          updated = true;
        }
      });

      if (updated) {
        localStorage.setItem(ISSUES_STORAGE_KEY, JSON.stringify(issues));
      }

      return issues;
    } catch (e) {
      console.error('Failed to read issues from localStorage', e);
      return INITIAL_ISSUES;
    }
  },

  saveIssue(newIssue: Omit<Issue, 'id' | 'updatedAt'> & { id?: string }): Issue {
    const issues = this.getIssues();
    const now = new Date().toISOString().split('T')[0];
    const id = newIssue.id || `ISSUE-${1000 + issues.length + 1}`;

    const issueToSave: Issue = {
      ...newIssue,
      id,
      updatedAt: now,
    };

    const existingIndex = issues.findIndex((i) => i.id === id);
    if (existingIndex >= 0) {
      issues[existingIndex] = issueToSave;
    } else {
      issues.unshift(issueToSave);
    }

    try {
      localStorage.setItem(ISSUES_STORAGE_KEY, JSON.stringify(issues));
    } catch (e) {
      console.error('Failed to save issue to localStorage', e);
    }

    return issueToSave;
  },

  updateIssueStatus(id: string, status: IssueStatus): Issue | null {
    const issues = this.getIssues();
    const issue = issues.find((i) => i.id === id);
    if (!issue) return null;

    issue.status = status;
    issue.updatedAt = new Date().toISOString().split('T')[0];

    try {
      localStorage.setItem(ISSUES_STORAGE_KEY, JSON.stringify(issues));
    } catch (e) {
      console.error('Failed to update issue status', e);
    }

    return issue;
  },

  deleteIssue(id: string): boolean {
    const issues = this.getIssues();
    const filtered = issues.filter((i) => i.id !== id);
    try {
      localStorage.setItem(ISSUES_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Failed to delete issue from localStorage', e);
      return false;
    }
  },

  resetToDefaults(): Issue[] {
    try {
      localStorage.setItem(ISSUES_STORAGE_KEY, JSON.stringify(INITIAL_ISSUES));
    } catch (e) {
      console.error('Failed to reset issues to defaults', e);
    }
    return INITIAL_ISSUES;
  },

  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!data) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: Partial<AppSettings>): AppSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
    return updated;
  },
};
