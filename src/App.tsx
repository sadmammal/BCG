import { useRef } from 'react'
import { Map as MapIcon, Clock, ListOrdered, Heart } from 'lucide-react'
import { useAppStore } from './store/useAppStore'
import restaurants from './data/restaurant.json'
import Map from './components/Map'
import DetailSheet from './components/DetailSheet'
import SearchOverlay from './components/SearchOverlay'
import MenuSheet from './components/MenuSheet'
import { useBitacora } from './hooks/useBitacora'
import { SortableRestaurantItem } from './components/SortableRestaurantItem'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

const priceSymbol = (range: string) => {
  if (range === 'Low') return '$'
  if (range === 'Medium') return '$$'
  if (range === 'Medium-High') return '$$$'
  return '$$$$'
}

function App() {
  const {
    view,
    isSearchOpen,
    isMenuOpen,
    isFilterCollapsed,
    selectedRestaurant,
    selectedCardId,
    activeFilter,
    starFilter,
    setView,
    setSearchOpen: setIsSearchOpen,
    setMenuOpen: setIsMenuOpen,
    setFilterCollapsed: setIsFilterCollapsed,
    setSelectedRestaurant,
    setSelectedCardId,
    setActiveFilter,
    setStarFilter,
  } = useAppStore();

  const {
    rincones,
    wantToGo,
    favorites,
    toggleRincon,
    toggleWantToGo,
    toggleFavorite,
    reorderRincones,
    setDiaryEntry,
    getDiaryEntry,
    clearData,
    exportData,
    isReady
  } = useBitacora()

  const handleYaFui = (id: string) => {
    // Add to ranking
    if (!rincones.includes(id)) {
      toggleRincon(id)
    }
    // Remove from wantToGo if it's there
    if (wantToGo.includes(id)) {
      toggleWantToGo(id)
    }
  }
  const carouselRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<{ [id: string]: HTMLDivElement | null }>({})

  const savedRestaurants = rincones.map(id => restaurants.find(r => r.id === id)).filter(Boolean) as any[]
  const wantToGoRestaurants = wantToGo.map(id => restaurants.find(r => r.id === id)).filter(Boolean) as any[]
  const favoriteRestaurants = favorites.map(id => restaurants.find(r => r.id === id)).filter(Boolean) as any[]

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = rincones.indexOf(active.id);
      const newIndex = rincones.indexOf(over.id);
      const newOrder = arrayMove(rincones, oldIndex, newIndex);
      reorderRincones(newOrder);
    }
  };

  // Marker clicked → scroll carousel to matching card + highlight it
  const handleSelectMarker = (id: string) => {
    setSelectedCardId(id)
    const card = cardRefs.current[id]
    if (card && carouselRef.current) {
      const carousel = carouselRef.current
      const cardLeft = card.offsetLeft
      const carouselWidth = carousel.offsetWidth
      const cardWidth = card.offsetWidth
      carousel.scrollTo({ left: cardLeft - (carouselWidth - cardWidth) / 2, behavior: 'smooth' })
    }
  }

  // Handle selection from search
  const handleSearchSelect = (id: string) => {
    setView('explorar')
    setSelectedCardId(id)
  }

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-[#f9f9f9]" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ── TopAppBar ─────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 w-full z-50 bg-white border-b border-[#c6c6c6]"
        style={{ borderBottom: '1px solid #c6c6c6' }}
      >
        <div className="flex justify-between items-center w-full px-6 py-4">
          {/* Menu icon */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="hover:opacity-60 transition-opacity active:opacity-40"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          {/* Title */}
          <div style={{ textAlign: 'center' }}>
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 900,
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#1b1b1b',
              lineHeight: 1.2,
              display: 'block',
            }}>
              Bitácora<br/>Gastronómica
            </span>
          </div>
          {/* Search icon */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="hover:opacity-60 transition-opacity active:opacity-40"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── EXPLORAR view ─────────────────────────────────────────────────── */}
      {view === 'explorar' && (
        <main className="relative min-h-[100dvh] pt-[57px] pb-20">

          {/* Full-bleed map background */}
          <div className="absolute inset-0 top-[57px] bottom-20 z-0">
            <Map 
              onSelectMarker={handleSelectMarker}
              getDiaryEntry={getDiaryEntry}
            />
          </div>

          {/* ── Filter Pills (Map Overlays) ────────────────────── */}
          <div className="absolute top-[73px] left-0 w-full z-10 pointer-events-none">

            <div className="flex flex-col gap-2 pointer-events-auto px-4">
              {/* Row 1: Funnel + Category Pills */}
              <div className="flex items-center gap-2">

              {/* Funnel / collapse toggle */}
              <button
                onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
                title={isFilterCollapsed ? 'Mostrar filtros' : 'Ocultar filtros'}
                style={{
                  flexShrink: 0,
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isFilterCollapsed ? '#1b1b1b' : 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(0,0,0,0.10)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.14)',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                  borderRadius: '0px',
                }}
                className="active:scale-90"
              >
                {/* Filter funnel icon */}
                <svg
                  width="15" height="15" viewBox="0 0 24 24"
                  fill={isFilterCollapsed ? 'white' : 'none'}
                  stroke={isFilterCollapsed ? 'white' : '#1b1b1b'}
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </button>

              {/* Scrollable pills — slide in/out */}
              <div
                className="overflow-x-auto flex items-center gap-2 py-1"
                style={{
                  scrollbarWidth: 'none',
                  WebkitOverflowScrolling: 'touch',
                  maxWidth: isFilterCollapsed ? '0px' : '100%',
                  opacity: isFilterCollapsed ? 0 : 1,
                  overflow: isFilterCollapsed ? 'hidden' : 'auto',
                  transition: 'max-width 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease',
                  pointerEvents: isFilterCollapsed ? 'none' : 'auto',
                }}
              >
                {[
                  { label: 'Todos', emoji: '' },
                  { label: 'Café', emoji: '☕' },
                  { label: 'Postres', emoji: '🍮' },
                  { label: 'Pasta', emoji: '🍝' },
                  { label: 'Pizza', emoji: '🍕' },
                  { label: 'Sushi', emoji: '🍱' },
                ].map(({ label, emoji }) => {
                  const active = activeFilter === label;
                  return (
                    <button
                      key={label}
                      onClick={() => {
                        setActiveFilter(label);
                        setSelectedCardId(null);
                      }}
                      style={{
                        flexShrink: 0,
                        height: '36px',
                        paddingLeft: emoji ? '10px' : '14px',
                        paddingRight: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: active
                          ? '#1b1b1b'
                          : 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        color: active ? '#fff' : '#1b1b1b',
                        border: active ? '1px solid transparent' : '1px solid rgba(0,0,0,0.10)',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '11px',
                        fontWeight: active ? 700 : 500,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        boxShadow: active
                          ? '0 4px 16px rgba(0,0,0,0.22)'
                          : '0 2px 12px rgba(0,0,0,0.10)',
                        transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
                        borderRadius: '0px',
                      }}
                      className="active:scale-95"
                    >
                      {emoji && <span style={{ fontSize: '13px', lineHeight: 1 }}>{emoji}</span>}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 2: Star threshold pills */}
            <div
              className="flex items-center gap-2 ml-[44px]"
              style={{
                opacity: isFilterCollapsed ? 0 : 1,
                maxHeight: isFilterCollapsed ? '0px' : '40px',
                overflow: 'hidden',
                transition: 'opacity 0.22s ease, max-height 0.28s ease',
                pointerEvents: isFilterCollapsed ? 'none' : 'auto',
              }}
            >
              {([{ label: '>3 ★', value: 4 }, { label: '>4 ★', value: 5 }] as { label: string; value: number }[]).map(({ label, value }) => {
                const active = starFilter === value;
                return (
                  <button
                    key={`star-${value}`}
                    onClick={() => {
                      setStarFilter(active ? 0 : value);
                      setSelectedCardId(null);
                    }}
                    title={`Filtrar: rating ${label}`}
                    style={{
                      flexShrink: 0,
                      height: '32px',
                      padding: '0 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: active
                        ? '#ff4040'
                        : '#1b1b1b',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      color: '#fff',
                      border: '1px solid transparent',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      cursor: 'pointer',
                      boxShadow: active
                        ? '0 4px 16px rgba(255,64,64,0.3)'
                        : '0 2px 12px rgba(0,0,0,0.10)',
                      transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
                      borderRadius: '0px',
                      whiteSpace: 'nowrap',
                    }}
                    className="active:scale-95"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

          {/* ── Single Floating Card Popup ────────────────────────────── */}
          {selectedCardId && (
            <div className="absolute bottom-24 left-0 w-full z-20 px-6 pointer-events-none flex justify-center">
              {/* Tap map to clear selection */}
              <div 
                className="fixed inset-0 pointer-events-auto"
                onClick={() => setSelectedCardId(null)}
              />
              
              {/* The Card */}
              <div
                className="relative bg-white overflow-hidden pointer-events-auto shadow-2xl transition-transform"
                style={{ width: 'min(90vw, 380px)', cursor: 'pointer', animation: 'slideUp 0.3s ease-out' }}
                onClick={() => {
                  const r = restaurants.find(res => res.id === selectedCardId)
                  if (r) setSelectedRestaurant(r)
                }}
              >
                {(() => {
                  const r = restaurants.find(res => res.id === selectedCardId)
                  if (!r) return null;
                  return (
                    <>
                      {/* Image area */}
                      <div style={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative' }}>
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#3b3b3b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span style={{ fontFamily: 'Noto Serif, serif', fontStyle: 'italic', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>
                            {r.category[0]}
                          </span>
                        </div>
                      </div>

                      {/* Card text body */}
                      <div style={{ padding: '20px 20px 16px', backgroundColor: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                          <div>
                            <h3 style={{
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 900,
                              fontSize: '1.3rem',
                              letterSpacing: '-0.04em',
                              textTransform: 'uppercase',
                              color: '#1b1b1b',
                              marginBottom: '4px',
                              lineHeight: 1,
                            }}>
                              {r.name}
                            </h3>
                            <p style={{ fontFamily: 'Noto Serif, serif', fontStyle: 'italic', fontSize: '0.8rem', color: '#5f5e5e' }}>
                              {r.description}
                            </p>
                          </div>
                          <span style={{ color: '#1b1b1b', fontSize: '1rem', marginLeft: '12px', flexShrink: 0 }}>↗</span>
                        </div>

                        <div style={{ height: '1px', backgroundColor: '#e2e2e2', marginBottom: '12px' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '9px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.18em',
                            color: '#777',
                          }}>
                            {r.address}
                          </span>
                          <span style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '9px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.18em',
                            fontWeight: 700,
                            color: '#1b1b1b',
                          }}>
                            {priceSymbol(r.price_range)}
                          </span>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          )}

        </main>
      )}

      {/* ── RANKING view ─────────────────────────────────────────────── */}
      {view === 'ranking' && (
        <main className="pt-[57px] pb-24 min-h-[100dvh]">
          {!isReady ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : savedRestaurants.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
              <div style={{ border: '1px solid #c6c6c6', padding: '60px 40px', backgroundColor: '#fff', maxWidth: '320px', margin: '40px auto' }}>
                <p style={{ fontFamily: 'Noto Serif, serif', fontStyle: 'italic', fontSize: '0.85rem', color: '#5f5e5e', lineHeight: 1.7 }}>
                  Aún no hay rincones en tu bitácora personal. Explora el mapa y guarda tus favoritos para crear tu propio ranking.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>

              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext 
                  items={rincones}
                  strategy={verticalListSortingStrategy}
                >
                  {savedRestaurants.map((r) => (
                    <SortableRestaurantItem
                      key={r.id}
                      id={r.id}
                      restaurant={r}
                      index={rincones.indexOf(r.id)}
                      onClick={() => setSelectedRestaurant(r)}
                      diaryEntry={getDiaryEntry(r.id)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          )}
        </main>
      )}

      {/* ── WANT TO GO view ────────────────────────────────────────────────── */}
      {view === 'wantToGo' && (
        <main className="pt-[57px] pb-24 min-h-[100dvh]">
          {!isReady ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : wantToGoRestaurants.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
              <div style={{ border: '1px solid #c6c6c6', padding: '60px 40px', backgroundColor: '#fff', maxWidth: '320px', margin: '40px auto' }}>
                <p style={{ fontFamily: 'Noto Serif, serif', fontStyle: 'italic', fontSize: '0.85rem', color: '#5f5e5e', lineHeight: 1.7 }}>
                  Aún no tienes lugares marcados para visitar. Explora el mapa y añade tus antojos.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              {wantToGoRestaurants.map((r, i) => (
                <div
                  key={r.id}
                  style={{
                    borderBottom: '1px solid #c6c6c6',
                    borderTop: i === 0 ? '1px solid #c6c6c6' : 'none',
                    padding: '28px 24px',
                    backgroundColor: '#fff',
                  }}
                >
                  <div
                    onClick={() => setSelectedRestaurant(r)}
                    style={{ cursor: 'pointer' }}
                    className="hover:opacity-70 active:opacity-50 transition-opacity"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.04em', textTransform: 'uppercase', color: '#1b1b1b', marginBottom: '5px', lineHeight: 1 }}>
                          {r.name}
                        </h3>
                        <p style={{ fontFamily: 'Noto Serif, serif', fontStyle: 'italic', fontSize: '0.8rem', color: '#5f5e5e' }}>
                          {r.category.join(' • ')}
                        </p>
                      </div>
                      <span style={{ fontSize: '1.1rem', color: '#1b1b1b', flexShrink: 0, marginLeft: '12px' }}>↗</span>
                    </div>
                    <div style={{ height: '1px', backgroundColor: '#c6c6c6', marginBottom: '14px' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#777' }}>
                        {r.address}
                      </span>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>
                        {priceSymbol(r.price_range)}
                      </span>
                    </div>
                  </div>

                  {/* Fui button */}
                  <button
                    onClick={async () => {
                      await toggleWantToGo(r.id);  // remove from wantToGo
                      await toggleRincon(r.id);     // add to rincones
                      setSelectedRestaurant(r);     // open detail sheet
                    }}
                    style={{
                      marginTop: '16px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '9px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      color: '#fff',
                      backgroundColor: '#1b1b1b',
                      border: 'none',
                      padding: '10px 18px',
                      cursor: 'pointer',
                    }}
                    className="active:opacity-60 transition-opacity"
                  >
                    Fui ✓
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* ── FAVORITOS view ─────────────────────────────────────────────────── */}
      {view === 'favorites' && (
        <main className="pt-[57px] pb-24 min-h-[100dvh]">
          {!isReady ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : favoriteRestaurants.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
              <div style={{ border: '1px solid #c6c6c6', padding: '60px 40px', backgroundColor: '#fff', maxWidth: '320px', margin: '40px auto' }}>
                <p style={{ fontFamily: 'Noto Serif, serif', fontStyle: 'italic', fontSize: '0.85rem', color: '#5f5e5e', lineHeight: 1.7 }}>
                  Tu muro de favoritos está vacío. Marca restaurantes con el corazón para verlos aquí.
                </p>
              </div>
            </div>
          ) : (
            <div className="px-5 mt-6 mb-8">
              <div style={{ paddingBottom: '20px', borderBottom: '2px solid #000', marginBottom: '24px' }}>
                <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1 }}>
                  Favoritos
                </h2>
                <p style={{ fontFamily: 'Noto Serif, serif', fontStyle: 'italic', fontSize: '0.9rem', color: '#777', marginTop: '8px' }}>
                  El salón de la fama.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {favoriteRestaurants.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setSelectedCardId(r.id)
                      setSelectedRestaurant(r)
                    }}
                    style={{
                      backgroundColor: '#1b1b1b',
                      color: '#fff',
                      padding: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '140px',
                      position: 'relative'
                    }}
                    className="active:scale-[0.98] transition-transform"
                  >
                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                      <Heart size={14} fill="#ff4040" color="#ff4040" style={{ opacity: 0.9 }} />
                    </div>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                      {r.category[0]}
                    </p>
                    <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em', marginTop: '16px' }}>
                      {r.name}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      )}

      {/* ── DetailSheet ───────────────────────────────────────────────────── */}
      <DetailSheet
        restaurant={selectedRestaurant}
        onClose={() => {
          setSelectedRestaurant(null)
          setSelectedCardId(null)
        }}
        isFavorite={selectedRestaurant ? favorites.includes(selectedRestaurant.id) : false}
        onToggleFavorite={toggleFavorite}
        isLogged={selectedRestaurant ? rincones.includes(selectedRestaurant.id) : false}
        onLogVisit={handleYaFui}
        isWantToGo={selectedRestaurant ? wantToGo.includes(selectedRestaurant.id) : false}
        onToggleWantToGo={toggleWantToGo}
        diaryEntry={selectedRestaurant ? getDiaryEntry(selectedRestaurant.id) : null}
        onSaveDiary={setDiaryEntry}
      />

      {/* ── Menu Sheet (Hamburger Drawer) ──────────────────────────────────── */}
      <MenuSheet 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onClearData={clearData}
        onExportData={() => exportData(restaurants)}
      />

      {/* ── Search Overlay ────────────────────────────────────────────────── */}
      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectRestaurant={handleSearchSelect}
      />

      {/* ── Bottom Navigation Bar ─────────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 w-full z-50 bg-white flex justify-around items-center"
        style={{ height: '72px', borderTop: '3px solid #e2e2e2' }}
      >
        {/* EXPLORAR */}
        <button
          onClick={() => setView('explorar')}
          className="flex flex-col items-center justify-center h-full flex-1 transition-opacity active:scale-95"
          style={{ color: view === 'explorar' ? '#000' : '#c6c6c6', borderTop: view === 'explorar' ? '3px solid #000' : '3px solid transparent', marginTop: '-3px' }}
        >
          <MapIcon size={22} color={view === 'explorar' ? '#000' : '#c6c6c6'} strokeWidth={1.5} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, marginTop: '4px' }}>Explorar</span>
        </button>

        {/* POR IR */}
        <button
          onClick={() => setView('wantToGo')}
          className="flex flex-col items-center justify-center h-full flex-1 transition-opacity active:scale-95"
          style={{ color: view === 'wantToGo' ? '#000' : '#c6c6c6', borderTop: view === 'wantToGo' ? '3px solid #000' : '3px solid transparent', marginTop: '-3px' }}
        >
          <Clock size={22} color={view === 'wantToGo' ? '#000' : '#c6c6c6'} strokeWidth={1.5} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, marginTop: '4px' }}>Por ir</span>
        </button>

        {/* RANKING */}
        <button
          onClick={() => setView('ranking')}
          className="flex flex-col items-center justify-center h-full flex-1 transition-opacity active:scale-95"
          style={{ color: view === 'ranking' ? '#000' : '#c6c6c6', borderTop: view === 'ranking' ? '3px solid #000' : '3px solid transparent', marginTop: '-3px' }}
        >
          <ListOrdered size={22} color={view === 'ranking' ? '#000' : '#c6c6c6'} strokeWidth={1.5} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, marginTop: '4px' }}>Ranking</span>
        </button>

        {/* FAVORITOS */}
        <button
          onClick={() => setView('favorites')}
          className="flex flex-col items-center justify-center h-full flex-1 transition-opacity active:scale-95"
          style={{ color: view === 'favorites' ? '#000' : '#c6c6c6', borderTop: view === 'favorites' ? '3px solid #000' : '3px solid transparent', marginTop: '-3px' }}
        >
          <Heart size={22} color={view === 'favorites' ? '#000' : '#c6c6c6'} strokeWidth={1.5} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, marginTop: '4px' }}>Favoritos</span>
        </button>
      </nav>
    </div>
  )
}

export default App
