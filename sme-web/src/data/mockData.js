// ─── Projects ────────────────────────────────────────────────────────────────
export const PROJECTS = [
  { id: 'p1', name: 'Nursing Certification Exam 2025', status: 'Active', pm: 'Jordan Smith', pmAvatar: 'JS', description: 'Level 2 cardiac physiology question bank for certification body.', progress: 72, target: 200, approved: 144, inReview: 18, drafts: 24, overdue: 4, dueDate: '2025-08-15', lastActivity: '2 hours ago', teamSize: 8, tags: ['nursing', 'certification'] },
  { id: 'p2', name: 'HR Onboarding Assessment', status: 'In Review', pm: 'Jordan Smith', pmAvatar: 'JS', description: 'Entry-level HR professional competency assessment.', progress: 45, target: 80, approved: 36, inReview: 22, drafts: 12, overdue: 1, dueDate: '2025-07-01', lastActivity: '1 day ago', teamSize: 5, tags: ['hr', 'onboarding'] },
  { id: 'p3', name: 'Grade 10 Science Quiz Bank', status: 'Draft', pm: 'Jordan Smith', pmAvatar: 'JS', description: 'Science curriculum aligned question bank for Grade 10 students.', progress: 10, target: 150, approved: 15, inReview: 2, drafts: 45, overdue: 0, dueDate: '2025-09-30', lastActivity: '3 days ago', teamSize: 3, tags: ['education', 'science'] },
  { id: 'p4', name: 'Compliance Training Module', status: 'Completed', pm: 'Jordan Smith', pmAvatar: 'JS', description: 'Annual compliance and ethics training assessment.', progress: 100, target: 60, approved: 60, inReview: 0, drafts: 0, overdue: 0, dueDate: '2025-05-01', lastActivity: '2 weeks ago', teamSize: 4, tags: ['compliance', 'ethics'] },
  { id: 'p5', name: 'Technical Interview Bank', status: 'Active', pm: 'Jordan Smith', pmAvatar: 'JS', description: 'Full-stack developer technical screening questions.', progress: 58, target: 120, approved: 70, inReview: 15, drafts: 25, overdue: 2, dueDate: '2025-08-01', lastActivity: '5 hours ago', teamSize: 6, tags: ['technical', 'interview'] },
];

// ─── Questions ────────────────────────────────────────────────────────────────
export const QUESTIONS = [
  { id: 'Q-00142', stem: 'Which of the following best describes the primary function of the sinoatrial (SA) node in cardiac physiology?', format: 'MCQ', difficulty: 'Medium', status: 'Approved', project: 'Nursing Certification Exam 2025', createdBy: 'Taylor Brown', lastModified: '2 days ago', bloomsLevel: 'Understand', options: ['A. It controls blood pressure regulation', 'B. It acts as the natural pacemaker generating electrical impulses', 'C. It prevents backflow of blood between chambers', 'D. It regulates oxygen exchange in the lungs'], correct: 'B', explanation: 'The SA node generates the electrical impulse that initiates each heartbeat, making it the primary pacemaker of the heart.' },
  { id: 'Q-00143', stem: 'A patient presents with an irregular heartbeat and reduced cardiac output. Which condition is most likely?', format: 'MCQ', difficulty: 'Hard', status: 'Pending Review', project: 'Nursing Certification Exam 2025', createdBy: 'Taylor Brown', lastModified: '1 day ago', bloomsLevel: 'Apply', options: ['A. Tachycardia', 'B. Atrial fibrillation', 'C. Hypertension', 'D. Bradycardia'], correct: 'B', explanation: 'Atrial fibrillation is characterized by irregular electrical signals and reduced ventricular filling.' },
  { id: 'Q-00144', stem: 'True or False: The left ventricle pumps deoxygenated blood to the lungs.', format: 'True/False', difficulty: 'Easy', status: 'Approved', project: 'Nursing Certification Exam 2025', createdBy: 'Taylor Brown', lastModified: '3 days ago', bloomsLevel: 'Remember', correct: 'False', explanation: 'The right ventricle pumps deoxygenated blood to the lungs; the left ventricle pumps oxygenated blood to the body.' },
  { id: 'Q-00145', stem: 'Describe the sequence of events in the cardiac cycle, from atrial depolarization to ventricular relaxation.', format: 'Open-Ended', difficulty: 'Hard', status: 'In Review', project: 'Nursing Certification Exam 2025', createdBy: 'Taylor Brown', lastModified: '4 hours ago', bloomsLevel: 'Analyze', rubric: 'Answer should cover: P wave (atrial depolarization), QRS complex (ventricular depolarization), T wave (ventricular repolarization), systole and diastole phases.' },
  { id: 'Q-00146', stem: 'Which HR competency is most critical for successful employee onboarding?', format: 'MCQ', difficulty: 'Easy', status: 'Draft', project: 'HR Onboarding Assessment', createdBy: 'Taylor Brown', lastModified: '1 hour ago', bloomsLevel: 'Remember', options: ['A. Payroll processing', 'B. Cultural integration and role clarity', 'C. Benefits negotiation', 'D. Performance appraisal design'], correct: 'B', explanation: 'Cultural integration and role clarity are foundational to successful onboarding.' },
  { id: 'Q-00147', stem: 'Rate your confidence in explaining the company\'s core values to a new hire. (1 = Not at all confident, 5 = Extremely confident)', format: 'Rating Scale', difficulty: 'Easy', status: 'Revision Required', project: 'HR Onboarding Assessment', createdBy: 'Taylor Brown', lastModified: '2 days ago', bloomsLevel: 'Evaluate', min: 1, max: 5 },
  { id: 'Q-00148', stem: 'The chemical formula for water is _____.', format: 'Fill in the Blank', difficulty: 'Easy', status: 'Approved', project: 'Grade 10 Science Quiz Bank', createdBy: 'Taylor Brown', lastModified: '3 days ago', bloomsLevel: 'Remember', correct: 'H2O' },
  { id: 'Q-00149', stem: 'A developer is asked to optimize a slow database query. Which approach should they consider first?', format: 'Scenario-Based', difficulty: 'Hard', status: 'Draft', project: 'Technical Interview Bank', createdBy: 'Taylor Brown', lastModified: '30 mins ago', bloomsLevel: 'Apply', scenario: 'A production system experiences 5+ second query times on a table with 10 million rows.' },
];

