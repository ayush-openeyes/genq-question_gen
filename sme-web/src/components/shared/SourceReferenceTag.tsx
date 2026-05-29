import { BookOpen, Music, Video } from 'lucide-react';
import { formatSeconds } from '../../lib/exportUtils';

export default function SourceReferenceTag({ sourceRef, sourceType }) {
  if (!sourceRef) return null;

  let icon, label;

  if (sourceRef.type === 'page') {
    icon = <BookOpen size={11} aria-hidden="true" />;
    label = `Page ${sourceRef.pageNumber}`;
  } else if (sourceRef.type === 'clip') {
    icon = sourceType === 'audio'
      ? <Music size={11} aria-hidden="true" />
      : <Video size={11} aria-hidden="true" />;
    label = `${formatSeconds(sourceRef.startSeconds)} – ${formatSeconds(sourceRef.endSeconds)}`;
  } else {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-lgray border border-lgray-200 rounded-full px-2 py-0.5 whitespace-nowrap">
      {icon}
      {label}
    </span>
  );
}
