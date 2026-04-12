# Design System: R&K-Gaggenau
**Project ID:** 7817949544366103523

## 1. Visual Theme & Atmosphere
### The Creative North Star: "Atmospheric Precision"
Cleaning is often treated as a utilitarian service, but for R&K-Gaggenau, we are elevating it to an editorial experience. The "Atmospheric Precision" philosophy moves away from the cluttered, "bubbly" tropes of the cleaning industry. Instead, it leverages high-contrast typography, vast negative space, and tonal layering to create a digital environment that feels as organized and pristine as the spaces the company maintains.

This design system rejects the "template" look. We prioritize intentional asymmetry—where images might bleed off-canvas while text remains anchored—and deep, layered surfaces that suggest sophistication and meticulous care.

## 2. Color Palette & Roles
The palette is derived from the core brand identity: a deep, professional Green and a vibrant Sky Blue, supported by a sophisticated range of architectural neutrals.

*   **Primary Green (#008855):** The core brand color, used for primary actions and highlights to convey a professional, pristine quality.
*   **Vibrant Sky Blue (#3399CC):** Used as a secondary interactive and accent color (e.g., links, secondary icons) to distinguish functional interactions from brand elements.
*   **Base Surface (#f8fafa):** The foundational background layer, providing an airy and pristine canvas.
*   **Secondary Surface (#f2f4f4):** Used for structural breaks and secondary content segments instead of lines.
*   **Elevated Surface (#ffffff):** Crisp, pure white used to make interactive or floating elements pop against the Base Surface.
*   **On-Surface Ink (#191c1d):** A soft, natural near-black used for all text; 100% black is strictly avoided to maintain elegance.
*   **Outline Variant (#bdcabf):** Used at 15% opacity to create a "Ghost Border" recommendation for accessible container outlines.
*   **Deep Error Red (#ba1a1a):** High-contrast validation color.

## 3. Typography Rules
We utilize a pairing of **Manrope** for high-impact editorial moments and **Inter** for functional reliability.

*   **Display / Hero Statements (Manrope):** Massive, bold scales (`display-lg`: 3.5rem) set with tight letter-spacing (-0.02em) to feel authoritative.
*   **Headlines / Section Titles (Manrope):** Often aligned asymmetrically (e.g. far left while body text is indented) to create a rhythmic, non-standard layout.
*   **Body Content (Inter):** High-legibility sans-serif. Used at `body-lg` (1rem) for general content to ensure the "Corporate Clean" promise of trust and clarity.
*   **Labels & Metadata (Inter):** All-caps with increased letter-spacing (+0.05em) for small metadata or overlines, providing a "technical" and precise feel.

## 4. Component Stylings
*   **Buttons (Primary):** `md` (0.75rem / 12px) rounded corners. Filled with a subtle linear gradient from `primary` (#006c43) to `primary_container` (#008855) at a 135-degree angle to provide a tactile "soul" to the button. Text is `on_primary` (#ffffff).
*   **Buttons (Secondary):** Transparent background defined strictly by a 15% opacity "Ghost Border". Uses `primary` green for the text.
*   **Buttons (Tertiary):** No border or background. Underline on hover only.
*   **Cards/Containers:** Tonal Layering. Avoid shadows for static cards. Instead, place a `surface_container_lowest` (#ffffff) card on a `surface_container_low` (#f2f4f4) background. The value contrast itself signifies elevation. 
*   **Active States (Hovered Cards):** Uses an extra-diffused "Ambient Shadow" (`box-shadow: 0 20px 40px rgba(25, 28, 29, 0.06)`) mimicking natural light, never a digital drop shadow.
*   **Lists:** No 1px solid dividers. Uses generous `2rem` vertical white space to separate items. Decorative lists (like service steps) use large `display-sm` numbers in Dimmed Sky Blue (#82cfff) placed behind the text.
*   **Inputs/Forms:** Understated elegance. `surface_container_high` (#e6e8e9) fill with no border. On focus, transitions to `surface_container_lowest` (#ffffff) with a subtle `primary` glow.
*   **Floating Panels / Nav Bars:** Uses Glassmorphism combining a semi-transparent `surface` color with a `backdrop-filter: blur(20px)` to integrate UI tightly into background architectural photography.

## 5. Layout Principles
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Boundaries must be established through color blocking or tonal shifts mapping the transition from `surface` to `surface_container_low`.
*   **Intentional Asymmetry:** Overlapping elements are encouraged. Letting an image of a pristine kitchen overlap a text container helps break the rigid grid.
*   **Optical Alignment:** Do not adhere strictly to an 8px grid. Allow for "optical alignment" where typography feels balanced even if mathematically off-grid to support the editorial vibe.
*   **Imagery Over Clipart:** Never use "cleaning" clipart. Layouts must rely on high-resolution, architectural-style photography of clean spaces lit by natural light.
*   **Signature Component:** Essential for the project is a "Before/After" Slider utilizing a minimalist center handle with `backdrop-blur` and a `primary` icon.
