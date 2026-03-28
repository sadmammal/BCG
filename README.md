📍 Proyecto: Bitácora Gastronómica (Caracas)
A Federated Foodie Guide for the Urban Flâneur
📖 The Vision
A lightweight, high-performance Android aggregator that transforms social media chaos (TikTok, IG, Blogs) into a curated, map-based narrative of Caracas. This is not just a directory; it is a chronicle of the city's flavors.

🏗️ Technical stack (The "Bird's-Eye" Architecture)
Core: React + Vite + Tailwind CSS.

Bridge: Capacitor (Targeting Android).

Map Engine: MapLibre GL (Vector-based, low overhead).

Database: Local-First (Capacitor Preferences). No cloud, no logins, 100% privacy.

Content Strategy: Native Embeds for TikTok & Instagram to minimize data scraping and maximize performance on mid-range devices.

🎨 Identity & Voice: "El Cronista"
The UI must speak with the voice of a Caracas literary flâneur.

No generic buttons: Use "Explorar" instead of "Search," "Mis Rincones" instead of "Favorites."

Language: Spanish (Local Caracas register).

Vibe: Minimalist, text-focused, but punctuated by vibrant social media media.

📂 Project Structure for Antigravity Agents
The agents must adhere to the following directory standards:

src/data/restaurants.json: The "Golden Seed" containing coordinates and social links.

.agent/skills/foodie-logic/: Custom architectural rules.

.agent/prompts/ui-voice.md: The "Cronista" personality guidelines.

src/hooks/useBitacora.ts: The privacy-first local storage logic.

🚀 Mission Milestones
Phase 1: The Canvas. Render the MapLibre map centered on Caracas (10.4806, -66.9036) with custom pins.

Phase 2: The Aggregator. Build the "Detail Sheet" that dynamically renders TikTok/IG embeds based on restaurants.json.

Phase 3: The Memory. Implement the useBitacora hook so users can save "Rincones" locally.

Phase 4: Optimization. Ensure 60fps scrolling and lazy-loading of all video content.

⚠️ Hard Constraints
Zero Overhead: The app must be under 20MB (pre-content cache).

No Backend: If it requires an API key for a database, don't build it. Use local storage.

Offline First: The map and basic info should work even when data is spotty (common in certain Caracas sectors).