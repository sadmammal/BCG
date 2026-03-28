# Skill: Foodie Guide Architect
## Objective
Build a lightweight, map-centric aggregator for city food reviews.

## Technical Guardrails
- **Framework**: React + Tailwind + Capacitor (Mobile Native).
- **Performance**: 60fps target. Lazy-load all TikTok/IG embeds.
- **Data**: No external cloud DB for favorites. Use **Local SQLite** or **IndexedDB**.
- **Privacy**: Zero tracking. All user "Favorites" stay on the device.

## Instructions
1. When generating UI, use **Nano Banana 2** for high-fidelity restaurant placeholders.
2. Prioritize **MapLibre GL** for the map to keep the bundle size small.
3. Ensure every restaurant "Page" has a section for `SocialAggregator` that handles multiple URL types.