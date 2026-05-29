import { Info } from 'lucide-react';

export default function RunUsageMeter({
  runsUsed = 0,
  maxRuns = 3,
  maxItemsPerRun = 25,
  showDetails = false,
}) {
  const isMaxed = runsUsed >= maxRuns;

  return (
    <div className={`rounded-xl border p-4 ${isMaxed ? 'border-red-200 bg-red-50' : 'border-lgray-200 bg-white'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-navy">Run Usage</span>
        <span className={`text-sm font-bold ${isMaxed ? 'text-red-600' : 'text-gray-600'}`}>
          {runsUsed} of {maxRuns} runs used
        </span>
      </div>

      {/* Segmented progress bar */}
      <div className="flex gap-1.5 mb-1" role="meter" aria-valuenow={runsUsed} aria-valuemin={0} aria-valuemax={maxRuns} aria-label={`${runsUsed} of ${maxRuns} runs used`}>
        {Array.from({ length: maxRuns }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full transition-colors ${i < runsUsed ? (isMaxed ? 'bg-red-400' : 'bg-teal') : 'bg-lgray-200'}`}
          />
        ))}
      </div>

      {isMaxed && (
        <p className="text-xs text-red-600 mt-1.5 font-medium">
          You've reached the maximum number of runs.
        </p>
      )}

      {showDetails && (
        <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3">
          <div className="flex items-start gap-2 mb-2">
            <Info size={14} className="text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-xs font-semibold text-amber-800">Current Limitations</span>
          </div>
          <ul className="space-y-1 text-xs text-amber-700 ml-5 list-disc">
            <li>Documents: up to 10 pages, 10 MB</li>
            <li>Audio files: up to 60 minutes, 20 MB</li>
            <li>Video files: up to 60 minutes, 50 MB</li>
            <li>Max {maxItemsPerRun} items per run</li>
            <li>Max {maxRuns} runs total</li>
            <li>Execution time varies by source length and item types</li>
          </ul>
        </div>
      )}
    </div>
  );
}