// ─── Users ────────────────────────────────────────────────────────────────────
export const USERS = [
  { id: 'u1', name: 'Alex Carter', email: 'alex@genque.io', role: 'SA', status: 'Active', avatar: 'AC', projects: 12, lastLogin: '1 hour ago', dateJoined: '2024-01-10', org: 'OpenEyes Technologies' },
  { id: 'u2', name: 'Morgan Lee', email: 'morgan@acme.com', role: 'OA', status: 'Active', avatar: 'ML', projects: 5, lastLogin: '3 hours ago', dateJoined: '2024-02-15', org: 'Acme Corp' },
  { id: 'u3', name: 'Jordan Smith', email: 'jordan@acme.com', role: 'PM', status: 'Active', avatar: 'JS', projects: 5, lastLogin: '2 hours ago', dateJoined: '2024-03-01', org: 'Acme Corp' },
  { id: 'u4', name: 'Taylor Brown', email: 'taylor@acme.com', role: 'SME', status: 'Active', avatar: 'TB', projects: 3, lastLogin: '5 hours ago', dateJoined: '2024-03-10', org: 'Acme Corp' },
  { id: 'u5', name: 'Casey Wilson', email: 'casey@acme.com', role: 'RE', status: 'Active', avatar: 'CW', projects: 4, lastLogin: '1 day ago', dateJoined: '2024-04-01', org: 'Acme Corp' },
  { id: 'u6', name: 'Riley Evans', email: 'riley@acme.com', role: 'VI', status: 'Active', avatar: 'RE', projects: 2, lastLogin: '2 days ago', dateJoined: '2024-04-15', org: 'Acme Corp' },
  { id: 'u7', name: 'Sam Parker', email: 'sam@acme.com', role: 'SME', status: 'Pending', avatar: 'SP', projects: 0, lastLogin: 'Never', dateJoined: '2025-05-20', org: 'Acme Corp' },
  { id: 'u8', name: 'Dana Rhodes', email: 'dana@acme.com', role: 'RE', status: 'Deactivated', avatar: 'DR', projects: 1, lastLogin: '3 months ago', dateJoined: '2023-12-01', org: 'Acme Corp' },
];

