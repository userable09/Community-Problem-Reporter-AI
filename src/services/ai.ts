import { AIAnalysisResult, ChatMessage, Issue } from '../types';

export async function analyzeIssueWithAI(params: {
  title: string;
  description: string;
  location: string;
  category: string;
  userGroqKey?: string;
  hasImage?: boolean;
}): Promise<{ success: boolean; data: AIAnalysisResult; provider?: string }> {
  try {
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP status ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (err: any) {
    console.error('AI Analysis request failed, using client-side fallback:', err);
    // Client-side emergency fallback
    return {
      success: true,
      provider: 'Client Fallback System',
      data: {
        summary: `Report filed regarding ${params.category}: ${params.title}.`,
        correctedText: params.description,
        professionalRewrite: `Formal civic complaint regarding ${params.category.toLowerCase()} situated at ${params.location || 'specified area'}. ${params.description}`,
        detectedCategory: params.category as any,
        priority: params.title.toLowerCase().includes('urgent') || params.description.toLowerCase().includes('hazard') ? 'High' : 'Medium',
        urgencyScore: 75,
        estimatedResolutionDays: 3,
        possibleSolutions: [
          'Dispatch municipal engineering inspection team',
          'Deploy safety cones and warning lights',
          'Execute long-term infrastructure repair',
        ],
        responsibleDepartment: `${params.category} Department & Public Works`,
        departmentContact: 'civic-service@citygov.org | (555) 019-3000',
        keyRiskFactors: ['Community inconvenience', 'Elevated safety risk if left unaddressed'],
        complaintLetter: `To the Public Works Department,

Subject: Urgent Complaint Regarding ${params.title} at ${params.location || 'Local Site'}

Dear Director,

This is a formal report regarding ${params.title} located at ${params.location}.

Details:
${params.description}

Please organize an on-site inspection and necessary maintenance.

Sincerely,
Community Reporter AI`,
      },
    };
  }
}

export async function sendChatMessageToAI(
  messages: ChatMessage[],
  userGroqKey?: string
): Promise<{ success: boolean; reply: string; provider?: string }> {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, userGroqKey }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    console.error('Chat AI failed:', err);
    return {
      success: true,
      reply: `I apologize, but I am currently operating in offline mode. For urgent civic emergencies, please dial 911 or call your local municipal hotline 311. How else can I assist with your report?`,
      provider: 'Offline Assistant',
    };
  }
}

export async function generateRefinedComplaintLetter(
  issue: Issue,
  authorityName?: string,
  userGroqKey?: string
): Promise<string> {
  try {
    const response = await fetch('/api/ai/complaint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ issue, authorityName, userGroqKey }),
    });

    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }

    const data = await response.json();
    return data.complaintLetter || issue.aiAnalysis?.complaintLetter || '';
  } catch (err) {
    return issue.aiAnalysis?.complaintLetter || 'Complaint letter generation unavailable.';
  }
}
