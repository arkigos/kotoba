# Asset Pipeline

Kotoba ships frozen curriculum data. Images and audio are generated offline, checked, and referenced by stable paths.

## Current Policy

- Every card has an `imagePrompt`.
- `npm run assets:sync` assigns each card an `imageRef`, preserves reusable scene images under `public/media/`, writes card-level SVG placeholders only when no scene/generated image exists, and writes a manifest under `data/jp/media/manifests/`.
- Every card has an audio manifest entry. Audio starts as `queued` until production TTS is generated.
- The app uses browser speech synthesis as an immediate fallback when `audioRef` is not present.
- Japanese + English playback is sequenced in the browser fallback by waiting for the Japanese utterance to end before starting English.
- Clicking a Japanese token always plays that token's Japanese reading through the same fallback path.

## Commands

```sh
npm run assets:sync
npm run validate:assets
npm run validate:all
```

## Target Production Flow

```text
unit JSON
-> assets:sync
-> generate/replace images from image prompts
-> generate audio from Japanese card text
-> generate optional token-level audio from card token readings
-> update manifest entries to complete
-> validate:all
```

Production audio should eventually replace browser speech for both full-card
Japanese and token-level Japanese. English audio can remain browser-generated
unless learner testing shows it is worth freezing too.

## File Layout

```text
public/media/jp/images/unit_001/u001-c001.svg
public/media/jp/audio/unit_001/u001-c001.mp3
data/jp/media/manifests/unit_001.assets.json
```

Reusable scene images keep units visually alive without requiring one unique image per card. Placeholder images remain useful during authoring because the app always has a real visual asset path. Production image generation can replace those files without changing card ids or app code.


## Art Direction

Kotoba image assets should feel like austere, beautiful Japanese ink-and-watercolor artifacts rather than generic placeholders. Prefer intentionally 2D traditional illustration, cool off-white rice paper, mostly grayscale sumi ink, broad economical brush strokes, dry-brush marks, pigment blooms, splotches, granulation, rough edges, and old-timey Japanese school or everyday settings. A slight anime-influenced beauty ideal is welcome in faces and silhouettes, but the result should read as high stylized art, not cartoon.

Use color sparingly: tiny muted indigo, vermilion, or yellow accents are enough. Avoid beige/tan/cream/brown/sepia palettes, readable text, labels, watermarks, glossy digital rendering, 3D lighting, plastic skin, chibi/cute mascot energy, generic AI watercolor polish, and non-Japanese architectural cues.

Images may represent a coherent set of cards rather than one card literally. Unit 1 is the prototype direction: five reusable PNG scene images replace the placeholder SVGs while preserving stable card ids and manifest structure.
