import { EmergencyContact, Issue, ProblemCategory } from '../types';

export const CATEGORIES_META: Record<
  ProblemCategory,
  { label: ProblemCategory; color: string; badgeBg: string; textColor: string; icon: string }
> = {
  'Road Damage': {
    label: 'Road Damage',
    color: '#ef4444',
    badgeBg: 'bg-rose-500/10 border-rose-500/30',
    textColor: 'text-rose-500',
    icon: 'AlertTriangle',
  },
  Garbage: {
    label: 'Garbage',
    color: '#10b981',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30',
    textColor: 'text-emerald-500',
    icon: 'Trash2',
  },
  'Street Lights': {
    label: 'Street Lights',
    color: '#f59e0b',
    badgeBg: 'bg-amber-500/10 border-amber-500/30',
    textColor: 'text-amber-500',
    icon: 'Lightbulb',
  },
  'Water Leakage': {
    label: 'Water Leakage',
    color: '#3b82f6',
    badgeBg: 'bg-blue-500/10 border-blue-500/30',
    textColor: 'text-blue-500',
    icon: 'Droplets',
  },
  'Sewer Blockage': {
    label: 'Sewer Blockage',
    color: '#8b5cf6',
    badgeBg: 'bg-purple-500/10 border-purple-500/30',
    textColor: 'text-purple-500',
    icon: 'Waves',
  },
  'Illegal Parking': {
    label: 'Illegal Parking',
    color: '#ec4899',
    badgeBg: 'bg-pink-500/10 border-pink-500/30',
    textColor: 'text-pink-500',
    icon: 'Car',
  },
  'Traffic Signals': {
    label: 'Traffic Signals',
    color: '#f97316',
    badgeBg: 'bg-orange-500/10 border-orange-500/30',
    textColor: 'text-orange-500',
    icon: 'ShieldAlert',
  },
  'Public Safety': {
    label: 'Public Safety',
    color: '#dc2626',
    badgeBg: 'bg-red-600/10 border-red-600/30',
    textColor: 'text-red-600',
    icon: 'ShieldCheck',
  },
  Electricity: {
    label: 'Electricity',
    color: '#eab308',
    badgeBg: 'bg-yellow-500/10 border-yellow-500/30',
    textColor: 'text-yellow-500',
    icon: 'Zap',
  },
  Other: {
    label: 'Other',
    color: '#6b7280',
    badgeBg: 'bg-gray-500/10 border-gray-500/30',
    textColor: 'text-gray-400',
    icon: 'HelpCircle',
  },
};