// ─── Notifications ────────────────────────────────────────────────────────────
export const NOTIFICATIONS = [
  { id: 'n1', type: 'success', title: 'Question Approved', message: 'Question Q-00142 in Nursing Certification Exam 2025 was approved by Casey Wilson.', timestamp: '2 hours ago', read: false, link: '/questions/Q-00142/edit' },
  { id: 'n2', type: 'warning', title: 'Revision Required', message: 'Question Q-00147 requires revision. Feedback: "Rating scale anchors need clearer labels."', timestamp: '4 hours ago', read: false, link: '/questions/Q-00147/edit' },
  { id: 'n3', type: 'info', title: 'Assigned to New Project', message: 'You have been added to the Technical Interview Bank project as a Project Manager.', timestamp: '1 day ago', read: false, link: '/projects/p5' },
  { id: 'n4', type: 'error', title: 'Question Rejected', message: 'Question Q-00146 was rejected by Casey Wilson. Reason: "Not aligned to project scope."', timestamp: '1 day ago', read: true, link: '/questions/Q-00146/edit' },
  { id: 'n5', type: 'info', title: 'New Team Member', message: 'Sam Parker has joined the HR Onboarding Assessment project as SME.', timestamp: '2 days ago', read: true, link: '/projects/p2' },
  { id: 'n6', type: 'success', title: 'Assessment Published', message: 'Compliance Training Module assessment has been finalized and published.', timestamp: '2 weeks ago', read: true, link: '/assessments/a1/build' },
];

// ─── Activity Feed ────────────────────────────────────────────────────────────
export const ACTIVITY_FEED = [
  { id: 'a1', icon: 'generate', text: 'You generated 5 questions for Nursing Certification Exam 2025', timestamp: '2 hours ago', link: '/generate' },
  { id: 'a2', icon: 'approve', text: 'Casey Wilson approved Question #142 in Nursing Certification Exam', timestamp: '3 hours ago', link: '/question-bank' },
  { id: 'a3', icon: 'edit', text: 'You edited Question #143 — changed difficulty from Easy to Hard', timestamp: '5 hours ago', link: '/questions/Q-00143/edit' },
  { id: 'a4', icon: 'reject', text: 'Casey Wilson rejected Question #146 — "Not aligned to scope"', timestamp: '1 day ago', link: '/review-queue' },
  { id: 'a5', icon: 'comment', text: 'Taylor Brown commented on Question #145 — "Please expand the rubric"', timestamp: '1 day ago', link: '/questions/Q-00145/edit' },
  { id: 'a6', icon: 'generate', text: 'You generated 12 questions for HR Onboarding Assessment', timestamp: '2 days ago', link: '/generate' },
  { id: 'a7', icon: 'approve', text: 'Casey Wilson approved 8 questions in Technical Interview Bank', timestamp: '2 days ago', link: '/review-queue' },
];

// ─── Audit Log ────────────────────────────────────────────────────────────────
export const AUDIT_LOG = [
  { id: 'al1', timestamp: '2025-05-25 09:14:32', actor: 'Jordan Smith', actorRole: 'PM', actorAvatar: 'JS', action: 'Question Approved', entity: 'Question', entityId: 'Q-00142', entityName: 'Which of the following best describes...', ip: '192.168.1.10', outcome: 'Success' },
  { id: 'al2', timestamp: '2025-05-25 08:30:11', actor: 'Taylor Brown', actorRole: 'SME', actorAvatar: 'TB', action: 'Question Created', entity: 'Question', entityId: 'Q-00149', entityName: 'A developer is asked to optimize...', ip: '192.168.1.22', outcome: 'Success' },
  { id: 'al3', timestamp: '2025-05-25 07:55:00', actor: 'Morgan Lee', actorRole: 'OA', actorAvatar: 'ML', action: 'User Invited', entity: 'User', entityId: 'u7', entityName: 'Sam Parker', ip: '10.0.0.5', outcome: 'Success' },
  { id: 'al4', timestamp: '2025-05-24 16:42:19', actor: 'Casey Wilson', actorRole: 'RE', actorAvatar: 'CW', action: 'Question Rejected', entity: 'Question', entityId: 'Q-00146', entityName: 'Which HR competency is most critical...', ip: '192.168.1.15', outcome: 'Success' },
  { id: 'al5', timestamp: '2025-05-24 14:10:05', actor: 'Jordan Smith', actorRole: 'PM', actorAvatar: 'JS', action: 'Project Created', entity: 'Project', entityId: 'p5', entityName: 'Technical Interview Bank', ip: '192.168.1.10', outcome: 'Success' },
  { id: 'al6', timestamp: '2025-05-24 11:05:33', actor: 'Alex Carter', actorRole: 'SA', actorAvatar: 'AC', action: 'Role Permission Changed', entity: 'Role', entityId: 'r2', entityName: 'Project Manager', ip: '10.0.0.1', outcome: 'Success' },
  { id: 'al7', timestamp: '2025-05-23 09:00:00', actor: 'Unknown', actorRole: '', actorAvatar: '?', action: 'Login Failed', entity: 'User', entityId: '', entityName: 'admin@acme.com', ip: '203.0.113.45', outcome: 'Failed' },
];

