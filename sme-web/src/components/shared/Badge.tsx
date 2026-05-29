const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-green-100 text-green-800',
  Draft: 'bg-gray-100 text-gray-600',
  'In Review': 'bg-blue-100 text-blue-800',
  'Pending Review': 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  'Revision Required': 'bg-orange-100 text-orange-800',
  Completed: 'bg-teal-50 text-teal-700',
  Archived: 'bg-gray-100 text-gray-500',
  Suspended: 'bg-red-100 text-red-700',
  Finalized: 'bg-teal-50 text-teal-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Deactivated: 'bg-gray-100 text-gray-500',
};

const DIFFICULTY_COLORS = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard: 'bg-red-100 text-red-700',
};

const ROLE_COLORS = {
  SA: 'bg-purple-100 text-purple-800',
  OA: 'bg-indigo-100 text-indigo-800',
  PM: 'bg-blue-100 text-blue-800',
  SME: 'bg-teal-50 text-teal-700',
  RE: 'bg-orange-100 text-orange-800',
  VI: 'bg-gray-100 text-gray-600',
  'Super Admin': 'bg-purple-100 text-purple-800',
  'Org Admin': 'bg-indigo-100 text-indigo-800',
  'Project Manager': 'bg-blue-100 text-blue-800',
  'Subject Matter Expert': 'bg-teal-50 text-teal-700',
  'Reviewer/Editor': 'bg-orange-100 text-orange-800',
  'Viewer/Stakeholder': 'bg-gray-100 text-gray-600',
};

const FORMAT_COLORS = {
  MCQ: 'bg-blue-50 text-blue-700',
  'True/False': 'bg-purple-50 text-purple-700',
  'Open-Ended': 'bg-teal-50 text-teal-700',
  'Rating Scale': 'bg-pink-50 text-pink-700',
  'Likert Scale': 'bg-pink-50 text-pink-700',
  'Fill in the Blank': 'bg-orange-50 text-orange-700',
  'Fill in Blank': 'bg-orange-50 text-orange-700',
  'Scenario-Based': 'bg-indigo-50 text-indigo-700',
};

const OUTCOME_COLORS = {
  Success: 'bg-green-100 text-green-700',
  Failed: 'bg-red-100 text-red-700',
  'In Progress': 'bg-blue-100 text-blue-700',
};

interface BadgeProps {
  text: string;
  type?: 'status' | 'difficulty' | 'role' | 'format' | 'outcome';
  size?: 'xs' | 'sm';
}

export default function Badge({ text, type = 'status', size = 'sm' }: BadgeProps) {
  const map = type === 'difficulty' ? DIFFICULTY_COLORS
    : type === 'role' ? ROLE_COLORS
    : type === 'format' ? FORMAT_COLORS
    : type === 'outcome' ? OUTCOME_COLORS
    : STATUS_COLORS;

  const color = map[text] || 'bg-gray-100 text-gray-600';
  const sz = size === 'xs' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1';
  return (
    <span className={`inline-flex items-center font-medium rounded-full whitespace-nowrap ${sz} ${color}`}>
      {text}
    </span>
  );
}
