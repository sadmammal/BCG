import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import restaurants from '../data/restaurant.json';

import { useAppStore } from '../store/useAppStore';

const Map = ({ 
  onSelectMarker,
  getDiaryEntry,
}: { 
  onSelectMarker: (id: string) => void;
  getDiaryEntry?: (id: string) => { rating?: number } | null;
}) => {
  const selectedId = useAppStore(state => state.selectedCardId);
  const activeFilter = useAppStore(state => state.activeFilter);
  const starFilter = useAppStore(state => state.starFilter);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [id: string]: maplibregl.Marker }>({});

  useEffect(() => {
    if (!mapContainer.current) return;
    if (mapInstance.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [-66.9036, 10.4806],
      zoom: 12,
      attributionControl: false,
    });

    mapInstance.current = map;

    map.on('load', () => {
      map.resize();

      restaurants.forEach((restaurant) => {
        // Custom marker element — architectural label style from the prototype
        const el = document.createElement('div');
        el.style.cssText = `
          cursor: pointer;
        `;
        el.dataset.id = restaurant.id;
        
        const inner = document.createElement('div');
        inner.className = 'marker-inner';
        inner.style.cssText = `
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.2s;
        `;
        el.dataset.id = restaurant.id;

        const label = document.createElement('div');
        label.textContent = restaurant.name.toUpperCase();
        label.style.cssText = `
          background: #000;
          color: #e2e2e2;
          padding: 5px 10px;
          font-family: Inter, sans-serif;
          font-weight: 900;
          font-size: 9px;
          letter-spacing: 0.15em;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;

        const pin = document.createElement('div');
        pin.style.cssText = `
          width: 1px;
          height: 20px;
          background: #000;
          margin: 0 auto;
        `;

        inner.appendChild(label);
        inner.appendChild(pin);
        el.appendChild(inner);

        el.addEventListener('click', () => {
          onSelectMarker(restaurant.id);
          // Lift the clicked marker
          inner.style.transform = 'translateY(-4px)';
          setTimeout(() => { if (selectedId !== restaurant.id) inner.style.transform = ''; }, 300);
        });

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([restaurant.coordinates.lng, restaurant.coordinates.lat])
          .addTo(map);

        markersRef.current[restaurant.id] = marker;
      });
    });

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update marker highlight when selectedId changes
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      const inner = el.querySelector('.marker-inner') as HTMLElement;
      if (!inner) return;
      const label = inner.querySelector('div') as HTMLElement;
      if (!label) return;
      if (id === selectedId) {
        label.style.background = '#000';
        label.style.color = '#fff';
        inner.style.transform = 'translateY(-4px)';
      } else {
        label.style.background = selectedId ? '#5e5e5e' : '#000';
        label.style.color = '#e2e2e2';
        inner.style.transform = '';
      }
    });
  }, [selectedId]);

  // Update marker visibility when activeFilter or starFilter changes
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const restaurant = restaurants.find(r => r.id === id);
      if (!restaurant) return;

      let isVisible = true;

      // Category filter
      if (activeFilter !== 'Todos') {
        isVisible = restaurant.category.includes(activeFilter);
      }

      // Star filter — show restaurants rated >= starFilter (">3★" = 4+, ">4★" = 5)
      if (isVisible && starFilter > 0) {
        const entry = getDiaryEntry ? getDiaryEntry(id) : null;
        isVisible = (entry?.rating ?? 0) >= starFilter;
      }

      const el = marker.getElement();
      el.style.display = isVisible ? 'flex' : 'none';
    });
  }, [activeFilter, starFilter, getDiaryEntry]);

  // Fly to selected marker
  useEffect(() => {
    if (selectedId && mapInstance.current) {
      const restaurant = restaurants.find(r => r.id === selectedId);
      if (restaurant) {
        mapInstance.current.flyTo({
          center: [restaurant.coordinates.lng, restaurant.coordinates.lat],
          zoom: 16,
          speed: 1.5,
          curve: 1.2
        });
      }
    }
  }, [selectedId]);

  return (
    <div className="absolute inset-0 grayscale-img opacity-60 z-0">
      <div
        ref={mapContainer}
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default React.memo(Map);