// ─── Analytics data ───────────────────────────────────────────────────────────
export const ANALYTICS_OVER_TIME = [
  { date: 'May 1', Generated: 12, Approved: 5, Rejected: 2, Revision: 3 },
  { date: 'May 5', Generated: 18, Approved: 9, Rejected: 1, Revision: 4 },
  { date: 'May 10', Generated: 25, Approved: 14, Rejected: 3, Revision: 5 },
  { date: 'May 15', Generated: 20, Approved: 18, Rejected: 2, Revision: 2 },
  { date: 'May 20', Generated: 30, Approved: 22, Rejected: 1, Revision: 6 },
  { date: 'May 25', Generated: 15, Approved: 12, Rejected: 0, Revision: 1 },
];

export const FORMAT_DISTRIBUTION = [
  { name: 'MCQ', value: 145 },
  { name: 'Open-Ended', value: 62 },
  { name: 'True/False', value: 48 },
  { name: 'Rating Scale', value: 20 },
  { name: 'Fill in Blank', value: 18 },
  { name: 'Scenario-Based', value: 15 },
  { name: 'Likert Scale', value: 10 },
];

export const DIFFICULTY_DATA = [
  { project: 'Nursing Cert', targetEasy: 30, targetMedium: 50, targetHard: 20, actualEasy: 28, actualMedium: 45, actualHard: 27 },
  { project: 'HR Onboarding', targetEasy: 40, targetMedium: 40, targetHard: 20, actualEasy: 38, actualMedium: 42, actualHard: 20 },
  { project: 'Grade 10 Sci', targetEasy: 50, targetMedium: 35, targetHard: 15, actualEasy: 48, actualMedium: 30, actualHard: 12 },
];

export const REVIEWER_PERFORMANCE = [
  { name: 'Casey W.', Approved: 72, Revision: 18, Rejected: 8, avgTime: 1.4 },
  { name: 'Dana R.', Approved: 45, Revision: 22, Rejected: 12, avgTime: 2.1 },
  { name: 'Jordan S.', Approved: 30, Revision: 10, Rejected: 5, avgTime: 0.9 },
];

export const HEATMAP_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: `May ${i + 1}`,
  count: Math.floor(Math.random() * 20),
}));

export const AI_VS_MANUAL = [
  { project: 'Nursing Cert', asIs: 88, edited: 56 },
  { project: 'HR Onboarding', asIs: 30, edited: 50 },
  { project: 'Grade 10 Sci', asIs: 12, edited: 3 },
  { project: 'Compliance', asIs: 42, edited: 18 },
  { project: 'Tech Interview', asIs: 55, edited: 30 },
];

// ─── Integrations ─────────────────────────────────────────────────────────────
export const INTEGRATIONS = [
  { id: 'int1', name: 'Canvas LMS', icon: '🎓', description: 'Export assessments directly to Canvas courses.', status: 'Connected', connectedSince: '2024-11-01', lastSync: '2 hours ago', syncStatus: 'Success' },
  { id: 'int2', name: 'Moodle', icon: '📚', description: 'Sync question banks with Moodle course structure.', status: 'Not Connected', connectedSince: null, lastSync: null, syncStatus: null },
  { id: 'int3', name: 'Blackboard', icon: '🖥️', description: 'Push finalized assessments to Blackboard Ultra.', status: 'Not Connected', connectedSince: null, lastSync: null, syncStatus: null },
  { id: 'int4', name: 'AWS S3 Item Bank', icon: '☁️', description: 'Archive question banks to S3 storage.', status: 'Configuration Error', connectedSince: '2025-01-15', lastSync: '3 days ago', syncStatus: 'Failed' },
  { id: 'int5', name: 'Custom LMS via API', icon: '🔗', description: 'Connect any LMS that supports QTI or REST APIs.', status: 'Not Connected', connectedSince: null, lastSync: null, syncStatus: null },
];

