import { CheckSquare, Square, HelpCircle, ToggleLeft, AlignLeft, MessageSquare, LayoutList, Star, Sliders } from 'lucide-react';
import { ITEM_TYPES } from '../../data/mockData';

const TYPE_ICONS = {
  'mcq':        HelpCircle,
  'true-false': ToggleLeft,
  'fill-blank': AlignLeft,
  'open-ended': MessageSquare,
  'scenario':   LayoutList,
  'likert':     Star,
  'rating':     Sliders,
};

const TYPE_COLORS = {
  'mcq':        'border-blue-200 bg-blue-50 text-blue-600',
  'true-false': 'border-purple-200 bg-purple-50 text-purple-600',
  'fill-blank': 'border-orange-200 bg-orange-50 text-orange-600',
  'open-ended': 'border-teal-200 bg-teal-50 text-teal-600',
  'scenario':   'border-indigo-200 bg-indigo-50 text-indigo-600',
  'likert':     'border-pink-200 bg-pink-50 text-pink-600',
  'rating':     'border-green-200 bg-green-50 text-green-600',
};

export default function ItemTypeSelector({ selected = [], onChange }) {
  function toggle(id) {
    if (selected.includes(id)) onChange(selected.filter(s => s !== id));
    else onChange([...selected, id]);
  }

  const allSelected = selected.length === ITEM_TYPES.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">{selected.length} of {ITEM_TYPES.length} selected</p>
        <button
          type="button"
          onClick={() => onChange(allSelected ? [] : ITEM_TYPES.map(t => t.id))}
          className="text-xs text-teal hover:text-teal-700 font-medium transition-colors focus-visible:ring-2 focus-visible:ring-teal rounded"
        >
          {allSelected ? 'Clear All' : 'Select All'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {ITEM_TYPES.map(type => {
          const isSelected = selected.includes(type.id);
          const Icon = TYPE_ICONS[type.id] || HelpCircle;
          const colorClass = TYPE_COLORS[type.id] || 'border-gray-200 bg-gray-50 text-gray-500';
          const CheckIcon = isSelected ? CheckSquare : Square;

          return (
            <button
              key={type.id}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => toggle(type.id)}
              className={`relative text-left p-3 rounded-xl border-2 transition-all focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-1 ${
                isSelected
                  ? 'border-teal bg-teal/5 shadow-sm'
                  : 'border-lgray-200 bg-white hover:border-teal/40 hover:bg-teal/5'
              }`}
            >
              <CheckIcon
                size={14}
                className={`absolute top-2 right-2 ${isSelected ? 'text-teal' : 'text-gray-300'}`}
                aria-hidden="true"
              />
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${colorClass} border`}>
                <Icon size={15} aria-hidden="true" />
              </div>
              <p className="text-xs font-semibold text-navy leading-tight">{type.label}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-tight">{type.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
