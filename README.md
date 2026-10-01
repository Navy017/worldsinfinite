# Worlds Infinite

A procedural world generator you can zoom from a whole planet down to a single street. Every world
gets continents, climate, rivers and biomes, peoples, faiths and realms, towns and roads, trade and
war. It also gets a living history and one or two hidden truths that you uncover by reading the
world's own documents.

**Play it:** https://navy017.github.io/worldsinfinite/.

**Version 1.** Everything runs in the browser, and a world takes about half a second to generate.

## What a world has

- **Land:** plate-driven continents, a coastline that stays consistent from the world map down to
  metres, climate, rivers, biomes, mountain ranges, volcanoes, strange forests and mystery sites.
- **Zoom:** one continuous zoom from the globe to provinces (100 m tiles, streamed in chunks), towns
  (2 m tiles) and an angled street view, all in blocky pixel art.
- **Peoples and politics:** cultures, faiths, realms with origins, governments and ideals, relations,
  heraldry, and a calendar with moons. Each realm has a codex covering its government, court,
  culture, faith, military, economy, science and history.
- **Trade and war:** goods, markets with prices, named trade routes and sea lanes, roadside inns and
  border posts, wars with fronts, armies down to individual soldiers, and fleets.
- **Ecology:** land and marine zones with their own plants, animals and sea monsters, animated on
  the map.
- **History:** a separate monthly simulation. Rulers age and die, there are wars with tactics,
  revolutions, discoveries, monuments, new towns and roads, intrigue, and 36+ branching storylines,
  all reported in a news chronicle.
- **World premises:** each world hides 1-2 of 73 premises, which are power systems, world shapes,
  cosmic secrets, cycles, hidden histories and lost science. Their truth is scattered as framed
  documents across libraries, archives, temples, ruins, villages, inns and the people who wrote them.
  Sources are biased, wrong or lying, and the Journal tracks your theories, leads and the people
  you meet.

## Run it

```bash
npm install
npm run dev      # development server
npm run build    # dist/index.html: one self-contained file that works offline
```

## Checks

```bash
npm run bench                     # generation timings per stage
node bench/premises.mjs           # validate premise content files
node bench/lint-lore.mjs          # lore style check (docs/style.md)
node bench/journal.mjs [premise]  # play the lore journal headlessly
node bench/history.mjs 1500 20    # run 20 years of history and print the chronicle
```

## Layout

| Path | What |
|---|---|
| `src/gen/` | Generation stages: mesh, terrain, climate, regions, premise, states, features, settlements, society, lore, trade, conflict, ecology, plus region/town zoom |
| `src/sim/` | The history layer, storylines and lore events |
| `src/app/` | Renderer, UI, codex, journal, street view, the things that move |
| `src/content/` | All content as data: society, military, goods, tech, stories, storylines, lore, news, ecology, wildlife |
| `src/content/premises/` | One file per world premise; format in `FORMAT.md` |
| `docs/` | Design (`world-premises.md`), writing style (`style.md`), research |

## Contributing content

Content is plain data with tag-based rules (`src/core/rules.js`), so new governments, units, goods,
stories or whole premises can be added without touching the engine. Start with
`src/content/premises/FORMAT.md` and `docs/style.md`, and run the checks above.

## License

MIT. See `LICENSE`.