export const API_KEYS = [
  { id: 'k1', name: 'Production Integration', key: '••••••••••••••••••••••••••••••7a3f', created: '2025-01-10', lastUsed: '1 hour ago', scope: ['read:questions', 'read:projects'], status: 'Active' },
  { id: 'k2', name: 'Staging Test Key', key: '••••••••••••••••••••••••••••••9b2c', created: '2025-03-01', lastUsed: '5 days ago', scope: ['read:questions', 'write:questions', 'read:projects'], status: 'Active' },
  { id: 'k3', name: 'Old Export Script', key: '••••••••••••••••••••••••••••••4e1d', created: '2024-08-20', lastUsed: '2 months ago', scope: ['read:questions'], status: 'Revoked' },
];

// ─── Organizations (SA view) ───────────────────────────────────────────────────
export const ORGANIZATIONS = [
  { id: 'org1', name: 'Acme Corp', admin: 'Morgan Lee', plan: 'Enterprise', users: 24, questions: 482, storage: '1.2 GB', status: 'Active', created: '2024-01-15' },
  { id: 'org2', name: 'Bright Futures Academy', admin: 'Priya Nair', plan: 'Education', users: 12, questions: 210, storage: '450 MB', status: 'Active', created: '2024-03-01' },
  { id: 'org3', name: 'TechScreen Inc.', admin: 'David Kim', plan: 'Professional', users: 8, questions: 95, storage: '200 MB', status: 'Active', created: '2024-06-10' },
  { id: 'org4', name: 'Credex Board', admin: 'Laura Gomez', plan: 'Enterprise', users: 35, questions: 1240, storage: '3.8 GB', status: 'Active', created: '2023-11-01' },
  { id: 'org5', name: 'OldTest Co.', admin: 'Mark Stone', plan: 'Professional', users: 3, questions: 22, storage: '40 MB', status: 'Suspended', created: '2023-09-15' },
];

// ─── Feature Flags ────────────────────────────────────────────────────────────
export const FEATURE_FLAGS = [
  { id: 'ff1', name: 'Enable AI Improve Suggestions', description: 'Shows the "Improve with AI" button in the Question Editor.', globalEnabled: true, lastChangedBy: 'Alex Carter', dateChanged: '2025-05-01' },
  { id: 'ff2', name: 'Enable API Key Generation', description: 'Allows org admins to generate API keys for external integrations.', globalEnabled: true, lastChangedBy: 'Alex Carter', dateChanged: '2025-04-15' },
  { id: 'ff3', name: 'Enable Multi-Format Export', description: 'Enables PDF, DOCX, and CSV export options.', globalEnabled: true, lastChangedBy: 'Alex Carter', dateChanged: '2025-03-10' },
  { id: 'ff4', name: 'Enable Scenario-Based Questions', description: 'Unlocks the Scenario-Based format in the Question Generator.', globalEnabled: false, lastChangedBy: 'Alex Carter', dateChanged: '2025-05-20' },
  { id: 'ff5', name: "Show Bloom's Taxonomy Level Selector", description: "Displays Bloom's taxonomy field in Question Editor and Generator.", globalEnabled: true, lastChangedBy: 'Alex Carter', dateChanged: '2025-02-28' },
];

// ─── Assessments ──────────────────────────────────────────────────────────────
export const ASSESSMENTS = [
  { id: 'a1', name: 'Module 1 Compliance Quiz', project: 'Compliance Training Module', status: 'Finalized', questionCount: 20, createdDate: '2025-04-28', createdBy: 'Jordan Smith' },
  { id: 'a2', name: 'Cardiac Physiology Mock Exam', project: 'Nursing Certification Exam 2025', status: 'Draft', questionCount: 45, createdDate: '2025-05-10', createdBy: 'Jordan Smith' },
  { id: 'a3', name: 'HR Competency Assessment', project: 'HR Onboarding Assessment', status: 'Draft', questionCount: 30, createdDate: '2025-05-22', createdBy: 'Jordan Smith' },
];

