// The Leavings (merged with the Visited Ground): something vast passed through and left; where it touched down, the laws of nature broke.
export default {
  id: "leavings",
  name: "The Leavings",
  kind: "history",
  family: "world",
  pitch: "Long ago, something vast passed through the world without noticing us, and left. Where it touched down, nature stopped working normally, and those zones are full of priceless objects and deadly traps.",
  slots: ["ecology", "economy-resource", "monster-source"],
  tone: ["horror", "melancholy"],
  era: ["medieval", "renaissance", "industrial", "post-collapse"],
  scale: "regional",
  genres: ["fantasy", "grimdark", "flintlock", "postapoc"],
  w: 1,
  excludes: [],
  pairs: [{ id: "splinter_world", w: 2 }, { id: "sleeper", w: 2 }, { id: "pale_visitor", w: 2 }, { id: "balanced_circle", w: 1.2 }],

  truths: [
    { id: "litter", n: "The visit was a roadside halt", d: "The visitors stopped here briefly, the way travellers stop by a road, and left their litter behind. The zones mean nothing and want nothing. The one exception is the room at the heart of the deepest zone, which grants a wish to whoever reaches it, and the last stretch always kills whoever walks first, so every wish has cost a guide's life.", tags: ["truth:visit_litter"],
      known: [
        "Runners tell of a golden room at the centre of the deepest zone that grants wishes. The temple calls it a sinners' fable. The bones on the paths to the centre show that many people have believed it anyway.",
        "{survivor}, an old runner, says the room is real and that the last stretch needs someone to walk ahead and die. An apprentice who went in with {survivor} has never come home.",
        "An academy essay compares the zones to the litter travellers leave by a road. Nothing found in them seems made for people or aimed at them. The temple's account of a judgement fits none of the evidence.",
        "Confirmed: the visitors did not come for us and did not notice us. The zones are what they left behind. The room at the heart grants a wish, and the guide who walks first pays for it with their life.",
      ] },
    { id: "seeding", n: "The zones are converting the world", d: "The zones are not debris but a slow transformation. They copy everything they touch, hedges, towers, people, and turn it into something else. They grow a few hundred yards a year, the cordon hides the figures, and the runners who go in most often are already halfway changed, along with their children.", tags: ["truth:visit_seeding"],
      known: [
        "Cordon surveys stopped publishing the zone's boundary figures some years ago. The crown's library says the zones are fixed. Farmers near the edge say the birds over their fields have started hanging still.",
        "Midwives near the cordon say runners' babies are born different: fur, quiet eyes, no fear of fire. A tower abandoned to the zone has a note scratched on it saying the next tower is 'a copy now'.",
        "{investigator}'s measurements put the zone's growth at hundreds of yards a year. A garden inside the zone holds hedge-figures of the villagers who vanished, and a cordon fort deep inside is copying the real one.",
        "Confirmed: the zones copy whatever they touch and replace it. They are growing, and they are working on the people who enter them most. {official} has known the boundary figures for years and filed them as secret.",
      ] },
    { id: "we_did_it", n: "We made the zones", d: "There was no visitor. The academy joined twelve scholars' minds into one in a cellar experiment called the Choir, and the joining would not undo. The joined mind still sits at the heart of the largest zone, burning the will out of anyone who comes near and keeping them as guards, and the academy has blamed the sky ever since.", tags: ["truth:visit_ours"],
      known: [
        "The Faithful of the Heart walk into the zone singing and come out blank, to guard the centre. The academy says it has never worked on joining minds, and was the first to study the visit.",
        "Runners have found a cellar under the zone's centre with twelve chairs in a ring and the academy's seal on the door. An academy register mentions 'the Choir trials' and then has its pages cut out.",
        "A dying cultist said 'we are many, we are sorry, we cannot let go of each other'. An expelled scholar says the visit never happened and that the academy made the zones itself.",
        "Confirmed: the academy joined twelve minds in the ring cellar and could not separate them. The joined mind broke nature outward from the cellar and still holds the centre. The academy invented the visit to cover it.",
      ] },
  ],

  tags: ["visitation"],

  subthemes: [
    { id: "new_zone", n: "The New Zone", d: "On a clear night a light passed over the province, and in the morning a village and its fields had gone wrong: birds hang still in the air and the well water runs up.", w: 1, truthLink: "seeding", tags: ["theme:new_zone"], mark: { kind: "zone", n: "The new zone", color: "#8a6aa0", size: [1, 2], where: "any" } },
    { id: "cordon", n: "The Cordon", d: "Soldiers ring the zone with stakes, towers and lanterns. They are frightened, underpaid and very open to bribes.", w: 1.4, mods: [["standing_army", 2], ["autocracy", 1.5], ["harsh_law", 1.5]], tags: ["theme:cordon"] },
    { id: "zone_runners", n: "The Runners", d: "Illegal guides who slip past the cordon and bring out treasures. They throw nails ahead of them to find the traps, and never go in on a holy day.", w: 1.5, mods: [["poor", 1.5], ["mercenaries", 1.5], ["frontier", 1.5]], tags: ["theme:zone_runners"] },
    { id: "altered_children", n: "The Runners' Children", d: "Runners' children are born with fur, or quiet eyes, or no fear of fire. The village midwives no longer gossip about it.", w: 1, truthLink: "seeding", tags: ["theme:altered_children"] },
    { id: "lost_expedition", n: "The Twelfth Expedition", d: "The academy sent its twelfth expedition into the zone, every member known only by trade: surveyor, physician, soldier, scribe. None came back. Then they all came back.", w: 0.9, req: { any: ["scholarly", "academies", "learned"] }, truthLink: "seeding", tags: ["theme:lost_expedition"] },
    { id: "relic_city", n: "The Lamp City", d: "A whole town is lit and heated by a single rod brought out of the zone. Nobody knows when it will stop, or what it costs.", w: 1, req: { any: ["has:city", "mercantile", "urbane"] }, tags: ["theme:relic_city"] },
    { id: "surge", n: "The Surge", d: "Once a year the zone surges. Every safe path moves, every runner's map is wrong, and the cordon towers nearest the edge go silent.", w: 1, tags: ["theme:surge"] },
    { id: "will_burned", n: "The Faithful of the Heart", d: "Cultists walk into the zone singing and come back months later, blank-eyed, to drive off anyone who approaches the centre. They do not eat, and they do not answer to their names.", w: 0.9, req: { any: ["zealous", "mystic", "pious"] }, truthLink: "we_did_it", tags: ["theme:will_burned"] },
    { id: "wishing_man", n: "The Desperate Pilgrim", d: "A ruined man has hired the best runner in the province to take him to the heart. He says he has nothing left to lose. The runner says he is wrong.", w: 0.8, truthLink: "litter", tags: ["theme:wishing_man"] },
    { id: "smuggled_wonders", n: "The Smuggled Wonders", d: "Zone treasures are sold to rich houses far away, where they misbehave: a healing stone that heals the furniture into one lump, a lamp that lights only the past.", w: 1.1, req: { any: ["mercantile", "has:port", "rich"] }, tags: ["theme:smuggled_wonders"] },
    { id: "cordon_war", n: "The Cordon War", d: "Two realms share a zone's edge and each accuses the other of smuggling. The cordons have begun shooting at each other instead of at runners.", w: 0.8, mods: [["has:rival", 2], ["martial", 1.5]], tags: ["theme:cordon_war"] },
    { id: "old_order_cellars", n: "The Cellars Beneath", d: "Runners report a stair inside the zone going down into cellars full of rusted chairs, all bolted to the floor in a ring, facing inward.", w: 0.7, req: { any: ["near:ruins", "scholarly"] }, truthLink: "we_did_it", tags: ["theme:old_order_cellars"] },
  ],

  sites: [
    { id: "the_heart", n: "The Golden Room of $", kind: "anomaly", where: "remote", truthLink: "litter", d: "The heart of the deepest zone, where something is said to grant wishes.",
      layers: {
        surface: { n: "The story every runner knows", text: "Every runner at the cordon knows the story of a golden room at the centre of the deepest zone, where wishes are granted. None admit to having seen it. A tin of ribbons hangs at the cordon gate, one for each seeker who went in; the cordon counts about three hundred." },
        study: { n: "The bone road", text: "The paths to the centre are lined with bones, each set lying where a trap took its owner: 41 sets on the last mile alone. Most lie face down and alone, a few paces ahead of a clean patch of ground where somebody else stepped next." },
        dig: { n: "The notebook", text: "Near the centre lies a runner's notebook in oilcloth. Its last page says the final stretch needs someone to walk ahead and die, and always has. The handwriting matches the confession of the old runner {lead}.", points: "cast:survivor" },
        revelation: { n: "What the room costs", text: "The visitors left the room the way travellers leave a lamp burning by a road. It grants what a person truly wants, not what they say, and the last stretch kills whoever walks first. Every wish granted here was paid for by a guide. The runners' guild still takes apprentices at twelve." },
      } },
    { id: "frozen_town", n: "The Stilled Town of $", kind: "ruin", where: "any", d: "A town frozen at the moment of the visit.",
      layers: {
        surface: { n: "Clean streets", text: "Inside the cordon stands a town without rot: painted shutters, washing on the lines, swept doorsteps. The cordon map gives its name, the date of the visit and its people, 640 of them, none evacuated. Runners walk through it quietly and touch nothing." },
        study: { n: "Warm bread", text: "Candles lit on the day of the visit still burn at the same height, and a loaf on the baker's board is still warm. {investigator} weighed one candle on two visits a year apart. It had lost the weight of a fingernail paring." },
        dig: { n: "The townsfolk", text: "The townsfolk are here, a hair's breadth out of step with time: mid-stride, mid-word, a boy mid-jump over a puddle. A woman at a door has one hand raised to call someone. The academy's yearly sketches of her are filed at {lead}.", points: "library" },
        revelation: { n: "In the way", text: "The visitors did not attack the town. They set down beside it, and the town was caught in the edge of whatever they left running. Six hundred and forty people have stood inside one second for centuries because a traveller did not look down. The woman's hand has moved an inch." },
      } },
    { id: "shape_garden", n: "The Shaped Garden of $", kind: "anomaly", where: "forest", truthLink: "seeding", d: "A village garden where the plants have grown into the shapes of its people.",
      layers: {
        surface: { n: "The empty village", text: "A village inside the zone stands empty, with an overgrown garden at its centre. Runners call it the Shaped Garden and charge double to show it. A rusted iron hoop leans against the garden gate, where it has stood since the cordon first mapped the place." },
        study: { n: "Twenty-three figures", text: "The hedges and flowers have grown into people: a woman with a basket, a child with a hoop, an old man on a stick. {investigator} counted 23 figures. The parish roll for the village lists 23 people who never came out of the zone." },
        dig: { n: "Roots and bones", text: "Inside each figure the roots are knotted around a skeleton, so tightly that the bones have bent. The newest figure, by the gate, wears a cordon coat in leaves, with seed-pods for buttons. The cordon roll of missing men is kept by the captain, {lead}.", points: "cast:official" },
        revelation: { n: "The copies", text: "The zone does not simply kill. It copies whatever it touches, keeps the copy and lets the original go to bone. The villagers were the first 23. The cordon soldier was the 24th, last spring, and {official} filed the soldier as a deserter. The garden has grown nine yards toward the cordon since." },
      } },
    { id: "ring_cellar", n: "The Ring Cellar of $", kind: "dig", where: "inner", truthLink: "we_did_it", d: "A cellar beneath the zone's centre where chairs are bolted in a ring.",
      layers: {
        surface: { n: "The stair", text: "In {year} the ground cracked open near the zone's centre, and runners found a stone stair going down. They charge forty silver to take a client to the top step and will not go to the bottom for any price." },
        study: { n: "The ring of chairs", text: "Below is a vaulted hall, older than the visit, with twelve chairs bolted to the floor in a ring, facing inward. Each has leather straps at the wrists and a copper band for the head. Eleven chairs hold bones. The twelfth is empty." },
        dig: { n: "The seal on the door", text: "The cellar door bears the academy's own seal, and the academy's oldest records list this hall as 'the Choir'. The pages that should describe the Choir trials were cut from the register held at {lead}.", points: "archive" },
        revelation: { n: "The Choir", text: "There was no visitor. The academy strapped twelve scholars into these chairs to join their minds into one, and the joining would not undo. The joined mind spread outward, breaking nature as it went, and it still holds the centre. The academy named the disaster 'the visit' and sent the first expedition to study it." },
      } },
    { id: "copy_cordon", n: "The Other Cordon House at $", kind: "anomaly", where: "remote", d: "A perfect copy of the cordon headquarters, deep inside the zone.",
      layers: {
        surface: { n: "The other fort", text: "Runners speak of a fort deep inside the zone that looks exactly like the cordon's headquarters, which stands twelve miles away outside the wire. Runners leave it off their maps and walk an extra day to go round it." },
        study: { n: "Upside down", text: "Every stone matches the headquarters, down to a cracked step by the gate. But the flag flies upside down, and the tower clock runs backwards at the right speed. {investigator} timed it against a pocket watch for an hour: exactly one hour back." },
        dig: { n: "The copied officers", text: "Inside, copied officers sit at copied desks, writing reports that end mid-word. One desk carries the cordon captain's nameplate, and the copy at it writes in the captain's hand. The real reports, which these copy, are kept by {lead}.", points: "cast:official" },
        revelation: { n: "The second shift", text: "The zone copies what it touches, and it has been touching the cordon for forty years. Each spring the copied fort gains the room the real one built the year before. When the copies finish, they will walk out and take the officers' places. Their reports now end two words later each month." },
      } },
  ],

  beings: [
    { id: "blind_hound", n: "Blind hound", kind: "predator", d: "Eyeless dogs that run in packs through the zones and hunt without sight or smell. Runners say they hear your thoughts.", danger: 2, biomes: ["tempforest", "grass", "boreal", "badlands", "swamp"], look: { size: 1, group: [4, 10], move: "pack", speed: 15, col: "#6a5a5a", col2: "#c0b0a0", body: "quad", active: "dusk", visible: true } },
    { id: "bloom_deer", n: "Bloom-deer", kind: "grazer", d: "Deer whose antlers have grown into flowering branches. Their meat tastes of honey and gives dreams that do not end.", danger: 0, biomes: ["tempforest", "grass", "boreal"], look: { size: 1.5, group: [2, 8], move: "herd", speed: 10, col: "#8a6a4a", col2: "#e0a0c0", body: "quad", active: "day", visible: true } },
    { id: "the_copied", n: "The copied", kind: "beast", d: "People who walked out of a zone looking exactly like someone who went in, and who remember everything except the journey.", danger: 1, biomes: ["tempforest", "grass", "boreal", "badlands"], look: { size: 1.7, group: [1, 4], move: "solo", speed: 5, col: "#b0a090", col2: "#5a5a6a", body: "biped", active: "any", visible: true } },
  ],

  techs: [
    { id: "lv_bolt_throwing", n: "Nail and ribbon", field: "natural_philosophy", level: 1, d: "Runners' craft: throw a nail ahead, tie a ribbon where it lands, follow the dead birds." },
    { id: "lv_click_boxes", n: "Click-boxes", field: "engineering", level: 2, d: "Little boxes that click faster near a trap, made with a sliver of zone-stone inside." },
    { id: "lv_lead_caskets", n: "Lead caskets", field: "metallurgy", level: 2, d: "Lined caskets for carrying zone treasures without being changed by them." },
    { id: "lv_relic_industry", n: "Zone-lamp industry", field: "alchemy", level: 3, d: "Workshops outside the cordon that harness rods and stones to light streets and drive mills." },
    { id: "lv_field_stations", n: "Deep field stations", field: "natural_philosophy", level: 4, d: "Fortified camps inside the zone where the academy studies the anomalies, and loses scholars." },
    { id: "lv_choir_lore", n: "The Choir record", field: "arcana", level: 5, d: "The understanding of how the zones began, and how they might be closed, harvested or joined." },
  ],

  units: [
    { id: "lv_cordon_guard", n: "Cordon guard", role: "ranged", wpn: "xbow", kit: "mail", ranks: 3, gap: 1.5, size: 100, w: 1, mods: [["theme:cordon", 6], ["theme:cordon_war", 3]] },
    { id: "lv_runners", n: "Runner scouts", role: "ranged", wpn: "javelin", kit: "light", ranks: 1, gap: 4, size: 30, w: 0.5, mods: [["theme:zone_runners", 8]] },
  ],

  govs: [
    { id: "lv_cordon_command", n: "Cordon command", d: "A military authority that rules the zone's edge and skims every treasure that crosses it; the crown is far away.", tags: ["gov:cordon", "autocracy"], w: 0.4, forms: ["Cordon Command of $", "Protectorate of $", "Exclusion of $"], ruler: "Commander of the Cordon", mods: [["theme:cordon", 6], ["frontier", 2]] },
  ],

  mapMarks: [
    { kind: "zone", n: "The zones", color: "#7a5a8a", size: [1, 3], count: [2, 4], where: "any", d: "Irregular patches where the visit touched down: bleached fields, hanging birds, rivers running uphill, and a cordon of watchtowers round each." },
    { kind: "zone", n: "The deep zone", color: "#4a2a5a", size: [2, 4], count: [1, 1], where: "remote", d: "The largest zone, with a heart no runner admits to reaching." },
  ],

  storylines: [
    { id: "lv_heart_run", n: "The Run to the Heart", scale: "local", anchor: "frontier", w: 1.4, req: "visitation",
      stages: {
        start: { h: "A pilgrim hires a runner at {place}", b: "{person}, a ruined merchant, has paid {person2}, the best runner at {place}, every coin left for a guide to the heart of the zone.", wait: [1, 3], next: [{ to: "past_cordon", w: 2 }, { to: "caught", w: 1, mods: [["harsh_law", 2], ["theme:cordon", 2]] }] },
        past_cordon: { h: "Two figures slip past the cordon at {place}", b: "The tower lamps at {place} caught two shapes running into the zone at dawn. Nobody went after them.", wait: [1, 4], next: [{ to: "reach_heart", w: 1 }, { to: "zone_takes", w: 1.5 }] },
        caught: { h: "A runner is hanged at {place}", b: "The cordon caught {person2} at the wire and hanged them at the gate. {person} paid a bribe and went home, and a week later took their own life.", fx: { unrest: 6 }, end: true },
        zone_takes: { h: "The zone keeps its visitors", b: "Only a ribbon came back out, tied to a nail. {place} has added two more names to the runners' wall.", fx: { stability: -1 }, end: true },
        reach_heart: { h: "{person} returns from the heart", b: "{person} walked out of the zone alone, weeping. {person2} did not. Within a month {person} was rich beyond counting, and {person}'s daughter, long sick, was well.", wait: [3, 8], fx: { flag: "wish" }, next: [{ to: "wish_sours", w: 1.5 }, { to: "wish_holds", w: 1 }] },
        wish_sours: { h: "The wish of {person} goes wrong", b: "The money came from a fire that burned half of {place}. The daughter does not sleep and does not speak. {person} has gone back into the zone, alone.", fx: { unrest: 12, pop: 0.95 }, end: true },
        wish_holds: { h: "{person} builds a shrine to {person2}", b: "{person} lives quietly in {place} and has raised a shrine at the cordon gate to the runner who went first. Runners touch it for luck.", fx: { stability: 2, monument: { tier: 1, name: "The First-Walker's Shrine" } }, end: true },
      } },
    { id: "lv_zone_grows", n: "The Zone Comes to {place}", scale: "realm", anchor: "realm", w: 1.2, req: ["visitation", { any: ["frontier", "big", "learned", "autocracy"] }],
      stages: {
        start: { h: "The zone's edge moves toward {place}", b: "The cordon at {place} has pulled back its towers twice this year. The birds over the farms have started hanging still.", wait: [3, 8], fx: { unrest: 10 }, next: [{ to: "academy", w: 1, mods: [["learned", 2], ["scholarly", 1.5]] }, { to: "evacuate", w: 1.5 }] },
        academy: { h: "The academy of {realm} sends an expedition", b: "{investigator} leads a numbered expedition into the zone to find out why it is growing. Each member is known only by trade.", wait: [4, 12], fx: { treasury: -30 }, next: [{ to: "choir_found", w: 1 }, { to: "copies_return", w: 1 }] },
        evacuate: { h: "{place} is evacuated", b: "{ruler} has ordered {place} emptied. Its people are on the roads, and the runners are moving into the empty houses.", wait: [4, 12], fx: { pop: 0.95 }, next: [{ to: "swallowed", w: 1.5 }, { to: "edge_stops", w: 1 }] },
        choir_found: { h: "{investigator} finds the ring cellar", b: "The expedition found a cellar under the zone's heart, with the academy's own seal on the door. {investigator} came home with the records and has asked for an audience with {ruler} alone.", fx: { discovery: "arcana", stability: -6, flag: "choir" }, end: true },
        copies_return: { h: "The expedition returns, and returns again", b: "{investigator}'s expedition came home a month early, remembering nothing of the zone. Two weeks later, they came home again.", fx: { unrest: 15, stability: -5 }, end: true },
        swallowed: { h: "The zone swallows {place}", b: "The zone took {place} in a single night. From the new cordon you can see lamps still lit in its windows, and figures moving behind them.", fx: { abandon_town: true }, end: true },
        edge_stops: { h: "The zone's edge stops short of {place}", b: "The edge stopped a mile from the town walls. The people of {place} are coming home, and the runners have a new gate.", fx: { stability: 3, treasury: 15 }, end: true },
      } },
  ],

  cast: [
    { role: "investigator", n: "an academy surveyor who measures the zone boundary for the crown", home: "capital", stance: "Wants the true figures published, and has started to suspect the academy itself." },
    { role: "official", n: "a cordon captain who signs the boundary surveys and the forty-day holds", home: "border", stance: "Wants the cordon quiet and paid; hides the boundary figures so the farms are not abandoned." },
    { role: "believer", n: "a preacher at the cordon gate who teaches that the visitors never saw us", home: "inner", stance: "Holds that the zones mean nothing, and that this is a comfort rather than a horror." },
    { role: "survivor", n: "an old runner who reached the golden room and came out alone", home: "remote", stance: "Got the wish, regrets the price, and now trains runners to refuse the last stretch." },
  ],

  fragments: [
    { depth: "lore", about: "truth", source: "archive", bias: "official", reliable: "partial", who: "{official}, cordon captain", text: "Standing order no. 4 of the cordon at {place}, signed by {official}, {year}: 'The zone, meaning the ground where the visit broke the laws of nature, is closed by royal law. The cordon, meaning the ring of towers and stakes around it, is its only gate. Any object leaving the zone is crown property. Any person leaving it is to be held for forty days and questioned.'" },
    { depth: "lore", about: "truth", source: "oral", bias: "true", reliable: "partial", who: "{survivor}, runner", text: "The runner's rule, as {survivor} teaches it to apprentices at {place}, {year}, with a bag of two hundred bent nails on the table: 'Throw a nail ahead of you. If it floats or sinks into the ground, go round. Watch the birds; if they hang still, go back. Never walk straight. Never go in on a feast day. Never, ever take a child.' Each apprentice signs a slate." },
    { depth: "lore", about: "truth", source: "traveller", bias: "exaggerated", reliable: "partial", who: "a runner in the taproom at {place}", points: "site:frozen_town", text: "Overheard in the taproom at {place}, {year}, from a runner three cups down: 'Saw a field in there where the grass grows in a spiral and the rain falls sideways. A horse stands in the middle of it, dead a hundred years and still standing. Past that is a town where the candles are still lit, at {lead}. I took a spoon off a table there. It is still warm.'" },

    { depth: "core", about: "truth:litter", source: "library", bias: "true", reliable: "partial", who: "{investigator}, academy surveyor", points: "sub:wishing_man", text: "From the twelfth lecture of {investigator}, academy surveyor, {year}: 'I have catalogued 312 objects from the zones. Not one has a handle shaped for our hands. Plotted on the map, the seven zones lie on one straight line, 140 miles long, evenly spaced, like the stops of a coach. Nothing was aimed at us. They halted, and went on.' The lecture was cited in a lawsuit about a desperate pilgrim, filed at {lead}." },
    { depth: "core", about: "truth:litter", source: "person", bias: "true", reliable: true, plain: true, who: "{survivor}, runner", text: "Confession of {survivor}, runner, taken by the cordon at {place}, {year}: 'I have been to the room. It is real. The visitors left it the way you leave a lamp by the road, and it grants what you truly want. The last two hundred yards kill whoever goes first. Always. I took my apprentice. I got what I asked for. I would give it back.'" },
    { depth: "core", about: "truth:litter", source: "heretic", bias: "heretic", reliable: "partial", who: "{believer}, preacher at the cordon gate", points: "site:the_heart", text: "Sermon of {believer} at the cordon gate of {place}, {year}, to a crowd of about sixty: 'You want meaning? There is none. They did not come for us, and they did not see us. Nobody is punishing {place}, and nobody is keeping score. The zones are what they left behind. Even the golden room at {lead} is only a lamp they forgot to put out. Go home and love your children.'" },
    { depth: "core", about: "truth:litter", source: "temple", bias: "official", reliable: false, who: "the temple of {place}", text: "Pastoral letter of the temple of {place}, read at the 4 great feasts of {year}: 'The visit was a judgement of the gods upon the wicked towns, and the zones are their just and lasting punishment. There is no golden room, and no wishes are granted to sinners. Families who pay runners to seek it will be refused burial in consecrated ground.'" },
    { depth: "core", about: "truth:litter", source: "person", bias: "true", reliable: "partial", cost: true, who: "a mother of {place}, petitioning the cordon", text: "Petition to the cordon at {place}, {year}, from the mother of {person}, apprentice runner, aged 15: 'My child went in with {survivor} in spring, carrying the nail bag. {survivor} came out alone in autumn and paid off our debts, all 40 silver, and will not look at me. I want my child's body, or the place it lies. I do not want the money.'" },

    { depth: "core", about: "truth:seeding", source: "archive", bias: "redacted", reliable: "partial", who: "a cordon survey signed by {official}", points: "cast:investigator", text: "Cordon boundary survey for {year}, signed by {official}: 'Zone boundary advanced [figure removed] yards this year on the east side, the fourth year running. Survey chain lost in the zone; replaced at cost. Recommend survey figures not be published.' Pinned to it: a note asking for the true figure, and saying the academy's own measurements are held by the surveyor {lead}." },
    { depth: "core", about: "truth:seeding", source: "person", bias: "true", reliable: true, plain: true, who: "a midwife at the cordon", text: "Register of the midwife at the cordon village of {place}, {year}, last page: 'Thirty-one births to runners' families since I began. Every one born different. Fur on the backs. Eyes that do not blink. No fear of the stove. Not sick: different. The zone copies what it touches and changes it, and it is doing that to them. I will not deliver any more of these children without a priest present.'" },
    { depth: "core", about: "truth:seeding", source: "ruin", bias: "true", reliable: "partial", who: "scratched on an abandoned cordon tower", points: "site:copy_cordon", text: "Scratched into the door of tower 9 of the cordon, abandoned to the zone in {year}, with a knife-point: 'The tower next to us is a copy now. The men in it wave. They are not our men. Their lamp is lit at the wrong hour. Corporal says we hold until relieved.' The relief column found the tower empty, and runners say the copied fort lies beyond, at {lead}." },
    { depth: "core", about: "truth:seeding", source: "library", bias: "official", reliable: false, who: "the crown geographer of {realm}", text: "From the crown geographer's yearly atlas of {realm}, {year}, page 40: 'The zones are fixed in extent, as every survey confirms. Reports of their growth arise from cordon deserters seeking excuses and farmers seeking tax relief. The boundary drawn in this atlas is the boundary of the first survey, which has not needed correction.'" },
    { depth: "core", about: "truth:seeding", source: "person", bias: "true", reliable: "partial", cost: true, who: "{person}, runner, to the cordon surgeon", text: "Statement of {person}, runner of {place}, to the cordon surgeon in {year}: 'Eleven years in and out. My hands have gone grey to the wrist and I cannot feel heat; I burned both palms on a kettle without knowing. My son was born with eyes that do not blink. I am done running. The surgeon says I am done anyway, and has written my name in a separate book.'" },

    { depth: "core", about: "truth:we_did_it", source: "archive", bias: "redacted", reliable: "partial", who: "an academy register", points: "library", text: "Academy register, dated forty years before the visit: 'The Choir trials: twelve subjects joined, in the lower hall. Results remarkable. Subjects report one shared thought. Separation scheduled for the third day.' The following entries are cut from the binding with a knife. The binder's ledger, which counts the pages of every volume, is kept at {lead} and lists six more." },
    { depth: "core", about: "truth:we_did_it", source: "person", bias: "true", reliable: "partial", cost: true, who: "a cordon surgeon", text: "Notes of the cordon surgeon at {place}, {year}: '{person}, a carter who walked into the zone singing with the Faithful three years ago, was carried out blank-eyed. Lucid for one hour before death. Said: we are many, we are sorry, we cannot let go of each other, do not come closer or we will keep you. Then asked for a horse by name. The family buried the carter on the fourth day.'" },
    { depth: "core", about: "truth:we_did_it", source: "heretic", bias: "true", reliable: true, plain: true, who: "an expelled academy scholar, now a runner", points: "site:ring_cellar", text: "Notes on a runner's map of the deep zone, in the hand of a scholar expelled from the academy in {year}: 'There was no visitor. The academy joined twelve minds in the cellar at {lead}, and could not part them. The joined mind broke everything around it, and it still sits there. The academy's seal is on the door. I know because I helped carry the chairs down.'" },
    { depth: "core", about: "truth:we_did_it", source: "library", bias: "propaganda", reliable: false, who: "the academy of {realm}", text: "Preface to the academy of {realm}'s official history, ninth edition, {year}: 'The academy has never conducted any work on the joining of minds, which is impossible. It was the first body to send scholars to study the visit, and has sent twelve expeditions since. Rumours of a cellar bearing our seal are spread by expelled members, of whom there are three.'" },

    { depth: "sub", about: "sub:cordon", source: "traveller", bias: "true", reliable: true, who: "a pedlar's expense book", points: "cast:official", text: "Expense book of a pedlar crossing the cordon at {place}, {year}: 'A silver for the sergeant. A silver for the tower. A silver for the dog. Total, three silver, which is less than the road toll in town.' Below it: 'The cordon is not a wall. It is a toll-road. The captain, {lead}, takes the fourth silver, but you pay that one on the way out.'" },
    { depth: "sub", about: "sub:lost_expedition", source: "archive", bias: "official", reliable: "partial", who: "the academy roster, countersigned by {investigator}", text: "Roster of expedition twelve, countersigned by {investigator}, {year}: 'Departed: surveyor, physician, soldier, scribe. Returned on day 30: surveyor, physician, soldier, scribe, remembering nothing. Returned again on day 44: surveyor, physician, soldier, scribe.' Margin: 'Both sets claim the same pay. The bursar asks which set to pay. I have no answer for the bursar.'" },
    { depth: "sub", about: "sub:smuggled_wonders", source: "person", bias: "exaggerated", reliable: "partial", who: "a lady of the court, to her sister", text: "Letter of a lady of the court to her sister, {year}: 'The zone-lamp cost my husband 900 crowns before he died. It shows the room as it was a year ago, so I sit with him most evenings while he reads. He turns the pages. He does not look up. In three months it will show the night he died, and I have not decided whether to put it out first.'" },
    { depth: "sub", about: "sub:will_burned", source: "oral", bias: "garbled", reliable: "partial", who: "a cordon sergeant, to recruits", points: "site:the_heart", text: "A cordon sergeant at {place}, to new recruits in {year}: 'The Faithful walk in singing and walk out silent. They do not eat and they do not answer to names. If one of them looks at you, look away, or it will remember your face for the others. Last year two lads stared back. They are standing guard by the room at {lead} now.'" },
    { depth: "sub", about: "sub:relic_city", source: "library", bias: "propaganda", reliable: false, who: "the town council of {place}", text: "Notice of the town council of {place}, {year}: 'The great lamp of {place}, a single rod brought from the zone, heats and lights 4,000 homes at no charge. It is a gift of science and entirely safe. The sicknesses reported in the lamp quarter are the usual fevers of a crowded town. Residents should not sleep with their windows open toward the lamp, for draughts.'" },
    { depth: "sub", about: "sub:surge", source: "person", bias: "true", reliable: "partial", who: "a runner of {place}", points: "ruin", text: "A runner of {place}, writing to a partner after the surge of {year}: 'Every ribbon gone. Every cairn moved. The path I have walked for twelve years leads into a pit now. It is like the zone shuffled the cards. Three of our crew went in the day before and none came out. Meet me at {lead}; the old ruin there did not move.'" },
    { depth: "site", about: "site:frozen_town", source: "traveller", bias: "true", reliable: "partial", who: "a travelling painter", text: "Notebook of a travelling painter who bribed the cordon in {year}: 'In the stilled town a woman stands at her door mid-call, one hand raised. I drew her, and marked the hand against the doorframe in charcoal. I came back a year later with the same paper. Her hand had moved an inch toward her mouth. I did not stay to finish the second drawing.'" },
    { depth: "site", about: "site:shape_garden", source: "oral", bias: "garbled", reliable: "partial", who: "a runner, to clients", points: "site:shape_garden", text: "A runner at {place} to paying clients, {year}: 'Don't pick the flowers in the shaped garden at {lead}. They're still people, and they still feel it. A client last spring took one rose off the woman with the basket. Twenty-three figures, and every one of them turned its head. We were out in an hour, and the client's hand has not stopped bleeding.'" },
  ],
};
