import { useRef, useState } from 'react';
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { Heart, Bookmark } from "lucide-react"
import type { DiaryEntry } from '../hooks/useBitacora';

interface DetailSheetProps {
  restaurant: any;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  isWantToGo?: boolean;
  onToggleWantToGo?: (id: string) => void;
  diaryEntry?: DiaryEntry | null;
  onSaveDiary?: (id: string, entry: DiaryEntry) => void;
}

export default function DetailSheet({
  restaurant,
  onClose,
  isSaved,
  onToggleSave,
  isWantToGo,
  onToggleWantToGo,
  diaryEntry,
  onSaveDiary,
}: DetailSheetProps) {
  const cached = useRef<any>(null);
  if (restaurant) cached.current = restaurant;
  const r = restaurant || cached.current;

  const [note, setNote] = useState('');
  const [vibe, setVibe] = useState('');
  const [visitedOn, setVisitedOn] = useState('');
  const [rating, setRating] = useState(0);
  const [saved, setSaved] = useState(false);

  // Sync local form state when the sheet opens or diaryEntry changes
  const prevId = useRef<string | null>(null);
  if (r && r.id !== prevId.current) {
    prevId.current = r.id;
    setNote(diaryEntry?.note ?? '');
    setVibe(diaryEntry?.vibe ?? '');
    setVisitedOn(diaryEntry?.visited_on ?? '');
    setRating(diaryEntry?.rating ?? 0);
    setSaved(false);
  }

  if (!r) return null;

  const handleSave = () => {
    if (!onSaveDiary) return;
    onSaveDiary(r.id, { note, vibe, visited_on: visitedOn, rating });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.9rem',
    color: '#1b1b1b',
    backgroundColor: '#fff',
    border: '1px solid #c6c6c6',
    padding: '12px 14px',
    outline: 'none',
    resize: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '9px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.25em',
    color: '#777',
    display: 'block',
    marginBottom: '8px',
  };

  return (
    <Drawer open={!!restaurant} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DrawerContent
        className="outline-none"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '92dvh',
          maxHeight: '92dvh',
          borderRadius: 0,
          backgroundColor: '#f9f9f9',
          padding: 0,
        }}
      >
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', width: '100%', position: 'relative' }}>
          {r && (
            <div style={{ fontFamily: 'Inter, sans-serif' }}>

              {/* ── Hero Section ──────────────────────────────────────────── */}
              <section
                style={{
                  position: 'relative',
                  height: '280px',
                  backgroundColor: '#1b1b1b',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, #1b1b1b 0%, #3b3b3b 100%)',
                    filter: 'contrast(110%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '32px 28px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                  }}
                >
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3em',
                    color: 'rgba(255,255,255,0.55)',
                    marginBottom: '12px',
                  }}>
                    {r.category.join(' • ')}
                  </p>
                  <h1 style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 900,
                    fontSize: 'clamp(2.2rem, 8vw, 3.5rem)',
                    color: '#fff',
                    lineHeight: 0.85,
                    letterSpacing: '-0.04em',
                    textTransform: 'uppercase',
                    marginBottom: '20px',
                  }}>
                    {r.name}
                  </h1>
                  <div style={{ width: '48px', height: '3px', backgroundColor: '#fff' }} />
                </div>

                {/* Save / WantToGo controls */}
                <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                  {onToggleSave && (
                    <button
                      onClick={() => onToggleSave(r.id)}
                      style={{
                        width: '36px', height: '36px',
                        backgroundColor: isSaved ? '#fff' : 'rgba(255,255,255,0.15)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <Heart size={15} fill={isSaved ? '#000' : 'none'} color={isSaved ? '#000' : '#fff'} />
                    </button>
                  )}
                  {onToggleWantToGo && (
                    <button
                      onClick={() => onToggleWantToGo(r.id)}
                      style={{
                        width: '36px', height: '36px',
                        backgroundColor: isWantToGo ? '#fff' : 'rgba(255,255,255,0.15)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <Bookmark size={15} fill={isWantToGo ? '#000' : 'none'} color={isWantToGo ? '#000' : '#fff'} />
                    </button>
                  )}
                </div>
              </section>

              {/* ── Info ──────────────────────────────────────────────────── */}
              <section style={{ padding: '36px 28px 28px', backgroundColor: '#f9f9f9' }}>
                <blockquote style={{
                  fontFamily: 'Noto Serif, serif',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                  lineHeight: 1.75,
                  color: '#1b1b1b',
                  borderLeft: '2px solid #000',
                  paddingLeft: '20px',
                  marginBottom: '28px',
                }}>
                  "{r.description}"
                </blockquote>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  borderTop: '1px solid #c6c6c6',
                  paddingTop: '20px',
                }}>
                  <div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#777', marginBottom: '6px' }}>Dirección</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#1b1b1b', fontWeight: 500 }}>{r.address}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#777', marginBottom: '6px' }}>Precio</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#1b1b1b', fontWeight: 700 }}>{r.price_range}</p>
                  </div>
                </div>
              </section>

              {/* ── Diary Entry ───────────────────────────────────────────── */}
              <section style={{ backgroundColor: '#fff', padding: '40px 28px 60px', borderTop: '1px solid #e2e2e2' }}>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.4em',
                  color: '#1b1b1b',
                  marginBottom: '32px',
                }}>
                  Mi entrada
                </p>

                {!isSaved && (
                  <p style={{ fontFamily: 'Noto Serif, serif', fontStyle: 'italic', fontSize: '0.85rem', color: '#aaa', marginBottom: '28px', lineHeight: 1.6 }}>
                    Guarda este lugar en tus rincones para escribir tu entrada de diario.
                  </p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', opacity: isSaved ? 1 : 0.4, pointerEvents: isSaved ? 'auto' : 'none' }}>
                  {/* Rating */}
                  <div>
                    <label style={labelStyle}>Valoración</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setRating(star === rating ? 0 : star)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '2px',
                            cursor: 'pointer',
                            fontSize: '1.6rem',
                            color: star <= rating ? '#1b1b1b' : '#d0d0d0',
                            lineHeight: 1,
                            transition: 'color 0.15s',
                          }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fecha */}
                  <div>
                    <label style={labelStyle}>Fecha de visita</label>
                    <input
                      type="date"
                      value={visitedOn}
                      onChange={e => setVisitedOn(e.target.value)}
                      style={{ ...inputStyle, colorScheme: 'light' }}
                    />
                  </div>

                  {/* Vibe */}
                  <div>
                    <label style={labelStyle}>Vibe</label>
                    <input
                      type="text"
                      placeholder="e.g. Volvería con los ojos cerrados"
                      value={vibe}
                      onChange={e => setVibe(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  {/* Nota */}
                  <div>
                    <label style={labelStyle}>Nota</label>
                    <textarea
                      rows={5}
                      placeholder="Escribe lo que quieras recordar..."
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  {/* Save button */}
                  <button
                    onClick={handleSave}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '10px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      color: saved ? '#777' : '#fff',
                      backgroundColor: saved ? '#f0f0f0' : '#1b1b1b',
                      border: 'none',
                      padding: '16px 28px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s, color 0.2s',
                      alignSelf: 'flex-start',
                    }}
                  >
                    {saved ? 'Guardado ✓' : 'Guardar entrada'}
                  </button>
                </div>
              </section>

              {/* ── Black Footer ──────────────────────────────────────────── */}
              <section style={{ backgroundColor: '#000', padding: '40px 28px 80px' }}>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4em',
                  color: 'rgba(255,255,255,0.35)',
                  marginBottom: '24px',
                }}>
                  Coordenadas
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>Ubicación</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#fff' }}>{r.address}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>Categoría</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#fff' }}>{r.category.join(' · ')}</p>
                  </div>
                </div>
              </section>

            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