// ─── Roles ────────────────────────────────────────────────────────────────────
export const ROLES = [
  { id: 'r1', name: 'Super Admin', type: 'System', users: 2 },
  { id: 'r2', name: 'Org Admin', type: 'System', users: 5 },
  { id: 'r3', name: 'Project Manager', type: 'System', users: 8 },
  { id: 'r4', name: 'Subject Matter Expert', type: 'System', users: 24 },
  { id: 'r5', name: 'Reviewer/Editor', type: 'System', users: 15 },
  { id: 'r6', name: 'Viewer/Stakeholder', type: 'System', users: 31 },
  { id: 'r7', name: 'Content Lead', type: 'Custom', users: 3 },
];

export const PERMISSION_AREAS = [
  'Question Generator', 'Question Bank', 'Review Queue', 'Assessment Builder',
  'Project Management', 'Analytics', 'User Management', 'Role Management',
  'Org Settings', 'Audit Log', 'Integrations', 'Super Admin Panel',
];

export const PERMISSION_TYPES = ['View', 'Create', 'Edit Own', 'Edit All', 'Delete', 'Approve', 'Export', 'Assign'];

// ─── Item Generation (Runs) ────────────────────────────────────────────────────

export const ITEM_TYPES = [
  { id: 'mcq',        label: 'Multiple Choice',   description: 'Single correct answer from 4 options' },
  { id: 'true-false', label: 'True / False',       description: 'Binary correct/incorrect statement' },
  { id: 'fill-blank', label: 'Fill in the Blank',  description: 'Complete the missing word or phrase' },
  { id: 'open-ended', label: 'Open-Ended',         description: 'Free-text response with model answer' },
  { id: 'scenario',   label: 'Scenario-Based',     description: 'Context paragraph + question' },
  { id: 'likert',     label: 'Likert Scale',        description: '5-point agreement scale' },
  { id: 'rating',     label: 'Rating Scale',        description: 'Numeric rating with anchors' },
];

export const RUNS = [
  {
    id: 'run-1',
    userId: 'u3',
    status: 'completed',
    sourceType: 'document',
    sourceFileName: 'chapter3.pdf',
    sourceFileSize: 3145728,
    sourcePageCount: 8,
    sourceDuration: null,
    itemTypes: ['mcq', 'true-false', 'fill-blank'],
    itemCount: 18,
    requestedCount: 25,
    createdAt: '2026-05-20T09:15:00Z',
    completedAt: '2026-05-20T09:17:42Z',
    estimatedSeconds: 120,
    notes: 'Generated for Unit 3 mid-term review.',
    projectId: 'p1',
  },
  {
    id: 'run-2',
    userId: 'u3',
    status: 'completed',
    sourceType: 'audio',
    sourceFileName: 'lecture_week4.mp3',
    sourceFileSize: 18874368,
    sourcePageCount: null,
    sourceDuration: 2580,
    itemTypes: ['mcq', 'open-ended'],
    itemCount: 12,
    requestedCount: 15,
    createdAt: '2026-05-22T14:00:00Z',
    completedAt: '2026-05-22T14:04:10Z',
    estimatedSeconds: 200,
    notes: '',
    projectId: 'p1',
  },
  {
    id: 'run-3',
    userId: 'u3',
    status: 'completed',
    sourceType: 'video',
    sourceFileName: 'demo_session.mp4',
    sourceFileSize: 42000000,
    sourcePageCount: null,
    sourceDuration: 1800,
    itemTypes: ['mcq', 'scenario', 'fill-blank'],
    itemCount: 14,
    requestedCount: 25,
    createdAt: '2026-05-25T10:00:00Z',
    completedAt: '2026-05-25T10:05:00Z',
    estimatedSeconds: 300,
    notes: '',
    projectId: 'p2',
  },
];

