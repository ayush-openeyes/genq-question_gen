import { useRef, useState } from 'react';
import { FileText, Music, Video, UploadCloud, X, CheckCircle } from 'lucide-react';
import Badge from './Badge';
import Button from '../ui/Button';

const LIMITS = {
  document: { maxBytes: 10 * 1024 * 1024, label: 'PDF / DOCX · up to 10 pages · 10 MB' },
  audio:    { maxBytes: 20 * 1024 * 1024, label: 'MP3 / WAV · up to 60 min · 20 MB' },
  video:    { maxBytes: 50 * 1024 * 1024, label: 'MP4 / MOV · up to 60 min · 50 MB' },
};

const MIME_MAP = {
  'application/pdf': 'document',
  'application/msword': 'document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document',
};

function detectType(file) {
  if (MIME_MAP[file.type]) return MIME_MAP[file.type];
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.startsWith('video/')) return 'video';
  return null;
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const SOURCE_META = [
  { type: 'document', icon: FileText, color: 'text-blue-500',  bg: 'bg-blue-50',  border: 'border-blue-200' },
  { type: 'audio',    icon: Music,    color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
  { type: 'video',    icon: Video,    color: 'text-pink-500',   bg: 'bg-pink-50',  border: 'border-pink-200' },
];

export default function FileUploadZone({ onFileSelected, onError, disabled = false }) {
  const [dragOver, setDragOver] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError]       = useState('');
  const inputRef = useRef(null);

  function handleFile(file) {
    setError('');
    const sourceType = detectType(file);
    if (!sourceType) {
      const msg = 'Unsupported file type. Upload a PDF, DOCX, audio, or video file.';
      setError(msg);
      onError?.(msg);
      return;
    }
    const limit = LIMITS[sourceType];
    if (file.size > limit.maxBytes) {
      const msg = `File too large. ${sourceType === 'document' ? 'Documents' : sourceType === 'audio' ? 'Audio files' : 'Video files'} must be under ${formatBytes(limit.maxBytes)}.`;
      setError(msg);
      onError?.(msg);
      return;
    }
    setSelected({ file, sourceType });
    onFileSelected?.(file, sourceType);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleInputChange(e) {
    const file = e.target.files[0];
    if (file) handleFile(file);
    e.target.value = '';
  }

  function clearFile() {
    setSelected(null);
    setError('');
    onFileSelected?.(null, null);
  }

  if (selected) {
    const meta = SOURCE_META.find(m => m.type === selected.sourceType);
    const Icon = meta.icon;
    return (
      <div className={`rounded-xl border-2 ${meta.border} ${meta.bg} p-4 flex items-center gap-4`}>
        <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
          <Icon size={20} className={meta.color} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-navy truncate">{selected.file.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{formatBytes(selected.file.size)}</p>
        </div>
        <Badge text={selected.sourceType === 'document' ? 'Document' : selected.sourceType === 'audio' ? 'Audio' : 'Video'} type="status" size="xs" />
        <CheckCircle size={18} className="text-green-500 flex-shrink-0" aria-hidden="true" />
        {!disabled && (
          <button
            type="button"
            onClick={clearFile}
            aria-label="Remove file"
            className="p-1 rounded-lg hover:bg-white/60 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={e => { e.preventDefault(); if (!disabled) setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed transition-all p-6 text-center ${
          disabled ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
          : dragOver ? 'border-teal bg-teal/5 scale-[1.01]'
          : 'border-lgray-200 bg-white hover:border-teal/50 hover:bg-teal/5 cursor-pointer'
        }`}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload source file"
        onKeyDown={e => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) inputRef.current?.click(); }}
      >
        <UploadCloud size={32} className={`mx-auto mb-2 ${dragOver ? 'text-teal' : 'text-gray-400'}`} aria-hidden="true" />
        <p className="text-sm font-medium text-navy">Drop your file here or <span className="text-teal underline underline-offset-2">browse</span></p>
        <p className="text-xs text-gray-400 mt-1">Supports PDF, DOCX, MP3, WAV, MP4, MOV</p>
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept=".pdf,.doc,.docx,audio/*,video/*"
          onChange={handleInputChange}
          disabled={disabled}
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {/* File type info strips */}
      <div className="grid grid-cols-3 gap-2">
        {SOURCE_META.map(({ type, icon: Icon, color, bg, border }) => (
          <div key={type} className={`rounded-lg border ${border} ${bg} px-3 py-2 text-center`}>
            <Icon size={16} className={`mx-auto mb-1 ${color}`} aria-hidden="true" />
            <p className="text-xs text-gray-500 leading-snug">{LIMITS[type].label}</p>
          </div>
        ))}
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-600 flex items-center gap-1.5">
          <X size={12} className="flex-shrink-0" aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  );
}
