// The Breach-Born: titanic creatures come through a wound in the world, and humanity builds giants to answer.
export default {
  id: "breach_born",
  name: "The Breach-Born",
  family: "scifi",
  pitch: "Titanic creatures climb out of a wound in the sea floor, humanity builds walking giants to answer them, and every victory costs a city and a pilot's mind.",
  slots: ["apocalypse", "monster-source"],
  tone: ["heroic", "grim"],
  era: ["industrial", "modern", "near-future", "far-future", "post-collapse"],
  scale: "world",
  genres: ["cyberpunk", "postapoc", "farfuture", "flintlock"],
  bridge: false,
  w: 1,
  excludes: [],
  pairs: [{ id: "unending_mobilization", w: 2.5 }, { id: "converging_choir", w: 2 }, { id: "ward_walls", w: 2 }, { id: "charter_lords", w: 1.5 }, { id: "walking_mountains", w: 1.5 }],

  cast: [
    { role: "investigator", n: "a rift-watcher of the coastal observatory who logs every wave", home: "coast", stance: "Wants the waves explained before the next one comes, and keeps two sets of numbers: the corps' and the real ones." },
    { role: "official", n: "a marshal of the Giant Corps", home: "capital", stance: "Believes the only answer to a titan is a bigger giant, and that public doubt costs cities." },
    { role: "believer", n: "a priest of the Tide Cult who keeps the offerings at the waterline", home: "coast", stance: "Believes the titans are judges, and that the coast should repent instead of building." },
    { role: "survivor", n: "a pilot of the corps whose link-partner died in the cockpit", home: "coast", stance: "Carries a dead partner's memories through the link, and no longer believes the titans are only beasts." },
  ],

  truths: [
    { id: "sent", n: "They are sent", d: "The titans are grown weapons, bred in pens on the far side of the wound by makers who want this world cleared for their own settling. The makers study every battle, and each wave is armoured at the joints the last wave lost. The corps marshals have known since wave six and struck it from the reports, because a sent enemy cannot be beaten by more giants, and the foundries sell giants.", tags: ["truth:breach_sent"],
      known: [
        "Wave six titans had armour exactly where the giants struck wave five. The conclusion of the corps report was removed by order.",
        "An egg in the estuary is stamped inside with 1,140 identical seal marks. Eggs do not stamp themselves.",
        "A scholar who linked to a dead titan's brain saw numbered stalls, a calf being tagged, and a chart of our coast with the harbours marked.",
        "Confirmed: the titans are made and sent, and each wave is designed against the last. The corps has known for years and kept building giants.",
      ] },
    { id: "are_us", n: "They are us", d: "The titans are what an older humanity became, and what the children lost in the drowning years were made into on the other side. Under the armour is a five-fingered skeleton and a human skull forty times life size. The war kills kin in both directions; the titans know it, and the corps recruits twelve-year-olds to do the killing.", tags: ["truth:breach_kin"],
      known: [
        "Pilots who touch a titan through the link report that it is afraid, and that it thinks in our words.",
        "The coast's story says the children lost in the drowning years became the great ones. The titans always come ashore at the old harbour steps.",
        "A sealed dissection report describes five-fingered hands and a human skull under the plates. The surgeon resigned the next day.",
        "Confirmed: the titans are people, grown huge. The corps knows, and its giants are built around their brains.",
      ] },
    { id: "world_answer", n: "They are the world's answer", d: "The wound was opened by the Mining Guild's deep bore at the shelf, a year before the first wave. The titans are the planet's answer to the harm, as a fever answers a splinter, and every titan killed makes the next one larger. The wave stones show it happened once before and stopped when the pit was filled. The guild has started a second bore, because titan bone sells.", tags: ["truth:breach_answer"],
      known: [
        "Each wave's titans are larger than the last: ninety feet at the shoulder in wave one, two hundred and ten in wave nine.",
        "A guild ledger records a deep bore at the shelf finished one year before the first wave, with glowing water at the bottom and a crew paid for silence.",
        "Standing stones three thousand years old show men digging a pit, titans rising, the pit filled, and titans sinking.",
        "Confirmed: the guild's bore opened the wound, and the world is answering. Killing titans makes it worse, and the guild is still drilling.",
      ] },
  ],

  tags: ["breach_titans"],

  subthemes: [
    { id: "wall_vs_giants", n: "The Wall or the Giants", d: "The council is split: build a sea wall along the whole coast, or pour the treasury into more walking giants. Both factions are paid by the same foundries.", w: 1.4, req: { any: ["coastal", "has:port", "republic", "autocracy"] }, tags: ["theme:wall_debate"], mark: { kind: "zone", n: "The Sea Wall works", color: "#6a6a70", size: [2, 4], where: "coast" } },
    { id: "bone_market", n: "The Bone Market", d: "Titan bone cures fevers, titan blood poisons wells, and both sell for a fortune. A whole quarter lives off the carcasses.", w: 1.3, req: { any: ["mercantile", "has:port", "poor"] }, tags: ["theme:bone_market"] },
    { id: "carcass_city", n: "The City in the Ribs", d: "A titan felled on the coast generations ago is now a town: houses in its ribs, a temple in its skull, a harbour in its jaw.", w: 1, req: { any: ["coastal", "island"] }, tags: ["theme:carcass_city"], mark: { kind: "zone", n: "Carcass isles", color: "#c8bca0", size: [1, 2], where: "coast" } },
    { id: "lone_pilot", n: "The Pilot Who Lost Her Partner", d: "A giant needs two minds linked to walk. One pilot's partner died mid-battle; she still carries his memories, and his habits, and sometimes his voice.", w: 1, tags: ["theme:lone_pilot"] },
    { id: "child_pilots", n: "The Children in the Cockpit", d: "Only the young can hold the link without burning out. The corps recruits at twelve, and the old marshals who send them do not sleep well.", w: 1, req: { any: ["martial", "standing_army", "gov:stratocracy", "autocracy"] }, truthLink: "are_us", tags: ["theme:child_pilots"] },
    { id: "tide_cult", n: "The Tide Cult", d: "Fishing towns that lost everything have begun to worship the titans as judges. They leave offerings at the waterline and pray for the next wave.", w: 1, req: { any: ["faith:sea", "seafaring", "poor", "pious", "faith:void"] }, truthLink: "world_answer", tags: ["theme:tide_cult"] },
    { id: "brain_link", n: "The Scientist Who Linked", d: "A brilliant and unwise scholar linked her mind to a dead titan's brain. She came back with maps of a place no one has seen, and a nosebleed that has not stopped.", w: 0.8, req: { any: ["scholarly", "academies", "learned"] }, truthLink: "sent", tags: ["theme:brain_link"] },
    { id: "gentle_titan", n: "The Titan That Does Not Attack", d: "One titan surfaced, looked at the coast for a day, and went back down. It has done so every spring since, and has never harmed anyone.", w: 0.6, truthLink: "are_us", tags: ["theme:gentle_titan"] },
    { id: "faster_cycle", n: "The Quickening Tide", d: "The waves used to come once a generation. Now they come every year, and the rift-watchers say the gaps are halving.", w: 1, truthLink: "world_answer", tags: ["theme:fast_cycle"] },
    { id: "drowned_coast", n: "The Abandoned Shore", d: "A whole coast has been given up: cities emptied, roads cut, a line drawn inland. Scavengers and the stubborn still live in the ruins.", w: 1, req: { any: ["coastal", "realm:large", "realm:vast"] }, tags: ["theme:abandoned_shore"], mark: { kind: "zone", n: "The abandoned shore", color: "#5a6a6a", size: [2, 4], where: "coast" } },
  ],

  sites: [
    { id: "the_wound", n: "The Wound off $", kind: "anomaly", where: "coast", d: "A glowing rift on the sea floor, out beyond the shelf.",
      layers: {
        surface: { n: "The blue water", text: "On calm nights the sea twenty miles out glows a sick blue, and no fish are caught there. Fishing boats steer around it, and the insurers of {realm} will not cover a hull that crosses it." },
        study: { n: "The straight trench", text: "Soundings by {investigator} found a trench on no old chart, eleven miles long, with perfectly straight edges. Old Mining Guild buoys still float above one end, rusted to their chains and numbered." },
        dig: { n: "The diving bell", text: "A diving bell lowered on 3,000 feet of cable saw rows of vast shapes in the light below, lying still like ships at anchor, each in its own stall. The bell's log and sketches went to the corps marshal at {lead}.", points: "cast:official" },
        revelation: { n: "Held open", text: "The wound is a passage, and someone on the far side holds it open: the bell's cable came back cut clean, not torn. Each wave waits in those stalls until it is sent up. The corps has known since the bell came back, and built four more giants instead of asking who." },
      } },
    { id: "carcass_isle", n: "The Bone Isle of $", kind: "ruin", where: "coast", d: "An island that is the carcass of a titan felled long ago.",
      layers: {
        surface: { n: "Ridged stone", text: "A long grey island of strange ridged stone, rich in seabirds and goats. About 400 people live in houses built between the ridges, and sell bone to the mainland by the barge-load." },
        study: { n: "Ribs and skull", text: "The ridges are ribs and the caves are a skull. The soil is unusually fertile and faintly blue. {investigator} counted 24 ribs, twelve pairs, which no fish or whale has." },
        dig: { n: "The tally room", text: "Inside the skull is a chamber of fused bone carved with tally marks from the inside: 312 marks in groups of seven. A small handprint is pressed into the bone beside them. The same handprint is carved on the standing stones at {lead}.", points: "site:old_carvings" },
        revelation: { n: "The rider", text: "A small creature shaped like a human rode inside this titan while it fought, and kept count of the days. It counted 312 before the titan was felled on this coast. The islanders found its bones a century ago and buried them in the churchyard under a stone that says 'Stranger'." },
      } },
    { id: "souled_giant", n: "The Silent Giant of $", kind: "wonder", where: "capital", truthLink: "are_us", d: "A walking giant that has not moved in thirty years, though someone is still inside it.",
      layers: {
        surface: { n: "The monument", text: "A great iron giant stands in the capital square as a monument to the first wave, pigeons on its shoulders. Its plaque names two pilots. Children are told that one of them is still inside." },
        study: { n: "The turning eyes", text: "The cockpit is sealed, yet the link-harness inside still draws power and the eyes sometimes turn. The caretaker logged nine turnings last year. Every one of them followed a child across the square." },
        dig: { n: "The hatch", text: "When the hatch is opened the pilot's seat is empty, but the link shows a mind present, frightened and young. The giant's build papers list one part only as 'core, recovered', shipped from {lead}.", points: "site:carcass_isle" },
        revelation: { n: "Thirty years of talking", text: "The giant was built around a piece of titan brain cut from the bone isle, because only titan tissue carries the link. Its young pilot never left. For thirty years pilot and titan have been talking, and the titan was a child once too. The corps built five more giants the same way." },
      } },
    { id: "old_carvings", n: "The Wave Stones of $", kind: "shrine", where: "remote", truthLink: "world_answer", d: "Ancient standing stones carved with titans rising from the sea.",
      layers: {
        surface: { n: "The headland ring", text: "A ring of 14 weathered stones on a headland, carved with great beasts and tiny people. Shepherds leave salt on the tallest stone after each wave, and do not say why." },
        study: { n: "Seven panels", text: "The carvings run in seven panels. Men dig a great pit; titans rise from the sea. Men fill the pit; the titans sink. {investigator} took rubbings and puts the stones at about 3,000 years old." },
        dig: { n: "The filled shaft", text: "Beneath the ring is a deep shaft packed with offerings and stones and capped with a slab. A guild survey marker has been hammered into the slab. It carries the bore number of the shelf works off {lead}.", points: "site:the_wound" },
        revelation: { n: "Last time", text: "This has happened before. Three thousand years ago people dug into the shelf and the titans came; they filled the pit, and the sea went quiet. This time the Mining Guild dug it, and the guild has opened a second bore because titan bone sells. Every titan killed makes the next one larger." },
      } },
    { id: "titan_egg", n: "The Egg at $", kind: "dig", where: "any", truthLink: "sent", d: "A great ribbed egg found in a silted estuary, warm and alive.",
      layers: {
        surface: { n: "The warm dome", text: "A smooth dome in the estuary mudflats that the tide never quite covers. Gulls sit on it in winter for the warmth. The mudlarks have paced it at forty feet across." },
        study: { n: "The seal marks", text: "It is warm and has a slow heartbeat, three beats a minute. Its shell is covered in marks like a seal pressed in wax, a circle with three bars, in neat rows. {investigator} counted 1,140." },
        dig: { n: "The calf", text: "Opened, it holds a curled titan-calf and a lining of woven threads too regular for any womb. The calf's armour is already thick at the joints the giants are taught to strike. The corps' strike manual is kept at {lead}.", points: "cast:official" },
        revelation: { n: "Made to order", text: "Titans are not born. They are made in pens beyond the wound, stamped with their makers' seal, and armoured against the last battle. The makers are clearing this coast to settle it. The corps marshal has read the report on this egg and ordered more giants anyway." },
      } },
  ],

  beings: [
    { id: "breach_titan", n: "Breach titan", kind: "beast", d: "A creature the size of a hill, armoured in ridged plates, glowing blue at the gills. It comes ashore, walks to the nearest city, and does not stop.", danger: 3, biomes: ["shelf", "open", "abyss"], look: { size: 80, group: [1, 1], move: "solo", speed: 15, col: "#2a3a4a", col2: "#4ab8d8", body: "reptile", active: "any", visible: true } },
    { id: "breach_parasite", n: "Rift-lice", kind: "small", d: "Dog-sized crawling parasites that drop off titans and infest the coast, spreading the blue poison wherever they nest.", danger: 2, biomes: ["coast", "mangrove", "swamp", "river"], look: { size: 0.8, group: [5, 30], move: "swarm", speed: 6, col: "#3a4a5a", col2: "#7ac8e0", body: "crab", active: "night", visible: true } },
    { id: "bone_gulls", n: "Bone gulls", kind: "bird", d: "Gulls grown huge and blue-eyed from feeding on titan carcasses. Bold, loud and slightly poisonous.", danger: 1, biomes: ["coast", "ocean"], look: { size: 0.9, group: [10, 80], move: "flock", speed: 35, col: "#e0e4e8", col2: "#4a8ab0", body: "bird", active: "day", visible: true } },
  ],

  techs: [
    { id: "bb_sea_walls", n: "Sea walls", field: "architecture", level: 1, d: "Great walls along the coast, built faster than any before them. Each new wave of titans climbs a little higher than the last." },
    { id: "bb_titan_bone", n: "Bone-craft", field: "medicine", level: 2, d: "Titan bone ground for medicine and carved for armour. The workers who carve it lose their hair." },
    { id: "bb_giants", n: "Walking giants", field: "engineering", level: 3, d: "Towering iron frames walked by their pilots' will. No one pilot can bear the strain alone." },
    { id: "bb_twin_link", n: "The twin link", field: "medicine", level: 4, d: "A harness that joins two pilots' minds to share the burden of a giant. What one remembers, both remember, for ever." },
    { id: "bb_rift_study", n: "Rift soundings", field: "natural_philosophy", level: 4, d: "Bells, lamps and listening-wires lowered into the wound. Every instrument comes back changed." },
    { id: "bb_sealing", n: "The sealing charge", field: "warfare", level: 5, d: "A weapon meant to close the wound for good. Nobody knows what it will do on the other side." },
  ],

  units: [
    { id: "bb_giants_unit", n: "Walking giant", role: "siege", wpn: "siege", kit: "plate", ranks: 1, gap: 40, size: 2, w: 0.4, mods: [["theme:child_pilots", 6], ["theme:lone_pilot", 4], ["theme:wall_debate", 2]] },
    { id: "bb_coast_guns", n: "Wall gunners", role: "ranged", wpn: "xbow", kit: "mail", ranks: 3, gap: 1.4, size: 100, w: 1, mods: [["theme:wall_debate", 4], ["theme:abandoned_shore", 2]] },
  ],

  faiths: [
    { id: "bb_tide_faith", n: "The Tide Judges", d: "The titans are judges sent by the sea for the sins of the land. They must be fed, and welcomed, and never fought.", tags: ["faith:tide_judges", "sinister"], w: 0.4, names: ["The Tide-Judges of $", "Children of the Wave", "The Waterline Faith"], mods: [["theme:tide_cult", 10], ["seafaring", 1.5]] },
  ],

  mapMarks: [
    { kind: "zone", n: "Titan-trampled ruin", color: "#4a4a50", size: [1, 3], count: [1, 2], where: "coast", d: "Coastal cities flattened by past waves, never rebuilt." },
  ],

  storylines: [
    { id: "bb_wave", n: "The Wave at {place}", scale: "local", anchor: "coast", w: 2, req: "breach_titans",
      stages: {
        start: { h: "The sea glows off {place}", b: "Fishermen of {place} report the water far out burning blue, and the fish fleeing inshore in shoals. The bells have been rung.", wait: [1, 3], next: [{ to: "landfall", w: 2 }, { to: "passes", w: 1 }] },
        landfall: { h: "A titan comes ashore at {place}", b: "It rose from the surf at dawn, larger than the harbour fort, and walked into {place}. {person} and {person2}, the corps pilots, have been sent to meet it.", wait: [1, 2], fx: { stability: -5, unrest: 10 }, next: [{ to: "victory", w: 2 }, { to: "pyrrhic", w: 1 }, { to: "city_lost", w: 1, mods: [["poor", 1.5], ["small", 1.5]] }] },
        passes: { h: "The titan off {place} turns back", b: "It rose, looked at the town for a long hour, and sank again. Some in {place} have begun leaving offerings at the waterline.", fx: { flag: "titan_turned" }, end: true },
        victory: { h: "Pilots of {realm} fell the titan of {place}", b: "The giant walked out into the surf and brought the titan down in the shallows. {person} and {person2} are heroes; the carcass is already being sold.", fx: { prestige: 10, treasury: 30 }, end: true },
        pyrrhic: { h: "The titan dies, and {person2} with it", b: "The titan fell, and so did the giant. {person} survived the wreck, but now carries the dead partner's memories through the link and answers to both names.", fx: { prestige: 5, stability: -3 }, end: true },
        city_lost: { h: "{place} is trampled into the sea", b: "No giant came in time. The titan walked through {place} and back into the waves. The survivors are moving inland.", fx: { abandon_town: true, pop: 0.9, unrest: 15 }, end: true },
      } },
    { id: "bb_wall_or_giant", n: "The Great Question of {realm}", scale: "realm", anchor: "realm", w: 1.2, req: ["breach_titans", { any: ["coastal", "has:port"] }],
      stages: {
        start: { h: "{realm} debates walls against giants", b: "After the last wave, the council of {realm} is divided: {person} calls for a wall along the whole coast, {person2} for a new corps of walking giants.", wait: [4, 10], next: [{ to: "wall_built", w: 1, mods: [["insular", 2], ["isolation", 2]] }, { to: "giants_built", w: 1, mods: [["martial", 2], ["standing_army", 2]] }] },
        wall_built: { h: "The great sea wall of {realm} rises", b: "Stone and iron have swallowed the treasury and the coast. {realm} feels safe for the first time in a generation.", wait: [6, 18], fx: { treasury: -60, stability: 6, monument: { tier: 2, name: "The Sea Wall" } }, next: [{ to: "wall_breached", w: 1 }, { to: "wall_holds", w: 1, mods: [["rich", 1.5]] }] },
        giants_built: { h: "{realm} raises a corps of walking giants", b: "The foundries of {realm} have built six giants, and the academy is testing children for the link. {person2} has been made marshal.", wait: [6, 18], fx: { treasury: -40, science: { engineering: 1 } }, next: [{ to: "rift_closed", w: 1, mods: [["learned", 2]] }, { to: "pilots_burn", w: 1 }] },
        wall_breached: { h: "The sea wall of {realm} falls", b: "The next wave was bigger, as if it had been built to climb. The wall broke at three places in one night.", fx: { pop: 0.88, stability: -15, unrest: 20 }, end: true },
        wall_holds: { h: "The wall of {realm} holds", b: "The titan beat on the wall for a day and a night, and went back to the sea. {person} is hailed in every coastal town.", fx: { prestige: 10, stability: 5 }, end: true },
        rift_closed: { h: "Giants of {realm} carry a charge into the wound", b: "Two giants walked into the deep water carrying the sealing charge. The blue light has gone out. Nobody knows what happened on the other side.", fx: { prestige: 20, discovery: "warfare", flag: "rift_sealed" }, end: true },
        pilots_burn: { h: "The child pilots of {realm} burn out", b: "The link is too much, wave after wave. The academy's first class of pilots now sit silent in a hospital by the sea, and the giants stand idle.", fx: { unrest: 15, stability: -8 }, end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "power", source: "library", bias: "official", reliable: "partial", who: "Giant Corps manual, chapter 1", text: "Giant Corps manual, chapter 1, issued to cadets in {year}: 'A giant is an iron frame 200 feet tall, walked by two pilots whose minds are joined through the link-harness. No pilot may walk a giant alone; the load of the frame will kill a single mind in minutes. Two minds share it. What else they share is a medical matter, and is covered in chapter 9.'" },
    { depth: "lore", about: "power", source: "oral", bias: "true", reliable: true, who: "A fishwife's board, bone quarter of {place}", points: "sub:bone_market", text: "Price board chalked by a fishwife in the bone quarter of {place}, {year}: 'Titan bone heals: 2 silver the ounce. Titan blood kills: not sold here. Titan meat drives you mad: not sold here either, ask next door. Titan eyes: a duke's ransom, ask the corps. Wholesale bone from the barges at {lead}.' Underneath, smaller: 'No refunds on bone.'" },
    { depth: "lore", about: "truth", source: "temple", bias: "pious", reliable: "partial", who: "{believer}, priest of the Tide Cult", points: "cast:official", text: "Warning read by {believer}, priest of the Tide Cult, at the waterline of {place}, {year}, over 60 offerings laid on the sand: 'The deep keeps its own counsel. When it sends its great ones, ask what you have done, not what you will build.' The priest named the shelf where the guild drilled. The corps arrested the priest that afternoon and took the priest to the marshal's cells at {lead}." },

    { depth: "core", about: "truth:sent", source: "person", bias: "true", reliable: "partial", cost: true, who: "{person}, linked scholar", text: "Words of {person}, the scholar who linked to a dead titan's brain, taken down by {investigator} at the observatory in {year}: 'I saw where they come from. Stalls in rows, like a cattle fair, each with a number burned over it. A hand with too many joints tied a tag to a calf's ear. On the wall behind it was a chart of our coast, with the harbours marked.' {person}'s nose has bled for 40 days. The physicians do not expect the scholar to see the spring." },
    { depth: "core", about: "truth:sent", source: "archive", bias: "redacted", reliable: "partial", who: "{official}, corps marshal", points: "cast:investigator", text: "Corps after-action report on wave six, {year}, signed by {official}: 'Wave six titans showed new armour at the exact 4 joints our giants struck in wave five. Conclusion: [removed by order of the marshal].' A clerk's note on the back says the unredacted copy was sent, by mistake, to the rift-watch at {lead}." },
    { depth: "core", about: "truth:sent", source: "ruin", bias: "true", reliable: true, plain: true, who: "{investigator}, rift-watcher", points: "site:titan_egg", text: "Report of {investigator}, rift-watcher, on the egg dug up at {lead}, {year}: 'Stamped into the inner shell, in rows, is one small mark: a circle with three bars, pressed like a seal into wax. I counted 1,140 of them. Eggs do not stamp themselves. These animals are made, someone signs their work, and someone sends them here.'" },
    { depth: "core", about: "truth:sent", source: "heretic", bias: "exaggerated", reliable: "partial", who: "Broadsheet on the foundry gates of {place}", text: "Broadsheet pasted on the foundry gates of {place}, {year}, 500 copies: 'THEY ARE NOT BEASTS. THEY ARE PLOUGHS. SOMEONE IS CLEARING THE FIELD. Every wave is built to beat the last. Ask the marshal why wave six had armour where we struck wave five. Ask why the foundries never complain about the cost of giants.'" },
    { depth: "core", about: "truth:sent", source: "library", bias: "official", reliable: false, who: "Bestiary of the Giant Corps", text: "Official bestiary of the Giant Corps, {year} edition, approved by {official}: 'The titans are wild animals of the deep trench, driven ashore by hunger. Their behaviour is instinctive and wholly without design. Any likeness between their armour and our tactics is coincidence. Cadets who repeat otherwise will lose ten days' pay.'" },

    { depth: "core", about: "truth:are_us", source: "person", bias: "true", reliable: "partial", who: "{survivor}, corps pilot", text: "Link-record of {survivor}, pilot of the Giant Corps, taken by the corps physician after the battle at {place}, {year}: 'In the link I touched it for 2 seconds. It was afraid. It was thinking of its mother. It was thinking in our words, the way my partner used to.' The physician's note: 'Pilot to be rested. Do not let the pilot talk to the cadets.'" },
    { depth: "core", about: "truth:are_us", source: "oral", bias: "garbled", reliable: "partial", who: "A net-mender of {place}", text: "A net-mender of {place}, telling {investigator} the story the whole coast knows, {year}: in the drowning years 300 children were put in boats to escape the flood, and the boats went down past the shelf. The children became the great ones, and they are only trying to come home. The net-mender's proof: the titans always come ashore at the old harbour steps." },
    { depth: "core", about: "truth:are_us", source: "archive", bias: "redacted", reliable: "partial", plain: true, who: "The corps surgeon at the bone isle", points: "site:carcass_isle", text: "Sealed dissection notes of the corps surgeon at {lead}, {year}: 'Under the plates the skeleton is human: five-fingered hands, a human skull at forty times life size, the same 12 pairs of ribs. These are people, grown huge. Recommend no further dissection be...' The notes stop there. The surgeon resigned the next day and moved inland." },
    { depth: "core", about: "truth:are_us", source: "library", bias: "propaganda", reliable: false, who: "Giant Corps recruiting poster", text: "Recruiting poster of the Giant Corps, posted in every school in {realm} in {year} by order of {official}: 'THEY ARE MONSTERS. YOU ARE THE WALL. NOTHING THAT COMES FROM THE DEEP HAS EVER BEEN HUMAN. Age 12 and up. Three meals a day. Your name on the monument.'" },
    { depth: "core", about: "truth:are_us", source: "archive", bias: "true", reliable: "partial", cost: true, who: "Corps hospital log", text: "Corps hospital log, ward by the sea at {place}, {year}: 'Cadet pilot {person}, age 13, held the link with a titan while it died, as ordered, to keep it from thrashing into the town. Since then {person} says only the titan's last thought: \"take me home\". Four years on the ward. The cadet's mother visits every Sunday. No change.'" },

    { depth: "core", about: "truth:world_answer", source: "archive", bias: "redacted", reliable: "partial", who: "Mining Guild ledger, page 88", points: "site:the_wound", text: "Mining Guild ledger, page 88, {year}: 'Deep bore at the shelf completed to record depth, 9,000 feet. Water at the bottom glowing blue. Crew of 40 paid off and dismissed with a bonus for silence.' The entry is dated one year before the first wave. The bore stood over the water now called {lead}." },
    { depth: "core", about: "truth:world_answer", source: "ruin", bias: "true", reliable: true, plain: true, who: "{investigator}, rift-watcher", points: "site:old_carvings", text: "Report of {investigator} on the wave stones at {lead}, {year}: 'The carvings show it plainly, in 7 panels. Men dig a great pit; the great ones rise from the sea. Men fill the pit; the great ones sleep. This has happened before. This time we dug the pit, and the guild is still digging it.'" },
    { depth: "core", about: "truth:world_answer", source: "person", bias: "true", reliable: "partial", who: "{investigator}, rift-watcher", text: "Journal of {investigator}, rift-watcher at {place}, {year}: 'Each titan we kill, the next is larger. Wave one: 90 feet at the shoulder. Wave nine: 210. The corps calls it chance. I call it a body learning that it must send more. I now keep two sets of numbers, the corps' and mine, and only one of them goes to the marshal.'" },
    { depth: "core", about: "truth:world_answer", source: "library", bias: "official", reliable: false, who: "Statement of the Mining Guild", text: "Statement of the Mining Guild, endorsed by {official} before the council of {realm}, {year}: 'The trench off the shelf is an ancient natural feature, older than any human works. No connection to the deep bores has been found. The guild's second bore, at 12,000 feet, will bring work to 600 families.'" },
    { depth: "core", about: "truth:world_answer", source: "person", bias: "true", reliable: "partial", cost: true, who: "{person}, sibling of a bore crewman", text: "Petition of {person} to the council of {realm}, {year}: 'My brother was one of the 40 who drilled the deep bore. The crew were paid to keep quiet, and my brother kept quiet until the wave took our street, then drank the bonus and walked into the sea with the receipt in his coat. The guild is drilling a second bore. I ask the council to stop it.' Filed; no reply." },

    { depth: "sub", about: "sub:lone_pilot", source: "person", bias: "true", reliable: true, who: "{survivor}, corps pilot", text: "Letter of {survivor}, pilot, to the mother of a dead link-partner, {year}: 'Your son still hums when I make tea. I don't know the tune; you will. He died at {place} with the link open, and I got his memories, all 19 years of them. I know where he hid the key to your garden shed. It is under the third pot.'" },
    { depth: "sub", about: "sub:bone_market", source: "traveller", bias: "exaggerated", reliable: "partial", who: "A cloth merchant in the bone quarter", points: "site:carcass_isle", text: "Travel notes of a cloth merchant in the bone quarter of {place}, {year}: 'Children play with titan teeth as tall as they are. Every second shop sells a cure, and I counted 14 cures for the same cough. Half the wells are blue, and the water-seller charges extra for water that is not. The bone comes in on barges from {lead}.'" },
    { depth: "sub", about: "sub:child_pilots", source: "library", bias: "propaganda", reliable: false, who: "{official}, corps marshal", text: "Annual report of the Giant Corps academy, signed by {official}, {year}: 'The young pilots of the corps are volunteers of the finest families, who serve proudly and return home with honour. Of last year's class of 60, all served proudly.' The report does not say how many returned home, with honour or without." },
    { depth: "sub", about: "sub:tide_cult", source: "temple", bias: "pious", reliable: "partial", who: "{investigator}, rift-watcher", text: "A waterline hymn of the Tide Cult, sung at dawn at {place} and copied by {investigator} in {year}: 'Come, judge, come walking; we have set the table on the shore.' {believer} leads it every morning beside 3 long tables of bread and salt fish. The harbour council has asked, twice, that the tables be moved further from the harbour." },
    { depth: "sub", about: "sub:gentle_titan", source: "oral", bias: "true", reliable: "partial", who: "A ferry-keeper of {place}", text: "A ferry-keeper of {place}, talking to {investigator} in {year}: 'Every spring the old one comes up past the point, 300 feet of it, and looks at the town for a whole day. Then it goes down again. It has never hurt anyone. My aunt lost two boys in the drowning years. She says it is looking for someone, and she has started standing on the quay in her good coat.'" },
    { depth: "sub", about: "sub:faster_cycle", source: "archive", bias: "true", reliable: true, who: "Tally board of the rift-watch", points: "site:the_wound", text: "Tally board of the rift-watch at {place}, copied by {investigator} in {year}: 'Waves 1 to 3: 30 years apart. Waves 4 to 6: 8 years apart. Waves 7 to 9: one a year.' Someone has chalked in the next line: 'Wave 10: half a year?' The watch has asked the corps for a boat to sound the wound off {lead} again. The corps has not answered." },
    { depth: "site", about: "site:souled_giant", source: "person", bias: "true", reliable: "partial", who: "Caretaker of the monument square", text: "Complaint of the caretaker of the monument square at {place} to the corps office, {year}: 'The monument's eyes followed me across the square again, 40 paces, left to right. I asked the corps about it. They told me to stop asking. I would like it in writing that I have stopped asking, and I would like a different square.'" },
  ],
};
