function Skeleton({ className = '', variant = 'rect', width, height, style }) {
  const base = 'skeleton rounded';
  const variants = {
    rect:   'rounded-lg',
    text:   'rounded h-4',
    circle: 'rounded-full',
    card:   'rounded-2xl',
  };
  return (
    <div
      aria-hidden="true"
      className={`${base} ${variants[variant] ?? variants.rect} ${className}`}
      style={{ width, height, ...style }}
    />
  );
}

export function SkeletonCard({ rows = 3 }) {
  return (
    <div className="bg-white rounded-2xl border border-lgray-100 p-5 space-y-3" aria-hidden="true">
      <Skeleton variant="text" className="w-1/3 h-4" />
      <Skeleton variant="text" className="w-full h-6" />
      {Array.from({ length: rows - 2 }, (_, i) => (
        <Skeleton key={i} variant="text" className="w-full h-3" />
      ))}
    </div>
  );
}

export function SkeletonRow({ cols = 5 }) {
  return (
    <tr aria-hidden="true">
      {Array.from({ length: cols }, (_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton variant="text" className={`h-4 ${i === 0 ? 'w-32' : 'w-20'}`} />
        </td>
      ))}
    </tr>
  );
}

export default Skeleton;
