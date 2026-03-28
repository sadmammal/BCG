import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DiaryEntry } from '../hooks/useBitacora';

const priceSymbol = (range: string) => {
  if (range === 'Low') return '$';
  if (range === 'Medium') return '$$';
  if (range === 'Medium-High') return '$$$';
  return '$$$$';
};

interface SortableRestaurantItemProps {
  id: string;
  restaurant: any;
  index: number;
  onClick: () => void;
  diaryEntry?: DiaryEntry | null;
}

export function SortableRestaurantItem({ id, restaurant, index, onClick, diaryEntry }: SortableRestaurantItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const dragging = !!transform;
  const stars = diaryEntry?.rating ?? 0;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        borderBottom: '1px solid #c6c6c6',
        borderTop: index === 0 ? '1px solid #c6c6c6' : 'none',
        backgroundColor: dragging ? '#f2f2f2' : '#fff',
        touchAction: 'none',
        position: 'relative',
        zIndex: dragging ? 99 : 1,
      }}
      {...attributes}
    >
      <div style={{ display: 'flex', alignItems: 'stretch' }}>

        {/* Drag handle */}
        <div
          {...listeners}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 16px',
            cursor: 'grab',
            borderRight: '1px solid #e8e8e8',
            flexShrink: 0,
          }}
          className="active:cursor-grabbing"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c6c6c6" strokeWidth="2.5">
            <line x1="4" y1="8" x2="20" y2="8" /><line x1="4" y1="16" x2="20" y2="16" />
          </svg>
        </div>

        {/* Rank number */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px 0 14px', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: '1.1rem', color: '#e2e2e2', letterSpacing: '-0.04em', lineHeight: 1, userSelect: 'none' }}>
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Content — tappable */}
        <div
          onClick={onClick}
          style={{ flexGrow: 1, padding: '20px 20px 20px 0', cursor: 'pointer' }}
          className="hover:opacity-70 active:opacity-50 transition-opacity"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.04em', textTransform: 'uppercase', color: '#1b1b1b', lineHeight: 1.05, marginBottom: '4px' }}>
                {restaurant.name}
              </h3>
              <p style={{ fontFamily: 'Noto Serif, serif', fontStyle: 'italic', fontSize: '0.8rem', color: '#5f5e5e' }}>
                {restaurant.category.join(' • ')}
              </p>
            </div>
            <span style={{ color: '#1b1b1b', fontSize: '1rem', flexShrink: 0, marginLeft: '12px' }}>↗</span>
          </div>

          {/* Star rating + vibe row */}
          {diaryEntry && (diaryEntry.rating || diaryEntry.vibe) && (
            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {stars > 0 && (
                <span style={{ fontSize: '0.75rem', letterSpacing: '1px', color: '#1b1b1b' }}>
                  {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
                </span>
              )}
              {diaryEntry.vibe && (
                <span style={{ fontFamily: 'Noto Serif, serif', fontStyle: 'italic', fontSize: '0.75rem', color: '#5f5e5e' }}>
                  "{diaryEntry.vibe}"
                </span>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e8e8e8', paddingTop: '10px' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#999' }}>
              {restaurant.address}
            </span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 700, color: '#1b1b1b' }}>
              {priceSymbol(restaurant.price_range)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
