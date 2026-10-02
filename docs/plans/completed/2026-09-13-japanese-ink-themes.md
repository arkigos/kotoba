# Japanese ink themes

User request: keep the visual depth but make the identity Japanese first,
with Edo-inspired ink, dark indigo/black, muted dark red, and warm paper.
Remove the pastel rainbow from headers and buttons. Preserve the compact
interface and current behavior in both light and dark mode.

- Give light and dark mode dedicated washi/sumi backgrounds with indigo brush
  silhouettes, restrained wave linework, and quiet central reading areas.
- Unify headers and buttons around deep indigo, occasional oxblood, and ivory.
  Keep muted paper washes rather than separate pastel color families.
- Carry the material through Home, Learn, Activities, Custom, Dictionary,
  My lessons, Progress, and the practice shell without adding copy or controls.
- Preserve existing raster illustration colors; retain quiet readable text areas.
- Verify desktop/phone, dark/light, active/hover/focus controls and main flows;
  run builds and required practice-flow checks. Document generated asset prompt.

Status: complete.

Implemented the shared ink palette and original Edo-inspired day/night assets
in `watercolor.css`, plus coordinated Home, Learn, Activities, Custom, Kanji,
Dictionary, My lessons, and Progress CSS. Lesson controls and small text on
painted backgrounds have protected reading surfaces. Layout and behavior stayed
unchanged. Artwork paths and built-in image generation prompts are recorded in
`docs/decisions/2026-09-13-japanese-ink-themes.md`.

Verification:
- Desktop and 390×844 phone checks across the main views in both themes.
- Practice card, controls, and settings inspected in both themes; no horizontal
  overflow. Preview restored to light with no viewport override.
- `npm run next:build` and `npm run build` passed (existing chunk-size advisory).
- Five focused Next suites passed, 22 tests: Home, continuity, My lessons,
  Progress, and Dictionary. `npm run test:e2e` passed, one practice-flow test.
- CSS parsing and whitespace checks passed. No curriculum or paid audio work.
