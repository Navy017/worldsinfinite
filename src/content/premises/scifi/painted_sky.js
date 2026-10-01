// The Painted Sky: the world is a made thing, a stage or a garden in a box, and its seams are starting to show.
// A bridge premise: under a medieval world the seams read as miracles, curses and the edge of the world.
export default {
  id: "painted_sky",
  name: "The Painted Sky",
  family: "scifi",
  pitch: "The world is artificial: a sealed garden painted to look endless. In more and more places the paint is flaking, and people are starting to notice.",
  slots: ["cosmology", "world-edge"],
  tone: ["wonder", "horror"],
  era: ["bronze", "medieval", "renaissance", "industrial", "post-collapse", "far-future"],
  scale: "world",
  genres: ["fantasy", "mythic", "grimdark", "farfuture", "cyberpunk"],
  bridge: true,
  w: 1,
  excludes: ["forgotten_landing"],
  pairs: [{ id: "made_kin", w: 3 }, { id: "wheel_of_suns", w: 2.5 }, { id: "unremembering", w: 2.5 }, { id: "arithmetic_of_ages", w: 1.5 }, { id: "ward_walls", w: 1.5 }],

  // the hidden truth: a world picks one
  truths: [
    { id: "pen", n: "A pen for sleepers", d: "The true bodies of every person lie asleep in cold beds somewhere outside, and this world is a painted dream laid over them to keep them quiet. The grey keepers who repair the flaws are not gods but herders, and they wipe the memory of anyone who notices too much. The Contented Church teaches people not to look, and its deans know why.", tags: ["truth:sleeper_pen"],
      known: [
        "Quiet strangers in grey visit people who talk about flaws in the world. Afterwards the talkers are calm and remember nothing. The physicians blame marsh vapours. The Contented Church says the seams must not be looked at.",
        "A fisher lost for a year at sea walked home and told a reeve about a cold hall of sleepers in rows, with the fisher's own face three beds down. The grey ones put the fisher back.",
        "A sealed room at the top of a watchtower holds one warm chair facing dark glass that shows the sleepers' hall. Every person in the world lies asleep outside it. The grey keepers are herders, and the world is a pen.",
      ] },
    { id: "rehearsal", n: "The world is a rehearsal", d: "The world has been run many times over to find an answer its makers want: a cure, a peace, a worthy heir. Every fallen age in the chronicles was an earlier run, wiped and flooded when it failed, and the people of each run are remade for the next. This run is being judged now, and the judges have already found the current ruler wanting once.", tags: ["truth:rehearsal"],
      known: [
        "A spreading fever makes people remember cities that never stood and children they never had, in perfect detail. The physicians call it the twice-lived fever. Nobody can say where the memories come from.",
        "A ruined city in a remote valley has the exact street plan of the capital, down to the alleys, and is a thousand years dead. Its cellars hold coins stamped with the face of the current ruler, worn smooth.",
        "Under the twin ruins someone carved: 'Ninth time. We are close.' The world has been run before. Each failed age was wiped and flooded, its people remade, and this run is the tenth, being judged now.",
      ] },
    { id: "memorial", n: "A memorial kept by a dying curator", d: "The world is a copy of a lost world, rebuilt from scraps of memory by a single grieving caretaker. The people are reconstructions, the blank grey places are what the caretaker could not remember, and the caretaker is failing: each year a little more of the world goes grey. Nobody has told the caretaker that the people inside are alive.", tags: ["truth:memorial"],
      known: [
        "Children say the far hills are not there until you walk toward them. Grey caverns in the high country have no colour and no texture. The physicians call it a pale mineral.",
        "An old beggar appears in every great city at once, asking for the second verses of old songs and writing the answers down. Two strangers from opposite ends of the realm share a face and a childhood.",
        "Behind the deepest grey chamber are half-drawn shapes and a plaque: 'Rebuilt as faithfully as I could.' The world is a memorial rebuilt from one keeper's memory, and the keeper is forgetting more each year.",
      ] },
  ],

  cast: [
    { role: "investigator", n: "a seam-seeker, a scholar who catalogues the places where the world contradicts itself", home: "inner", stance: "Believes the contradictions follow rules, and that rules can be written down and tested like any others." },
    { role: "official", n: "a dean of the Contented Church, which teaches that the seams are holy and must not be looked at", home: "capital", stance: "Knows more than the sermons say, and believes people are happier and safer not looking." },
    { role: "believer", n: "a wandering mender who changes small things by wanting them changed", home: "forest", stance: "Believes the world can be mended from the inside, one cup and one wound at a time, before the grey ones arrive." },
    { role: "survivor", n: "a fisher who fell from a sea-cliff, was lost for a year, and walked home", home: "coast", stance: "Wants someone to believe what was seen in the cold room, and fears the grey visitors will come back." },
  ],

  tags: ["painted_world"],

  subthemes: [
    { id: "repeating_day", n: "The Village of the Same Day", d: "One village wakes each morning to the same weather, the same quarrel and the same funeral. Only a handful of its folk have noticed, and they are trying to break the day.", w: 1, req: { any: ["realm:tiny", "realm:small", "realm:mid"] }, tags: ["theme:repeating_day"] },
    { id: "edge_expedition", n: "The Expedition to the Rim", d: "A crown-funded company has set out for the end of the world. Their last letter describes a cliff of sky that rings faintly when struck with a spear.", w: 1.3, req: { any: ["seafaring", "frontier", "scholarly", "has:port"] }, tags: ["theme:edge_expedition"] },
    { id: "far_blur", n: "The Children Who See the Blur", d: "Children here say the far hills are not there until you walk toward them. They draw the world fading into grey at a fixed distance, and their parents beat the habit out of them.", w: 0.9, truthLink: "memorial", tags: ["theme:far_blur"] },
    { id: "elder_memory", n: "The Plague of Old Memory", d: "A spreading sickness of remembering: people recall cities that never stood and children they never bore, in perfect detail. Physicians call it the twice-lived fever.", w: 1.2, truthLink: "rehearsal", tags: ["theme:elder_memory"], mark: { kind: "zone", n: "The Remembering Fields", color: "#8a7aa8", size: [1, 3], where: "inner" } },
    { id: "flickering_sky", n: "The Night the Sky Flickered", d: "During an eclipse the whole sky went out for the space of a breath, and the stars came back a finger's width out of place. The astrologers have not slept since.", w: 1, req: { any: ["faith:stars", "seers", "scholarly", "faith:sun"] }, tags: ["theme:flicker"] },
    { id: "small_miracles", n: "The Mender of Small Things", d: "A wandering prophet can change little things by wanting them changed: a cup refilled, a wound unwritten. The crowds call it holiness; the quiet ones in grey have begun to follow her.", w: 1.2, req: { any: ["pious", "zealous", "mystic", "pilgrims"] }, tags: ["theme:small_miracles"] },
    { id: "erased_town", n: "The Town That Was Never There", d: "Travellers swear there was a market town on this road. Every map now shows a forest, every local denies it, and the forest is too young and too neat.", w: 1, truthLink: "pen", tags: ["theme:erased_town"] },
    { id: "returnee", n: "The One Who Came Back", d: "A woman who fell from a sea-cliff and was lost for a year has walked home. She says she woke in a cold room among rows of sleepers, and that the sky outside was the wrong colour.", w: 0.8, truthLink: "pen", tags: ["theme:returnee"] },
    { id: "breakers", n: "The Brotherhood of the Last Stone", d: "A secret order means to crack the world open, to free everyone or to end everyone. They are not sure which, and do not think it matters.", w: 0.8, req: { any: ["unstable", "sinister", "faith:void", "autocracy"] }, tags: ["theme:breakers"] },
    { id: "doubled_folk", n: "The Twinned Strangers", d: "Two strangers from opposite ends of the realm have met and found they share a face, a voice and a childhood. Neither will leave the other's sight.", w: 0.8, truthLink: "memorial", tags: ["theme:doubled"] },
    { id: "old_beggar", n: "The Beggar Who Asks for Help", d: "An old beggar appears in every great city of the realm at once, asking passers-by what they remember of their grandmothers' songs. He writes every answer down.", w: 0.6, truthLink: "memorial", tags: ["theme:old_beggar"] },
    { id: "content_faith", n: "The Contented Church", d: "A faith whose single teaching is that the seams are holy and must not be looked at. It is the most peaceful creed in the land, and its priests know exactly why.", w: 1, req: { any: ["organised", "faith:one_god", "theocratic", "hierarchical"] }, tags: ["theme:content_faith"], mark: { kind: "zone", n: "The Untroubled Parishes", color: "#c8c0a0", size: [2, 4], where: "capital" } },
  ],

  sites: [
    { id: "blank_cave", n: "The Grey Hollow of $", kind: "anomaly", where: "mountain", truthLink: "memorial", d: "A cave whose inner chambers have no colour and no texture at all, only smooth grey.",
      layers: {
        surface: { n: "No shadows", text: "Shepherds will not enter the hollow. Torches carried inside cast no shadow, and sound goes flat after ten paces. A shepherd's dog that ran in after a hare in {year} came out the colour of ash and lived another 12 years." },
        study: { n: "The stopped stone", text: "{investigator} measured the grey walls: perfectly flat, and neither warm nor cold. A thrown stone stops in mid-air and stays there. The seam-seeker left one hanging at head height in {year}. It is still there." },
        dig: { n: "Half-drawn things", text: "Behind the deepest chamber are half-finished shapes: a doorway sketched in a single line, a tree with no leaves yet drawn, a well with no bottom. A plaque in half-formed letters is copied in the seam-seekers' register at {lead}.", points: "library" },
        revelation: { n: "Where memory ran out", text: "This place was never finished. The world was rebuilt from one keeper's memory, and here the keeper's memory ran out. The grey has spread forty paces since the first survey. The keeper is forgetting, and the hollow is where the forgetting shows first." },
      } },
    { id: "deleted_city", n: "The Twin Ruins of $", kind: "ruin", where: "remote", truthLink: "rehearsal", d: "A ruined city whose street plan is the exact plan of the capital, down to the alleys.",
      layers: {
        surface: { n: "The unfarmed valley", text: "Burned stone, older than any chronicle, in a valley nobody farms. A flood line runs across every wall at the same height, eleven feet up. The nearest village says the valley belongs to nobody and always has." },
        study: { n: "The same streets", text: "A surveyor laid the capital's street map over the ruins. Every street, well and gate matches. The palace stands where the palace stands, and the same crooked alley runs behind the same bakery, though the city is a thousand years dead." },
        dig: { n: "The worn coins", text: "In the cellars are 200 coins stamped with the current ruler's face, worn smooth with use. The oldest chronicle of the realm, which mentions a city 'let to the waters', is kept at {lead}.", points: "archive" },
        revelation: { n: "The ninth run", text: "This is the capital of an earlier run of the world, wiped and flooded when it failed. The ruler on the coins was tried before and found wanting by whoever runs the world. The same ruler sits in the palace now, and does not know there is a second chance being judged." },
      } },
    { id: "chair_tower", n: "The Topmost Room of $", kind: "wonder", where: "any", truthLink: "pen", d: "A tower with one more floor than it has from the outside.",
      layers: {
        surface: { n: "The locked door", text: "A watchtower with a door at the top of the stair that no key fits. The town has tried 60 keys over the years, including one from the cathedral. The door is oak, and the oak is warm." },
        study: { n: "The extra floor", text: "Counted from inside, the tower has seven floors. Counted from the yard, it has six. The extra floor is warm in winter. A mason measured both ways three times in {year} and resigned from the guild the next week." },
        dig: { n: "The chair", text: "Forced open: a bare room with a desk, one chair facing a pane of dark glass, and dust on everything but the chair. A list of the town folk who have been visited by the grey ones is kept by the returned fisher at {lead}.", points: "cast:survivor" },
        revelation: { n: "The watcher's seat", text: "Someone outside watches the world from here, and sits in that chair often. The glass shows the sleepers' hall: every person in the world, asleep in rows. The grey keepers are the herders, and the Contented deans have known about this room for two centuries." },
      } },
    { id: "placeholder_stone", n: "The Thousand Stones of $", kind: "anomaly", where: "any", d: "A carved standing stone that stands, identical down to a chip in its face, in a hundred other places.",
      layers: {
        surface: { n: "The waymarker", text: "An old waymarker with a worn face carved on it and a chip out of the left cheek. Drovers touch it for luck. The parish record says it has stood here since before {year}, and nobody remembers it being raised." },
        study: { n: "The same chip", text: "Pilgrims report the same stone, with the same chip and the same moss, in distant lands. {investigator} has a list of 41 sightings in nine realms. A pilgrim's scratch on one appeared on the next." },
        dig: { n: "The clean base", text: "The base is not buried. It ends a hand's width under the soil in a clean flat edge, as if cut from a block. A note of every place it has been found is kept at {lead}.", points: "cast:investigator" },
        revelation: { n: "A stand-in", text: "It is a stand-in, placed wherever the makers of the world needed a landmark and had nothing better to put there. There are about a thousand. The makers were in a hurry, and they did not expect anyone to travel this far." },
      } },
    { id: "grid_stars", n: "The Star-Well of $", kind: "shrine", where: "desert", d: "A deep well from whose bottom, at noon, the stars can be seen moving in straight lines.",
      layers: {
        surface: { n: "The hermits", text: "A dry holy well, 90 feet deep. Hermits sit at its lip by day and take turns at the bottom. The local priest calls it a place of contemplation and charges pilgrims a coin for the rope." },
        study: { n: "Ruled lines", text: "Seen from the bottom at noon, the stars drift along ruled lines and turn only at right angles. An astrologer timed one turn with a water-clock: exactly at the hour, to the drop." },
        dig: { n: "The corrected grid", text: "Scratched in the well wall by many hands over centuries is the same grid, redrawn and corrected 14 times. The newest correction matches an astrologer's eclipse log copied to {lead}.", points: "sub:flickering_sky" },
        revelation: { n: "The painted vault", text: "The sky is painted on a vault, and the painting is moved by machinery on a schedule. During the last eclipse the machinery stopped for a breath and restarted a finger out of true. The hermits have known for 300 years and charge for the rope." },
      } },
    { id: "edge_wall", n: "The Rim-Cliff beyond $", kind: "wonder", where: "remote", d: "The place where the world ends in a wall painted to look like more distant country.",
      layers: {
        surface: { n: "The fog", text: "Fog that never lifts, and a sea that brings ships back to the same shore. Fishers of the rim coast have landed at their own harbour from the wrong direction for as long as the harbour has a record: about 400 years." },
        study: { n: "The ringing pole", text: "A pole pushed into the fog meets something hard and smooth at forty paces, and rings like a bell. The expedition struck it 12 times, and each note was the same pitch." },
        dig: { n: "The brushstrokes", text: "Where the fog thins, the sky is a surface with brushstrokes in it, and a seam runs down it like a hairline crack. A sketch of the seam hangs in the palace at {lead}.", points: "archive" },
        revelation: { n: "There is an outside", text: "There is an outside. The world is enclosed, and the edge was painted to look like more world. The seam is warm to the touch. The Contented Church has burned three expedition reports that said so. The crown has just paid for a fourth expedition, and the Church has asked to send a chaplain with it." },
      } },
  ],

  beings: [
    { id: "grey_warden", n: "Grey warden", kind: "beast", d: "A mender of seams that wears whatever face is nearest: a reeve, a priest, a child. It arrives wherever people have started noticing the flaws, and afterwards nobody remembers why they were frightened.", danger: 3, biomes: ["tempforest", "grass", "boreal", "desert", "temprain"], look: { size: 1.8, group: [1, 3], move: "solo", speed: 8, col: "#8a8a90", col2: "#c0c0c8", body: "biped", active: "any", visible: false } },
    { id: "half_drawn_deer", n: "Half-drawn deer", kind: "grazer", d: "Deer whose flanks are flat colour, without hair or shading, that pass through hedges as if they were not there.", danger: 0, biomes: ["tempforest", "grass", "boreal", "alpine"], look: { size: 1.3, group: [3, 9], move: "herd", speed: 30, col: "#b89a6a", col2: "#e0e0e0", body: "quad", active: "dusk", visible: true } },
    { id: "looping_crow", n: "Looping crow", kind: "bird", d: "A crow that flies the same circuit every day and caws the same three calls, at the same hour, forever.", danger: 0, biomes: ["grass", "tempforest", "coldsteppe", "dryforest"], look: { size: 0.4, group: [1, 1], move: "solo", speed: 40, col: "#1a1a20", col2: "#4a4a5a", body: "bird", active: "day", visible: true } },
  ],

  techs: [
    { id: "ps_seam_lore", n: "Seam-lore", field: "natural_philosophy", level: 1, d: "Scholars catalogue the places where the world contradicts itself, and find the contradictions obey rules." },
    { id: "ps_true_mirrors", n: "Truth-mirrors", field: "arcana", level: 2, d: "Black glass ground to a curve that shows a place as it is, not as it is painted: bare, grey and plain." },
    { id: "ps_star_rulings", n: "The ruled heavens", field: "astronomy", level: 3, d: "Star tables that predict the sky perfectly, because the sky moves on a ruled grid." },
    { id: "ps_seam_keys", n: "Seam-keys", field: "arcana", level: 4, d: "Objects shaped to fit the cracks, which open doors onto places that are not on any map." },
    { id: "ps_unmaking_words", n: "Words of unwriting", field: "writing", level: 5, d: "Phrases that, spoken in the right place, change small facts about the world. The grey wardens come for anyone who learns more than three." },
  ],

  units: [
    { id: "ps_seam_seekers", n: "Seam-seekers", role: "magic", wpn: "staff", kit: "robe", ranks: 2, gap: 3, size: 20, w: 0.4, mods: [["theme:small_miracles", 6], ["theme:breakers", 5], ["scholarly", 1.5]] },
  ],

  faiths: [
    { id: "ps_contented", n: "The Contented", d: "The seams are the hems of the gods' garment; to stare at them is to strip the gods. Blessed are the incurious.", tags: ["faith:ps_contented", "organised"], w: 0.6, names: ["The Contented Church", "The Faith of the Unlooked-For", "The Quiet Hem of $"], mods: [["theme:content_faith", 8], ["hierarchical", 1.5]] },
  ],

  mapMarks: [
    { kind: "forbidden", n: "The Unpainted Land", d: "The farthest land is fogged and unclaimed. Ships that sail for it return to their own harbour, and those who walk in come out where they started." },
    { kind: "zone", n: "Seamlands", color: "#9a9ab0", size: [1, 3], count: [1, 2], where: "remote", d: "Country where the land repeats itself: the same hill, the same oak, the same bend of river, again and again." },
  ],

  storylines: [
    { id: "ps_same_day", n: "The Same Day in {place}", scale: "local", anchor: "town", w: 1.5, req: "painted_world",
      stages: {
        start: { h: "{person} of {place} wakes to yesterday", b: "The same rain, the same fight at the well, the same old man dying in the same bed. {person} is sure of it, and nobody in {place} believes a word.", wait: [1, 3], next: [{ to: "tries_change", w: 2 }, { to: "goes_mad", w: 1, mods: [["zealous", 1.5], ["harsh_law", 1.5]] }] },
        tries_change: { h: "{person} sets out to break the day in {place}", b: "{person} has saved the old man, stopped the fight, and found that {person2} remembers too. The day still repeats, but a little differently each time.", wait: [2, 6], fx: { flag: "loop_breaker" }, next: [{ to: "day_breaks", w: 2 }, { to: "wardens_come", w: 1, mods: [["theme:content_faith", 3], ["chance:low", 1.5]] }] },
        goes_mad: { h: "A raving villager of {place} locked away", b: "{person} kept telling the priests what they would say before they said it. The temple of {faith} has taken them in, for their own good.", fx: { stability: 2 }, end: true },
        day_breaks: { h: "Tomorrow comes to {place} at last", b: "Whatever {person} and {person2} finally did, the morning was new. The town lost a month nobody can account for, and its clocks are wrong.", fx: { science: { natural_philosophy: 0.5 }, stability: -2 }, end: true },
        wardens_come: { h: "Strangers in grey visit {place}", b: "Quiet folk in grey cloaks spent a night in {place}. In the morning {person} and {person2} were gone, and no one in town remembers ever having known them.", fx: { unrest: 6 }, end: true },
      } },
    { id: "ps_rim_voyage", n: "The Rim Expedition of {realm}", scale: "realm", anchor: "realm", w: 1.2, req: ["painted_world", { any: ["seafaring", "scholarly", "has:port", "learned"] }],
      stages: {
        start: { h: "{realm} sends a company to the end of the world", b: "{ruler} has paid for ships and mules to find where the world stops. {person}, a cartographer, leads them from {capital}.", wait: [6, 14], fx: { treasury: -40 }, next: [{ to: "wall_found", w: 2 }, { to: "lost", w: 1 }] },
        wall_found: { h: "The expedition of {realm} reaches the painted wall", b: "{person} writes that the sky ends in a cliff that rings like a bell, painted with clouds. There is a seam, and something behind it is warm.", wait: [3, 8], fx: { flag: "wall_seen" }, next: [{ to: "seam_opened", w: 1, mods: [["learned", 2], ["ruler:ambitious", 2]] }, { to: "suppressed", w: 1.5, mods: [["theocratic", 2.5], ["pious", 1.5]] }, { to: "turned_back", w: 1 }] },
        lost: { h: "No word from the rim company of {realm}", b: "The ships came back on the tide, empty and dry, with their logs written in a hand none of the crew had.", fx: { prestige: -4 }, end: true },
        seam_opened: { h: "{person} steps through the seam", b: "One member of the company came home. The survivor says they saw a hall of sleepers, or a field of earlier worlds, and will say no more except to {ruler}.", fx: { discovery: "astronomy", stability: -12, unrest: 15 }, end: true },
        suppressed: { h: "The priests of {faith} burn the rim reports", b: "Heresy, they say: the world has no wall. {person} has been confined to a monastery, and the maps of {realm} once more fade at the edges.", fx: { stability: 3, prestige: -3 }, end: true },
        turned_back: { h: "The rim company returns to {capital}", b: "{person} came home thin and silent and with a sketch of a crack in the sky. The sketch hangs in the palace, and people stand before it for hours.", fx: { prestige: 6, science: { astronomy: 0.6 } }, end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "truth", source: "library", bias: "official", reliable: "partial", who: "the Almanac of Wonders", text: "From the Almanac of Wonders, edition of {year}, chapter 1: 'The world is wider than any traveller has walked, and those who say it ends are those who have stopped walking. The so-called seams, places where the land seems to repeat or contradict itself, are tricks of tired eyes. A rested traveller sees none.' The publishers offer 5 crowns to any reader who can prove otherwise. The prize has been claimed 14 times and paid none." },
    { depth: "lore", about: "truth", source: "oral", bias: "garbled", reliable: "partial", who: "a physician's note on a nursery custom", text: "A physician of {place}, noting a nursery custom in {year}: 'The nurses here tell the little ones that if they see the world go grey at the edges, they must shut their eyes and count to 20, and the painters will finish it before they open them. Three of the children in my care say they have done it. All three say it worked.'" },
    { depth: "lore", about: "truth", source: "heretic", bias: "heretic", reliable: true, who: "{investigator}, seam-seeker", text: "Notebook of {investigator}, seam-seeker, {year}: 'Forty-one contradictions recorded so far: a repeating oak, a stream that runs uphill for a mile, a stone with the same chip in nine realms. Each one is smaller near towns and larger far from people. The world is detailed where it is watched. My full table is lodged at {lead}.'", points: "library" },

    { depth: "core", about: "truth:pen", source: "person", bias: "true", reliable: true, plain: true, who: "{survivor}, the returnee", text: "Account of {survivor}, who fell from a sea-cliff and walked home a year later, taken down by the reeve of {place}, {year}: 'There were rows of us, asleep in cold beds, as far as I could see. Hundreds. My own face was three beds down. Everyone in this world is lying in that hall. This place is a dream they keep us in. Then the grey ones put me back.'" },
    { depth: "core", about: "truth:pen", source: "temple", bias: "pious", reliable: "partial", who: "{official}, dean of the Contented", text: "From the Contented hymnal, as sung at evening service in {place}, with a note by {official}, dean: 'Sleep, children, under the painted roof. The shepherds keep the pen, and the pen keeps you.' The dean's note: the hymn is sung 3 times on feast days, and no parishioner is to ask what the pen is. The dean does not explain why not." },
    { depth: "core", about: "truth:pen", source: "heretic", bias: "exaggerated", reliable: "partial", who: "a gaoler's report", text: "Report of the gaoler of {place}, {year}: 'Cell 4 found written floor to ceiling in charcoal, the same three lines 96 times: THE BEDS ARE COLD. COUNT THREE DOWN FROM YOUR OWN FACE. THE GREY MEN ARE HERDERS. The prisoner, a tanner held for debt, says the words came from the returned fisher, who lives at {lead}. Walls whitewashed. Prisoner calm by morning.'", points: "cast:survivor" },
    { depth: "core", about: "truth:pen", source: "archive", bias: "redacted", reliable: "partial", cost: true, who: "a sheriff's report", text: "Report of the sheriff of {place}, {year}: '{person}, a dyer, has told the market for a month that the sky is painted and we are all asleep. On the night of the 9th, two gentlemen in grey visited. By morning {person} was calm, and did not know the dyer's own children, or the house, and asked for...' The remainder of the page is blank paper, never written on." },
    { depth: "core", about: "truth:pen", source: "library", bias: "official", reliable: false, who: "the College of Physicians", text: "Opinion of the College of Physicians of {realm}, {year}, requested by the Contented Church: 'The so-called grey visitors are a fancy of the overwrought. Of the 70 sightings reported this year, all were made by persons short of sleep or living near marshes. We attribute them to marsh vapours. The College recommends rest, and silence.'" },

    { depth: "core", about: "truth:rehearsal", source: "ruin", bias: "true", reliable: true, plain: true, who: "an inscription in the twin ruins", text: "Carved under the twin ruins, in a script very like ours, copied by a surveyor in {year}: 'Ninth time. We are close. The world is run again each time it fails; the waters are let in and we are made over. If you read this, you are the tenth, and they are watching what you do with the throne.' The ruins are at {lead}.", points: "site:deleted_city" },
    { depth: "core", about: "truth:rehearsal", source: "oral", bias: "garbled", reliable: "partial", who: "a ferryman of {place}", text: "A ferryman of {place}, to a traveller who asked about the flood-line on the old walls, {year}: 'Grandfather says that line on the old walls is where the gods let the water in, the last time they started over. He says they've started over nine times. Each time they count who's left, like a farmer counting lambs, and if the count's wrong, in comes the water. He made us learn to swim. All eleven of us can.'" },
    { depth: "core", about: "truth:rehearsal", source: "traveller", bias: "exaggerated", reliable: "partial", cost: true, who: "a pilgrim's letter", text: "A pilgrim's letter from {place}, {year}: 'Half the village remembers the great flood that drowned the capital. The capital is dry and two hundred years old. The reeve, {person}, remembers a spouse and two daughters who drowned in it. The parish register has no record of any of them. {person} has stopped eating. The fever has spread to {lead}.'", points: "sub:elder_memory" },
    { depth: "core", about: "truth:rehearsal", source: "archive", bias: "redacted", reliable: "partial", who: "a chronicle older than the realm", text: "From a chronicle older than the realm, leaf 12, catalogued in {year}: 'And in the year of the ending the judges looked upon the age and found it [scraped away], and the waters were let in, and the count began again.' Under a strong lamp the scraped word has 7 letters. A second copy of the chronicle is said to be held at {lead}.", points: "archive" },
    { depth: "core", about: "truth:rehearsal", source: "library", bias: "official", reliable: false, who: "the Royal Antiquary", text: "Report of the Royal Antiquary of {realm}, {year}: 'The ruins in the remote valley are the work of an earlier people who copied our ancestors' city plans. Similarity of streets is common in well-ordered towns. The coins found there are modern forgeries, 200 of them, planted by a jester. The matter is closed.'" },

    { depth: "core", about: "truth:memorial", source: "person", bias: "true", reliable: true, plain: true, who: "an old beggar of {place}", text: "Overheard by a baker of {place}, {year}, between an old beggar and a child singing on the step: 'Sing it again. No, the second verse. I had forgotten the second verse. I built all of you from what I could remember of the first world, every street and every face. I am forgetting so much now. Sing it again, and I will put it back.'" },
    { depth: "core", about: "truth:memorial", source: "ruin", bias: "true", reliable: "partial", who: "{investigator}, seam-seeker", text: "Copied by {investigator}, seam-seeker, from a plaque in the deepest grey chamber, {year}. The letters are half-formed, as if written by someone who could not remember the alphabet: 'In remembrance of all who lived. Rebuilt as faithfully as I could. Forgive what I got wrong.' The plaque is about 2 feet wide. The chamber is at {lead}.", points: "site:blank_cave" },
    { depth: "core", about: "truth:memorial", source: "temple", bias: "pious", reliable: "partial", who: "a hedge priest's sermon", text: "Sermon of a hedge priest at {place}, preached at a burial, {year}: 'The Lord of the Long Memory holds every one of us in mind. Pray for that Lord, for even a god grows tired of remembering. Last spring 3 houses on the east road went grey and flat, and the families in them with the houses. Remember them aloud. It may help.'" },
    { depth: "core", about: "truth:memorial", source: "heretic", bias: "heretic", reliable: "partial", cost: true, who: "a seeker's letter", text: "A seeker's letter from {place}, {year}: 'The twins here are not twins. One is a copy, made because the other was half forgotten. This winter {person}, the elder, began to go grey at the edges: fingertips first, then the face, which has lost its freckles and one eyebrow. The other twin is unchanged. They live at {lead}.'", points: "sub:doubled_folk" },
    { depth: "core", about: "truth:memorial", source: "library", bias: "official", reliable: false, who: "the Mining Board", text: "Circular of the Mining Board of {realm}, {year}: 'Grey caverns are a known mineral phenomenon of the high country, caused by a pale stone that dulls light. 12 have been surveyed. They are of no further interest. Reports that the caverns are growing are exaggerated by shepherds who wish to be paid for the loss of grazing.'" },

    { depth: "sub", about: "sub:edge_expedition", source: "traveller", bias: "true", reliable: true, who: "a mule-driver of the rim company", text: "A mule-driver back from the rim company, questioned at the palace in {year}: 'Forty days out we hit the sky with a spear, and it rang. Clear as a church bell. The captain wept. Up close the clouds had brushstrokes in them. I just wanted to go home. We left 6 mules and a flag at {lead}.'", points: "site:edge_wall" },
    { depth: "sub", about: "sub:elder_memory", source: "library", bias: "official", reliable: "partial", who: "a physician's casebook", text: "From a physician's casebook, {place}, {year}: 'The twice-lived fever, case 31. Patient describes a city of glass towers in perfect detail, and the death of her husband in it, in the great flood. She has never married. She can draw the street she lived on. I compared it to the twin ruins in the valley. It matches.'" },
    { depth: "sub", about: "sub:flickering_sky", source: "archive", bias: "true", reliable: true, who: "an astrologer's log", text: "An astrologer's log, the night of the eclipse, {year}: 'At totality the stars went out, all of them, for the space of a held breath. When they returned the Plough had moved one finger west. I have checked it nine times against my tables. The hermits at {lead} say they saw it happen from the bottom of the well, along a ruled line.'", points: "site:grid_stars" },
    { depth: "sub", about: "sub:content_faith", source: "temple", bias: "propaganda", reliable: false, who: "{official}, dean of the Contented", text: "Pastoral letter of {official}, dean of the Contented Church, read in all 300 parishes, {year}: 'The Contented teach only peace. Our parishes have no crime, no grief, and no heresy, as any visitor may freely see. Where a parishioner reports a seam, the parish should pray, and wait. The grey brothers will call in due course.'" },
    { depth: "sub", about: "sub:erased_town", source: "oral", bias: "garbled", reliable: "partial", who: "an old woman on the forest road", text: "An old woman on the forest road near {place}, to a royal mapmaker, {year}: 'My mother sold apples in the market at the crossroads here. Every Thursday. There is no crossroads, they tell me now, and no market, only these neat young trees. But I have her apple-scales, look, and the town's name is stamped on the pan.'" },
    { depth: "sub", about: "sub:small_miracles", source: "person", bias: "true", reliable: "partial", who: "{believer}, the mender", text: "{believer}, the wandering mender, speaking to a crowd at {place}, {year}: 'I refilled the cup. I closed the cut on the boy's arm. These are small things. The world is thin here and wants mending, and I want it mended. Twice now men in grey have followed me from town to town. They are sent by the dean at {lead}. Ask the dean why.'", points: "cast:official" },
    { depth: "site", about: "site:chair_tower", source: "person", bias: "true", reliable: "partial", who: "a mason's confession", text: "Confession of a mason to a priest of {place}, {year}: 'We forced the top door with a crowbar, 3 of us. The chair was warm, I swear it. And the glass, when I touched it, showed rows of beds, and one of them was empty. The other two say they saw nothing. They have been calm ever since.'" },
    { depth: "site", about: "site:placeholder_stone", source: "traveller", bias: "exaggerated", reliable: true, who: "a wool trader's journal", text: "Journal of a wool trader, {year}: 'I have seen the chipped-face stone in four kingdoms and on two islands. Same chip. Same moss on the north side. At {place} I scratched my mark on it, a cross in a circle, with my knife. Two months later I found my mark on the next one, 300 miles south, fresh.'" },
  ],
};
