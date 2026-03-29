import { create } from 'zustand';

export type View = 'explorar' | 'ranking' | 'wantToGo' | 'favorites';

interface AppState {
  // Navigation & Overlays
  view: View;
  isSearchOpen: boolean;
  isMenuOpen: boolean;
  isFilterCollapsed: boolean;
  
  // Selection
  selectedRestaurant: any | null; // using any for now to match App.tsx
  selectedCardId: string | null;
  
  // Filters
  activeFilter: string;
  starFilter: number;
  
  // Actions
  setView: (view: View) => void;
  setSearchOpen: (isOpen: boolean) => void;
  setMenuOpen: (isOpen: boolean) => void;
  setFilterCollapsed: (isCollapsed: boolean) => void;
  setSelectedRestaurant: (restaurant: any | null) => void;
  setSelectedCardId: (id: string | null) => void;
  setActiveFilter: (filter: string) => void;
  setStarFilter: (filter: number) => void;
  resetFilters: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial State
  view: 'explorar',
  isSearchOpen: false,
  isMenuOpen: false,
  isFilterCollapsed: true,
  selectedRestaurant: null,
  selectedCardId: null,
  activeFilter: 'Todos',
  starFilter: 0,
  
  // Actions
  setView: (view) => set({ view, isSearchOpen: false }), // Close search on nav
  setSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
  setMenuOpen: (isMenuOpen) => set({ isMenuOpen }),
  setFilterCollapsed: (isFilterCollapsed) => set({ isFilterCollapsed }),
  setSelectedRestaurant: (selectedRestaurant) => set({ selectedRestaurant }),
  setSelectedCardId: (selectedCardId) => set({ selectedCardId }),
  setActiveFilter: (activeFilter) => set({ activeFilter, selectedCardId: null }),
  setStarFilter: (starFilter) => set({ starFilter, selectedCardId: null }),
  resetFilters: () => set({ activeFilter: 'Todos', starFilter: 0, selectedCardId: null }),
}));
