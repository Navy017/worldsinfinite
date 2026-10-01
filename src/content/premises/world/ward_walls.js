// The Ward-Walls: a people survive behind colossal walls against the things outside, and the story of why is a lie.
export default {
  id: "ward_walls",
  name: "The Ward-Walls",
  kind: "shape",
  family: "world",
  pitch: "A crowded people live behind huge rings of wall to keep out the man-eating giants that roam outside. The official history of the walls is a lie, written by the people who built them.",
  slots: ["history-secret", "state-control"],
  tone: ["grim", "horror"],
  era: ["medieval", "renaissance", "industrial"],
  scale: "regional",
  genres: ["fantasy", "grimdark", "flintlock", "shonen"],
  w: 1,
  excludes: ["strewn_sky"],
  pairs: [{ id: "blood_debt", w: 2.5 }, { id: "nursery_sea", w: 1.5 }, { id: "long_dark", w: 2 }, { id: "unremembering", w: 2 }, { id: "balanced_circle", w: 1.5 }],

  cast: [
    { role: "investigator", n: "a cartographer of the Outward Corps who maps the giant country", home: "forest", stance: "Wants an honest map of what is outside, and has started to notice what the Garrison will not let anyone draw." },
    { role: "official", n: "a censor of the Garrison's Office of History", home: "capital", stance: "Believes the walled people would tear themselves apart if they knew the truth, and edits accordingly." },
    { role: "believer", n: "a warden-priest of the Wall Faith who guards a curtained stretch of wall", home: "inner", stance: "Holds that the walls are the gods asleep, and that waking them would be the end of everything." },
    { role: "survivor", n: "a widow of the lost outer ring whose son was sent outward", home: "border", stance: "Wants a son back from the giant country, and no longer cares who hears her say so." },
  ],

  truths: [
    { id: "monsters_are_us", n: "The besiegers are people", d: "The giants outside the walls were men and women once: exiles, enemies and inconvenient soldiers of the founders, changed by a royal injection and walked out to the edge. Inside each giant the original person is still curled at the nape. The crown still keeps the injection, and a whole garrison regiment listed as lost to fever went out that way fifty years ago.", tags: ["truth:besiegers_human"],
      known: [
        "Scouts say the giants chew people and spit them out, as if not hungry. The Garrison says giants are mindless beasts like locusts, and that any resemblance to persons is the fancy of shaken soldiers.",
        "Field surgeons who cut a giant's nape report something the size of a man curled inside it. Killed giants melt into steam and leave hollows in the ground the exact shape of a person.",
        "A brass tag from the 12th Garrison Regiment, listed as lost to fever 50 years ago, was found in one of those hollows. A cell beyond the wall carries a prisoner's note about an injection.",
        "Confirmed: the giants are people the crown has changed with an injection and turned loose, our own soldiers among them. The person inside each giant is still alive. The crown still keeps the injection, and still uses it on prisoners.",
      ] },
    { id: "walls_are_weapon", n: "The walls are the weapon", d: "The walls are not stone. They are ten thousand sleeping giants standing shoulder to shoulder under plaster, stood there by the founders. Anyone with the founder's blood can wake them and march them outward, flattening everything from here to the sea. The Wall Faith guards the cracks so that nobody looks, and calls it piety.", tags: ["truth:walls_weapon"],
      known: [
        "The Wall Faith forbids anyone to touch the walls and will not let one crack be mended. The Garrison says the walls are quarried stone from the northern hills. Its own mason's report on the eighth tower was struck from the rolls.",
        "Behind a curtained shrine on the wall is a face the size of a house, with one eye open. The plaster around it is patched every spring. The face is warm.",
        "Masons cutting sideways from the face found another, and another, shoulder to shoulder. Words carved behind the plaster, signed with the founder's mark, say ten thousand stand here and one blood commands them.",
        "Confirmed: the walls are an army of 10,000 sleeping giants, and anyone of the founder's blood can wake them and march them outward. The Wall Faith has hidden this for centuries by calling the giants gods.",
      ] },
    { id: "world_moved_on", n: "The world moved on", d: "Beyond the giant country there are nations, ports and printing presses. They know about the walled people, fear them as a people who can make giants, and pay to keep the giant country between them. The Garrison has known for a century and treats any scout who reports a ship as a deserter.", tags: ["truth:walls_buffer"],
      known: [
        "The Founding Chronicle says nothing beyond the giants is left alive. A scout brought back a book in our own tongue, dated two centuries before the Founding. A stranger in good boots walked up to the outer gate untouched and asked for an audience.",
        "Garrison standing orders say there is only desert and ash beyond the giant country, and treat contrary reports as desertion. The envoy in the cell says his country prints a weekly newspaper about us.",
        "A cellar barred from the inside, in the lost outer ring, holds paintings of a harbour full of foreign ships, dated last century, and the journal of a Garrison liaison to the outside world.",
        "Confirmed: the world outside is alive and knows exactly where we are. It pays to keep the giants between us. The Garrison has known for a century and shoots the scouts who find out.",
      ] },
  ],

  tags: ["walled"],

  subthemes: [
    { id: "gate_breach", n: "The Breach at the Outer Gate", d: "A giant kicked in the outer gate a generation ago. The outer ring was lost, and its survivors are still refugees in the next ring in.", w: 1.4, req: { any: ["frontier", "realm:large", "realm:vast"] }, mods: [["martial", 1.5]], tags: ["theme:gate_breach"], mark: { kind: "zone", n: "The lost ring", color: "#5d5148", size: [2, 4], where: "border" } },
    { id: "outward_corps", n: "The Outward Corps", d: "Scouts on hooked lines and fast horses who ride beyond the walls to map and kill. Half die in their first year; the rest are despised in peacetime and adored on parade.", w: 1.4, mods: [["martial", 2], ["standing_army", 1.5], ["frontier_forts", 2]], tags: ["theme:outward_corps"] },
    { id: "wall_faith", n: "The Wall Faith", d: "A church that teaches the walls were raised by the gods and forbids anyone to touch them. Its priests guard certain stretches with their lives.", w: 1.2, req: { any: ["pious", "zealous", "organised"] }, truthLink: "walls_are_weapon", tags: ["theme:wall_faith"] },
    { id: "pre_founding_book", n: "The Book from Outside", d: "A scout came back with a book found in a ruined village beyond the walls. It is written in our tongue and dated two centuries before the Founding.", w: 1, req: { any: ["scholarly", "urbane", "academies"] }, truthLink: "world_moved_on", tags: ["theme:pre_founding_book"] },
    { id: "turned_recruit", n: "The Recruit Who Changed", d: "A cadet bled on a battlefield and stood up forty feet tall. The garrison has her in chains, and every faction wants her.", w: 0.8, mods: [["martial", 1.5], ["standing_army", 1.5]], truthLink: "monsters_are_us", tags: ["theme:turned_recruit"] },
    { id: "forbidden_crack", n: "The Forbidden Crack", d: "A crack in the inner wall may not be repaired, by order of the Wall Faith. Children dare each other to look into it.", w: 0.9, req: { any: ["pious", "theocratic", "gov:theocracy"] }, truthLink: "walls_are_weapon", tags: ["theme:forbidden_crack"] },
    { id: "shadow_throne", n: "The Throne-in-Shadow", d: "The king on the throne is a figurehead. The true royal line lives on a remote estate, and every heir who learns of it forgets within a week.", w: 1, req: "monarchy", mods: [["autocracy", 1.5], ["spy_network", 2]], tags: ["theme:shadow_throne"] },
    { id: "ring_famine", n: "The Ring Famine", d: "The inner ring eats white bread while the outer ring, swollen with refugees, eats bark. The grain carts are guarded by crossbows.", w: 1.2, mods: [["hierarchical", 2], ["poor", 1.5]], tags: ["theme:ring_famine"] },
    { id: "envoy_beyond", n: "The Envoy from Beyond", d: "A stranger in good boots walked up to the outer gate, untouched by giants, claiming to be an ambassador. He was given a cell, not an audience.", w: 0.7, req: { any: ["frontier", "has:port"] }, truthLink: "world_moved_on", tags: ["theme:envoy_beyond"] },
    { id: "giant_that_knew", n: "The Giant That Knew Her", d: "A giant stopped in front of a widow on the walls and did not attack. It wept. She says it had her husband's face.", w: 0.8, truthLink: "monsters_are_us", tags: ["theme:giant_that_knew"] },
    { id: "founding_cavern", n: "The Founding Cavern", d: "Engineers digging new cisterns under the capital broke into a crystal cavern that is on no plan, and were arrested the same night.", w: 0.8, req: "has:city", tags: ["theme:founding_cavern"] },
  ],

  sites: [
    { id: "wall_eye", n: "The Eye in the Wall at $", kind: "anomaly", where: "border", truthLink: "walls_are_weapon", d: "A stretch of wall where the plaster has fallen away from a vast, open eye.",
      layers: {
        surface: { n: "The curtained shrine", text: "A shrine built against the wall at {place}, its curtain 30 feet high, guarded day and night by 2 priests of the Wall Faith. Pilgrims may pray at it but not look. The priests will lift the curtain for a silver, and refuse nobody." },
        study: { n: "The face", text: "The curtain hides a face the size of a house, set in the wall, with one eye open. {investigator} measured the eye at 9 feet across. The plaster around it is new; the priests patch it every spring with plaster bought by the cartload." },
        dig: { n: "Shoulder to shoulder", text: "The face is warm. Masons cut sideways 40 feet and found another face behind the plaster, then another, packed shoulder to shoulder all the way round. The masons' report was struck from the rolls, but a copy survives at {lead}.", points: "archive" },
        revelation: { n: "The sleeping army", text: "The walls are an army of giants asleep on their feet, 10,000 by the founders' count. The founders stood them here, and anyone of the founder's blood can wake them. The Wall Faith calls them gods to stop anyone checking. This spring the face opened its other eye." },
      } },
    { id: "frontier_cellar", n: "The Locked Cellar of $", kind: "ruin", where: "border", truthLink: "world_moved_on", d: "A cellar in an abandoned outer-ring village, locked from the inside.",
      layers: {
        surface: { n: "The barred door", text: "A collapsed farmhouse in the lost outer ring near {place}. The cellar door is iron, barred from inside. Outward Corps riders rode past it for 60 years. It took 4 of them and a pry-bar to open it." },
        study: { n: "Three paintings", text: "A skeleton sits at a desk under 3 framed paintings of a harbour city full of ships. {investigator} counted 42 ships and 11 different flags, none flown by any realm inside the walls. A clay pipe is still in the skeleton's teeth." },
        dig: { n: "The journal", text: "The journal on the desk is a full history: the old war, the Founding, the injection, and the nations across the sea who buy our grain. Its last page names the Garrison office that received letters from outside. That office's files are at {lead}.", points: "archive" },
        revelation: { n: "The world outside", text: "There is a world outside, and it has always known exactly where we are. The founders' heirs sell it grain and peace, and it pays them to keep the giant country between us. The man in the cellar was the Garrison's own go-between. He barred the door himself." },
      } },
    { id: "crystal_founding", n: "The Crystal Hall of $", kind: "dig", where: "capital", d: "The cavern where the walls were raised, with a figure sealed in crystal at its heart.",
      layers: {
        surface: { n: "The glittering cave", text: "Cistern-diggers under {place} broke into a glittering cave that is on no plan. All 9 of them were arrested the same night. Their families say the diggers came home with glitter in their hair an hour before the guards came." },
        study: { n: "The missing figure", text: "The cave walls carry founding-day carvings: the walls rising, the gates hung, the people coming in. In every scene one figure has been chiselled out. {investigator} counted 31 scenes and 31 gaps, each the same height." },
        dig: { n: "The crystal", text: "At the centre, sealed in warm crystal, a woman in old court dress holds a crown of grey iron. The crystal grows a hair's breadth a year. The engineers' sealed report on it is held by the censor {official}, at {lead}.", points: "cast:official" },
        revelation: { n: "The first ruler", text: "The first ruler sealed herself away with the crown that commands the walls, so that nobody else could wear it. She is not dead, and the crown still works. Every censor since has known where she is. None has dared to break the crystal, or to let anyone else try." },
      } },
    { id: "giant_hollow", n: "The Hollow Field at $", kind: "anomaly", where: "remote", truthLink: "monsters_are_us", d: "A field where slain giants evaporate, leaving human-shaped hollows in the earth.",
      layers: {
        surface: { n: "Hollows in the grass", text: "A field of scorched grass near {place}, dotted with 200 hollows in the earth. The Outward Corps drives giants here to kill them, because the ground is open. Riders will not sleep in the hollows, even in rain." },
        study: { n: "Steam and shape", text: "Every killed giant dissolves into steam, and the hollow it leaves is the size and shape of one person, lying curled. {investigator} drew 50 of them. One is plainly a child of about 8." },
        dig: { n: "The tag", text: "In one hollow lay a soldier's brass tag, numbered, from the 12th Garrison Regiment, which the records list as lost to fever 50 years ago. The regiment's muster roll survives at {lead}.", points: "archive" },
        revelation: { n: "Our own", text: "Every giant was once a person. When the 12th Regiment mutinied over the bread ration, the crown gave it the injection and walked it out of the gate. The person inside each giant is still alive. The crown still keeps the injection." },
      } },
    { id: "giant_wood", n: "The Tall Wood of $", kind: "wonder", where: "forest", d: "A forest of trees so tall the giants will not enter it.",
      layers: {
        surface: { n: "Where giants wait", text: "Outward Corps riders camp in the tall wood near {place} on long patrols. The giants stand at the edge of the trees, sometimes 20 at once, and never come in. Riders hang their spare boots on the lowest branches, 80 feet up, for luck." },
        study: { n: "Rows that spell", text: "The trees were planted in rows. {investigator} climbed the tallest and found that seen from the top the rows spell words: a list of names in the old letters, half a mile long." },
        dig: { n: "The marker stones", text: "Roots bind around stone markers carved with the names of 300 families who now live inside the walls, some of them noble. One stone reads 'Exiled at the Founding'. The family it names keeps its private chapel at {lead}.", points: "temple" },
        revelation: { n: "The exiles' refuge", text: "The founders exiled 300 families at the Founding. The exiles planted this wood as a refuge, knowing the giants would not enter a forest, and carved their names beneath it. Their names now belong to the inner-ring families who sent them out and took their lands." },
      } },
  ],

  beings: [
    { id: "wall_giant", n: "Wall-giant", kind: "beast", d: "A naked, grinning humanoid four to fifteen times a man's height that eats people and ignores everything else. It feels no pain and heals from all but a cut to the back of the neck.", danger: 3, biomes: ["grass", "tempforest", "coldsteppe", "dryforest", "savanna"], look: { size: 12, group: [1, 6], move: "solo", speed: 7, col: "#c9a48a", col2: "#7a5a4a", body: "biped", active: "day", visible: true } },
    { id: "crawler_giant", n: "Crawler", kind: "predator", d: "A giant that runs on all fours, quicker and stranger than the rest. Scouts say crawlers think.", danger: 3, biomes: ["grass", "tempforest", "badlands"], look: { size: 8, group: [1, 2], move: "solo", speed: 18, col: "#b08a74", col2: "#4a3a30", body: "quad", active: "dusk", visible: true } },
    { id: "wall_rook", n: "Wall-rook", kind: "bird", d: "Black birds that nest in the cracks of the walls by the thousand and feed on what the giants leave.", danger: 0, biomes: ["grass", "tempforest", "coldsteppe"], look: { size: 0.5, group: [20, 200], move: "flock", speed: 40, col: "#1a1a1a", col2: "#5a5a6a", body: "bird", active: "day", visible: true } },
  ],

  techs: [
    { id: "ww_wall_hooks", n: "Wall-hooks", field: "engineering", level: 1, d: "Grappling lines and harnesses for climbing the walls and riding the gate-cranes." },
    { id: "ww_ring_granaries", n: "Ring granaries", field: "agriculture", level: 2, d: "Terraced farms and siege granaries packed into every spare yard inside the walls." },
    { id: "ww_gas_lines", n: "Gas-driven lines", field: "engineering", level: 3, d: "Pressure-driven grapples that let a scout swing across a giant's back. Deadly to everyone involved." },
    { id: "ww_nape_blades", n: "Nape blades", field: "metallurgy", level: 3, d: "Long, light, replaceable blades forged for the one cut that kills a giant." },
    { id: "ww_wall_cannon", n: "Wall cannon", field: "warfare", level: 4, d: "Great guns on rails along the wall-top, loaded with grapeshot for faces." },
    { id: "ww_core_cutting", n: "Core-cutting", field: "medicine", level: 5, d: "A surgeon's method for cutting a living person out of a giant's neck. It is forbidden by the crown." },
  ],

  units: [
    { id: "ww_outward_riders", n: "Outward Corps riders", role: "cavalry", mounted: 1, wpn: "sword", kit: "light", ranks: 2, gap: 4, size: 60, w: 1, mods: [["theme:outward_corps", 6], ["martial", 1.5]] },
    { id: "ww_garrison", n: "Wall garrison", role: "ranged", wpn: "xbow", kit: "mail", ranks: 4, gap: 1.2, size: 140, w: 1.5, mods: [["theme:gate_breach", 3], ["standing_army", 2]] },
  ],

  govs: [
    { id: "ww_garrison_state", n: "Garrison state", d: "The walls are the realm, and the garrison that mans them sets the bread ration, the curfew and the history.", tags: ["gov:garrison", "autocracy"], w: 0.5, forms: ["Garrison of $", "The Walled Realm of $", "Ward of $"], ruler: "Commander of the Walls", mods: [["martial", 3], ["theme:gate_breach", 4]] },
  ],

  faiths: [
    { id: "wall_faith", n: "The Wall Faith", d: "The walls are holy, raised by the gods; to touch them is sacrilege, to doubt them heresy.", tags: ["faith:wall"], w: 0.6, names: ["The Faith of the Walls", "The Holy Rampart", "The Stone Mother of $"], mods: [["theme:wall_faith", 6], ["pious", 2]] },
  ],

  mapMarks: [
    { kind: "wall", n: "The Ward-Walls", d: "Great rings of wall around the heartland, higher than any tower, gated in four places." },
    { kind: "zone", n: "The giant country", color: "#6e6050", size: [3, 6], count: [1, 2], where: "remote", d: "Empty farmland and ruined villages beyond the walls, where the giants roam." },
  ],

  storylines: [
    { id: "ww_breach", n: "The Fall of the {place} Gate", scale: "realm", anchor: "frontier", w: 1.5, req: "walled",
      stages: {
        start: { h: "A colossal giant appears over the {place} wall", b: "A giant taller than the wall itself looked over the battlements at {place}, then kicked. The gate is gone.", wait: [1, 2], fx: { unrest: 20, stability: -10 }, next: [{ to: "ring_falls", w: 2 }, { to: "held", w: 1, mods: [["theme:outward_corps", 3], ["martial", 2]] }] },
        ring_falls: { h: "The outer ring of {realm} is abandoned", b: "Boats, carts and feet: the whole outer ring of {realm} is fleeing inward. The grain will not stretch.", wait: [3, 8], fx: { pop: 0.85, abandon_town: true }, next: [{ to: "famine_riots", w: 1.5 }, { to: "retake", w: 1, mods: [["theme:turned_recruit", 4], ["standing_army", 1.5]] }] },
        held: { h: "The breach at {place} is plugged with a boulder", b: "{person} and the Outward Corps held the giants back long enough to roll a boulder into the gate. Nobody can say how it was carried.", wait: [2, 6], fx: { prestige: 6, flag: "held" }, next: [{ to: "who_carried", w: 1 }, { to: "hero_honoured", w: 1.5 }] },
        famine_riots: { h: "Bread riots in the inner rings of {realm}", b: "Refugees stormed the inner granaries. {ruler} has sent the garrison into the streets.", fx: { revolt: true, unrest: 25 }, end: true },
        retake: { h: "{realm} retakes the lost ring", b: "Led by a soldier who can become a giant, the garrison of {realm} pushed back to the old wall and sealed the gate. Nobody asks how she does it.", fx: { prestige: 12, found_town: true }, end: true },
        who_carried: { h: "The truth of the {place} boulder leaks out", b: "Witnesses say {person2} turned into a giant and carried the stone. The priests demand a burning; the garrison demands a medal.", fx: { unrest: 12, discovery: "warfare" }, end: true },
        hero_honoured: { h: "{person} is honoured in {capital}", b: "The hero of the {place} gate rode through {capital} under flowers. Within the year, the Corps' recruits trebled.", fx: { stability: 5, prestige: 4 }, end: true },
      } },
    { id: "ww_book", n: "The Book Beyond the Wall", scale: "realm", anchor: "realm", w: 1, req: ["walled", { any: ["learned", "scholarly", "academies"] }],
      stages: {
        start: { h: "A scout brings home an impossible book", b: "{person} of the Outward Corps found a book in a ruined village beyond the walls. It is dated two hundred years before the Founding of {realm}.", wait: [2, 5], next: [{ to: "copied", w: 1.5 }, { to: "seized", w: 1, mods: [["autocracy", 2], ["spy_network", 2]] }] },
        copied: { h: "Copies of the outside book spread in {capital}", b: "Students of {capital} pass hand-written copies of the outside book. It speaks of sea, ships, and the harbour-kings of 'the salt coast'.", wait: [3, 8], fx: { unrest: 8, science: { writing: 0.5 } }, next: [{ to: "truth_spreads", w: 1 }, { to: "suppressed", w: 1, mods: [["harsh_law", 2], ["theme:shadow_throne", 3]] }] },
        seized: { h: "The book is seized and {person} vanishes", b: "Grey-coated men sent by the censor {official} took the book from {person}'s barracks. {person} was seen at the inner gate, and then not at all.", wait: [2, 6], fx: { unrest: 5 }, next: [{ to: "suppressed", w: 1 }, { to: "truth_spreads", w: 0.7, mods: [["unstable", 2]] }] },
        truth_spreads: { h: "{realm} learns there is a world beyond", b: "The outside book is read aloud in the squares of {capital}. The Founding story is dead, and the crown's word with it.", fx: { stability: -20, revolution: true }, end: true },
        suppressed: { h: "The outside book is burned", b: "Every copy that could be found was burned, and the copyists with them. In {capital}, children still whisper the word 'sea' without knowing what it means.", fx: { stability: 4, unrest: 10 }, end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "truth", source: "library", bias: "official", reliable: false, who: "the Founding Chronicle, Office of History edition", text: "From the Founding Chronicle, Office of History edition of {year}, approved by the censor {official}, page 1: 'In the year of the giants the gods raised the walls in a single night, and all of humankind that remained came inside. Beyond them there is nothing left alive. Copies of this chronicle are free to every household, and possession of any other history is a crime.'" },
    { depth: "lore", about: "truth", source: "oral", bias: "garbled", reliable: "partial", who: "a refugee girl of the outer ring", text: "A refugee girl of 12 from the outer ring, to a Corps recruiter at {place}, {year}: 'My grandfather said that before the walls there was a big water that tasted of salt, and boats on it bigger than houses. Then he forgot he had said it, and asked who I was. He said it 3 times that winter. I am the only one who remembers it now.'" },
    { depth: "lore", about: "truth", source: "person", bias: "true", reliable: "partial", points: "cast:investigator", who: "an Outward Corps scout, last journal", text: "Last journal entry of an Outward Corps scout, day 19 beyond the wall, {year}: 'The giants do not eat. They chew and spit. I watched one hold a man for an hour without biting. I do not think they are hungry. I think they are sad. Send this book to the cartographer, {investigator}, at {lead}, who asked us to write down everything.'" },

    { depth: "core", about: "truth:monsters_are_us", source: "ruin", bias: "true", reliable: true, plain: true, points: "ruin", who: "scratched on a cell wall beyond the wall", text: "Scratched on the wall of cell 14 of an old prison beyond the wall at {lead}, copied by {investigator} in {year}: 'They gave us the injection and walked us to the edge. It turns a person into a giant. Garrison men did this, by the crown's order. When I wake I will not know my sister. Forgive me, whoever I eat.' 40 cells, the same kind of note in 11 of them." },
    { depth: "core", about: "truth:monsters_are_us", source: "person", bias: "true", reliable: "partial", points: "site:giant_hollow", who: "a Corps field surgeon", text: "Note of a field surgeon of the Outward Corps, {year}: 'Cut a giant's nape and you will find, curled and sleeping, something the size of a man. I have now seen it twice. Once it opened its eyes and said a word I took to be a name. We burned it before I could ask. We do our killing at the hollow field at {lead}, if the board wishes to inspect.'" },
    { depth: "core", about: "truth:monsters_are_us", source: "oral", bias: "garbled", reliable: "partial", who: "an outer-ring children's game", text: "A children's game of the outer ring, described by {investigator} in {year}: one child is the giant, the others are the wall. The giant cannot catch anyone. The giant wins only by guessing a child's name, and then that child becomes the next giant. The children have played it for at least 3 generations. Nobody can say where the rule about names came from." },
    { depth: "core", about: "truth:monsters_are_us", source: "library", bias: "official", reliable: false, who: "Garrison Manual of the Giant Country", text: "Garrison Manual of the Giant Country, {year}, section 2: 'Giants are beasts of no mind and no origin, comparable to locusts. Any resemblance to persons is the fancy of shaken soldiers. Soldiers who report that a giant spoke, wept or knew them will be given 7 days' rest and a ration of spirits, and will not report it again.'" },
    { depth: "core", about: "truth:monsters_are_us", source: "person", bias: "true", reliable: "partial", cost: true, who: "{survivor}, widow of the outer ring", text: "Petition of {survivor}, widow of the outer ring, to the Commander of the Walls, {year}: 'My son Aldo Venn, 19, struck a sergeant and was sentenced to be sent outward. On the 3rd of the month I watched from the wall as they walked Aldo out of the gate. That evening a giant came and stood under my window, very young-looking, and would not leave. I ask the Commander for my son.'" },

    { depth: "core", about: "truth:walls_are_weapon", source: "temple", bias: "pious", reliable: "partial", who: "{believer}, warden-priest of the Wall Faith", text: "Liturgy of the Wall Faith, as chanted at {place} and written out for novices by {believer} in {year}: 'Do not wake the walls, for the walls are the gods asleep, and the gods asleep are kinder than the gods awake.' {believer} adds a gloss: 'Novices will say this 7 times at the curtain each dawn. They will not lift the curtain. They will not ask why it is warm.'" },
    { depth: "core", about: "truth:walls_are_weapon", source: "ruin", bias: "true", reliable: true, plain: true, who: "carved behind the plaster, recorded by {investigator}", text: "Words carved behind the plaster of the inner wall at {place}, found when a storm cracked the facing in {year} and recorded by {investigator}: 'Ten thousand stand here. They are giants, sleeping on their feet; we stood them here. One blood commands them. When the blood speaks, the ground will shake from here to the sea.' The carving is signed with the founder's mark." },
    { depth: "core", about: "truth:walls_are_weapon", source: "archive", bias: "redacted", reliable: "partial", points: "site:wall_eye", who: "a mason's report, struck from the rolls", text: "Mason's report from the eighth tower, {year}, struck from the rolls by the Office of History: 'On removing the facing stone at a depth of 3 feet we found... [3 lines inked out] ...warm to the hand... resealed at once, by order.' A pencilled note in the margin: 'Same as at the shrine at {lead}. Do not send more masons.'" },
    { depth: "core", about: "truth:walls_are_weapon", source: "library", bias: "official", reliable: false, who: "Office of History primer", text: "From the Office of History primer for schools, {year}: 'The walls are solid quarried stone, laid in 9 courses by the founders' masons, as the quarries of the northern hills still show. The quarries are closed to visitors for safety. Pupils will draw a wall and colour it grey.'" },
    { depth: "core", about: "truth:walls_are_weapon", source: "temple", bias: "pious", reliable: "partial", cost: true, who: "register of {believer}", text: "Register of the warden-priest {believer}, shrine of the eye at {place}, {year}: 'Mason Cal Rook, sent to mend the plaster, touched the face and saw the eye move. The mason told 2 others before evening. As the law of the Faith requires, the mason's tongue was taken the next morning. The plaster is mended. The eye is still open.'" },

    { depth: "core", about: "truth:world_moved_on", source: "traveller", bias: "exaggerated", reliable: "partial", points: "archive", who: "a gaoler, report on the envoy", text: "Report of the gaoler at the outer gate, {year}: 'The prisoner calling himself an envoy told the guards his country prints a newspaper about us every week, 4 pages, and that in it we are drawn with horns. He asked for paper to write home. Refused. His boots were sent with his papers to {lead}. The boots are better than ours.'" },
    { depth: "core", about: "truth:world_moved_on", source: "ruin", bias: "true", reliable: true, plain: true, points: "site:frontier_cellar", who: "a letter in the locked cellar", text: "Letter found behind a painting in the locked cellar at {lead}, {year}, unsigned: 'There is a world outside the giant country. I have been there 30 times. The harbour in this painting is a day's ride past the last giant. They know all about us. They fear us because we can make giants, and they pay the crown to keep the giant country where it is. I am the one who carries the money.'" },
    { depth: "core", about: "truth:world_moved_on", source: "heretic", bias: "heretic", reliable: "partial", points: "site:crystal_founding", who: "a broadside of the cistern-diggers", text: "Broadside printed by the cistern-diggers' guild in {place}, {year}, after 9 diggers were arrested: 'Why do the giants never go west? Because someone in the west is paying them not to. Why were our 9 brothers taken? Because of what they found under {lead}. Ask the Office of History why their wives may not visit them.'" },
    { depth: "core", about: "truth:world_moved_on", source: "archive", bias: "official", reliable: false, who: "Garrison standing order 31", text: "Garrison standing order 31, re-issued in {year} over the seal of the censor {official}: 'Beyond the giant country there is only desert and ash, as confirmed by all 12 expeditions. Any report of water, ships, roads or persons beyond the giant country is to be treated as desertion. The reporting soldier is to be held for questioning.'" },
    { depth: "core", about: "truth:world_moved_on", source: "person", bias: "true", reliable: "partial", cost: true, who: "an Outward Corps sergeant", text: "Letter of an Outward Corps sergeant to the family of scout Mira Dane, {year}: 'Your daughter rode 9 days past the giants and came back. She said she had seen the sea and 40 ships on it. She was held under order 31 and shot as a deserter at dawn on the 5th. I was on the firing party. I believed her. I am sorry. I enclose her compass.'" },

    { depth: "sub", about: "sub:outward_corps", source: "oral", bias: "true", reliable: true, points: "site:giant_wood", who: "a Corps toast, recorded by {investigator}", text: "The toast of the Outward Corps, as {investigator} heard it at the camp in the tall wood at {lead}, {year}: 'To the wall, and to the gate.' Never to coming home; that one brings bad luck. Of the 60 riders at that fire, {investigator} notes, 31 were dead by the end of the season, and every one of them had kept to the rule." },
    { depth: "sub", about: "sub:shadow_throne", source: "person", bias: "redacted", reliable: "partial", who: "a court page, letter", text: "Letter of a court page of {realm} to a mother, {year}: 'The king asked me who the lady in grey was, who sits behind him at council. I said there is no lady in grey. He laughed and thanked me. There are 12 chairs at council and 13 cups are poured. [2 lines cut out with a knife.] Please burn this.'" },
    { depth: "sub", about: "sub:ring_famine", source: "heretic", bias: "propaganda", reliable: "partial", points: "cast:survivor", who: "chalked on the inner gate", text: "Chalked 6 feet high on the inner gate of {place} in {year}, and copied by the watch before it was scrubbed: 'INNER RING EATS, OUTER RING DIES, THE WALL KEEPS BOTH.' The watch report notes that white bread costs 2 pennies inside the gate and 2 shillings outside, and that the chalk was traced to a widow at {lead}." },
    { depth: "sub", about: "sub:giant_that_knew", source: "person", bias: "true", reliable: "partial", who: "a widow of {place}, to the Garrison", text: "Statement of a widow of {place} to a Garrison officer on the wall, {year}: 'It knelt. Right there, under the 4th gun. It has my husband's crooked tooth, and the scar on the chin from the mill. You can call me mad, but I will not let them shoot it. I have brought a chair. I will sit here.'" },
    { depth: "sub", about: "sub:wall_faith", source: "temple", bias: "propaganda", reliable: false, points: "sub:forbidden_crack", who: "a decree of the Wall Faith", text: "Decree of the Wall Faith, read from every pulpit in {year}: 'The crack at the eighth tower is a blessing of the gods and must not be touched, mended, measured or looked into, lest their gaze fall upon us in anger. The same holds for the crack at {lead}. A penance of 40 days is set for anyone who drops a pebble in.'" },

    { depth: "site", about: "site:wall_eye", source: "traveller", bias: "exaggerated", reliable: "partial", who: "a pilgrim to the shrine of the eye", text: "Letter of a pilgrim from the shrine of the eye at {place}, {year}: 'I paid the priest a silver to lift the curtain for the space of a prayer. The eye is bigger than my house. It moved. It followed my coin from the priest's hand into the box, and then it looked at me. I have given the rest of my silver to the poor.'" },
    { depth: "site", about: "site:crystal_founding", source: "archive", bias: "redacted", reliable: "partial", who: "engineers' report, sealed", text: "Engineers' report on the cistern works under {place}, sealed by the censor {official} in {year}: 'A figure in crystal. Female. Crowned with grey iron. The crystal is warm and grows a hair's breadth each year. Carvings on 31 walls. [Remainder of report sealed.] The 9 diggers are to be held until further notice.'" },
  ],
};
