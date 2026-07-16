# Asset Pipeline

Kotoba is text-first. The practice app does not display card images, ship image assets, or require image metadata in curriculum cards.

## Current Policy

- Every card has Japanese line data, token explanations, an English meaning, and grammar tags.
- Audio manifest entries are maintained for every card.
- Audio starts as `queued` until production TTS is generated.
- The app uses browser speech synthesis as an immediate fallback when `audioRef` is not present.
- Japanese + English playback is sequenced in the browser fallback by waiting for the Japanese utterance to end before starting English.
- Clicking a Japanese token plays production token audio when `audioRef` exists,
  otherwise it falls back to that token's Japanese reading through browser speech.
- Token audio is shared globally by spoken Japanese prompt. Do not generate
  per-unit copies of repeated particles, words, kana, or grammar chunks.
- Images are intentionally out of scope: no image prompts, image refs, placeholders, manifests, or public image assets.

## Commands

```sh
npm run assets:sync
npm run audio:elevenlabs -- --dry-run --units=101,102,103
npm run audio:elevenlabs -- --units=101,102,103
npm run audio:elevenlabs -- --units=1 --tokens
npm run validate:assets
npm run validate:all
```

## ElevenLabs Audio

Production Japanese audio is generated offline and checked in under
`public/media/jp/audio/`. Do not expose ElevenLabs credentials in browser code
or committed files.

Before running paid generation for a broad batch, run the same command with
`--dry-run` and confirm the expected generated file count and estimated credits
with the project owner, unless the current request explicitly approves that
batch. Use `--tokens` for normal unit generation so repeated elements reuse the
global token cache.

Required environment variables:

- `ELEVENLABS_API_KEY`: ElevenLabs API key.
- `ELEVENLABS_VOICE_ID`: voice id to use for Japanese playback.

These can be exported in the shell or placed in ignored `.env.local`:

```text
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=...
```

Optional environment variables:

- `ELEVENLABS_MODEL_ID`: defaults to `eleven_multilingual_v2`.
- `ELEVENLABS_OUTPUT_FORMAT`: defaults to `mp3_44100_128`.
- `ELEVENLABS_BASE_URL`: defaults to `https://api.elevenlabs.io`.
- `ELEVENLABS_SPEED`: defaults to `0.85`; valid range is `0.7` to `1.2`.
- `ELEVENLABS_LANGUAGE_CODE`: defaults to `ja`. Keep this set for Japanese,
  especially for isolated kana, particles, and short token prompts.

Useful commands:

```sh
npm run audio:elevenlabs -- --list-voices
npm run audio:elevenlabs -- --dry-run --units=101,102,103
npm run audio:elevenlabs -- --units=101,102,103
npm run audio:elevenlabs -- --units=101 --limit=5
npm run audio:elevenlabs -- --units=101 --limit=5 --speed=0.85
npm run audio:elevenlabs -- --units=101 --cards=u101-c001,u101-c002,u101-c017 --force
npm run audio:elevenlabs -- --units=101,102,103 --force
```

The generator speaks each card's `audioText` when present, otherwise its `tts`
reading rather than the displayed surface. This keeps kana audio explicit,
avoids particle ambiguity such as standalone `は`, and avoids ambiguous
standalone kanji pronunciation. When an MP3 is generated, the script writes the
card's `audioRef`, updates the unit manifest entry to `complete`, and leaves
browser speech synthesis as the fallback for any card still missing production
audio.

Kana recognition prompts are short, which makes language detection fragile.
Always probe a few representative kana before regenerating a full kana unit.
Use `ELEVENLABS_LANGUAGE_CODE=ja` and the `--cards` filter for this. Normal kana
and compound kana should use the single Japanese reading once only after probe
audio sounds correct. Do not repeat kana three times to coax pronunciation.
Small kana and the long vowel mark may use explicit Japanese labels such as
`ちいさいあ` or `ちょうおんぷ` because they are recognition items rather than
normal standalone syllables. IPA/phoneme dictionaries are not used with the
current `eleven_multilingual_v2` path; if we move to a phoneme-capable model
later, test a small kana batch before replacing this prompt strategy.

With `--tokens`, the generator also writes token-level audio refs. Token files
live under `public/media/jp/audio/tokens/` and are keyed by the exact spoken
prompt, so the same element, such as `か`, reuses one MP3 across every unit.
`validate:assets` fails if the same token key points at multiple files.

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
public/media/jp/audio/tokens/705d9fa1ca39.mp3
data/jp/media/manifests/unit_001.assets.json
```

The visual hierarchy belongs in the app UI itself: large Japanese text, revealable meaning, token hover details, notes, progress, and controls.
