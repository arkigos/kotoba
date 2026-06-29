# Asset Pipeline

Kotoba is text-first. The practice app does not display card images, ship image assets, or require image metadata in curriculum cards.

## Current Policy

- Every card has Japanese line data, token explanations, an English meaning, grammar tags, and a learner-facing note.
- Audio manifest entries are maintained for every card.
- Audio starts as `queued` until production TTS is generated.
- The app uses browser speech synthesis as an immediate fallback when `audioRef` is not present.
- Japanese + English playback is sequenced in the browser fallback by waiting for the Japanese utterance to end before starting English.
- Clicking a Japanese token always plays that token's Japanese reading through the same fallback path.
- Images are intentionally out of scope: no image prompts, image refs, placeholders, manifests, or public image assets.

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
-> generate audio from Japanese card text
-> generate optional token-level audio from card token readings
-> update manifest entries to complete
-> validate:all
```

Production audio should eventually replace browser speech for both full-card Japanese and token-level Japanese. English audio can remain browser-generated unless learner testing shows it is worth freezing too.

## File Layout

```text
public/media/jp/audio/unit_001/u001-c001.mp3
data/jp/media/manifests/unit_001.assets.json
```

The visual hierarchy belongs in the app UI itself: large Japanese text, revealable meaning, token hover details, notes, progress, and controls.