export const INITIAL_ISSUES: Issue[] = [
  {
    id: 'ISSUE-1001',
    title: 'Severe Pothole on Main Street Intersection',
    description:
      'A deep pothole has formed near the crosswalk on Main St & 5th Ave. It is causing vehicular damage and poses a major safety hazard for motorcyclists and cyclists.',
    location: 'Main St & 5th Ave, Downtown',
    category: 'Road Damage',
    priority: 'Critical',
    status: 'In Progress',
    date: '2026-07-24',
    latitude: 40.7128,
    longitude: -74.006,
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    updatedAt: '2026-07-25',
    aiAnalysis: {
      summary: 'Dangerous structural road defect impacting traffic flow and vulnerable road users.',
      correctedText:
        'A deep pothole has formed near the crosswalk on Main St & 5th Ave. It is causing vehicular damage and poses a major safety hazard for motorcyclists and cyclists.',
      professionalRewrite:
        'Substantial asphalt degradation observed at the intersection of Main Street and 5th Avenue, resulting in a deep pothole. Immediate structural resurfacing is requested to prevent vehicular accidents and pedestrian harm.',
      detectedCategory: 'Road Damage',
      priority: 'Critical',
      urgencyScore: 92,
      estimatedResolutionDays: 2,
      possibleSolutions: [
        'Deploy rapid cold-mix asphalt patch immediately',
        'Set up warning cones and safety reflectors',
        'Schedule full resurfacing with heavy road roller crew',
      ],
      responsibleDepartment: 'Department of Transportation & Public Works',
      departmentContact: 'dot-works@citygov.org | (555) 019-2834',
      keyRiskFactors: ['High risk of vehicle tire blowout', 'Cyclist falls', 'Traffic congestion during peak hours'],
      complaintLetter: `To the Commissioner,
Department of Transportation & Public Works

Subject: Urgent Request for Asphalt Repair at Main St & 5th Ave Intersection

Dear Commissioner,

I am writing to officially report a severe road defect located at Main St & 5th Ave, Downtown. The asphalt has eroded significantly, creating a hazardous pothole approximately 8 inches deep.

This defect presents an immediate risk of vehicular damage and serious injury to two-wheeler riders. We request urgent dispatch of a maintenance crew to inspect and repair this section.

Thank you for your prompt action on this critical matter.

Sincerely,
Concerned Citizen Community Reporter`,
    },
  },
  {
    id: 'ISSUE-1002',
    title: 'Burst Water Main and Flooding on Oak Lane',
    description:
      'Water has been continuously leaking from an underground pipe for 12 hours. The street is flooded and clean drinking water is being wasted in large quantities.',
    location: '742 Oak Lane, Westside',
    category: 'Water Leakage',
    priority: 'High',
    status: 'Pending',
    date: '2026-07-26',
    latitude: 40.7188,
    longitude: -74.012,
    imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80',
    updatedAt: '2026-07-26',
    aiAnalysis: {
      summary: 'High-volume drinking water pipe leak causing local flooding and resource loss.',
      correctedText:
        'Water has been continuously leaking from an underground pipe for 12 hours. The street is flooded and clean drinking water is being wasted in large quantities.',
      professionalRewrite:
        'An active underground water main rupture at 742 Oak Lane is discharging high volumes of potable water onto the public roadway, leading to localized flooding and potential subterranean erosion.',
      detectedCategory: 'Water Leakage',
      priority: 'High',
      urgencyScore: 88,
      estimatedResolutionDays: 1,
      possibleSolutions: [
        'Isolate the water section valve to stop active leakage',
        'Excavate and replace ruptured main joint',
        'Restore water pressure to affected households',
      ],
      responsibleDepartment: 'Municipal Water & Sanitation Board',
      departmentContact: 'water-dept@citygov.org | (555) 012-9876',
      keyRiskFactors: ['Potable water loss', 'Roadbed erosion', 'Potential basement flooding in adjacent homes'],
      complaintLetter: `To the General Manager,
Municipal Water & Sanitation Board

Subject: Immediate Water Main Break Repair Request at 742 Oak Lane

Dear Sir/Madam,

A major water main break has occurred at 742 Oak Lane, resulting in substantial continuous loss of clean water and street flooding.

Please dispatch an emergency pipe repair team to isolate the supply valve and restore proper plumbing infrastructure.

Yours faithfully,
Local Resident Action Group`,
    },
  },
  {
    id: 'ISSUE-1003',
    title: 'Overflowing Trash Dumpsters in Park Area',
    description:
      'Municipal garbage bins near Green Park have not been emptied for over 5 days. Waste is piling up on sidewalk, causing foul smell and health concerns.',
    location: 'Green Park South Entrance',
    category: 'Garbage',
    priority: 'Medium',
    status: 'In Review',
    date: '2026-07-25',
    latitude: 40.715,
    longitude: -74.001,
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    updatedAt: '2026-07-26',
    aiAnalysis: {
      summary: 'Accumulation of uncollected municipal solid waste in a public recreational area.',
      correctedText:
        'Municipal garbage bins near Green Park have not been emptied for over 5 days. Waste is piling up on sidewalk, causing foul smell and health concerns.',
      professionalRewrite:
        'Uncollected solid waste has exceeded container capacity at the Green Park South Entrance. Prolonged waste accumulation presents bio-sanitary hazards and compromises public park hygiene.',
      detectedCategory: 'Garbage',
      priority: 'Medium',
      urgencyScore: 65,
      estimatedResolutionDays: 3,
      possibleSolutions: [
        'Schedule immediate sanitation truck dispatch',
        'Install higher-capacity solar compactor bins',
        'Establish 48-hour regular collection routine',
      ],
      responsibleDepartment: 'City Sanitation & Waste Management Authority',
      departmentContact: 'waste-management@citygov.org | (555) 018-3344',
      keyRiskFactors: ['Pest infestation', 'Unpleasant odor in public park', 'Sanitary contamination'],
      complaintLetter: `To the Director,
City Sanitation & Waste Management Authority

Subject: Uncollected Garbage and Sanitation Overflow at Green Park

Dear Director,

We draw your urgent attention to the overflowing waste bins situated at the South Entrance of Green Park. Garbage has accumulated on the walkway for over five days.

We urge your team to organize an immediate pickup and increase the routine collection frequency for this public space.

Sincerely,
Green Park Neighborhood Watch`,
    },
  },
  {
    id: 'ISSUE-1004',
    title: 'Non-functioning Street Lights on Elm Street',
    description:
      'Five consecutive street lights are completely dark from 12th to 15th block on Elm St. The area is extremely dark at night, raising safety concerns for pedestrians.',
    location: '12th to 15th Elm Street',
    category: 'Street Lights',
    priority: 'High',
    status: 'Resolved',
    date: '2026-07-22',
    latitude: 40.709,
    longitude: -74.015,
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    updatedAt: '2026-07-24',
    aiAnalysis: {
      summary: 'Multiple street fixture electrical outages creating nocturnal safety vulnerabilities.',
      correctedText:
        'Five consecutive street lights are completely dark from 12th to 15th block on Elm St. The area is extremely dark at night, raising safety concerns for pedestrians.',
      professionalRewrite:
        'Sequential street lighting failure along Elm Street (12th to 15th Block). Complete absence of ambient illumination severely increases public safety vulnerabilities for evening commuters.',
      detectedCategory: 'Street Lights',
      priority: 'High',
      urgencyScore: 78,
      estimatedResolutionDays: 2,
      possibleSolutions: [
        'Inspect feeder pillar box and electrical line breaker',
        'Replace burned-out LED driver units',
        'Conduct evening light survey of surrounding blocks',
      ],
      responsibleDepartment: 'Department of Public Electrical Infrastructure',
      departmentContact: 'electrical-grid@citygov.org | (555) 014-7711',
      keyRiskFactors: ['Pedestrian safety hazard', 'Potential rise in night crime', 'Decreased road visibility'],
      complaintLetter: `To the Chief Electrical Engineer,
Department of Public Electrical Infrastructure

Subject: Street Light Outage Report - Elm Street Corridor

Dear Sir,

Multiple street lights along Elm Street (Blocks 12 to 15) have been inoperative for several consecutive nights.

We request an emergency electrical crew to repair the faulty fixtures and restore street illumination promptly.

Warm regards,
Elm Street Residents Association`,
    },
  },
  {
    id: 'ISSUE-1005',
    title: 'Malfunctioning Traffic Signal at Commerce & Broad',
    description:
      'Traffic light stuck on flashing red in all directions during morning peak hours. Vehicles are converging unpredictably causing major gridlock and near-misses.',
    location: 'Commerce St & Broad St Junction',
    category: 'Traffic Signals',
    priority: 'Critical',
    status: 'Pending',
    date: '2026-07-26',
    latitude: 40.711,
    longitude: -74.008,
    imageUrl: 'https://images.unsplash.com/photo-1566232392379-afd9298e6a46?auto=format&fit=crop&w=600&q=80',
    updatedAt: '2026-07-26',
    aiAnalysis: {
      summary: 'Signal controller logic fault at major arterial intersection causing traffic chaos.',
      correctedText:
        'Traffic light stuck on flashing red in all directions during morning peak hours. Vehicles are converging unpredictably causing major gridlock and near-misses.',
      professionalRewrite:
        'Critical automated traffic signal controller malfunction at Commerce St & Broad St. All signal phases defaulted to flashing red mode, creating acute traffic gridlock and imminent collision risk.',
      detectedCategory: 'Traffic Signals',
      priority: 'Critical',
      urgencyScore: 96,
      estimatedResolutionDays: 1,
      possibleSolutions: [
        'Deploy traffic police officer for manual intersection management',
        'Reset and reprogram smart signal logic controller board',
        'Check backup UPS battery unit',
      ],
      responsibleDepartment: 'City Traffic Management & Control Center',
      departmentContact: 'traffic-control@citygov.org | (555) 011-2299',
      keyRiskFactors: ['High risk of vehicular collision', 'Major rush-hour gridlock', 'Emergency vehicle delay'],
      complaintLetter: `To the Traffic Control Director,
City Traffic Management & Control Center

Subject: Emergency Traffic Signal Failure at Commerce St & Broad St

Dear Director,

The traffic signal lights at Commerce Street and Broad Street have failed and are continuously flashing red, causing chaotic traffic conditions during peak hours.

Please dispatch traffic officers immediately and send signal technicians to repair the controller board.

Sincerely,
Downtown Commuters Alliance`,
    },
  },
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'EMG-01',
    name: 'Police Central Dispatch',
    category: 'Police',
    phone: '911',
    altPhone: '(555) 019-9111',
    email: 'emergency@citypolice.gov',
    description: 'Immediate response for active crime, violent incidents, major accidents, and immediate danger.',
    address: '100 Public Safety Plaza, City Center',
    availableHours: '24/7 Always Open',
    is24x7: true,
  },
  {
    id: 'EMG-02',
    name: 'City Fire Department & Rescue',
    category: 'Fire Brigade',
    phone: '911',
    altPhone: '(555) 018-3473',
    email: 'fire.dispatch@citygov.org',
    description: 'Fire emergencies, hazardous material spills, structural collapses, and technical rescue operations.',
    address: '25 Firehouse Lane, Central District',
    availableHours: '24/7 Always Open',
    is24x7: true,
  },
  {
    id: 'EMG-03',
    name: 'Emergency Medical Services (Ambulance)',
    category: 'Ambulance',
    phone: '911',
    altPhone: '(555) 017-8822',
    email: 'ems@cityhealth.org',
    description: 'Urgent medical trauma, cardiac events, severe injuries, and paramedic transport services.',
    address: 'City General Hospital Paramedic Station',
    availableHours: '24/7 Always Open',
    is24x7: true,
  },
  {
    id: 'EMG-04',
    name: 'Municipal Mayor & City Hall Helplines',
    category: 'Municipal Office',
    phone: '311',
    altPhone: '(555) 010-3110',
    email: 'citizen-helpline@cityhall.gov',
    description: 'General civic complaints, municipal services inquiry, public works status, and official feedback.',
    address: 'City Hall, 1 Civic Center Plaza',
    availableHours: 'Mon-Fri: 8:00 AM - 6:00 PM',
    is24x7: false,
  },
  {
    id: 'EMG-05',
    name: 'Electric Utility Grid Emergency',
    category: 'Electric Company',
    phone: '(555) 013-7693',
    altPhone: '1-800-555-POWER',
    email: 'outage@citypower.com',
    description: 'Fallen power lines, transformer explosions, power grid blackout emergency, and electrical hazards.',
    address: 'City Power Substation #4',
    availableHours: '24/7 Always Open',
    is24x7: true,
  },
  {
    id: 'EMG-06',
    name: 'Water & Sewerage Emergency Response',
    category: 'Water Department',
    phone: '(555) 012-9876',
    altPhone: '1-800-555-WATER',
    email: 'water-emergency@citywater.org',
    description: 'Major water main breaks, severe sewage backup, contamination alerts, and flooding response.',
    address: 'Water Works Facility, River Road',
    availableHours: '24/7 Always Open',
    is24x7: true,
  },
];

