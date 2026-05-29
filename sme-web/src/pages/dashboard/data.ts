import {
  Users, FolderKanban, FileQuestion, Clock, CheckCircle2, AlertTriangle,
  Wand2, BookOpen, ClipboardCheck, PenSquare, Settings2, BarChart3,
  Plus, ArrowRight, Zap, Edit3, ThumbsUp, MessageSquare, XCircle,
  type LucideIcon,
} from 'lucide-react';

export interface StatEntry {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  color?: string;
  path?: string;
}

export interface ActionEntry {
  label: string;
  desc: string;
  icon: LucideIcon;
  path: string;
  color: string;
}

export interface ActivityIconEntry {
  icon: LucideIcon;
  color: string;
}

export const ROLE_STATS: Record<string, StatEntry[]> = {
  SA: [
    { label: 'Total Organizations', value: '24', icon: FolderKanban, trend: 8 },
    { label: 'Total Active Users', value: '1,284', icon: Users, trend: 12 },
    { label: 'Questions Generated (All Time)', value: '48,920', icon: FileQuestion, trend: 5 },
    { label: 'Total Projects', value: '312', icon: FolderKanban, color: 'purple', trend: 3 },
    { label: 'Platform Uptime', value: '99.97%', icon: CheckCircle2, color: 'green' },
  ],
  OA: [
    { label: 'Total Users', value: '24', icon: Users, trend: 2 },
    { label: 'Active Projects', value: '5', icon: FolderKanban, trend: 0 },
    { label: 'Questions This Month', value: '182', icon: FileQuestion, trend: 14 },
    { label: 'Pending Reviews', value: '31', icon: ClipboardCheck, color: 'orange', trend: -8 },
  ],
  PM: [
    { label: 'My Active Projects', value: '3', icon: FolderKanban },
    { label: 'Questions Pending Review', value: '31', icon: ClipboardCheck, color: 'orange' },
    { label: 'Approved This Week', value: '22', icon: CheckCircle2, color: 'green', trend: 10 },
    { label: 'Overdue Tasks', value: '4', icon: AlertTriangle, color: 'red' },
  ],
  SME: [
    { label: 'Generated Today', value: '8', icon: Wand2 },
    { label: 'Generated This Month', value: '64', icon: FileQuestion, trend: 6 },
    { label: 'Pending Submission', value: '3', icon: Clock, color: 'orange' },
    { label: 'Approved (Lifetime)', value: '247', icon: CheckCircle2, color: 'green' },
  ],
  RE: [
    { label: 'In My Review Queue', value: '18', icon: ClipboardCheck, color: 'orange' },
    { label: 'Approved This Week', value: '14', icon: CheckCircle2, color: 'green', trend: 5 },
    { label: 'Sent Back for Revision', value: '6', icon: Edit3, color: 'red' },
    { label: 'Avg Review Time', value: '1.4 hrs', icon: Clock },
  ],
  VI: [
    { label: 'Projects I Can Access', value: '2', icon: FolderKanban },
    { label: 'Total Questions', value: '224', icon: FileQuestion },
    { label: 'Last Updated', value: '2h ago', icon: Clock },
  ],
};

export const QUICK_ACTIONS: Record<string, ActionEntry[]> = {
  PM: [
    { label: 'Create New Project', desc: 'Start a new assessment project', icon: Plus, path: '/projects', color: 'teal' },
    { label: 'Assign Reviewers', desc: 'Manage reviewer assignments', icon: Users, path: '/projects', color: 'blue' },
    { label: 'View Review Queue', desc: 'Check questions awaiting review', icon: ClipboardCheck, path: '/review-queue', color: 'orange' },
  ],
  SME: [
    { label: 'Generate Questions', desc: 'Create AI-powered questions', icon: Wand2, path: '/generate', color: 'teal' },
    { label: 'My Question Bank', desc: 'Browse and manage your questions', icon: BookOpen, path: '/question-bank', color: 'blue' },
    { label: 'Continue Last Project', desc: 'Pick up where you left off', icon: ArrowRight, path: '/generate', color: 'purple' },
  ],
  RE: [
    { label: 'Open Review Queue', desc: 'Start reviewing pending questions', icon: ClipboardCheck, path: '/review-queue', color: 'teal' },
    { label: 'My Approved Questions', desc: "View questions you've approved", icon: CheckCircle2, path: '/question-bank', color: 'green' },
  ],
  OA: [
    { label: 'Invite User', desc: 'Add a new team member', icon: Plus, path: '/settings/users', color: 'teal' },
    { label: 'View All Projects', desc: 'Monitor all org projects', icon: FolderKanban, path: '/projects', color: 'blue' },
    { label: 'View Audit Log', desc: 'Review recent platform activity', icon: BarChart3, path: '/settings/audit-log', color: 'purple' },
  ],
  SA: [
    { label: 'Manage Organizations', desc: 'View and configure all orgs', icon: Settings2, path: '/settings/organization', color: 'teal' },
    { label: 'View Platform Health', desc: 'Monitor system status and KPIs', icon: BarChart3, path: '/admin', color: 'blue' },
    { label: 'Manage Roles', desc: 'Configure role permissions', icon: Users, path: '/settings/roles', color: 'purple' },
  ],
  VI: [],
};

export const ACTIVITY_ICONS: Record<string, ActivityIconEntry> = {
  generate: { icon: Zap, color: 'text-teal bg-teal-50' },
  approve: { icon: ThumbsUp, color: 'text-green-600 bg-green-50' },
  edit: { icon: Edit3, color: 'text-blue-600 bg-blue-50' },
  reject: { icon: XCircle, color: 'text-red-500 bg-red-50' },
  comment: { icon: MessageSquare, color: 'text-purple-600 bg-purple-50' },
};