export const RUN_ITEMS = [
  {
    id: 'item-001',
    runId: 'run-1',
    type: 'mcq',
    stem: 'Which of the following best describes the role of mitochondria in eukaryotic cells?',
    options: [
      'A. Protein synthesis via ribosomes',
      'B. ATP production through oxidative phosphorylation',
      'C. DNA replication and cell division',
      'D. Lipid storage and transport',
    ],
    correctAnswer: 'B',
    explanation: 'Mitochondria generate ATP through the electron transport chain and oxidative phosphorylation.',
    sourceRef: { type: 'page', pageNumber: 4 },
    userReaction: null,
    notes: '',
    customized: false,
    originalStem: null,
    originalOptions: null,
    originalCorrectAnswer: null,
    addedToLists: [],
    createdAt: '2026-05-20T09:17:30Z',
  },
  {
    id: 'item-002',
    runId: 'run-1',
    type: 'true-false',
    stem: 'The Krebs cycle occurs in the cytoplasm of eukaryotic cells.',
    options: null,
    correctAnswer: 'False',
    explanation: 'The Krebs cycle occurs in the mitochondrial matrix.',
    sourceRef: { type: 'page', pageNumber: 5 },
    userReaction: 'liked',
    notes: 'Great recall question.',
    customized: false,
    originalStem: null,
    originalOptions: null,
    originalCorrectAnswer: null,
    addedToLists: ['list-1'],
    createdAt: '2026-05-20T09:17:31Z',
  },
  {
    id: 'item-003',
    runId: 'run-1',
    type: 'fill-blank',
    stem: 'The process by which glucose is converted to pyruvate is called ______.',
    options: null,
    correctAnswer: 'glycolysis',
    explanation: 'Glycolysis is a 10-step metabolic pathway that occurs in the cytoplasm.',
    sourceRef: { type: 'page', pageNumber: 6 },
    userReaction: 'disliked',
    notes: 'Too simple for advanced learners.',
    customized: false,
    originalStem: null,
    originalOptions: null,
    originalCorrectAnswer: null,
    addedToLists: [],
    createdAt: '2026-05-20T09:17:32Z',
  },
  {
    id: 'item-004',
    runId: 'run-1',
    type: 'mcq',
    stem: 'During aerobic respiration, where does the electron transport chain primarily occur?',
    options: [
      'A. Cytoplasm',
      'B. Nucleus',
      'C. Inner mitochondrial membrane',
      'D. Endoplasmic reticulum',
    ],
    correctAnswer: 'C',
    explanation: 'The electron transport chain is embedded in the inner mitochondrial membrane.',
    sourceRef: { type: 'page', pageNumber: 4 },
    userReaction: 'liked',
    notes: '',
    customized: false,
    originalStem: null,
    originalOptions: null,
    originalCorrectAnswer: null,
    addedToLists: ['list-1'],
    createdAt: '2026-05-20T09:17:33Z',
  },
  {
    id: 'item-005',
    runId: 'run-1',
    type: 'true-false',
    stem: 'Fermentation produces more ATP than aerobic respiration per glucose molecule.',
    options: null,
    correctAnswer: 'False',
    explanation: 'Aerobic respiration yields ~36–38 ATP per glucose, while fermentation yields only 2 ATP.',
    sourceRef: { type: 'page', pageNumber: 7 },
    userReaction: null,
    notes: '',
    customized: false,
    originalStem: null,
    originalOptions: null,
    originalCorrectAnswer: null,
    addedToLists: [],
    createdAt: '2026-05-20T09:17:34Z',
  },
  {
    id: 'item-006',
    runId: 'run-1',
    type: 'fill-blank',
    stem: 'The final electron acceptor in the electron transport chain is ______.',
    options: null,
    correctAnswer: 'oxygen',
    explanation: 'Oxygen accepts electrons at the end of the chain, forming water.',
    sourceRef: { type: 'page', pageNumber: 4 },
    userReaction: null,
    notes: '',
    customized: false,
    originalStem: null,
    originalOptions: null,
    originalCorrectAnswer: null,
    addedToLists: [],
    createdAt: '2026-05-20T09:17:35Z',
  },
  {
    id: 'item-007',
    runId: 'run-2',
    type: 'mcq',
    stem: 'According to the lecture, what is the primary advantage of spaced repetition?',
    options: [
      'A. It reduces total study time by 50%',
      'B. It strengthens memory traces through timed recall intervals',
      'C. It eliminates the need for active recall',
      'D. It is only effective for declarative memory',
    ],
    correctAnswer: 'B',
    explanation: 'Spaced repetition leverages the spacing effect to improve long-term retention.',
    sourceRef: { type: 'clip', startSeconds: 312, endSeconds: 385 },
    userReaction: 'liked',
    notes: '',
    customized: false,
    originalStem: null,
    originalOptions: null,
    originalCorrectAnswer: null,
    addedToLists: ['list-1'],
    createdAt: '2026-05-22T14:04:05Z',
  },
  {
    id: 'item-008',
    runId: 'run-2',
    type: 'open-ended',
    stem: 'Explain the difference between short-term memory and long-term memory as discussed in the lecture.',
    options: null,
    correctAnswer: 'Short-term memory holds a limited amount of information for a short period; long-term memory stores information indefinitely with larger capacity.',
    explanation: null,
    sourceRef: { type: 'clip', startSeconds: 540, endSeconds: 630 },
    userReaction: null,
    notes: 'Good for essay-format assessments.',
    customized: false,
    originalStem: null,
    originalOptions: null,
    originalCorrectAnswer: null,
    addedToLists: [],
    createdAt: '2026-05-22T14:04:08Z',
  },
  {
    id: 'item-009',
    runId: 'run-3',
    type: 'mcq',
    stem: 'In the demo, which step comes directly after uploading a source file?',
    options: [
      'A. Selecting the export format',
      'B. Choosing the item types to generate',
      'C. Reviewing existing runs',
      'D. Setting up a project',
    ],
    correctAnswer: 'B',
    explanation: 'After uploading, the user selects item types before requesting a run.',
    sourceRef: { type: 'clip', startSeconds: 90, endSeconds: 145 },
    userReaction: null,
    notes: '',
    customized: false,
    originalStem: null,
    originalOptions: null,
    originalCorrectAnswer: null,
    addedToLists: [],
    createdAt: '2026-05-25T10:04:50Z',
  },
  {
    id: 'item-010',
    runId: 'run-3',
    type: 'scenario',
    stem: 'A trainer uploads a 45-minute video lecture and selects MCQ and Scenario-Based item types with a quantity of 20. After requesting the run, how many items might the system generate?',
    options: [
      'A. Exactly 20',
      'B. Up to 20, depending on content density',
      'C. Always 25',
      'D. Exactly 10',
    ],
    correctAnswer: 'B',
    explanation: 'Item count depends on source length and content density; the quantity slider sets a maximum.',
    sourceRef: { type: 'clip', startSeconds: 200, endSeconds: 310 },
    userReaction: 'liked',
    notes: '',
    customized: false,
    originalStem: null,
    originalOptions: null,
    originalCorrectAnswer: null,
    addedToLists: [],
    createdAt: '2026-05-25T10:04:55Z',
  },
];

