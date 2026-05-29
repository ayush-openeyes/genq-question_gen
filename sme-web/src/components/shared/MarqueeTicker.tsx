const DEFAULT_ITEMS = [
  'AI-POWERED GENERATION',
  "BLOOM'S TAXONOMY ALIGNED",
  'MULTI-FORMAT QUESTIONS',
  'COLLABORATIVE REVIEW',
  'ASSESSMENT BUILDER',
  'ANALYTICS DASHBOARD',
  'GENQUE PLATFORM',
  'ASSIGN · REVIEW · DEPLOY',
];

export default function MarqueeTicker({ items = DEFAULT_ITEMS, speed = 40 }) {
  const text = items.join('  •  ') + '  •  ';
  return (
    <div
      className="overflow-hidden h-6 flex items-center border-t border-lgray-100/60 bg-navy/[0.025]"
      aria-hidden="true"
    >
      <div
        className="ticker-track text-[9.5px] font-mono tracking-[0.22em] uppercase text-gray-400 select-none"
        style={{ animationDuration: `${speed}s` }}
      >
        <span className="pr-0">{text}</span>
        <span className="pr-0">{text}</span>
      </div>
    </div>
  );
}
