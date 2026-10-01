// The Converging Choir: children born with minds that reach out, and a pull toward one mind for everyone.
export default {
  id: "converging_choir",
  name: "The Converging Choir",
  family: "scifi",
  pitch: "Children are being born who can read and move other minds, and each new gift brings closer the day when every mind in the world merges into one.",
  slots: ["mind-substrate", "power-access", "state-control"],
  tone: ["horror", "melancholy"],
  era: ["industrial", "modern", "near-future", "far-future"],
  scale: "world",
  genres: ["cyberpunk", "farfuture", "postapoc", "flintlock"],
  bridge: false,
  w: 1,
  excludes: [],
  pairs: [{ id: "visited_ground", w: 3 }, { id: "gentle_eye", w: 2 }, { id: "breach_born", w: 1.5 }, { id: "charter_lords", w: 1.5 }, { id: "unending_mobilization", w: 1.5 }],

  cast: [
    { role: "investigator", n: "a Registry examiner who tests the seven-year-olds of every district", home: "any", stance: "Believes in the tests, and has started keeping a private count of what they show." },
    { role: "official", n: "a deputy director of the Registry of Gifts", home: "capital", stance: "Holds that the gift must be dosed, counted and kept quiet, or the cities will burn the gifted in the street." },
    { role: "believer", n: "a crater pilgrim who leads the night singing at the fence", home: "inner", stance: "Believes the union will be paradise, the end of every loneliness, and is trying to call it closer." },
    { role: "survivor", n: "an Unbound runaway, a gifted child who escaped the Registry and grew up hiding", home: "mountain", stance: "Has felt the pull and run from it, and now moves younger runaways from safe house to safe house." },
  ],

  truths: [
    { id: "merge_purpose", n: "The merge is what the gift is for", d: "The gifts are early symptoms of a change in the whole species, and the pull every strong psychic feels is its direction. Gifted births have gone from one in four thousand to one in a hundred and sixty in three decades. The union is coming whether anyone wants it or not. The Spire of Hands is what the first hundred to arrive early became, and the only open question is whether the rest of us arrive gently.", tags: ["truth:choir_purpose"],
      known: [
        "Strong psychics describe a pull, like being cold and knowing where the fire is. The Registry says proper dosing removes it.",
        "Gifted births have risen from one in four thousand to one in a hundred and sixty in three decades. The Registry's projection was redacted.",
        "A village of gifted families no longer speaks or quarrels, and visitors forget their own names there. A spire of fused bodies says 'come in'.",
        "Confirmed: the whole species is changing toward one mind. The gift is the first symptom, and the pull is the direction.",
      ] },
    { id: "union_council", n: "A council is forcing it", d: "The Philosophers of Union, a salon of rich and kind people, have spent five generations breeding, drugging and training the gifted in their orphan homes to bring the union early. They believe being separate is the root of all suffering, and mean to end it for everyone at once, in a year their birth ledgers have already fixed. Their orphans do not know whose children they are. They were bred for the date.", tags: ["truth:choir_council"],
      known: [
        "The Philosophers of Union run twelve orphan homes for gifted children, praised by the crown. Their orphans have no recorded parents.",
        "Unnamed council minutes approve 'pairings' of gifted lines, with an 'expected outcome year: as planned'.",
        "A ledger in the mirror rooms projects the strength and date of each bred child. Every date is the same year.",
        "Confirmed: the salon is breeding the gifted to force the union, on a schedule, and the year is close.",
      ] },
    { id: "first_one", n: "The first one never died", d: "The child whose gift destroyed the old city did not die in the blast. It reached union alone, and the blast was the city's eighty thousand minds being pulled in at once. It sleeps in a sealed chamber at the crater's centre, breathing once an hour, and its dreams give every gifted child born since their powers. The Registry has known for forty years, fenced the crater, and called it a powder magazine.", tags: ["truth:choir_sleeper"],
      known: [
        "The official account blames the old city's destruction on a powder magazine, but cites no inventory of powder.",
        "Every gifted child brought to the crater fence hums the same tune, one none of them knew before.",
        "A child's words painted on a scorched wall at the crater's edge say 'I am not dead, I am just everywhere now'. The paint is from before the blast.",
        "Confirmed: the first one is alive at the crater's centre, breathing once an hour, and the Registry sealed the chamber.",
      ] },
  ],

  tags: ["psychic_gift"],

  subthemes: [
    { id: "crater_city", n: "The Crater City", d: "A great city was destroyed in a single white instant decades ago. A new city has been built in rings around the crater, and no one is allowed to the centre.", w: 1.2, req: { any: ["has:city", "realm:large", "realm:vast"] }, truthLink: "first_one", tags: ["theme:crater"], mark: { kind: "zone", n: "The Crater", color: "#d8d4e8", size: [1, 1], where: "inner" } },
    { id: "bureau_of_gifts", n: "The Registry of Gifts", d: "Every child is tested at seven. Those who test bright are taken to the state academy, and their families receive a pension and a medal.", w: 1.5, req: { any: ["autocracy", "standing_army", "academies", "harsh_law"] }, tags: ["theme:gift_registry"] },
    { id: "unbound", n: "The Unbound", d: "Gifted children who ran from the registry live hidden in the slums and the hills, moved from safe house to safe house by people who owe them their lives.", w: 1.2, tags: ["theme:unbound"] },
    { id: "bonded_pair", n: "The Two Who Cannot Part", d: "Two gifted youths touched minds once and could not separate. They speak in turns, finish each other's dreams, and grow sick when apart.", w: 0.8, truthLink: "merge_purpose", tags: ["theme:bonded_pair"] },
    { id: "slum_gangs", n: "The Thought-Gangs", d: "Gangs of gifted teenagers run whole districts. Nobody lies to them, and nobody informs on them twice.", w: 1, req: { any: ["urbane", "poor", "has:city"] }, tags: ["theme:psychic_gangs"] },
    { id: "damper_epidemic", n: "The Damper Epidemic", d: "The drug that quiets the gift is handed out freely in schools. Half a generation now takes it, and some who never had the gift take it to feel nothing at all.", w: 1, req: { any: ["mercantile", "urbane", "autocracy"] }, tags: ["theme:dampers"] },
    { id: "crater_pilgrims", n: "The Crater Pilgrims", d: "A cult camps at the edge of the crater, singing toward its centre. They believe the union will be paradise, and they are trying to call it.", w: 1, req: { any: ["mystic", "pious", "seers", "faith:void"] }, truthLink: "first_one", tags: ["theme:crater_pilgrims"] },
    { id: "child_soldier", n: "The Weapon Child", d: "The army has raised one gifted child as a weapon since infancy. She has won three battles without a soldier lifting a rifle. She is eleven.", w: 1, req: { any: ["martial", "standing_army", "gov:stratocracy", "atwar"] }, tags: ["theme:weapon_child"] },
    { id: "quiet_village", n: "The Quiet Village", d: "A village of gifted families lives in near-silent harmony in the hills. They do not speak aloud, they do not argue, and they are very, very content.", w: 0.8, req: { any: ["mountain", "forest", "hills", "egalitarian"] }, truthLink: "merge_purpose", tags: ["theme:quiet_village"] },
    { id: "melting_visions", n: "The Visions of Light", d: "Every precognitive in the land has begun seeing the same thing: crowds standing still in the streets and slowly becoming light.", w: 0.8, req: { any: ["seers", "scholarly"] }, tags: ["theme:light_visions"] },
    { id: "council_salon", n: "The Philosophers of Union", d: "An exclusive salon of rich, kind and learned people funds orphanages for gifted children. Their lectures on the end of loneliness are very moving.", w: 0.7, req: { any: ["hierarchical", "scholarly", "mercantile", "urbane"] }, truthLink: "union_council", tags: ["theme:union_salon"] },
  ],

  sites: [
    { id: "crater", n: "The Crater of $", kind: "anomaly", where: "inner", truthLink: "first_one", d: "The white crater where a city once stood, forbidden and fenced.",
      layers: {
        surface: { n: "The white bowl", text: "A bowl of fused white stone two miles across, ringed by fences and thirty watchtowers. Birds will not fly over it. The new city's ring roads all bend to keep it in view." },
        study: { n: "The hum", text: "Psychics who approach the fence hear a child humming. The tune is the same for everyone. {investigator} has measured it for ten years, and it gets a little louder every spring." },
        dig: { n: "The chamber", text: "At the centre, under the glass, is a sealed chamber with a small figure inside, unaged, breathing once an hour. A Registry seal on the hatch is dated the year after the blast. The matching file is kept at {lead}.", points: "cast:official" },
        revelation: { n: "Just everywhere now", text: "The first one never died. The child reached union alone, and the blast was the old city's 80,000 minds being pulled in at once. Its dreams give every gifted child born since their powers. The Registry has known for forty years, fenced it, and called it a powder magazine." },
      } },
    { id: "mirror_lab", n: "The Mirror Rooms of $", kind: "ruin", where: "remote", truthLink: "union_council", d: "An abandoned research campus whose rooms are lined with mirrors and padded walls.",
      layers: {
        surface: { n: "Bricked windows", text: "A walled campus in the hills, its windows bricked from the inside. A sign at the gate reads 'Home for Gifted Orphans, by the kindness of the Philosophers of Union'." },
        study: { n: "Mirrors and murals", text: "Every room is mirrored so that no child is ever alone with their own face. The playroom murals show children holding hands in a ring. {investigator} counted 64 bunks, all child-sized." },
        dig: { n: "The birth ledger", text: "Behind the director's office is a ledger of births: children bred from gifted lines like prize stock, each with a projected strength and date. Its index refers to a second volume, filed at {lead}.", points: "archive" },
        revelation: { n: "The date", text: "Every projected date in the ledger is the same year, eleven years from now. The Philosophers of Union bred five generations of orphans to reach union together, on schedule. Their kindness was real. So was the plan, and none of the children were asked." },
      } },
    { id: "silent_zone", n: "The Silent Fields of $", kind: "anomaly", where: "remote", d: "A stretch of land where no thought can be heard.",
      layers: {
        surface: { n: "The quiet moor", text: "A moor where psychics feel blind and deaf and ordinary folk sleep wonderfully. Unbound runaways rest here between safe houses, and the shepherds rent them beds by the night, two coppers a bed." },
        study: { n: "The shrinking edge", text: "The silence has a sharp edge you can step across. Stakes driven by runaways over twenty years show it shrinking about thirty paces a year. {investigator} confirmed it with a gifted child and a measuring tape." },
        dig: { n: "The grey antenna", text: "Under the moor lies a buried antenna of grey metal, 300 feet long and still faintly warm. Its maker's plate is dated before the old city fell. The same plate is fixed to a machine in the academy basement at {lead}.", points: "site:sleep_vault" },
        revelation: { n: "Wearing out", text: "Long ago someone built this machine to block the pull. It is wearing out, and the safe ground shrinks every year. At thirty paces a year the moor will be gone within a generation, and every runaway resting here can do the sum." },
      } },
    { id: "fused_spire", n: "The Spire of Hands at $", kind: "wonder", where: "any", truthLink: "merge_purpose", d: "A tower grown from bodies fused together, still faintly warm.",
      layers: {
        surface: { n: "The Bride", text: "A tall, smooth, pale column on a hill, sixty feet high, which the locals call the Bride. Couples walk round it once on their wedding day for luck, and leave a ribbon tied to a finger." },
        study: { n: "Skin and fingers", text: "Its surface is skin, very old, and there are fingers in it, reaching upward. {investigator} counted 196 hands before stopping. The column is faintly warm in winter, and snow never settles on it." },
        dig: { n: "Come in", text: "Inside it is hollow and hums. Anyone gifted who enters hears a hundred voices, all calm, all saying 'come in'. A runaway's knife-scratched note at the threshold says the same voices can be heard at {lead}.", points: "site:crater" },
        revelation: { n: "Early arrivals", text: "This is what an early union looks like: about a hundred gifted villagers who reached it together two centuries ago and grew into one body. The voices are not suffering. They are content, and they are asking others in. That is the frightening part." },
      } },
    { id: "sleep_vault", n: "The Cold Cradle of $", kind: "dig", where: "capital", d: "A vault beneath the academy holding a single sleeping child.",
      layers: {
        surface: { n: "Old records", text: "A sealed sub-basement of the state academy, said to hold old records. Students dare each other to touch the door. The cleaners are not allowed below the second stair, on pain of dismissal." },
        study: { n: "The coal bills", text: "Its coal draw is enormous for a records store: nine tons a week, and the heating never stops. {investigator} found the bills signed by the Registry's deputy director's office, every month for forty years." },
        dig: { n: "The glass cradle", text: "A glass cradle in deep cold holds a famous gifted child declared dead forty years ago, still eleven years old. A chart beside the cradle compares its breathing, hour by hour, with readings taken at {lead}.", points: "site:crater" },
        revelation: { n: "Kept asleep", text: "The state kept its strongest child asleep because it did not know how to keep the child awake and safe. The Registry signed the death notice and paid the parents a pension. The child's breathing now matches the one in the crater: one breath an hour." },
      } },
  ],

  beings: [
    { id: "merged_ones", n: "The merged", kind: "beast", d: "Several people whose minds and then bodies fused into one shambling, many-handed thing that speaks in chorus. Gentle, mostly, unless separated.", danger: 2, biomes: ["tempforest", "grass", "badlands", "boreal"], look: { size: 2.4, group: [1, 2], move: "solo", speed: 3, col: "#cfc6c0", col2: "#8a7a8a", body: "biped", active: "dusk", visible: true } },
    { id: "echo_moths", n: "Echo-moths", kind: "insect", d: "Pale moths that swarm around gifted people and repeat their thoughts as a faint whisper of wings.", danger: 0, biomes: ["tempforest", "temprain", "grass", "swamp"], look: { size: 0.05, group: [50, 400], move: "swarm", speed: 2, col: "#e8e4f0", col2: "#a8a0c8", body: "insect", active: "night", visible: true } },
  ],

  techs: [
    { id: "cc_testing", n: "Gift testing", field: "medicine", level: 1, d: "Card tests, then needles and wires, that find the gift in a child before the child knows it is there." },
    { id: "cc_dampers", n: "Damper draughts", field: "alchemy", level: 2, d: "A drug that quiets the gift, along with most strong feelings." },
    { id: "cc_collars", n: "Damper collars", field: "engineering", level: 3, d: "Worn by registered psychics in public, and by prisoners always. A key turns the gift off like a lamp." },
    { id: "cc_amplifiers", n: "Amplifier pills", field: "alchemy", level: 3, d: "The opposite of a damper: a few hours of enormous power, and a nosebleed that does not stop." },
    { id: "cc_mind_shields", n: "Thought-shields", field: "warfare", level: 4, d: "Trained psychics who wall a regiment's minds against enemy reachers. The shield holds until its bearer falls asleep." },
    { id: "cc_choir_engine", n: "The choir engine", field: "natural_philosophy", level: 5, d: "A great machine that links many gifted minds into one for a single purpose. Every test run, a few of them do not come back out." },
  ],

  units: [
    { id: "cc_shield_corps", n: "Damper troopers", role: "infantry", wpn: "spear", kit: "mail", ranks: 4, gap: 1.3, size: 100, w: 1, mods: [["theme:gift_registry", 4], ["theme:dampers", 2]] },
    { id: "cc_reachers", n: "Reachers", role: "magic", wpn: "staff", kit: "robe", ranks: 1, gap: 4, size: 12, w: 0.6, mods: [["theme:weapon_child", 8], ["theme:gift_registry", 3]] },
  ],

  govs: [
    { id: "cc_academy_state", n: "Academy state", d: "The gifted rule, through a council of the academy's graduates. The ungifted are kindly managed.", tags: ["gov:academy_state", "autocracy"], w: 0.3, forms: ["Academy of $", "Lucid Council of $", "Concord of $"], ruler: "First Reader", mods: [["theme:gift_registry", 4], ["scholarly", 2]] },
  ],

  mapMarks: [
    { kind: "zone", n: "Silent ground", color: "#b8b4c8", size: [1, 3], count: [0, 2], where: "remote", d: "Land where no thought can be heard, prized by the hunted gifted and the ordinary sleepless alike." },
  ],

  storylines: [
    { id: "cc_awakening", n: "The Child of {place}", scale: "local", anchor: "town", w: 2, req: "psychic_gift",
      stages: {
        start: { h: "Windows shatter in {place}", b: "Every pane in a street of {place} burst at once when {person}, a miller's child, had a nightmare. The registry has been informed.", wait: [1, 3], next: [{ to: "taken", w: 2, mods: [["theme:gift_registry", 3], ["autocracy", 1.5]] }, { to: "hidden", w: 1, mods: [["theme:unbound", 3], ["egalitarian", 1.5]] }] },
        taken: { h: "The registry takes {person} from {place}", b: "Grey carriages came for {person} at dawn. The family received a pension and a medal and is not permitted to write.", wait: [6, 18], fx: { unrest: 5 }, next: [{ to: "weapon", w: 2 }, { to: "escape", w: 1 }] },
        hidden: { h: "The Unbound hide a child from {place}", b: "{person} vanished the night before the testers arrived. {person2}, a hill shepherd, has been seen buying far too much bread.", wait: [4, 12], next: [{ to: "escape", w: 1 }, { to: "pulled", w: 1, mods: [["theme:crater", 3], ["theme:crater_pilgrims", 2]] }] },
        weapon: { h: "{person} turns the tide for {realm}", b: "In the war, the child from {place} reached out and the enemy's officers simply lay down. {realm} celebrates. {person} has not spoken since.", fx: { prestige: 10, stability: 3 }, end: true },
        escape: { h: "{person} walks out of the academy", b: "Doors opened, guards forgot their own names, and {person} walked out of the academy of {realm} and into the hills. The registry is offering a fortune.", fx: { stability: -5, unrest: 8 }, end: true },
        pulled: { h: "{person} answers the pull", b: "{person} walked toward the crater humming a tune nobody taught them. {person2} followed as far as the fence, and came back alone, and will not say what they saw.", fx: { unrest: 6, flag: "pulled" }, end: true },
      } },
    { id: "cc_union_rite", n: "The Union Year of {realm}", scale: "realm", anchor: "realm", w: 1, req: ["psychic_gift", { any: ["learned", "hierarchical", "has:city", "scholarly"] }],
      stages: {
        start: { h: "A salon in {capital} buys up the orphanages", b: "The Philosophers of Union, led by the gentle {person}, have taken charge of every gifted orphan in {realm}. They speak beautifully of an end to loneliness.", wait: [6, 14], next: [{ to: "visions", w: 2 }, { to: "exposed", w: 1, mods: [["spy_network", 3], ["learned", 1.5]] }] },
        visions: { h: "All {realm}'s seers dream of light", b: "The seers of {realm} wake weeping from the same dream: crowds standing still in {capital}, becoming light. {person} calls it a promise.", wait: [3, 8], fx: { unrest: 10, stability: -4 }, next: [{ to: "rite", w: 1, mods: [["unstable", 2]] }, { to: "exposed", w: 1 }] },
        exposed: { h: "The Union's breeding ledgers are found", b: "{person2}, a clerk, smuggled out the salon's ledgers: generations of births planned toward a single year. {capital} is in uproar.", wait: [2, 6], fx: { unrest: 15 }, next: [{ to: "council_broken", w: 2 }, { to: "rite", w: 1, mods: [["chance:low", 2]] }] },
        rite: { h: "The Union rite is sung in {capital}", b: "For one hour every mind in {capital} was the same mind. When it ended, a third of the city's people never returned to their own minds. They still stand smiling in the streets.", fx: { pop: 0.8, stability: -20, monument: { tier: 1, name: "The Still Square" } }, end: true },
        council_broken: { h: "{ruler} breaks the Philosophers of Union", b: "The salon's members are arrested and its orphans freed. {person} went to the scaffold serene, saying the union was only delayed.", fx: { stability: 4, prestige: 4 }, end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "power", source: "library", bias: "official", reliable: "partial", who: "Registry primer, signed by {official}", points: "site:sleep_vault", text: "Registry primer for parents, {year}, signed by {official}: 'The gift is a rare and treatable condition of childhood: the power to hear or move other minds. With dampening drops and discipline, nine in ten gifted children grow into useful citizens. Your child will be tested at seven. Children of exceptional strength are cared for at the state academy at {lead}.'" },
    { depth: "lore", about: "power", source: "oral", bias: "true", reliable: true, who: "{survivor}, Unbound", points: "heretic", text: "What the Unbound tell new runaways, as {survivor} told it to a runaway of 12 at a safe house in {place}, {year}: 'Bleeding from the nose means stop. Hearing other people's dreams means stop. Wanting to stop being you means run.' The runaway asked where to run. {survivor} handed over a coat, 3 coins, and the name of the next safe house, among the hill-printers of {lead}." },
    { depth: "lore", about: "truth", source: "person", bias: "true", reliable: "partial", who: "{investigator}, Registry examiner", text: "A child's drawing pinned in a schoolroom at {place}, {year}, collected by {investigator} with 40 others from the same district: many stick figures holding hands in a ring, and in the middle one big figure made of all their colours, smiling. The examiner's note: '31 of the 40 drew the same picture. None of the 31 has tested positive. Yet.'" },

    { depth: "core", about: "truth:merge_purpose", source: "person", bias: "true", reliable: "partial", who: "{survivor}, Unbound", points: "site:fused_spire", text: "Diary of {survivor}, Unbound, {year}: 'The pull is not a voice. It is like being cold and knowing where the fire is, and every year the fire is closer. Last winter I walked 12 miles toward it in my sleep. I woke barefoot on the moor road, facing the Spire of Hands at {lead}, with my hand already out.'" },
    { depth: "core", about: "truth:merge_purpose", source: "archive", bias: "redacted", reliable: "partial", plain: true, who: "{investigator}, Registry examiner", text: "Registry census, internal only, prepared by {investigator} in {year}: 'Gifted births by decade: 1 in 4,000; 1 in 900; 1 in 160. This is not a sickness spreading. The whole species is changing, and the pull the strong ones feel is the direction it is changing in: toward one mind. Projection for the next decade: [redacted at the Director's order].'" },
    { depth: "core", about: "truth:merge_purpose", source: "traveller", bias: "exaggerated", reliable: "partial", cost: true, who: "A tinker of {place}", text: "Letter of a tinker who went to the quiet village at {place} to fetch a cousin home, {year}: 'My cousin {person} has lived there 4 years. Nobody spoke a word in the 7 days I stayed. {person} passed me the salt before I asked, and smiled, and did not know my name. I came home alone. In a year, I think nobody there will know whose cousin {person} was.'" },
    { depth: "core", about: "truth:merge_purpose", source: "heretic", bias: "heretic", reliable: true, who: "Unbound pamphlet", text: "Pamphlet printed in the hills by the Unbound, {year}, 300 copies: 'They tell you the gift is a sickness. It is a birth. Every child born gifted is the species turning over in its sleep. The only question is whether we come through it alive and ourselves, or drown in it like the hundred in the Spire.'" },
    { depth: "core", about: "truth:merge_purpose", source: "library", bias: "official", reliable: false, who: "{official}, Registry circular", text: "Registry circular to physicians, {year}, signed by {official}: 'Reports of a pull among the gifted are the result of poor dampening and adolescent romance, and vanish entirely with proper dosing: 4 drops at breakfast, 4 at bedtime. Physicians who record a pull in a patient's file will be asked to explain their dosage.'" },

    { depth: "core", about: "truth:union_council", source: "archive", bias: "redacted", reliable: "partial", who: "{investigator}, Registry examiner", points: "site:mirror_lab", text: "Minutes of an unnamed council, found by {investigator} in the director's safe at the orphan home of {lead}, {year}: 'Pairing approved: line of the miller with line of the singer. Expected outcome strength 7. Expected outcome year: as planned.' The minutes are numbered 1,104. The next page lists 40 more pairings." },
    { depth: "core", about: "truth:union_council", source: "person", bias: "true", reliable: "partial", plain: true, who: "A philosopher of the salon of Union", text: "Private letter of a philosopher of the salon of Union to a new member, seized by the Registry in {year}: 'We do not do this from cruelty. For five generations we have bred, dosed and trained the gifted children in our homes, so that the union comes early, and to everyone at once. You have seen a mother lie to her son, and a king to his army. None of it could happen if each could see inside the other. In eleven years nobody will be able to lie again. They will thank us, all at once.'" },
    { depth: "core", about: "truth:union_council", source: "oral", bias: "garbled", reliable: "partial", who: "{investigator}, Registry examiner", points: "archive", text: "A skipping song of the orphan homes run by the Philosophers of Union, written down by {investigator} at {place}, {year}: 'Kind lady, kind lady, takes us to tea, and none of us know whose children we be.' The home's register lists 188 children and no parents. Each child's file has a year on the cover, the same year, and the files are copied to {lead}." },
    { depth: "core", about: "truth:union_council", source: "library", bias: "propaganda", reliable: false, who: "Court gazette of {realm}", text: "Notice in the court gazette of {realm}, {year}: 'The Philosophers of Union are a charitable society of the highest character. Their 12 orphan homes have been praised by the crown, and their lectures on the end of loneliness are attended by three ministers.' The notice was placed and paid for by the society." },
    { depth: "core", about: "truth:union_council", source: "person", bias: "true", reliable: "partial", cost: true, who: "{believer}, crater pilgrim", text: "Letter of {believer}, crater pilgrim, to the Philosophers of Union, {year}: 'You took my child {person} into your orphan home at 4, and promised me a child who would never be lonely. I visited when {person} was 9. {person} looked at me with the other children's eyes, 30 of them turning at once, and asked which of them I had come for.'" },

    { depth: "core", about: "truth:first_one", source: "ruin", bias: "true", reliable: true, plain: true, who: "{investigator}, Registry examiner", points: "site:crater", text: "Painted on a scorched wall at the crater's edge in a child's letters, photographed by {investigator} in {year}: 'I AM NOT DEAD I AM JUST EVERYWHERE NOW'. The paint is the old city's red lead, from before the blast. The wall faces inward, toward the sealed centre of {lead}, and the letters are 4 feet high." },
    { depth: "core", about: "truth:first_one", source: "temple", bias: "pious", reliable: "partial", who: "{believer}, crater pilgrim", text: "Prayer of the crater pilgrims, led each night at the fence by {believer} for about 200 singers, {year}: 'Sleeping child, dreaming child, dream us too. Every gift is your breath; breathe us home.' The pilgrims leave one toy at the fence each night. The guards burn the toys in the morning and keep count: 14,000 so far." },
    { depth: "core", about: "truth:first_one", source: "person", bias: "true", reliable: "partial", cost: true, who: "A fence guard at the crater", text: "Report of a fence guard at the crater, {year}: 'Every gifted child brought to the crater hums the same tune. None of them knew it before. My own child {person}, due for testing at seven, hummed it the night before the test. One of the children told me it was a lullaby, and that it was for us. {person} has not spoken since. {person} only hums.'" },
    { depth: "core", about: "truth:first_one", source: "archive", bias: "official", reliable: false, who: "{official}, Registry archive", text: "Official account of the Catastrophe, reissued from the Registry archive by {official} in {year}: 'A powder magazine exploded beneath the old city, killing 80,000. No living thing survived at the centre, and none could have. The crater is fenced for reasons of public health.' The account cites no inventory of the magazine." },

    { depth: "sub", about: "sub:bureau_of_gifts", source: "archive", bias: "official", reliable: "partial", who: "Registry testing schedule", points: "cast:official", text: "Testing schedule of the Registry of Gifts, {year}, issued to {investigator}: 'Children of seven, all districts. Results to be sealed and sent to the deputy director at {lead}. Families of positive results to be notified after collection, not before. Medal and pension within 30 days.' The examiner has written 'why after?' in the margin, then crossed it out." },
    { depth: "sub", about: "sub:bonded_pair", source: "person", bias: "true", reliable: true, who: "One of the bonded twins", text: "Letter from one of the bonded twins of {place}, written alone at the Registry's request, {year}: 'We tried to sleep in different houses, 2 miles apart. I woke in my sister's bed. My body was still in mine. The physician wants to try 20 miles next. We would rather not, and we said so at the same time.'" },
    { depth: "sub", about: "sub:damper_epidemic", source: "traveller", bias: "exaggerated", reliable: "partial", who: "A salt merchant in {place}", text: "Travel notes of a salt merchant in {place}, {year}: 'Here they hand out damper drops at the school gates like sweets, 4 to a child. The children are very calm. The children do not dream. I asked one girl what she wanted to be when she grew up. She said: dosed.'" },
    { depth: "sub", about: "sub:child_soldier", source: "library", bias: "propaganda", reliable: false, who: "Army bulletin", text: "Army bulletin, {year}, approved by {official}: 'The Lucid Daughter of the army, aged 11, is a volunteer, happy in her service and free to leave whenever she likes. She has won 3 battles without a soldier lifting a rifle. She sends her love to all the children of {realm}, every one of whom she can hear.'" },
    { depth: "sub", about: "sub:slum_gangs", source: "oral", bias: "true", reliable: "partial", who: "A ferry-woman of {place}", text: "Advice from a ferry-woman of {place} to a newcomer, overheard by {investigator} in {year}: 'Don't lie to the thought-boys. Don't even think about lying; they hear it. Just pay. It's 2 coins a week, and nobody on this street has been robbed in 5 years, except by them.'" },
    { depth: "sub", about: "sub:melting_visions", source: "person", bias: "true", reliable: "partial", who: "{investigator}, Registry examiner", points: "site:crater", text: "Register of seers' reports kept by {investigator}, {year}: '43 seers in 9 districts, none in contact with each other, describe the same scene: crowds standing still in a street and slowly becoming light. 11 of them name the street. It is the ring road nearest the crater at {lead}.'" },
    { depth: "sub", about: "sub:council_salon", source: "library", bias: "official", reliable: "partial", who: "Programme of the salon of Union", points: "site:mirror_lab", text: "Programme of a lecture at the salon of the Philosophers of Union, {year}: 'The End of Loneliness: a talk in 3 parts, with tea. Part 3: the date.' Admission by invitation. The back of the card lists the orphan homes the evening's donations will support, among them the walled campus at {lead}." },
    { depth: "site", about: "site:mirror_lab", source: "ruin", bias: "true", reliable: true, who: "{investigator}, Registry examiner", text: "Carved under a bunk in the mirror rooms at {place}, many times over in 17 different hands, found by {investigator} in {year}: 'Which one of us is me?' Under the last one, smaller and newer: 'All of us. They said so.'" },
    { depth: "site", about: "site:silent_zone", source: "traveller", bias: "true", reliable: "partial", who: "{survivor}, Unbound", text: "Letter of {survivor} from the silent moor at {place}, {year}: 'Last night I slept a whole night without hearing my neighbours' dreams, for the first time in my life. I wept. Then I found the stake I drove at the edge last year. The silence ends 30 paces inside it now.'" },
  ],
};
