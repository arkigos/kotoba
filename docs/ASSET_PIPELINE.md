# Asset Pipeline

## Canonical dictionary audio

New word audio is owned by dictionary entries and exact pronunciations, through
`data/jp/dictionary/audio.json`; spelling and lesson aliases reuse the same file.
The Next Library, dictionary, and both players' word controls use the shared
resolver. Existing sentence audio and legacy clips remain available. See
`docs/decisions/2026-09-12-canonical-dictionary.md` for identity and licensing.

```sh
npm run dictionary:audio-forms
npm run dictionary:audio -- --sync
npm run dictionary:audio -- --dry-run
npm run dictionary:audio -- --dry-run --curated-only
npm run dictionary:audio -- --status
npm run dictionary:audio -- --generate --max-characters=6000 --max-requests=1200
```

`--sync` only adopts existing exact recordings; it never makes paid requests.
The inventory includes exact tokens from the eight starters and every authored
curated level, including inflections and grammar forms. `--curated-only` limits
the plan to those actual course pronunciations, excluding unused legacy or
procedural forms; use it for curated-course production. It works with dry-run,
sync and capped generation. Completed assets remain retained in either scope.
`audio_function_forms.json` is compiled from authored function forms and provides
stable local recording identities for forms without historical word bindings.
Punctuation is excluded. Runtime lookup uses the same registry and gives existing
bindings precedence. No inflection is synthesized or replaced by lemma audio.
The generation command reads the secret from ignored `.env.local` and needs
Text to Speech plus User Read permission for its quota check. Provider key IDs
are not secret API keys. No credentials enter frontend code.

The catalog and `audio_requests.json` persist each successful response. If a run
stops with an unresolved paid request, reconcile the saved file/temp catalog and
provider receipt first; do not delete its journal and rerun blindly. The writer
lock normally removes itself on exit. After a crash, confirm no writer remains
and reconcile pending receipts before removing that lock. Retrying a transient
local file rename must never resend the paid synthesis call. Completed clips are
immutable; subsequent normal runs skip them. Larger optional dictionary-audio
coverage should be selected deliberately rather than generating every lookup.

For a large authorized batch, `--concurrency=3` can overlap up to three provider
requests (the default remains one). Confirm the account supports that many
simultaneous requests. Catalog and request-journal writes remain serialized under
one writer lock. A failure stops new requests and lets already-sent requests save
their results before releasing the lock; it never automatically retries them.
Use `--skip-unresolved` to generate other pronunciations while leaving previously
interrupted requests untouched. The dry run lists every skipped pronunciation;
all reading aliases of the same spoken identity are protected. Without this
explicit option, a plan containing an unresolved request still fails before any
paid generation. Skipping does not resolve or remove the saved receipt.

Pronunciation repairs need more than a successful MP3 decode. The provider's
[current TTS documentation](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps)
states that `eleven_multilingual_v2` does not enforce `language_code`. Do not
treat the configured `ja` value as proof of Japanese pronunciation, particularly
for isolated kana. For a reported syllable defect, a contextual utterance with
character alignment can supply an extracted syllable. Preserve the source,
alignment, paid receipt, original clip and trim boundaries; use a new file URL
so the player cannot reuse a cached defective clip. Do not claim listening-based
verification from file/decode checks alone.

The October 2 と particle repair retains the displayed reading と and the authored
audio prompt ト. Its replacement clip extracts the initial aligned `t`/`o` from
`と。これは日本語の助詞です。` (0–0.480 seconds, including padding). The catalog records
the source utterance, request ID and prior recording; other と dictionary senses
and kana lessons retain their own identities.

The September 12 player refresh adds full-sentence playback to generated cards
by sequencing exact realized-token recordings in sentence order. Missing words
use device pronunciation for that exact reading, never a dictionary-form
substitute. The player labels word clips/device voice, highlights the current
token, and cancels the remaining sequence on navigation or Stop. As of the
September 13 correction, both generated and frozen cards always use this word
sequence. Legacy sentence recordings are bypassed, including explicit card refs:
their filenames use stable card IDs that do not verify the current sentence text.
Verified single-token kana recordings remain reusable pronunciation assets in the
dictionary registry. English uses device speech.
No new paid requests are made by playback.

Kotoba is text-first. The practice app does not display card images, ship image assets, or require image metadata in curriculum cards.

## Current Policy

- Every card has Japanese line data, token explanations, an English meaning, and grammar tags.
- Audio manifest entries are maintained for every card.
- Audio starts as `queued` until production TTS is generated.
- The Next learner first resolves the deterministic checked-in card path when
  `audioRef` is not stamped, then sequences exact word recordings if that file is
  unavailable. Each missing word uses browser speech. If playback fails, it gives
  explicit feedback. The original player retains its full-sentence speech fallback.
- The app plays one full-card audio language at a time: Japanese, English, or a contextual same/opposite language choice.
- Clicking a Japanese token plays production token audio when `audioRef` exists,
  otherwise it falls back to that token's Japanese reading through browser speech.
- The open language inspector always exposes a contextual Play pronunciation
  control. Single-token cards reuse their checked-in card audio; longer-card
  tokens resolve the shared token cache before speech fallback.
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
