# Japanese ink and paper themes

Accepted 2026-09-13. The interface keeps its compact visual cards, but the
identity is Japanese print first: sumi ink, deep indigo, warm ivory and occasional
muted vermilion. Edo-inspired wave lines and dry-brush marks replace the bright
mineral watercolor backdrop. Washes remain a material detail, not four pastel
color families. Headers and primary actions use dark pigment with ivory content
in both themes. Dense lists, lesson text, and small labels have quiet surfaces.

The shared theme lives in `apps/learner-next/src/watercolor.css`. Existing color
variable names remain compatibility aliases; `--panel-ink`, `--panel-red`, and
`--on-pigment` define the dark art panels. Dark mode has its own original image,
not an inverted or dimmed light image. Kanji illustrations retain their original
colors inside ink frames. No curriculum, learning behavior, copy, or navigation
changed in this theme pass.

## Artwork

Generated with the built-in `image_gen` tool. Final unmodified PNGs are saved in
this workspace and referenced via `--paper-image`:

- `public/art/edo-paper-day.png`
- `public/art/edo-paper-night.png`

Earlier watercolor assets remain available but are not the active day/night
backgrounds. Original generator outputs are preserved under Codex generated_images.

## Light prompt

Use case: stylized-concept. Asset type: production LIGHT theme background for a Japanese language learning app, wide landscape 16:9. Japanese first: an elegant Edo-inspired contemporary print on warm ivory washi, with the dramatic graphic confidence and strong silhouettes of a beautiful anime title background, no actual title. Limited traditional print palette ONLY warm ivory #f3eddf, deep Prussian indigo #233440, sumi charcoal #222628, and restrained dark iron vermilion #783d38, with minute dull brass details. No pastel rainbow, no mint, lavender, pink, coral peach or green. At least 75 percent of the middle composition is very quiet almost-empty ivory paper for readable UI, softly visible grain. Bold irregular dry-brush sumi ink splotches, dramatic cropped sweeping indigo strokes and very subtle hand-carved woodblock wave linework live ONLY along the extreme outside corners and margins, especially left bottom and far upper right. A tiny tightly restrained dark vermilion pigment impression toward far bottom right, not a big solid circle. Expressive, asymmetrical, intentional Japanese craft. Strong dark-on-light contrast at the far edges with beautiful broken brush bristles and fine ink speckles. Keep central area pale and uninterrupted. Ink and woodblock first, a hint of muted watercolor bleed second. Flat photographed real fiber texture, not synthetic vector gradients or 3D. No text, calligraphy, kanji, letters, symbols, logos, borders, UI, characters, people, animals, objects, flags, mountains or watermark. Modern Japanese print atmosphere, sophisticated, confident, calm enough behind content.

## Dark prompt

Use case: stylized-concept. Asset type: production DARK theme background for a Japanese language learning app, wide landscape 16:9. Japanese first: dramatic elegant Edo-inspired contemporary woodblock print and sumi brush painting on deep charcoal indigo handmade paper. Graphic confidence and strong sweeping silhouettes reminiscent of the craftsmanship of an anime opening background, no actual title. Limited print palette ONLY deep charcoal #171d23, dark Prussian indigo #233440, subtle weathered blue-gray ink #405461, restrained muted iron vermilion #783d38, and very fine dull brass details. This is a dark screen background: at least 75 percent across the middle composition is quiet almost-uninterrupted charcoal indigo paper with fine fiber grain so pale UI will be readable. At the extreme outside corners and margins only, dramatic cropped sweeping indigo sumi ink strokes and irregular ink splotches, beautiful broken brush edges, sparse tiny pale paper flecks, faint woodblock wave linework in subdued antique brass. Strong intentional Japanese graphic marks, asymmetric, sophisticated; a small deep oxblood pigment impression at the far bottom right. Dark navy on charcoal with perceptible tonal contrast at the edges. No neon or pastel color, no mint/lavender/pink/green. Not colorful mineral watercolor: Japanese ink first, a subtle muted wash notion only. Flat actual printed material, not 3D or synthetic gradients. No text, letters, kanji, calligraphy, symbols, UI, logos, people, characters, animals, objects, flags, mountains, frame or watermark. Center stays dark and quiet; beautiful crisp brush silhouettes confined to margins.

