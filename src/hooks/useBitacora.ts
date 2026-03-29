// src/hooks/useBitacora.ts
import { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';

export interface DiaryEntry {
  note: string;
  vibe: string;
  visited_on: string; // ISO date string e.g. "2026-03-27"
  rating?: number; // 1–5
}

export const useBitacora = () => {
  const [rincones, setRincones] = useState<string[]>([]);
  const [wantToGo, setWantToGo] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [diary, setDiary] = useState<Record<string, DiaryEntry>>({});
  const [isReady, setIsReady] = useState(false);

  // Load from phone storage on start
  useEffect(() => {
    const loadData = async () => {
      const [{ value: favs }, { value: wtg }, { value: diaryData }, { value: favsList }] = await Promise.all([
        Preferences.get({ key: 'user_bitacora_v1' }),
        Preferences.get({ key: 'user_wanttogo_v1' }),
        Preferences.get({ key: 'user_diary_v1' }),
        Preferences.get({ key: 'user_favorites_v1' }),
      ]);
      if (favs) setRincones(JSON.parse(favs));
      if (wtg) setWantToGo(JSON.parse(wtg));
      if (favsList) setFavorites(JSON.parse(favsList));
      if (diaryData) setDiary(JSON.parse(diaryData));
      setIsReady(true);
    };
    loadData();
  }, []);

  const toggleRincon = async (id: string) => {
    const updated = rincones.includes(id)
      ? rincones.filter(fav => fav !== id)
      : [...rincones, id];
    setRincones(updated);
    await Preferences.set({ key: 'user_bitacora_v1', value: JSON.stringify(updated) });
  };

  const toggleWantToGo = async (id: string) => {
    const updated = wantToGo.includes(id)
      ? wantToGo.filter(w => w !== id)
      : [...wantToGo, id];
    setWantToGo(updated);
    await Preferences.set({ key: 'user_wanttogo_v1', value: JSON.stringify(updated) });
  };

  const toggleFavorite = async (id: string) => {
    const updated = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    await Preferences.set({ key: 'user_favorites_v1', value: JSON.stringify(updated) });
  };

  const reorderRincones = async (newOrder: string[]) => {
    setRincones(newOrder);
    await Preferences.set({ key: 'user_bitacora_v1', value: JSON.stringify(newOrder) });
  };

  const setDiaryEntry = async (id: string, entry: DiaryEntry) => {
    const updated = { ...diary, [id]: entry };
    setDiary(updated);
    await Preferences.set({ key: 'user_diary_v1', value: JSON.stringify(updated) });
  };

  const getDiaryEntry = (id: string): DiaryEntry | null => {
    return diary[id] ?? null;
  };

  const clearData = async () => {
    setRincones([]);
    setWantToGo([]);
    setFavorites([]);
    setDiary({});
    await Promise.all([
      Preferences.remove({ key: 'user_bitacora_v1' }),
      Preferences.remove({ key: 'user_wanttogo_v1' }),
      Preferences.remove({ key: 'user_diary_v1' }),
      Preferences.remove({ key: 'user_favorites_v1' }),
    ]);
  };

  const exportData = (restaurants: any[]) => {
    const lines: string[] = ['BITÁCORA GASTRONÓMICA — CARACAS', '================================', ''];

    if (rincones.length > 0) {
      lines.push('MIS RINCONES');
      lines.push('------------');
      rincones.forEach((id, i) => {
        const r = restaurants.find(res => res.id === id);
        if (!r) return;
        const entry = diary[id];
        lines.push(`${i + 1}. ${r.name} — ${r.address}`);
        if (entry) {
          if (entry.rating) lines.push(`   Rating: ${'★'.repeat(entry.rating)}${'☆'.repeat(5 - entry.rating)}`);
          if (entry.visited_on) lines.push(`   Fecha: ${entry.visited_on}`);
          if (entry.vibe) lines.push(`   Vibe: ${entry.vibe}`);
          if (entry.note) lines.push(`   Nota: ${entry.note}`);
        }
        lines.push('');
      });
    }

    if (wantToGo.length > 0) {
      lines.push('QUIERO IR');
      lines.push('---------');
      wantToGo.forEach((id, i) => {
        const r = restaurants.find(res => res.id === id);
        if (r) lines.push(`${i + 1}. ${r.name} — ${r.address}`);
      });
    }

    const text = lines.join('\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    return text;
  };

  return {
    rincones,
    wantToGo,
    favorites,
    diary,
    toggleRincon,
    toggleWantToGo,
    toggleFavorite,
    reorderRincones,
    setDiaryEntry,
    getDiaryEntry,
    clearData,
    exportData,
    isReady,
  };
};