export const TESTIMONIALS = [
  {
    name: 'Sarah Jenkins',
    role: 'Resident, Downtown District',
    quote:
      'I reported a massive pothole outside my apartment. Within 2 minutes, the AI created a professional complaint letter to Public Works. The pothole was repaired in 48 hours!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
  },
  {
    name: 'Marcus Vance',
    role: 'Community Association President',
    quote:
      'The automated priority scoring and map visualization gave our neighborhood board the exact evidence needed to get street lights fixed on Elm Street.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
  },
  {
    name: 'Elena Rostova',
    role: 'Local Business Owner',
    quote:
      'Reporting garbage buildup used to take phone tag with city hall. With Community Problem Reporter AI, I uploaded a photo and got an official complaint PDF ready to send immediately.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 5,
  },
];

export const FAQS = [
  {
    question: 'How does the AI analyze my community problem report?',
    answer:
      'Our Groq AI engine scans your description and image context to classify the exact civic category, assess urgency, rewrite your complaint in formal government language, identify responsible municipal agencies, and draft an official complaint letter.',
  },
  {
    question: 'Do I need an account or login to submit a report?',
    answer:
      'No! Community Problem Reporter AI operates entirely without registration or database login. All reports and AI analyses are saved securely in your browser local storage.',
  },
  {
    question: 'How can I download or send the generated complaint letter?',
    answer:
      'You can instantly copy the generated complaint text to your clipboard, print it directly, or export it as a clean PDF or DOCX file formatted for official city administration submittals.',
  },
  {
    question: 'Is the interactive community map live?',
    answer:
      'Yes, the interactive map displays all locally saved and reported community issues with color-coded priority markers, allowing citizens to inspect nearby problems and status updates.',
  },
  {
    question: 'What if I need emergency assistance for an immediate danger?',
    answer:
      'For active fires, medical emergencies, or live crimes, please use the Emergency Contacts tab or dial 911 / your local emergency dispatch immediately.',
  },
];

export const STATS = [
  { value: '14,250+', label: 'Community Issues Logged' },
  { value: '89.4%', label: 'Resolution Rate' },
  { value: '< 2 Mins', label: 'AI Complaint Generation' },
  { value: '100%', label: 'Private & Local Storage' },
];
