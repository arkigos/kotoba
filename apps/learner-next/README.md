# Kotoba Learner Next

This is the Kotoba rebuild. It lives beside the current app so
the existing product and curriculum pipeline remain available during cutover.

## Run it

```text
npm run next:dev
npm run next:test
npm run next:build
```

The development server uses `http://127.0.0.1:4175`.

## Current product surface

- Today, Course, Library, and Me destinations
- responsive desktop rail and mobile bottom navigation
- complete 80–100-card authored unit streams with exact-card resume
- Reading, Listening, Recall, and hands-free Rapid modes over the same deck
- Japanese/English/hidden card faces and surface/kana/romaji display
- a first-class in-lesson settings panel for default face, autoplay, Japanese /
  English / same / opposite audio, auto-advance, sequential or random order,
  timing, and lesson theme
- sequential, previous, random, flip/reveal, and keyboard navigation
- card audio plus token audio, explanations, and Library status tagging
- saved words and sentences
- lesson position, completed lessons, word ratings, and recorded practice days
- local attempt history, settings, progress import, and data export
- light, dark, and reduced-motion settings
- lesson search, optional display name, and unit detail sheets
- lazy curriculum chunks and a service-worker application shell

Course lessons use the checked-in authored curriculum in its frozen order. The
player does not sample a unit into a short generated quiz: the authored card
stream is the lesson. Library filters can build smaller cross-unit decks, but
those reviews run through the same flashcard player.

New profiles start with no practice history, including in development. Earlier
saved profiles remain intact; recognizable sample attempt records are flagged in
the UI. Sample fixtures live under `tests/`, never in the initialization path.

The shell does not advertise adaptive skill scores, due queues, dialogue scenes,
placement checks, content reports, or per-unit offline downloads. These are not
implemented product features. The older state fields remain readable for
compatibility and export, but are not presented as measured learning ability.
