# Blueprint: Privacy-First Favorites (Local Bitácora)

## Objective
Enable users to save restaurants to a "Favorites" list without an internet connection or an account.

## Technical Requirements
- **Storage Engine**: `@capacitor/preferences` (High-performance key-value storage).
- **Key Name**: `user_bitacora_favorites`.
- **Data Type**: Array of Strings (Restaurant IDs).

## Logic Flow for Agent
1. **On App Launch**: Load the array of IDs from local storage into a global `FavoritesContext`.
2. **On Toggle**: 
   - If ID exists in array -> Remove it (Unfavorite).
   - If ID does not exist -> Push it (Favorite).
3. **Persistence**: Every time the array changes, silently sync it back to `Capacitor Preferences`.
4. **UI Update**: Any restaurant card with a matching ID should instantly show the 'Filled Heart' state.

## Empty State UX
- If the "Mis Rincones" tab is empty, display: 
  *"Tu bitácora está en blanco. Camina la ciudad y guarda tus hallazgos."*