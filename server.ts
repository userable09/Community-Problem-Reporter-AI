import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Helper to call Groq API if key is available
async function callGroqAPI(apiKey: string, messages: any[], responseFormatJson = false) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.3,
      ...(responseFormatJson ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API Error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// Structured Fallback Analysis Generator if no AI API Key or if API call fails
function generateFallbackAnalysis(title: string, description: string, location: string, category: string) {
  const isCritical =
    /burst|flood|explosion|fire|collapse|hazard|live wire|leakage|trapped|danger/i.test(title + ' ' + description);
  const isHigh = /pothole|broken|signal|sewer|dark|accident|injury|blocked/i.test(title + ' ' + description);

  const priority = isCritical ? 'Critical' : isHigh ? 'High' : 'Medium';
  const urgencyScore = isCritical ? 95 : isHigh ? 78 : 55;

  const summary = `Community report regarding ${category.toLowerCase()} at ${location || 'local site'}: ${title}.`;
  const correctedText = description.charAt(0).toUpperCase() + description.slice(1);
  const professionalRewrite = `Formal notice regarding ${category.toLowerCase()} issue: "${title}" at location ${location || 'unspecified location'}. ${description}. Immediate inspection and remediation by municipal teams is requested.`;

  const solutions = [
    `Dispatch a emergency repair assessment crew to ${location || 'site'} within 24 hours.`,
    `Implement safety barriers or warning notices around affected zone.`,
    `Schedule complete physical overhaul and structural fix.`,
  ];

  const deptMap: Record<string, string> = {
    'Road Damage': 'Department of Transportation & Public Works',
    'Water Leakage': 'Municipal Water & Sanitation Board',
    Garbage: 'City Sanitation & Waste Management Authority',
    'Street Lights': 'Department of Electrical Infrastructure',
    'Sewer Blockage': 'Water & Sewerage Drainage Division',
    'Illegal Parking': 'Municipal Traffic Enforcement Division',
    'Traffic Signals': 'Traffic Control & Signal Operations',
    'Public Safety': 'Department of Public Safety & Civil Defense',
    Electricity: 'City Power Utility Company',
    Other: 'Municipal Public Works & General Affairs',
  };

  const responsibleDepartment = deptMap[category] || 'Municipal Public Works Department';

  const complaintLetter = `To the Department Head / Commissioner,
${responsibleDepartment}
City Municipal Administration

Subject: Formal Complaint and Action Request - ${category} Issue at ${location || 'Local Area'}

Dear Sir/Madam,

I am writing to formally log a community issue regarding "${title}" located at ${location || 'the specified address'}.

Issue Details:
${description}

Impact & Risks:
This defect poses severe public inconvenience, potential safety hazards, and operational disruption if left unaddressed.

Requested Action:
We respectfully request your department to assign an inspection team to examine ${location || 'the area'}, apply necessary repairs, and inform local residents once resolved.

Thank you for your service and dedication to civic safety.

Sincerely,
Concerned Citizen & Community Reporter AI`;

  return {
    summary,
    correctedText,
    professionalRewrite,
    detectedCategory: category || 'Road Damage',
    priority,
    urgencyScore,
    estimatedResolutionDays: isCritical ? 1 : isHigh ? 2 : 4,
    possibleSolutions: solutions,
    responsibleDepartment,
    departmentContact: `${responsibleDepartment.toLowerCase().replace(/[^a-z]/g, '')}@citygov.org | (555) 019-3000`,
    keyRiskFactors: [
      'Potential escalation of damage',
      'Safety hazard to nearby pedestrians and commuters',
      'Public inconvenience and road blockage',
    ],
    complaintLetter,
  };
}

// ---------------------- API ROUTES ----------------------

// 1. Analyze Issue Endpoint
app.post('/api/ai/analyze', async (req: Request, res: Response) => {
  try {
    const { title, description, location, category, userGroqKey, hasImage } = req.body;

    if (!title && !description) {
      return res.status(400).json({ error: 'Title or description is required for analysis' });
    }

    const groqKey = userGroqKey || process.env.GROQ_API_KEY;

    // A) Try Groq API first if key provided
    if (groqKey) {
      try {
        const systemPrompt = `You are an expert AI Civic Intelligence System for Community Problem Reporter AI.
Analyze the user's community issue report and return ONLY a valid JSON object matching this schema:
{
  "summary": "1 concise sentence summary",
  "correctedText": "Grammar-corrected version of user description",
  "professionalRewrite": "Formal, professional, administrative rewrite of the problem statement",
  "detectedCategory": "One of: Road Damage, Garbage, Street Lights, Water Leakage, Sewer Blockage, Illegal Parking, Traffic Signals, Public Safety, Electricity, Other",
  "priority": "One of: Low, Medium, High, Critical",
  "urgencyScore": number between 1 and 100,
  "estimatedResolutionDays": number of estimated days to fix,
  "possibleSolutions": ["Solution 1", "Solution 2", "Solution 3"],
  "responsibleDepartment": "Name of relevant municipal department",
  "departmentContact": "Sample email and phone for this department",
  "keyRiskFactors": ["Risk 1", "Risk 2", "Risk 3"],
  "complaintLetter": "Complete formal complaint letter addressed to authority"
}`;

        const userPrompt = `Title: ${title}\nDescription: ${description}\nLocation: ${location}\nSelected Category: ${category}\nAttached Image Present: ${hasImage ? 'Yes' : 'No'}`;

        const groqResponseText = await callGroqAPI(
          groqKey,
          [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          true
        );

        const parsed = JSON.parse(groqResponseText);
        return res.json({ success: true, data: parsed, provider: 'Groq AI' });
      } catch (err: any) {
        console.warn('Groq API call failed, falling back to Gemini/Internal:', err.message);
      }
    }

    // B) Try Gemini API
    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `Analyze this civic issue report:
Title: ${title}
Description: ${description}
Location: ${location}
Selected Category: ${category}
Attached Image: ${hasImage ? 'Image attached' : 'No image'}

Generate a thorough JSON response for civic action.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            systemInstruction: `You are an expert AI Civic Analyst. You MUST return JSON only matching this schema:
{
  "summary": "1-sentence summary",
  "correctedText": "Grammatically corrected description",
  "professionalRewrite": "Formal administrative rewrite",
  "detectedCategory": "Road Damage|Garbage|Street Lights|Water Leakage|Sewer Blockage|Illegal Parking|Traffic Signals|Public Safety|Electricity|Other",
  "priority": "Low|Medium|High|Critical",
  "urgencyScore": 85,
  "estimatedResolutionDays": 2,
  "possibleSolutions": ["solution1", "solution2", "solution3"],
  "responsibleDepartment": "Department Name",
  "departmentContact": "dept@citygov.org | (555) 012-3456",
  "keyRiskFactors": ["risk1", "risk2"],
  "complaintLetter": "Formal letter text"
}`,
            responseMimeType: 'application/json',
          },
        });

        const text = response.text || '';
        const parsed = JSON.parse(text);
        return res.json({ success: true, data: parsed, provider: 'Gemini 3.6 Flash' });
      } catch (geminiErr: any) {
        console.warn('Gemini API call failed, using smart internal analyzer:', geminiErr.message);
      }
    }

    // C) Smart Fallback
    const fallbackData = generateFallbackAnalysis(title || 'Civic Issue', description || '', location || '', category || 'Other');
    return res.json({ success: true, data: fallbackData, provider: 'Civic Rule Engine' });
  } catch (error: any) {
    console.error('Error in /api/ai/analyze:', error);
    res.status(500).json({ error: 'Failed to analyze issue', details: error.message });
  }
});

// 2. Chatbot Endpoint
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { messages, userGroqKey } = req.body;
    const groqKey = userGroqKey || process.env.GROQ_API_KEY;

    const systemPrompt = `You are CivicBot, an empathetic, highly knowledgeable AI Assistant for Community Problem Reporter AI.
Your purpose is to help citizens:
1. Know how to report local issues (potholes, water leaks, garbage, street lights, safety hazards).
2. Understand municipal department responsibilities and jurisdiction.
3. Provide emergency guidance and quick action steps.
4. Help write, refine, and structure official municipal complaint letters.
5. Provide community awareness and civic safety advice.

Be concise, helpful, structured, and polite. Use Markdown formatting when helpful.`;

    // A) Groq API
    if (groqKey) {
      try {
        const groqMessages = [
          { role: 'system', content: systemPrompt },
          ...messages.map((m: any) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
        ];

        const responseText = await callGroqAPI(groqKey, groqMessages);
        return res.json({ success: true, reply: responseText, provider: 'Groq AI' });
      } catch (e: any) {
        console.warn('Groq chat error, trying Gemini:', e.message);
      }
    }

    // B) Gemini API
    const ai = getGeminiClient();
    if (ai) {
      try {
        const lastUserMessage = messages[messages.length - 1]?.content || 'Hello';
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: lastUserMessage,
          config: {
            systemInstruction: systemPrompt,
          },
        });

        return res.json({ success: true, reply: response.text || 'I am ready to assist with your civic questions.', provider: 'Gemini 3.6 Flash' });
      } catch (e: any) {
        console.warn('Gemini chat error:', e.message);
      }
    }

    // C) Fallback Chat Response
    const lastMsg = (messages[messages.length - 1]?.content || '').toLowerCase();
    let reply = `Thank you for asking! Community Problem Reporter AI helps you report, track, and resolve local issues.`;

    if (lastMsg.includes('pothole') || lastMsg.includes('road')) {
      reply = `**Reporting Road Damage & Potholes:**\n- Go to **Report Problem** on the sidebar.\n- Select **Road Damage** as the category.\n- Add a photo and precise location.\n- Our AI will generate an official letter for the **Department of Transportation & Public Works**!`;
    } else if (lastMsg.includes('emergency') || lastMsg.includes('fire') || lastMsg.includes('police')) {
      reply = `**Emergency Guidance:**\nFor active fires, crimes in progress, or severe medical trauma, dial **911** or visit our **Emergency Contacts** tab on the sidebar for quick dial buttons for Police, Fire, Ambulance, Electric, and Water emergencies.`;
    } else if (lastMsg.includes('complaint') || lastMsg.includes('letter')) {
      reply = `**Drafting Complaint Letters:**\nOur AI automatically generates formal complaint letters addressed to responsible authorities. You can view, copy, print, or download them as PDF/DOCX from the **AI Problem Analyzer** or **Issue History** tabs!`;
    }

    return res.json({ success: true, reply, provider: 'Civic Assistant Rules' });
  } catch (error: any) {
    res.status(500).json({ error: 'Chat API error', details: error.message });
  }
});

// 3. Complaint Generator Endpoint
app.post('/api/ai/complaint', async (req: Request, res: Response) => {
  try {
    const { issue, authorityName, userGroqKey } = req.body;
    const groqKey = userGroqKey || process.env.GROQ_API_KEY;

    const prompt = `Write a formal, highly effective municipal complaint letter for the following civic issue:
Title: ${issue.title}
Category: ${issue.category}
Location: ${issue.location}
Priority: ${issue.priority}
Description: ${issue.description}
Addressed to: ${authorityName || issue.aiAnalysis?.responsibleDepartment || 'Local Municipal Authority'}

Include formal subject line, reference number (${issue.id}), precise issue location details, requested action timeline, and citizen closing.`;

    if (groqKey) {
      try {
        const letter = await callGroqAPI(groqKey, [
          { role: 'system', content: 'You are a legal and administrative civic complaint writer.' },
          { role: 'user', content: prompt },
        ]);
        return res.json({ success: true, complaintLetter: letter });
      } catch (e: any) {
        console.warn('Groq complaint error:', e.message);
      }
    }

    const ai = getGeminiClient();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
        });
        return res.json({ success: true, complaintLetter: response.text });
      } catch (e: any) {
        console.warn('Gemini complaint error:', e.message);
      }
    }

    // Fallback letter
    const fallbackLetter = `To the Director / Commissioner,
${authorityName || issue.category + ' Department'}
City Municipal Council

Subject: Urgent Complaint Regarding ${issue.title} [Ref: ${issue.id}]

Dear Sir/Madam,

I am writing to bring your immediate attention to a critical community issue located at ${issue.location}.

Problem Description:
${issue.description}

Category: ${issue.category}
Priority Level: ${issue.priority}

This defect compromises community welfare, public safety, and neighborhood infrastructure. We urge your department to initiate an on-site inspection and execute the necessary repairs immediately.

Thank you for your prompt response to this matter.

Sincerely,
Community Resident Reporter`;

    return res.json({ success: true, complaintLetter: fallbackLetter });
  } catch (error: any) {
    res.status(500).json({ error: 'Complaint generation failed', details: error.message });
  }
});

// ---------------------- VITE / STATIC SERVING ----------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Community Problem Reporter AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
