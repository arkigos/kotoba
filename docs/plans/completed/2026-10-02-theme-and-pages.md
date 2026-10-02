# Theme access and GitHub Pages release

User requested a theme button on all top bars and deployment of the current app.
Keep the curriculum goal paused and preserve browser progression.

- Share the existing theme toggle across the global header, lesson player and
  completion screen; retain the persisted setting and narrow-screen layout.
- Verify the learner tests, production build and desktop/mobile theme controls.
- Publish the current authored app, dictionary and audio to the existing GitHub
  Pages setup. The workflow must upload `apps/learner-next/dist`, the active build.
- Exclude local work logs, caches, secrets and provider request receipts; retain
  all application dependencies, licenses and deployable assets.
- Verify the GitHub deployment and the live site before reporting completion.

Implemented the shared theme control in the global and lesson headers, plus
the completion screen. Verified switching in both directions on an isolated
127.0.0.1 browser profile, at 320px and 1280px widths, through lesson completion;
the user's localhost progression was untouched. The integration check waits for
the player to load and verifies persistence across lesson exit without moving
the saved card. Corrected the Pages artifact path and excluded local receipts
and scratch files from source control.

The release pool check exposed missing local-entry frequency metadata following
the previous dictionary bind. Ran the existing curation step: only
course_entries.json changed, and the exact frozen-pool validation passes. Added
that required step to the dictionary maintenance instructions.

Release verification: all 541 tests / 53 files and the curated-course and frozen
vocabulary-pool audits pass. The production build uses `/kotoba/`; existing
bundle-size advisory remains. Production build completed successfully.

Released app commit `b9338d7150d16ad8df0b30260c704bde80017eee` to master.
GitHub Pages run 36981295706 completed both build and deployment successfully:
https://github.com/arkigos/kotoba/actions/runs/36981295706

Verified https://arkigos.github.io/kotoba/ renders Home and the A1 course,
switches the shared theme, and serves the exact locally built JavaScript and
CSS bundle names with HTTP 200. A published dictionary audio sample also
returns HTTP 200. Progress is local to each origin; no localhost progress was
reset or migrated. Task complete.
