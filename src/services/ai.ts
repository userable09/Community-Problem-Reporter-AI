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

    const data = await response.json();
    if (data && data.reply) {
      return data;
    }
    throw new Error('Invalid response structure');
  } catch (err: any) {
    console.warn('Chat API fetch failed, using smart client fallback:', err);
    
    // Smart client-side response system for static / client-only hosts like Vercel
    const lastMsg = (messages[messages.length - 1]?.content || '').toLowerCase().trim();

    let reply = `I'm here to assist with your civic questions! You can ask me how to report potholes, water leaks, street light failures, or how to generate formal complaint letters for local authorities. What would you like help with?`;

    if (!lastMsg) {
      reply = "Hello! I am your AI Civic Assistant. How can I help you with reporting or resolving community issues today?";
    } else if (lastMsg.includes('hi') || lastMsg.includes('hello') || lastMsg.includes('hey') || lastMsg.includes('greetings')) {
      reply = "Hello! 👋 I'm **CivicBot**, your AI assistant for Community Problem Reporter. I can help you report local issues, understand municipal departments, or draft formal complaint letters. What issue are you experiencing today?";
    } else if (lastMsg.includes('pothole') || lastMsg.includes('road') || lastMsg.includes('crack') || lastMsg.includes('asphalt')) {
      reply = "🛣️ **Reporting Road Damage & Potholes:**\n\n1. Click **Report Problem** on the left menu.\n2. Select **Road Damage** as the category.\n3. Enter the street location and attach a photo.\n4. Our AI will automatically rate the urgency and draft an official complaint letter for the **Department of Transportation & Public Works**!";
    } else if (lastMsg.includes('garbage') || lastMsg.includes('trash') || lastMsg.includes('waste') || lastMsg.includes('dump')) {
      reply = "🗑️ **Reporting Illegal Dumping & Garbage Accumulation:**\n\n1. Go to **Report Problem**.\n2. Choose **Garbage / Sanitation** as the category.\n3. Detail the location and whether hazardous items are present.\n4. The system will alert the **Sanitation & Environmental Department** and generate a formal dispatch request.";
    } else if (lastMsg.includes('light') || lastMsg.includes('dark') || lastMsg.includes('electricity') || lastMsg.includes('power')) {
      reply = "💡 **Street Light & Electrical Issues:**\n\n1. Navigate to **Report Problem**.\n2. Select **Street Lights** or **Electricity**.\n3. Mention pole numbers or cross streets if available.\n4. Our AI analyzer routes your complaint directly to the **Municipal Power & Energy Board**.";
    } else if (lastMsg.includes('water') || lastMsg.includes('leak') || lastMsg.includes('sewer') || lastMsg.includes('pipe')) {
      reply = "🚰 **Water Leakage & Drainage Hazards:**\n\n1. Select **Water Leakage / Sewer Blockage** under **Report Problem**.\n2. Note if clean water or sewage is overflowing.\n3. Severe leaks get flagged with high priority and an automated complaint for the **Water & Sanitation Utility**.";
    } else if (lastMsg.includes('emergency') || lastMsg.includes('fire') || lastMsg.includes('police') || lastMsg.includes('911') || lastMsg.includes('danger')) {
      reply = "🚨 **Emergency Guidance:**\n\nFor immediate life-threatening emergencies, crimes in progress, or active fires, please **dial 911 immediately**.\n\nFor municipal utility emergencies (gas leak, live electric wire), open the **Emergency Contacts** tab on the sidebar to find instant hotlines for Police, Fire, Ambulance, Electric, and Water authorities.";
    } else if (lastMsg.includes('letter') || lastMsg.includes('complaint') || lastMsg.includes('pdf') || lastMsg.includes('docx') || lastMsg.includes('download')) {
      reply = "📄 **Official Municipal Complaint Letters:**\n\nWhen you submit any issue, our AI automatically crafts an official, professionally worded complaint letter.\n- Go to **AI Problem Analyzer** or **Issue History**.\n- Click **Print / Export PDF** or **Export DOCX** to send directly to your local council or mayor's office!";
    } else if (lastMsg.includes('map') || lastMsg.includes('location') || lastMsg.includes('track')) {
      reply = "🗺️ **Interactive Community Map & Tracking:**\n\n- Click **Community Map** to view all reported issues pinpointed geographically across your neighborhood.\n- Click **Issue History** to track status updates (Pending, In Progress, Resolved) and filter by priority.";
    } else if (lastMsg.includes('who') || lastMsg.includes('developer') || lastMsg.includes('maryam') || lastMsg.includes('tahir')) {
      reply = "✨ **About This Application:**\n\n**Community Problem Reporter AI** was developed by **Maryam Tahir** to empower citizens with AI-driven civic problem resolution.\n\n🌐 **Portfolio:** [maryamtahir.tech](https://www.maryamtahir.tech)\n💼 **LinkedIn:** [linkedin.com/in/maryam-tahir-developer/](https://www.linkedin.com/in/maryam-tahir-developer/)";
    }

    return {
      success: true,
      reply,
      provider: 'Civic Assistant Engine',
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
