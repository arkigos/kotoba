# Greenfield Rebuild

Date: 2026-05-09

## Context

The existing Kotoba app is a small Create React App and Express prototype. It
proved the core idea of presenting Japanese lesson items with images, audio,
translations, and word-part explanations.

The product direction has changed into a curriculum-driven sentence drilling app
with frozen authored units, grammar-focused sequencing, 10 new words per unit,
and deterministic vocabulary bins.

## Decision

The current app is a prototype archive source and is archived for posterity
before the new implementation begins.

The next app architecture is designed around the target curriculum experience,
not constrained by the current CRA/Express shape.

## Consequences

- Existing code remains useful as reference for data shape, media conventions,
  and UI ideas.
- New architecture docs describe the desired app, not merely the current
  implementation.
- Rebuild work begins from product and curriculum contracts first, then chooses
  the simplest technical stack that serves them.
- Archiving preserves the current prototype in a clearly named folder or branch
  before replacement work begins.
