import { useNavigate } from 'react-router-dom';
import { FileText, Music, Video, CheckCircle, Loader, XCircle, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/shared/Badge';
import RunUsageMeter from '../components/shared/RunUsageMeter';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { RUNS, ITEM_TYPES } from '../data/mockData';

const SOURCE_ICON = { document: FileText, audio: Music, video: Video };
const SOURCE_COLOR = { document: 'text-blue-500', audio: 'text-purple-500', video: 'text-pink-500' };
const SOURCE_BG    = { document: 'bg-blue-50', audio: 'bg-purple-50', video: 'bg-pink-50' };

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

function formatDuration(seconds) {
  if (!seconds) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}

function RunStatusBadge({ status }) {
  if (status === 'completed') return <Badge text="Completed" type="status" />;
  if (status === 'processing') return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-full px-2 py-1">
      <Loader size={11} className="animate-spin" aria-hidden="true" /> Processing
    </span>
  );
  return <Badge text="Failed" type="status" />;
}

export default function RunsHistoryPage() {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const userRuns  = [...RUNS].filter(r => r.userId === (user?.id ?? 'u3')).reverse();
  const runsUsed  = userRuns.length;
  const maxRuns   = 3;
  const isMaxed   = runsUsed >= maxRuns;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">My Runs</h1>
          <p className="text-sm text-gray-500 mt-1">History of your item generation runs.</p>
        </div>
        <Button
          leftIcon={Zap}
          onClick={() => navigate('/runs/new')}
          disabled={isMaxed}
          title={isMaxed ? 'Run limit reached' : undefined}
        >
          Start New Run
        </Button>
      </div>

      <RunUsageMeter runsUsed={runsUsed} maxRuns={maxRuns} showDetails />

      {userRuns.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No runs yet"
          description="Upload a source file and request your first run."
          action={() => navigate('/runs/new')}
          actionLabel="Start a Run"
        />
      ) : (
        <div className="space-y-3">
          {userRuns.map(run => {
            const SrcIcon  = SOURCE_ICON[run.sourceType]  || FileText;
            const srcColor = SOURCE_COLOR[run.sourceType] || 'text-gray-500';
            const srcBg    = SOURCE_BG[run.sourceType]    || 'bg-gray-50';
            const typeLabels = run.itemTypes.map(id => ITEM_TYPES.find(t => t.id === id)?.label ?? id);

            return (
              <div
                key={run.id}
                className="bg-white rounded-2xl border border-lgray-200 shadow-card p-4 flex gap-4 hover:shadow-elevated transition-shadow"
              >
                {/* Source icon */}
                <div className={`w-10 h-10 rounded-xl ${srcBg} flex items-center justify-center flex-shrink-0`}>
                  <SrcIcon size={18} className={srcColor} aria-hidden="true" />
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-navy truncate">{run.sourceFileName}</p>
                    <RunStatusBadge status={run.status} />
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{formatDate(run.createdAt)}</p>
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    {typeLabels.map(label => (
                      <span key={label} className="text-xs bg-lgray border border-lgray-200 text-gray-600 rounded-full px-2 py-0.5">{label}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {run.status === 'completed' && (
                      <span className="flex items-center gap-1">
                        <CheckCircle size={11} className="text-green-500" aria-hidden="true" />
                        {run.itemCount} items generated
                      </span>
                    )}
                    {run.sourcePageCount && <span>· {run.sourcePageCount} pages</span>}
                    {run.sourceDuration  && <span>· {formatDuration(run.sourceDuration)}</span>}
                    {run.notes && <span className="truncate max-w-xs italic">"{run.notes.substring(0, 50)}{run.notes.length > 50 ? '…' : ''}"</span>}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex-shrink-0 flex items-center">
                  <button
                    type="button"
                    onClick={() => navigate(`/runs/${run.id}`)}
                    className="flex items-center gap-1 text-sm font-medium text-teal hover:text-teal-700 transition-colors focus-visible:ring-2 focus-visible:ring-teal rounded px-1"
                    aria-label={`View items for run ${run.sourceFileName}`}
                  >
                    View Items <ArrowRight size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
