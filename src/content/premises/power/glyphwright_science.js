// Glyphwright Science: linking magic and engraved glyphs run like engineering, and what the guild hides about them.
export default {
  id: "glyphwright_science",
  name: "Glyphwright Science",
  family: "power",
  pitch: "Magic is a branch of engineering. Link two things with a drawn or spoken binding and they share heat, motion and harm. Society runs on universities, licensed glyphs and very careful arithmetic.",
  slots: ["power-access", "state-control"],
  tone: ["heroic", "grim"],
  era: ["medieval", "renaissance", "industrial"],
  scale: "regional",
  genres: ["fantasy", "flintlock", "shonen"],
  w: 1,
  excludes: [],
  pairs: [{ id: "long_sight", w: 2.5 }, { id: "elder_lattice", w: 2 }, { id: "ward_walls", w: 2 }, { id: "machine_liturgy", w: 1.5 }],

  power: {
    name: "glyphwork", user: "glyphwright", users: "glyphwrights",
    taught: "A drawn or spoken binding links two things, so that what happens to one happens to the other: heat, motion, force. The gift is a mind that can divide itself to hold the link.",
    rules: ["Likeness strengthens a link: iron to iron holds, iron to wax barely does.", "Distance weakens every link.", "Energy must come from somewhere: a candle, a river, or the wright's own body heat.", "What leaks from a binding returns into the wright as burns, frost or torn muscle."],
    forbidden: "Binding a living person through their blood or hair.",
  },

  cast: [
    { role: "investigator", n: "a crown surveyor who maps rivers and fault lines", home: "mountain", stance: "Wants every seal dated against the land it was drawn on, and has found someone else surveying the faults." },
    { role: "official", n: "a proctor of the University, who runs the examinations and their 'corrections'", home: "capital", stance: "Holds that the gift is real, and that the University's monopoly is all that keeps the realm safe." },
    { role: "believer", n: "an ink-witch who teaches village children to draw, for free", home: "forest", stance: "Believes anyone can draw, and that the University steals children and memories to hide it." },
    { role: "survivor", n: "a parent whose child was taken for examination, and who no longer remembers the child", home: "any", stance: "Keeps a pair of small shoes nobody can explain, and wants to know whose they were." },
  ],

  truths: [
    { id: "land_glyphs", n: "The glyphs are the land", d: "Every glyph is a simplified map of the land it is drawn in. When an earthquake, a flood or a new river changes the land, the glyphs fail. The quake that killed the old glyph-city was set off on purpose by a rival crown's sappers, and someone is now surveying the faults to do it again.", tags: ["truth:land_glyphs"],
      known: [
        "Seals across the land are failing at once, and a foreign school's bindings fail in our lands as ours fail in theirs. The University teaches that glyphs are abstract forms with no relation to geography.",
        "{investigator}, a crown surveyor, found the rivers have shifted a hand's breadth since the seals were drawn. An old earthquake survey records every binding in a city failing on the morning its river moved.",
        "Old boundary stones carry a glyph that traces the valley's rivers exactly as they ran before the great quake. Under one of them is a sapper's tunnel and a burned-out engine aimed at the fault.",
        "Confirmed: the glyphs are maps of the land, and moving the land kills every glyph on it. The old kingdom's quake was set off on purpose by enemy sappers, and fresh survey pegs are in the same fault.",
      ] },
    { id: "anyone_draws", n: "Anyone can draw", d: "There is no gift. The craft is only drawing, and the University's claim that the gifted alone can work it is kept up by wiping the memory of anyone who watches too closely and taking the children who find out. The ink-witches who teach children are hunted for telling the truth.", tags: ["truth:open_glyphs"],
      known: [
        "Village children taught by ink-witches light candles with chalk drawings. Guild examiners follow the witches from village to village, and each village forgets the witches, and sometimes a child, after they leave.",
        "University minutes record witnesses to a practical examination: four before 'correction', none after. People who watched a master work in the square remember nothing until supper, and some find a child's cot in the house they cannot explain.",
        "A child's slate in a village shrine lights a candle when its drawing is traced. The village roll lists the child as 'taken for examination', with the family's names struck out.",
        "Confirmed: anyone can draw. The University's gift is a lie kept up by wiping memories and taking the children who prove otherwise. {survivor} is one of the parents who forgot.",
      ] },
    { id: "the_leak", n: "The leak goes somewhere", d: "Every binding leaks, and the University was built to channel the leaked heat and force into its cellars. A creature sealed beneath it has been fed by every lesson ever taught. The founders' reasons are lost, the proctors have doubled the intake anyway, and it is nearly strong enough to break out.", tags: ["truth:fed_seal"],
      known: [
        "The ground under the University city is warm in winter, the wells under the east court run hot, and the rats have moved out. The building accounts close the wells 'by order; no further enquiry'.",
        "Beneath the archive is a grey door with four copper plates and no handle, always warm. A porter who swept the stair for 30 years scratched beside it that it hums louder when the first-years practise.",
        "The plates on the door are not a lock but a vent, drawing inward. Behind the wall beside it, a large living body moves whenever a lesson is taught upstairs, and the stone there is blood-warm.",
        "Confirmed: the leak goes somewhere. The University was built to channel every binding's leaked heat to a creature sealed beneath it. Every lesson feeds it, and it is nearly strong enough to get out.",
      ] },
  ],

  tags: ["glyphwork"],

  subthemes: [
    { id: "scholarship", n: "The Scholarship Orphans", d: "Street children claw their way into the University on cleverness and debt. A few become masters; most become indentured lamp-wrights for thirty years.", w: 1.2, req: { any: ["academies", "scholarly", "has:city"] }, mods: [["poor", 1.5], ["urbane", 1.5]], tags: ["theme:scholarship"] },
    { id: "malfeasance", n: "The Malfeasance Trials", d: "A student hangs for a blood-binding nobody saw. The church's examiners burn wax dolls in the square, and every quarrel ends with an accusation.", w: 1, req: { any: ["harsh_law", "zealous", "gov:theocracy", "pious"] }, tags: ["theme:malfeasance"] },
    { id: "fallen_city", n: "The Fallen Glyph City", d: "A shining capital died in a morning when its glyphs broke. Its people are still there, grey and still, hands on the lamps.", w: 0.8, truthLink: "land_glyphs", tags: ["theme:fallen_city"], mark: { kind: "zone", n: "The broken city", color: "#7a7a8a", size: [1, 2], where: "inner" } },
    { id: "ink_witches", n: "The Ink-Witches", d: "Hooded women in wide-brimmed hats teach village children to draw, for free. The guild's examiners follow them, and the villages forget them afterwards.", w: 1.1, mods: [["egalitarian", 2], ["forest_folk", 1.5], ["poor", 1.5]], truthLink: "anyone_draws", tags: ["theme:ink_witches"] },
    { id: "seal_failure", n: "The Failing Seals", d: "Containment seals across the land are weakening at once: plague-wards, beast-pits, spirit-jars. The seal-masters cannot agree why, and some of them have stopped trying to find out.", w: 1, truthLink: "land_glyphs", tags: ["theme:seal_failure"] },
    { id: "artificer_boom", n: "The Artificers' Boom", d: "Glyph-lamps, heat-stones and bound looms are remaking labour. The artificers' guilds fight patent wars with lawyers by day and saboteurs by night.", w: 1.2, req: { any: ["artisans", "guilds", "mercantile", "urbane"] }, tags: ["theme:artificer_boom"] },
    { id: "rival_script", n: "The Rival Script", d: "A foreign school writes its bindings in circles, not lines, and calls ours crude. Their masters fail in our lands and ours fail in theirs.", w: 0.9, req: { any: ["scholarly", "faith:philosophy", "insular", "mercantile"] }, truthLink: "land_glyphs", tags: ["theme:rival_script"] },
    { id: "tattooed_regiment", n: "The Tattooed Regiment", d: "Soldiers wear combat glyphs carved into their armour, and some, illegally, into their skin. They never feel warm again.", w: 1, req: { any: ["martial", "standing_army", "autocracy"] }, tags: ["theme:tattooed_regiment"] },
    { id: "locked_door", n: "The Four-Plate Door", d: "Beneath the University's archive is a door of grey stone with four copper plates and no handle. Students dare each other to touch it; it is always warm.", w: 0.8, req: { any: ["academies", "scholarly", "has:city"] }, truthLink: "the_leak", tags: ["theme:locked_door"] },
    { id: "warm_cellars", n: "The Warm Cellars", d: "The ground under the University city is warm in winter. Wells run hot, no snow lies in the east court, and the rats have all moved out.", w: 0.8, req: { any: ["academies", "has:city"] }, truthLink: "the_leak", tags: ["theme:warm_cellars"] },
    { id: "rune_masons", n: "The Rune-Masons", d: "The masons engrave the whole city with protective script. Their guild knows where every glyph in the walls is, which makes it more powerful than the council.", w: 1, mods: [["guilds", 2], ["mountain_folk", 1.5], ["artisans", 1.5]], tags: ["theme:rune_masons"] },
  ],

  sites: [
    { id: "plated_door", n: "The Plated Door of $", kind: "anomaly", where: "capital", truthLink: "the_leak", d: "A handleless door of grey stone in the deepest archive, always warm.",
      layers: {
        surface: { n: "The handleless door", text: "At the bottom of the archive stair, 140 steps down, is a door of grey stone with four copper plates and no handle. Students dare each other to touch it. It is always warm, and the porters heat their lunch on the step." },
        study: { n: "A vent, not a lock", text: "{investigator} copied the plates' glyphs in {year} and checked them against the leakage tables. They are not a lock. They are a vent, drawing heat inward from every binding in the building, and from the city's wells." },
        dig: { n: "Blood-warm stone", points: "archive", text: "Behind the wall beside the door the stone is blood-warm. A listening-cup against it picks up movement, large and slow, whenever a lesson is taught upstairs. The founders' building plans, which show the vent, are held in {lead}." },
        revelation: { n: "Built to feed it", text: "The founders built the University over a sealed creature and drew every lesson's leaked heat down to it on purpose. Their reasons are lost; the plans survive. Five hundred years of first-years have fed it. The proctors know, and last year they doubled the intake." },
      } },
    { id: "survey_stones", n: "The Survey Stones of $", kind: "dig", where: "mountain", truthLink: "land_glyphs", d: "Boundary stones carved with a glyph that matches the valley as it was before the great quake.",
      layers: {
        surface: { n: "Crooked glyphs", text: "Old boundary stones stand half sunk in scree across the valley, each carved with the same crooked glyph. There are 23 of them over nine miles. Shepherds use them as scratching posts for the sheep." },
        study: { n: "The old rivers", text: "Laid over {investigator}'s survey map, the glyph traces the valley's rivers exactly as they ran before the great quake, every bend to within a few spans. The rivers have since moved half a mile." },
        dig: { n: "The sapper's tunnel", points: "sub:rival_script", text: "Beneath one stone is a sapper's tunnel and the burned-out shell of an engine of bindings, aimed at the fault. Its glyphs are written in circles, in the script of the rival school taught at {lead}." },
        revelation: { n: "They moved the land", text: "The quake that broke the old kingdom's glyphs was set off on purpose. A rival crown's sappers tunnelled under the fault and moved the land itself to make a nation's script useless. Last spring {investigator} found fresh survey pegs along the same fault." },
      } },
    { id: "grey_city", n: "The Grey City of $", kind: "ruin", where: "remote", truthLink: "land_glyphs", d: "A dead city whose every wall is glyph-carved, and every glyph a hair's breadth wrong.",
      layers: {
        surface: { n: "Worn walls", text: "Streets of carved walls stand empty, every glyph worn smooth by hands, abandoned for centuries. Scavengers will not take the stone. The road signs to the city were taken down by royal order in {year}." },
        study: { n: "A hair off true", text: "The glyphs are a hair off true. {investigator} measured the river beside the city: in one flood it shifted its bed 11 spans east of the old survey. Every glyph in the city still points to where the river used to be." },
        dig: { n: "Hands on the lamps", points: "site:survey_stones", text: "In the houses the dead lie as if asleep, grey-skinned, their hands still on the glyph-lamps: 30,000 by the old census. In the river silt lies a carved boundary stone, washed down from the valley at {lead}." },
        revelation: { n: "Warmth taken back", text: "When the river moved, every binding in the city failed at once, and each took its makers' warmth with it to balance. The city died in a morning. The flood came from a quake set off upriver by enemy sappers. The University's history blames plague." },
      } },
    { id: "child_slate", n: "The Slate of $", kind: "shrine", where: "any", truthLink: "anyone_draws", d: "A child's slate in a village shrine whose drawing, traced exactly, lights a candle.",
      layers: {
        surface: { n: "A chalk sun", text: "A schoolroom slate is kept in a village shrine, with a child's chalk drawing of a sun on it. Villagers set a candle beside it on feast days. Nobody can say whose it was." },
        study: { n: "It lights a candle", text: "{believer}, an ink-witch, traced the drawing exactly in {year}, and a candle lit. The child who drew it was seven, by the date chalked on the frame, and had never seen a glyph." },
        dig: { n: "Taken for examination", points: "cast:survivor", text: "The village roll lists the child as 'taken for examination', with the family's names struck out beside it. One parent still lives in {lead}, and keeps a pair of small shoes nobody in the house can explain." },
        revelation: { n: "No gift needed", text: "No gift is needed: a seven-year-old with chalk can draw a working glyph. The University's proctors take the children who find this out, and wipe the parents' memories so they forget they ever had them. The shrine cupboard holds 14 more slates." },
      } },
    { id: "spiral_pit", n: "The Spiral Pit of $", kind: "dig", where: "any", d: "A shaft whose walls are cut with a spiral of glyphs going down into the dark.",
      layers: {
        surface: { n: "The fenced shaft", text: "A shaft on a hillside is fenced with iron, its walls cut with a spiral of carving going down into the dark. The fence went up in {year}. Sheep that fall in are not recovered." },
        study: { n: "A seal, outside in", text: "{investigator} lowered a lamp 200 feet. The spiral is a seal written from the outside in, glyph after glyph, built to keep a creature at the bottom. The seal-masters' register lists it as sound." },
        dig: { n: "Scratched from inside", points: "sub:seal_failure", text: "At the bottom the spiral has been scratched over from the inside, glyph by glyph, in a neat and patient hand. The same scratching has been reported in failing seals across {lead}." },
        revelation: { n: "It learned to write", text: "The creature in the pit escaped slowly, by teaching itself to write and undoing the seal one glyph at a time. It took about 300 years. The seal-masters marked the pit sound for the last 40 of them without once going down. The last glyph it cut, at the top, means thank you." },
      } },
  ],

  beings: [
    { id: "crawling_sigil", n: "Crawling sigil", kind: "small", d: "A glyph come loose from its page, crawling like an ink-black beetle and drinking warmth from sleepers.", danger: 1, biomes: ["tempforest", "grass", "temprain", "river"], look: { size: 0.3, group: [3, 20], move: "swarm", speed: 2, col: "#1a1a2a", col2: "#c08a2a", body: "insect", active: "night", visible: false } },
    { id: "seal_wraith", n: "Seal-wraith", kind: "predator", d: "A creature released from a failed seal: tall, cold, and wrapped in strips of faded glyphs. It feeds on heat and follows lamplight.", danger: 3, biomes: ["badlands", "boreal", "swamp", "tempforest"], look: { size: 2.5, group: [1, 1], move: "solo", speed: 10, col: "#4a3a5a", col2: "#e0d0a0", body: "biped", active: "night", visible: true } },
    { id: "lamp_moth", n: "Lamp-moth", kind: "insect", d: "A fat amber moth drawn to glyph-lamps. It drinks leaked heat and glows faintly for an hour afterwards.", danger: 0, biomes: ["tempforest", "grass", "river", "temprain"], look: { size: 0.1, group: [10, 60], move: "swarm", speed: 8, col: "#e0a040", col2: "#fff0b0", body: "insect", active: "night", visible: true } },
  ],

  techs: [
    { id: "gw_folk_marks", n: "Folk marks", field: "arcana", level: 1, d: "Poppets, charms and door-marks: the binding as village craft." },
    { id: "gw_rune_carving", n: "Rune-carving", field: "architecture", level: 2, d: "Masons cut permanent bindings into stone and timber, so a wall holds itself up and a hearth stays warm." },
    { id: "gw_leak_tables", n: "Leakage tables", field: "natural_philosophy", level: 3, d: "Tables of how much of each binding is lost, between which materials, and over what distance." },
    { id: "gw_bound_compass", n: "The bound compass", field: "navigation", level: 3, d: "A needle bound to a lodestone kept in the home port always points the way back." },
    { id: "gw_artificery", n: "Artificery", field: "engineering", level: 4, d: "Heat-stones, glyph-lamps and bound looms made by the thousand in artificers' halls." },
    { id: "gw_linked_wires", n: "Linked wires", field: "engineering", level: 5, d: "Twinned needles a hundred miles apart: what one writes, the other writes too." },
  ],

  units: [
    { id: "gw_glyph_regiment", n: "Glyph-armoured foot", role: "infantry", wpn: "sword", kit: "plate", ranks: 4, gap: 1.2, size: 100, w: 0.8, mods: [["theme:tattooed_regiment", 6], ["standing_army", 1.5]] },
    { id: "gw_field_wrights", n: "Field glyphwrights", role: "magic", wpn: "staff", kit: "robe", ranks: 2, gap: 3, size: 20, w: 0.8, mods: [["academies", 2], ["theme:scholarship", 2], ["arcane", 2]] },
  ],

  govs: [
    { id: "gw_university", n: "University charter", d: "The masters of the University hold the city's charter: every magistrate is a graduate, and every law is examined before it is passed.", tags: ["gov:gw_university", "republic", "arcane_rule"], w: 0.4, forms: ["University City of $", "Collegium of $", "Learned Commonwealth of $"], ruler: "Chancellor", mods: [["academies", 4], ["scholarly", 2], ["realm:tiny", 2], ["realm:small", 1.5]] },
  ],

  mapMarks: [
    { kind: "zone", n: "Quake-broken land", color: "#6a5a4a", size: [1, 3], count: [0, 1], where: "mountain", d: "A valley where the land shifted and every glyph in it went dead in a single morning." },
  ],

  storylines: [
    { id: "gw_orphan", n: "The Scholar of {place}", scale: "local", anchor: "town", w: 1.5, req: "glyphwork",
      stages: {
        start: { h: "A street child of {place} passes the University examination", b: "{person}, who sleeps under the bridges of {place}, walked into the admissions hall barefoot and answered every question. The masters have admitted the child on a debt that will take thirty years to pay.", wait: [3, 8], next: [{ to: "rises", w: 2 }, { to: "accused", w: 1, mods: [["harsh_law", 2], ["hierarchical", 2]] }] },
        rises: { h: "{person} climbs the ranks of the University", b: "The orphan of {place} has been raised to the inner school. The rich students hate it; the masters have started to ask {person} questions they cannot answer themselves.", wait: [6, 14], next: [{ to: "artificer", w: 2 }, { to: "door", w: 1, mods: [["theme:locked_door", 3], ["theme:warm_cellars", 2]] }] },
        accused: { h: "{person} is accused of malfeasance", b: "A wealthy student fell from a stair, and a wax doll was found in {person}'s room. The examiners have set the trial for spring.", wait: [2, 5], next: [{ to: "hanged", w: 1, mods: [["harsh_law", 2]] }, { to: "acquitted", w: 1, mods: [["ruler:just", 2]] }, { to: "flees", w: 1 }] },
        artificer: { h: "{person} patents the cold lamp", b: "The orphan of {place} has made a lamp that gives light with no heat, and paid off the debt in a single year. The artificers' halls are at war over the patent.", fx: { science: { engineering: 1 }, treasury: 40 }, end: true },
        door: { h: "{person} goes down to the plated door", b: "The last anyone saw of {person}, they were going down into the deep archive with a lamp and four copper keys of their own making. The cellars have been warmer since.", fx: { discovery: "arcana", unrest: 4 }, end: true },
        hanged: { h: "{person} is hanged for malfeasance", b: "The orphan of {place} was hanged before the University gate. The students wore black for a week; the masters did not.", fx: { unrest: 10, stability: -2 }, end: true },
        acquitted: { h: "{person} walks free", b: "The defence proved the doll was made of a wax {person} could never have afforded. The rich student's friends have quietly been sent down.", fx: { stability: 2 }, end: true },
        flees: { h: "{person} vanishes before the trial", b: "The cell was empty on the morning of the trial. A child in a wide-brimmed hat was seen with the ink-witches on the north road.", fx: { unrest: 4 }, end: true },
      } },
    { id: "gw_seals", n: "The Failing Seals of {realm}", scale: "realm", anchor: "realm", w: 1.2, req: "glyphwork",
      stages: {
        start: { h: "Seals fail across {realm}", b: "In one week three containment seals in {realm} cracked: a plague-ward in {capital}, a beast-pit in the hills and a spirit-jar in a temple. The seal-masters are working without sleep.", wait: [2, 5], fx: { unrest: 8 }, next: [{ to: "survey", w: 2 }, { to: "blame", w: 1, mods: [["zealous", 2], ["harsh_law", 1.5]] }] },
        blame: { h: "The ink-witches are blamed", b: "Priests and magistrates call the failures witchcraft. Women in wide hats are being dragged out of the villages of {realm}.", wait: [2, 6], fx: { unrest: 10 }, next: [{ to: "breakout", w: 1 }, { to: "survey", w: 1 }] },
        survey: { h: "A surveyor finds the land has moved", b: "{investigator}, a surveyor, has shown the court that the rivers of {realm} have shifted a hand's breadth since the seals were drawn. Nobody yet knows whether the shift is natural or someone's work.", wait: [3, 8], next: [{ to: "redrawn", w: 2, mods: [["learned", 2], ["academies", 2]] }, { to: "saboteurs", w: 1, req: "has:rival" }, { to: "breakout", w: 1 }] },
        redrawn: { h: "The seals of {realm} are redrawn", b: "Working from {investigator}'s new maps, the seal-masters redrew every seal in {realm}. Each is now dated, so the next generation will know when the land has changed again.", fx: { stability: 5, science: { arcana: 1 } }, end: true },
        saboteurs: { h: "Sappers of {rival} are caught at the fault", b: "Engineers of {rival} were taken in a tunnel under the hills with an engine of bindings aimed at the fault. {realm} calls it an act of war.", fx: { relation: { rival: -30 }, war: "rival" }, end: true },
        breakout: { h: "A sealed creature escapes in {realm}", b: "The last seal in the hills broke at midnight. What came out of the pit has not been seen clearly, but the villages around it are empty.", fx: { pop: 0.92, stability: -8, unrest: 12 }, end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "power", source: "library", bias: "official", reliable: true, who: "University first-year text, chapter two", text: "First-year text of the University, chapter two, {year} edition: 'A binding links two things, so that what happens to one happens to the other. Iron to iron, nine parts in ten. Iron to wood, three. Iron to wax, one, and the rest of the heat goes into you. Learn your tables.' A note in the margin gives last year's frostbite cases among first-years: 17." },
    { depth: "lore", about: "power", source: "oral", bias: "garbled", reliable: true, who: "A washerwoman of {place}, to her daughter", text: "A washerwoman of {place} to her daughter, combing out the girl's hair on market day, overheard by a magistrate's clerk in {year}: 'Don't let the hedge-binder take a hair from your comb, love. A hair is a handle. Your aunt sold three hairs for a copper, and walked crooked for a year.'" },
    { depth: "lore", about: "power", source: "archive", bias: "official", reliable: "partial", who: "Patent filing, Hall of Artificers", text: "Patent filing at the Hall of Artificers, {year}: 'This heat-stone is wholly safe in domestic use and leaks no more than a candle, being one part in ten.' The examiner's note beneath: 'Granted. Ten thousand stones licensed this year. Where the leaked tenth goes is not a matter for the patent office.'" },
    { depth: "core", about: "truth:land_glyphs", source: "ruin", bias: "true", reliable: true, plain: true, points: "site:survey_stones", who: "A rival sapper's note, found by {investigator}", text: "Sapper's note in the rival school's circular script, found by {investigator} in the tunnel under the stones at {lead}, {year}: 'Charge laid along the river-glyph. Their glyphs are maps of this valley. When the river moves, their whole script moves with it, and none of it will answer. Twelve days' work. Their city will be dark by the morning after.'" },
    { depth: "core", about: "truth:land_glyphs", source: "archive", bias: "redacted", reliable: "partial", points: "site:grey_city", who: "Crown earthquake survey", text: "Earthquake survey of the crown, {year}: 'The river at {lead} has shifted eleven spans east. The failure of every municipal binding on the same morning is noted; 30,000 dead. Cause...' The rest of the line is scraped out, and the surveyor's name has been cut from the foot of the page." },
    { depth: "core", about: "truth:land_glyphs", source: "traveller", bias: "exaggerated", reliable: "partial", who: "A ship's glyphwright, journal", text: "Journal of a ship's glyphwright at a foreign port, {year}: 'The foreign wrights laughed at our glyphs. Yours are drawings of your valley, one said; mine are drawings of mine. Neither works at sea. I tried a heat-glyph on deck 40 miles out, and it did nothing at all. I have stopped laughing back.'" },
    { depth: "core", about: "truth:land_glyphs", source: "oral", bias: "garbled", reliable: "partial", cost: true, who: "{person}, last child born in the old city, to {investigator}", text: "Told by {person}, the last child born in the old glyph-city, to {investigator}, {year}: 'My father died with a hand on the lamp, the morning the river moved. My mother carried me out because she was nursing me by the fire, not the lamp. For 70 years we said the river turned over in its sleep. We said it like a joke.'" },
    { depth: "core", about: "truth:land_glyphs", source: "library", bias: "official", reliable: false, who: "History of the Craft, approved by {official}", text: "From the University's History of the Craft, approved by {official}, proctor, {year}: 'The fall of the old glyph-city was caused by plague. Glyphs are abstract forms of pure reason and have no relation to geography whatever. A glyph drawn here would work as well on the moon, if one could get there.'" },
    { depth: "core", about: "truth:anyone_draws", source: "person", bias: "true", reliable: true, plain: true, who: "{believer}, ink-witch, sketchbook", text: "From the sketchbook of {believer}, ink-witch, under a child's drawing, {year}: 'Mira, aged six. First try. Lit the candle, then laughed so hard she blew it out. That makes 212 children in nine years, and every one of them lit it. There is no gift. There is chalk, and patience, and the proctors on the road behind me.'" },
    { depth: "core", about: "truth:anyone_draws", source: "archive", bias: "redacted", reliable: "partial", points: "cast:official", who: "Minute of the University examination board", text: "Minute of the University examination board, {year}: 'Witnesses to the practical examination: four. Witnesses after correction: none. Cost of correction entered under lamp oil.' Signed by the proctor in charge, whose office is at {lead}. The four witnesses were a baker, two carters and a child." },
    { depth: "core", about: "truth:anyone_draws", source: "heretic", bias: "heretic", reliable: "partial", who: "Ink-witch leaflet in a village schoolroom", text: "Leaflet of the ink-witches, left in a village schoolroom of {place}, {year}: 'There is no gift. There is a pen, and there is a proctor in a grey coat who will make you forget you ever held it. If your child draws a sun and the candle lights, hide the slate. Do not tell the examiners. Nine in ten children taken are never seen again.'" },
    { depth: "core", about: "truth:anyone_draws", source: "oral", bias: "garbled", reliable: "partial", cost: true, who: "{survivor}, to an ink-witch", text: "Told by {survivor} to an ink-witch at {place}, {year}: 'I remember watching the proctor light the lamps in the square. Then I remember nothing until supper, and the whole house crying. We have a cot in the back room. We have two small shoes by the door. None of us can say whose they are, and we have stopped asking.'" },
    { depth: "core", about: "truth:anyone_draws", source: "library", bias: "official", reliable: false, who: "Statement of the proctors, signed {official}", text: "Statement of the University proctors, signed by {official}, {year}: 'Only one mind in a thousand can divide itself to hold a binding. Those who claim otherwise are frauds who use hidden flame, and the ink-witches are the worst of them. The examinations are open to every child in the realm, at a fee of 20 silver.'" },
    { depth: "core", about: "truth:the_leak", source: "ruin", bias: "true", reliable: true, plain: true, who: "An archive porter, scratched beside the door", text: "Scratched beside the plated door, signed by a porter of the archive, {year}: 'It hums when the first-years practise, and louder every year; I have kept a tally for 30 years. The plates are a vent. Every binding in the building drains to this door. We are not teaching students. We are feeding what is behind it.'" },
    { depth: "core", about: "truth:the_leak", source: "archive", bias: "redacted", reliable: "partial", points: "sub:warm_cellars", who: "University building accounts", text: "University building accounts, {year}: 'Cellar temperature, midwinter: blood-warm. Snow on the east court: none for six years. Wells under the east court closed by order. No further enquiry.' A copy of the closing order was posted on the well-heads at {lead}." },
    { depth: "core", about: "truth:the_leak", source: "person", bias: "true", reliable: "partial", cost: true, who: "{person}, master of leakage, last words", text: "Last words of {person}, master of leakage, to an assistant, {year}: 'Don't count the leakage. Count where it goes. Then go somewhere else.' {person} had spent 11 years measuring the heat under the archive, and had lost the use of both hands to frost doing it. The assistant left the city the same week." },
    { depth: "core", about: "truth:the_leak", source: "oral", bias: "garbled", reliable: "partial", points: "site:plated_door", who: "A first-year student, letter to a brother", text: "Letter of a first-year student of the University to a brother at home, {year}: 'The University cat will not go below the second cellar. Some of us carried it down three flights for a bet, toward the door at {lead}, and it screamed until we let go. The porters laughed and said it always does that. Then they told us not to go down there again.'" },
    { depth: "core", about: "truth:the_leak", source: "library", bias: "official", reliable: false, who: "Leakage tables, foreword by {official}", text: "Foreword to the leakage tables by {official}, proctor, {year}: 'Leaked energy disperses harmlessly as heat into air and soil, as every first-year learns. It does not gather, and it goes nowhere. Reports of a warm door in the archive are to be referred to the porters, who are paid 2 silver a month to keep it dusted.'" },
    { depth: "sub", about: "sub:malfeasance", source: "temple", bias: "pious", reliable: "partial", who: "Church tract at a malfeasance trial", text: "Church tract handed out at the malfeasance trial in {place}, {year}: 'The binder who takes your hair takes your soul. There is no lawful binding; there is only the slow sin and the quick one. Bring any wax doll you find to the examiners.' Last month the examiners of {place} burned 41 dolls and hanged one student." },
    { depth: "sub", about: "sub:ink_witches", source: "library", bias: "propaganda", reliable: false, who: "Proclamation of the proctors, posted in {realm}", text: "Proclamation of the University proctors, posted in the villages of {realm}, {year}: 'The ink-witches steal children to drown them in ink, and their drawings bring only fire and madness to the villages that shelter them. A reward of 10 silver is offered for any wide-brimmed hat, with a witch under it.'" },
    { depth: "sub", about: "sub:tattooed_regiment", source: "person", bias: "true", reliable: true, who: "A sergeant of the 3rd Foot, letter home", text: "Letter of a sergeant of the 3rd Foot to a sister at home, {year}: 'They carved the strength-glyph into my arm. It works; I lifted a cart off a man. It also takes the warmth out of my blood, and I haven't been warm since spring. The surgeon says it will not get better. Send the thick socks. Send two pairs.'" },
    { depth: "sub", about: "sub:rival_script", source: "traveller", bias: "garbled", reliable: "partial", points: "sub:rival_script", who: "Harbour-master's log, {place}", text: "Harbour-master's log at {place}, {year}: 'Foreign master of the eastern circle-school landed today. Tried a binding on the quay before a crowd, to lift a crate. Nothing happened. The master went very pale and asked to see a map of our coast. Sailed on the evening tide for {lead}. Harbour dues paid: 3 silver.'" },
    { depth: "sub", about: "sub:fallen_city", source: "oral", bias: "exaggerated", reliable: "partial", points: "site:grey_city", who: "A salt carter, to a traveller", text: "Told by a carter who hauls salt past the dead city, to a traveller, {year}: 'The grey folk still stand in the streets with their hands on the lamps, waiting for the light to come back. I counted 30 in the main street from the road. I do not stop at {lead}, and I don't water the mules there.'" },
    { depth: "sub", about: "sub:scholarship", source: "archive", bias: "official", reliable: true, who: "Indenture of a scholarship student, bursar's copy", text: "Indenture of {person}, scholarship student of the University, bursar's copy, {year}: 'Tuition, board and chalk advanced: 900 silver. To be repaid by service as a lamp-wright to the city at 30 silver a year, interest at one part in ten.' A clerk has done the sum in the margin and written one word: 'Never.' {person} signed with a glyph, and the clerk's candle lit." },
    { depth: "sub", about: "sub:artificer_boom", source: "archive", bias: "official", reliable: "partial", who: "Ruling of the Hall of Artificers", text: "Ruling of the Hall of Artificers on a patent dispute, {year}: 'The claimant's heat-engine is a copy of the defendant's, line for line, save that the claimant's works. Damages: 400 gold to the defendant for the copying. The claimant keeps the patent for the working. Both parties are fined for the fire in the courtroom.'" },
    { depth: "site", about: "site:spiral_pit", source: "ruin", bias: "true", reliable: "partial", points: "site:spiral_pit", who: "A seal-master's copy from the pit", text: "Copied by a seal-master from the bottom of the pit at {lead}, {year}: the glyph for open, scratched from the inside in a beautifully neat hand, a thousand times over, each a little better than the last. The seal-master's report adds: 'The last hundred are better than mine. Recommend the register stop calling this seal sound.'" },
    { depth: "site", about: "site:child_slate", source: "oral", bias: "true", reliable: "partial", points: "site:child_slate", who: "An old woman of {place}, to {believer}", text: "Told by an old woman of {place} to {believer}, ink-witch, {year}: 'Every family in our village kept a child's slate in the shrine once, 14 of them. Nobody can remember why we stopped, or whose they were. You may look at the one with the sun on it at {lead}, if you are careful.'" },
  ],
};