export const PERSONAL_LISTS = [
  {
    id: 'list-1',
    userId: 'u3',
    name: 'Unit 3 Mid-Term Review',
    description: 'Curated items for the unit 3 mid-term examination.',
    itemIds: ['item-002', 'item-004', 'item-007'],
    createdAt: '2026-05-20T16:00:00Z',
    updatedAt: '2026-05-22T14:10:00Z',
  },
];

// Default permission matrix for Project Manager role
export const DEFAULT_PERMISSIONS = {
  'Question Generator': { View: true, Create: true, 'Edit Own': true, 'Edit All': false, Delete: false, Approve: false, Export: true, Assign: false },
  'Question Bank': { View: true, Create: true, 'Edit Own': true, 'Edit All': true, Delete: false, Approve: false, Export: true, Assign: false },
  'Review Queue': { View: true, Create: false, 'Edit Own': false, 'Edit All': false, Delete: false, Approve: true, Export: false, Assign: true },
  'Assessment Builder': { View: true, Create: true, 'Edit Own': true, 'Edit All': true, Delete: false, Approve: false, Export: true, Assign: false },
  'Project Management': { View: true, Create: true, 'Edit Own': true, 'Edit All': false, Delete: false, Approve: false, Export: false, Assign: true },
  'Analytics': { View: true, Create: false, 'Edit Own': false, 'Edit All': false, Delete: false, Approve: false, Export: true, Assign: false },
  'User Management': { View: false, Create: false, 'Edit Own': false, 'Edit All': false, Delete: false, Approve: false, Export: false, Assign: false },
  'Role Management': { View: false, Create: false, 'Edit Own': false, 'Edit All': false, Delete: false, Approve: false, Export: false, Assign: false },
  'Org Settings': { View: false, Create: false, 'Edit Own': false, 'Edit All': false, Delete: false, Approve: false, Export: false, Assign: false },
  'Audit Log': { View: false, Create: false, 'Edit Own': false, 'Edit All': false, Delete: false, Approve: false, Export: false, Assign: false },
  'Integrations': { View: false, Create: false, 'Edit Own': false, 'Edit All': false, Delete: false, Approve: false, Export: false, Assign: false },
  'Super Admin Panel': { View: false, Create: false, 'Edit Own': false, 'Edit All': false, Delete: false, Approve: false, Export: false, Assign: false },
};
