export function formatSeconds(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function sourceRefLabel(item) {
  const ref = item.sourceRef;
  if (!ref) return '';
  if (ref.type === 'page') return `Page ${ref.pageNumber}`;
  return `${formatSeconds(ref.startSeconds)} – ${formatSeconds(ref.endSeconds)}`;
}

const FIELD_DEFS = [
  { id: 'type',     label: 'Item Type',       getValue: i => i.type },
  { id: 'stem',     label: 'Stem',            getValue: i => i.stem },
  { id: 'options',  label: 'Answer Options',  getValue: i => i.options ? i.options.join(' | ') : '' },
  { id: 'answer',   label: 'Correct Answer',  getValue: i => i.correctAnswer ?? '' },
  { id: 'explain',  label: 'Explanation',     getValue: i => i.explanation ?? '' },
  { id: 'ref',      label: 'Source Reference',getValue: i => sourceRefLabel(i) },
  { id: 'notes',    label: 'My Notes',        getValue: i => i.notes ?? '' },
  { id: 'reaction', label: 'Reaction',        getValue: i => i.userReaction ?? 'none' },
];

export { FIELD_DEFS };

function buildCsv(items, fieldIds) {
  const fields = FIELD_DEFS.filter(f => fieldIds.includes(f.id));
  const header = fields.map(f => JSON.stringify(f.label)).join(',');
  const rows = items.map(item =>
    fields.map(f => JSON.stringify(f.getValue(item))).join(',')
  );
  return [header, ...rows].join('\n');
}

export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportItems(items, { scope, format, fieldIds, selectedIds }) {
  let pool = items;
  if (scope === 'selected') pool = items.filter(i => selectedIds.includes(i.id));
  else if (scope === 'liked')    pool = items.filter(i => i.userReaction === 'liked');

  const filename = `genque-items-${Date.now()}`;

  if (format === 'csv') {
    const csv = buildCsv(pool, fieldIds);
    downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
  } else if (format === 'docx') {
    // Fallback to CSV until docx library is integrated
    const csv = buildCsv(pool, fieldIds);
    downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
  }
}
