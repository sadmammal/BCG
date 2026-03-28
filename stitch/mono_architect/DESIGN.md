# Design System Specification: High-End Editorial

## 1. Overview & Creative North Star: "The Architectural Monolith"
This design system is not a template; it is a digital gallery. The Creative North Star is **"The Architectural Monolith"**—a philosophy that treats the screen as a physical space defined by light, shadow, and structural mass rather than UI components. 

We break the "standard web" look by rejecting the grid as a cage. Instead, we use it as a foundation for intentional asymmetry. Expect large, sweeping areas of `surface` interrupted by high-contrast `primary` (black) elements. Text is treated as a graphic element. Overlapping typography and imagery are encouraged to create depth, moving away from flat, centered layouts toward a sophisticated, editorial composition.

---

## 2. Colors & Tonal Depth
Our palette is strictly achromatic. We rely on the "vibration" between pure black and white to create energy, using cool grays only to define spatial relationships.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit the use of 1px solid borders for sectioning. Structural boundaries must be defined solely through background shifts. For example, a `surface-container-low` (#f3f3f3) content block should sit on a `surface` (#f9f9f9) background to create a "carved" effect. Use the `16` (5.5rem) or `20` (7rem) spacing tokens to let the eye identify boundaries through negative space rather than ink.

### Surface Hierarchy & Nesting
Treat the UI as stacked sheets of premium paper. 
- **Base Layer:** `surface` (#f9f9f9)
- **Recessed Areas:** `surface-dim` (#dadada) for utility bars or secondary zones.
- **Elevated Elements:** `surface-container-lowest` (#ffffff) for primary cards or interactive modules.
- **Interactive Depth:** When an element is pressed or active, shift it to `surface-container-high` (#e8e8e8) to "sink" it into the layout.

### The Glass & Gradient Rule
While we avoid vibrant colors, we use "Tonal Gradients" to add soul. Use a subtle linear gradient from `primary` (#000000) to `primary-container` (#3b3b3b) on major call-to-action buttons. For overlays, use **Glassmorphism**: a background of `surface_container_lowest` at 70% opacity with a `20px` backdrop-blur to allow desaturated photography to bleed through the UI layers.

---

## 3. Typography: The Editorial Voice
The tension between the modernism of **Inter** and the classicism of **Noto Serif** is the heartbeat of this system.

- **Display & Headlines (Inter):** These are architectural. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero moments. This conveys authority and modern precision.
- **Body & Titles (Noto Serif):** Use `body-lg` (1rem) for all long-form content. The serif typeface provides an "Editorial" warmth that balances the coldness of the black-and-white palette.
- **Labels (Inter):** Small caps or uppercase `label-md` (0.75rem) should be used for navigation and metadata to maintain a clean, technical feel.

---

## 4. Elevation & Depth
In a minimalist system, traditional drop shadows are often too "software-like." We use **Tonal Layering**.

- **The Layering Principle:** Depth is achieved by stacking. A `surface-container-lowest` (#ffffff) card sitting on a `surface-container-low` (#f3f3f3) background creates a crisp, natural lift.
- **Ambient Shadows:** If a floating element (like a modal) is required, use an "Atmospheric Shadow": `0px 20px 50px rgba(0, 0, 0, 0.06)`. The shadow must feel like a soft glow of dark light, never a heavy smudge.
- **The "Ghost Border" Fallback:** If accessibility requires a stroke, use the `outline-variant` (#c6c6c6) at 20% opacity. **Never use 100% opaque borders.**
- **Corner Radius:** Every corner in this system is `0px`. Sharpness is a core brand pillar. It conveys architectural intent and precision.

---

## 5. Components

### Buttons
- **Primary:** Background `primary` (#000000), Text `on_primary` (#e2e2e2). Sharp `0px` corners. Padding: `1rem 2.75rem` (using spacing `3` and `8`).
- **Secondary:** Background `transparent`, Border `1px` using `outline` (#777777). 
- **Tertiary:** Text `primary`, no background. Use an underline that appears only on hover.

### Input Fields
- **Style:** A single bottom border using `outline` (#777777). No background fill.
- **Label:** `label-md` (Inter) positioned above the input, never floating inside.
- **Error:** Use `error` (#ba1a1a) only for the helper text; do not turn the entire input red, as it breaks the achromatic harmony.

### Cards & Lists
- **Rule:** Forbid divider lines.
- **Separation:** Use `surface-container-highest` (#e2e2e2) for a thin, 4px-wide vertical "accent bar" on the left side of a list item to indicate selection, rather than a full-box highlight.
- **Photography:** All imagery must use a `-100` saturation filter. High-contrast, "noir" style photography is the default.

### Signature Component: The "Content Curated" Slider
A horizontal scroll component where images utilize the `24` (8.5rem) spacing token for gutters. Captions use `title-sm` (serif) placed asymmetrically in the top-left corner of the image, overlapping the frame.

---

## 6. Do's and Don'ts

### Do
- **Do** use "Inertia Scrolling" and smooth, eased transitions (cubic-bezier 0.4, 0, 0.2, 1).
- **Do** treat whitespace as a functional element. If a section feels crowded, double the spacing.
- **Do** use large, bold `display` type that intentionally bleeds off the edge of the container for a high-fashion look.

### Don't
- **Don't** use any corner radius. The system must remain `0px` throughout.
- **Don't** use icons unless absolutely necessary. Prefer text-based labels.
- **Don't** use pure `#000000` for body text. Use `on_surface` (#1b1b1b) to ensure readability on digital screens while maintaining the high-contrast look.
- **Don't** use "Card Shadows" to separate sections. Use the color tokens `surface` vs `surface-container` for a more sophisticated architectural feel.