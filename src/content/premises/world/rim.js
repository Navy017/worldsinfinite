// The Rim: the world is flat and ends; at the edge the oceans pour away into nothing.
export default {
  id: "rim",
  name: "The Rim",
  kind: "shape",
  family: "world",
  pitch: "The world is a great flat disc, and at its edge the seas pour over into empty space. The few who have looked over the brink and come back all describe something different below.",
  slots: ["world-shape", "world-edge"],
  tone: ["wonder", "mythic"],
  era: ["bronze", "medieval", "renaissance"],
  scale: "world",
  genres: ["fantasy", "mythic"],
  w: 0.9,
  excludes: [],
  pairs: [{ id: "body_of_the_world", w: 2.5 }, { id: "splinter_world", w: 1.2 }, { id: "elder_lattice", w: 1.5 }],

  truths: [
    { id: "table", n: "The world is a made table", d: "The disc was built by a maker and set on supports, and the supports are failing. Each tremor is a leg settling, and the eastern seas have risen a foot in a century because the disc is tilting. The maker left a note that it would return to mend the third leg, and it has not come back.", tags: ["truth:world_table"],
      known: [
        "The seas of one quarter have risen a foot in a century, and the opposite quarter's ports are drying. The crown's library says the disc rests on nothing and needs nothing.",
        "The hub mountain at the centre of the world has split, and the crack smells of oak and lamp oil. Pilgrims say the summit beyond the bronze gate is flat and round, like a peg.",
        "{investigator} has seen a timber shaft as wide as a city inside the hub, carved with the words 'Third leg cracked. Will return.' The Hub Temple has not explained the carving.",
        "Confirmed: the disc is a built thing standing on legs, and one is failing. The tilt is the disc settling. The maker promised to return and has not, and the Hub Temple has known since its gate was cast.",
      ] },
    { id: "lid", n: "The world is a lid", d: "The disc is the lid on a huge pot. Everything that falls over the edge, water, wrecks and the dead, feeds a creature below. It is growing, the space under the lid is filling up, and the brinkward towns that drive oxen over the edge each year to keep it quiet are feeding it faster.", tags: ["truth:world_lid"],
      known: [
        "The netters say the edgefall roars with the voices of the dead. The crown's library says falling water becomes mist and rain, and that nothing waits below. The netters throw their dead over regardless.",
        "A creature climbed up the edgefall and walked inland. The Last Stair down the edgefall is cut for something that climbs, and its landing is heaped with offerings: oxen, figureheads, crowns.",
        "{investigator}, lowered over the edge in a cable cradle, saw a surface below heaving slowly up and down, higher than the year before. A cable lowered further came back bitten through.",
        "Confirmed: something lives beneath the disc and eats what falls. It is growing, the level is rising, and the brinkward feasts that feed it have taught it to climb. The towns still drive oxen over every year.",
      ] },
    { id: "many_plates", n: "There are other plates", d: "Beyond the edge and below it hang other discs, other worlds, reachable by those who survive the fall or the crossing. Some have already found us. One has signalled to the void-light for centuries, and the Hub Temple has ordered every answer kept from the faithful and every reply forbidden.", tags: ["truth:many_plates"],
      known: [
        "The Fallers leap from the edge on feast days and say the fall is a road. The Hub Temple teaches there is one world under heaven, and that lights beyond the brink are reflections.",
        "The nets have hauled up wrecks of a timber no forest grows, and once a living sailor who wept at the sight of the hub. The void-light on the brink is answered by a light out in the dark.",
        "A casket from a foreign wreck holds a map of another disc, with ours drawn small and labelled 'the near plate'. The void-light keepers' log says the signals are not to be shared with the temple.",
        "Confirmed: there are other discs, and at least one has been trying to talk to us for centuries. The Hub Temple has kept every message secret and jailed the keeper who answered.",
      ] },
  ],

  tags: ["flat_world"],

  subthemes: [
    { id: "rim_netters", n: "The Rim Netters", d: "A league of salvagers strings great nets along the edgefall, the cliff where the sea pours off the world. They haul up what comes back from below: wrecks, strange timber, coins of no known king.", w: 1.4, req: "coastal", mods: [["mercantile", 2], ["seafaring", 1.5]], tags: ["theme:rim_netters"], mark: { kind: "zone", n: "Net-coast", color: "#4a6a7a", size: [1, 3], where: "coast" } },
    { id: "hub_temple", n: "The Hub Temple", d: "The great temple at the world's centre teaches that the middle is holy and the brink is sin. Pilgrims walk centreward; exiles are sent brinkward.", w: 1.3, req: { any: ["pious", "organised", "faith:one_god", "faith:sun"] }, tags: ["theme:hub_temple"] },
    { id: "climber", n: "The Thing That Climbed Over", d: "A large creature climbed up the edgefall in the night and walked inland. The netters who saw it refuse to go back to their posts.", w: 0.9, req: { any: ["coastal", "frontier"] }, truthLink: "lid", tags: ["theme:climber"] },
    { id: "tilting", n: "The Tilt", d: "The seas have sloshed a foot toward one quarter of the disc this decade. Ports there are flooding; ports opposite are dry.", w: 1, req: "coastal", truthLink: "table", tags: ["theme:tilting"] },
    { id: "sliding_isle", n: "The Sliding Isle", d: "An island on the brink is slipping toward the edge by a yard a year. Its folk have chained it to the mainland.", w: 0.8, req: { any: ["island", "coastal"] }, tags: ["theme:sliding_isle"] },
    { id: "foreign_relic", n: "The Netted Relic", d: "The nets hauled up a bronze machine with writing nobody can read and a map of a disc that is not ours.", w: 0.8, req: { any: ["coastal", "scholarly", "mercantile"] }, truthLink: "many_plates", tags: ["theme:foreign_relic"] },
    { id: "brink_philosophers", n: "The Brink Philosophers", d: "Scholars lowered on cables over the edge to watch the underside. Their notes are careful, and their hands shake.", w: 1, req: { any: ["scholarly", "academies", "faith:philosophy"] }, tags: ["theme:brink_philosophers"] },
    { id: "fallers", n: "The Fallers", d: "A sect that leaps from the edge on feast days. They say the fall is a road. Nobody has proven them wrong.", w: 0.8, req: { any: ["mystic", "zealous", "seers"] }, truthLink: "many_plates", tags: ["theme:fallers"] },
    { id: "river_diversion", n: "The Stolen River", d: "A brinkward realm dammed and turned a great river so it no longer falls off the world. The realm downstream has not had a harvest since.", w: 1, req: "river", mods: [["has:rival", 2]], tags: ["theme:river_diversion"] },
    { id: "hub_crack", n: "The Crack in the Hub", d: "The hub mountain has split from summit to root. Through the crack, the pilgrims say, comes a smell of old oak and lamp oil.", w: 0.6, req: { any: ["pious", "mountain"] }, truthLink: "table", tags: ["theme:hub_crack"] },
    { id: "upward_star", n: "The Star That Fell Up", d: "Watchers on the edge saw a light rise from beneath the world, climb into the sky and stop among the stars. It is still there.", w: 0.7, req: { any: ["faith:stars", "seers", "scholarly"] }, truthLink: "many_plates", tags: ["theme:upward_star"] },
  ],

  sites: [
    { id: "last_stair", n: "The Last Stair of $", kind: "ruin", where: "coast", truthLink: "lid", d: "Steps carved down the face of the edgefall itself.",
      layers: {
        surface: { n: "The chained steps", text: "Worn steps go down the face of the edgefall into the spray at the very brink. The netters have closed them with an iron gate and a padlock, and the key hangs in the League house. The paint on the gate is scratched from the far side." },
        study: { n: "Steps for climbing", text: "The steps are cut for something that climbs, not walks: a yard deep at the top and larger as they go down. {investigator} measured the twentieth step at the height of a man, with claw-gouges on the riser." },
        dig: { n: "The landing", text: "Twenty fathoms down is a landing heaped with offerings: ox bones, ships' figureheads and three old crowns. The newest ox bones still wear garlands. The League's record of who leaves them, and when, is kept at {lead}.", points: "archive" },
        revelation: { n: "Fed for centuries", text: "A creature below the disc has been fed at this stair for centuries: oxen, wrecks, the dead of kings. Every gift taught it the way up. The brinkward towns began the feeding to keep it quiet, and now it climbs to ask for more. The stair has been widened, from below." },
      } },
    { id: "outward_lighthouse", n: "The Void Light of $", kind: "wonder", where: "coast", truthLink: "many_plates", d: "A lighthouse on the brink that shines outward, into nothing.",
      layers: {
        surface: { n: "The backward lamp", text: "A tower on the brink keeps its lamp facing away from the world, into nothing. It is tended by an order of silent keepers who burn two hundred barrels of whale oil a year. The Hub Temple pays for the oil and forbids anyone to ask why." },
        study: { n: "The answer", text: "On some nights, far out in the dark below the brink, a light answers it. {investigator} timed the answers on 31 nights. The light always replies within the length of a long prayer, and always from the same point." },
        dig: { n: "The cipher", text: "The keepers' logs record the answering light's signals for centuries, with a cipher to read them inside the cover. The pages of the last forty years are missing. Under a standing order they were sent to the Hub Temple examiner, {lead}.", points: "cast:official" },
        revelation: { n: "Neighbours", text: "There is another disc out there, and its people have been signalling to us for centuries. The cipher's first line reads 'We see you'. The last legible line reads 'Why do you not answer?' The Hub Temple has forbidden the keepers to reply since the faith was founded." },
      } },
    { id: "hub_peak", n: "The Sealed Summit of $", kind: "shrine", where: "mountain", truthLink: "table", d: "The sealed peak of the hub mountain at the centre of the world.",
      layers: {
        surface: { n: "The bronze gate", text: "Pilgrims climb the hub mountain, the centre of the world, to a sealed bronze gate below the summit and leave candles there. The ledge holds about four thousand candles in a good season. The Hub Temple sells them at the foot of the path." },
        study: { n: "The turned peg", text: "Beyond the gate the summit is perfectly flat and round, like the head of a turned peg. A crack runs down from it the whole height of the mountain. Through it comes a smell of old oak and lamp oil, stronger every year." },
        dig: { n: "The shaft", text: "Through the crack runs a shaft of joined timber as wide as a city, going down into the disc. A carving on it, each letter a yard high, reads 'Third leg cracked'. {investigator} copied it and sent the copy to {lead}.", points: "library" },
        revelation: { n: "The axle", text: "The world is built, and the hub is its axle. A maker set the disc on nine legs, reset the second, found the third cracked and left a note that it would return. It has not. The Hub Temple has known since the gate was cast, and teaches that the righteous are never tipped off the plate." },
      } },
    { id: "chained_isle", n: "The Chained Isle of $", kind: "anomaly", where: "coast", d: "An island bound to the mainland by great iron chains to keep it from sliding off.",
      layers: {
        surface: { n: "Chains like towers", text: "Chains as thick as towers run from the mainland cliffs to an island on the brink. The islanders pay a chain-tax of one fish in ten to keep the links greased. Their children slide down the slack chains to school." },
        study: { n: "Older than the settlers", text: "The chains are far older than the island's settlers, and some links are not iron at all: one is pale stone, one a dark wood that does not rot. {investigator} counted fourteen chains. The settlers' charter mentions six." },
        dig: { n: "The anchor chain", text: "The oldest chain runs not to the isle but under it, straight down into the void. It is warm to the touch and pulled tight. The island survey that lists all fourteen chains is filed at {lead}.", points: "archive" },
        revelation: { n: "Holding the world", text: "Long ago someone chained the whole disc in place from below. The isle only sits where one anchor chain comes up. The islanders have spent two hundred years chaining their home to the mainland, while the mainland hangs from the chain under their feet." },
      } },
    { id: "salvage_yard", n: "The Salvage Yards of $", kind: "dig", where: "coast", d: "Yards full of things the nets have caught from beyond the edge.",
      layers: {
        surface: { n: "Sold by weight", text: "Acres of wrecks and oddities lie in the salvage yards, sold by weight at a silver a hundredweight. Centreward towns buy the timber; scholars come for the rest. A bronze bell with no maker's mark hangs at the gate to call the foreman." },
        study: { n: "No shipyard", text: "Some wrecks come from no shipyard on the disc. Their timber is a grey, close-grained wood no forest grows, and their nails are bronze. The yard foreman keeps forty such hulls apart from the rest and will not sell them." },
        dig: { n: "The casket", text: "One grey hull held a sealed casket. Inside lay a map of a disc with different coasts, and our own world drawn small in one corner. The League took the map to {lead} and left a copy pinned up in the yard.", points: "library" },
        revelation: { n: "The near plate", text: "Another people have mapped our world from outside, and on their map it is small. They labelled it 'the near plate' and drew a route to it. The forty grey hulls in the yard were theirs. They have been trying to reach us for a long time, and few have arrived alive." },
      } },
  ],

  beings: [
    { id: "edge_swift", n: "Edge-swift", kind: "bird", d: "Black swifts that nest upside-down under the brink and hunt in the edgefall spray.", danger: 0, biomes: ["coast"], look: { size: 0.4, group: [30, 300], move: "flock", speed: 90, col: "#1a1a2a", col2: "#a0a0b0", body: "bird", active: "day", visible: true } },
    { id: "brink_crawler", n: "Brink-crawler", kind: "predator", d: "A many-legged hunter that climbs up the edgefall on foggy nights to take netters from their posts.", danger: 3, biomes: ["coast"], look: { size: 3, group: [1, 3], move: "solo", speed: 10, col: "#3a4a3a", col2: "#9aa080", body: "spider", active: "night", visible: false } },
    { id: "rim_serpent", n: "Rim-serpent", kind: "marine", d: "A sea-serpent so long that it is seen only in pieces along the brink, coiled around the world's edge.", danger: 3, biomes: ["open", "abyss"], look: { size: 300, group: [1, 1], move: "solo", speed: 3, col: "#2a3a4a", col2: "#6a8a6a", body: "serpent", active: "any", visible: true } },
  ],

  techs: [
    { id: "rm_brink_nets", n: "Brink nets", field: "engineering", level: 1, d: "Great nets of rope and chain strung along the edgefall to catch what comes back up from below the edge." },
    { id: "rm_centre_reckoning", n: "Centreward reckoning", field: "navigation", level: 2, d: "Navigation by centreward and brinkward rather than north and south, with the hub as the only fixed star." },
    { id: "rm_cable_cradles", n: "Cable cradles", field: "engineering", level: 3, d: "Baskets lowered on cables over the brink so watchers can study the underside." },
    { id: "rm_underside_charts", n: "Underside charts", field: "astronomy", level: 4, d: "Charts of the sun's path beneath the world, and of what it lights on the way." },
    { id: "rm_void_skiff", n: "Void skiffs", field: "navigation", level: 5, d: "Winged boats of netted timber meant to glide from the edge toward another disc." },
  ],

  units: [
    { id: "rm_netters", n: "Net-wardens", role: "infantry", wpn: "spear", kit: "light", ranks: 3, gap: 1.6, size: 80, w: 0.7, mods: [["theme:rim_netters", 6], ["theme:climber", 4]] },
  ],

  faiths: [
    { id: "hub_faith", n: "The Hub Faith", d: "The centre is holy, the brink is sin, and the world is a plate set before the gods.", tags: ["faith:hub"], w: 0.7, names: ["The Faith of the Hub", "The Centreward Way", "The Temple of the Axle"], mods: [["theme:hub_temple", 5], ["organised", 1.5]] },
  ],

  mapMarks: [
    { kind: "zone", n: "The edgefall", color: "#9ab8c8", size: [2, 5], count: [2, 3], where: "coast", d: "Coasts where the sea pours over the brink of the world into mist and nothing." },
    { kind: "zone", n: "The hub", color: "#c8b080", size: [1, 2], count: [1, 1], where: "inner", d: "The holy mountain at the exact centre of the disc." },
  ],

  storylines: [
    { id: "rm_climber", n: "What Climbed at {place}", scale: "local", anchor: "coast", w: 1.4, req: "flat_world",
      stages: {
        start: { h: "Something climbs over the brink at {place}", b: "Netters at {place} saw a shape climb up the edgefall in the fog, and heard it walk inland. Two posts are empty this morning.", wait: [1, 3], fx: { unrest: 12 }, next: [{ to: "hunt", w: 1.5, mods: [["martial", 2]] }, { to: "offerings", w: 1, mods: [["pious", 2], ["sacrifice", 3]] }] },
        hunt: { h: "Hunters track the climber of {place}", b: "{person}, the best netter on the coast, leads a hunt along the cliffs. The tracks lead not inland, but in circles, as if it were looking for something.", wait: [2, 5], next: [{ to: "slain", w: 1 }, { to: "goes_back", w: 1.5 }] },
        offerings: { h: "{place} leaves offerings at the brink", b: "Oxen were driven over the edge at {place} with garlands on their horns. The climbing stopped. The priests say it will need feeding again.", wait: [6, 12], fx: { treasury: -20, flag: "fed" }, next: [{ to: "feeding_custom", w: 1.5 }, { to: "it_returns", w: 1 }] },
        slain: { h: "The climber of {place} is slain", b: "{person} drove a whaling lance into the thing on the cliffs. It bled black and fell back over. Its claw hangs in the temple of {place}.", fx: { prestige: 6, monument: { tier: 1, name: "The Claw of {place}" } }, end: true },
        goes_back: { h: "The climber goes back over the edge", b: "It found what it was looking for: an old offering-stone near {place}, long fallen into disuse. It sat by it for a night, and then went home.", fx: { stability: 2 }, end: true },
        feeding_custom: { h: "{place} keeps the feast of the brink", b: "Every year now, {place} drives oxen over the edge on the same night. Nothing has climbed since.", fx: { stability: 4 }, end: true },
        it_returns: { h: "Many climb at {place}", b: "The creatures below took the feeding as a promise of more. A dozen shapes came over the edgefall in the fog, and the netters' town is empty.", fx: { abandon_town: true, pop: 0.95 }, end: true },
      } },
    { id: "rm_answering_light", n: "The Light Beyond the Brink", scale: "realm", anchor: "realm", w: 1, req: ["flat_world", { any: ["coastal", "learned", "scholarly"] }],
      stages: {
        start: { h: "Keepers of {realm} decipher the answering light", b: "{person}, a keeper of the void-light, claims the light beyond the brink is a voice, and has read its first words: 'We see you.'", wait: [3, 8], next: [{ to: "reply", w: 1.5, mods: [["learned", 2]] }, { to: "silenced", w: 1, mods: [["theme:hub_temple", 3], ["zealous", 2]] }] },
        reply: { h: "{realm} answers the light", b: "By order of {ruler}, the keepers flashed back the name of {realm}. The answer came in a single night: an invitation, and a date.", wait: [6, 14], fx: { science: { astronomy: 0.8 } }, next: [{ to: "skiff_flies", w: 1 }, { to: "visitors_come", w: 1 }] },
        silenced: { h: "The Hub Temple silences the keepers", b: "The temple has declared the void-light a lure of the damned. {person} has been sent centreward in chains and the lamp put out.", fx: { stability: 2, unrest: 6 }, end: true },
        skiff_flies: { h: "A skiff glides off the edge of {realm}", b: "{person2} and four volunteers launched a winged skiff from the brink toward the light. The keepers watched it for three nights, getting smaller.", fx: { discovery: "navigation", prestige: 10 }, end: true },
        visitors_come: { h: "A ship comes up over the brink", b: "A ship of unknown timber rose over the edgefall near {place} on great kites, and its crew asked politely for the ruler of {realm}.", fx: { prestige: 15, flag: "plates_met" }, end: true },
      } },
  ],

  cast: [
    { role: "investigator", n: "a brink philosopher who is lowered over the edge on cables to watch the underside", home: "coast", stance: "Wants to see what holds the world up, and writes down exactly what is there." },
    { role: "official", n: "an examiner of the Hub Temple who licenses the void-light and keeps its sealed logs", home: "inner", stance: "Holds that the faithful need one world and one centre, and keeps every message from outside under seal." },
    { role: "believer", n: "a preacher of the Fallers, who leap from the edge on feast days", home: "border", stance: "Believes the fall is a road to other seas and towns, and leads the leap each year." },
    { role: "survivor", n: "a netter who went over the edge on a broken line and was hauled back up", home: "remote", stance: "Saw the underside for an hour and wants the League to stop throwing things over." },
  ],

  fragments: [
    { depth: "lore", about: "truth", source: "library", bias: "official", reliable: true, who: "a primer of {realm}", text: "From a primer of {realm}, first page, {year}: 'The world is a disc. The seas pour over its edge at the edgefall, the cliff where all water ends. Travel is reckoned centreward, toward the hub mountain at the middle, and brinkward, toward the edge. The hub is the one true mark. A child should know how many days centreward their town is; ours is twelve.'" },
    { depth: "lore", about: "truth", source: "person", bias: "exaggerated", reliable: "partial", who: "a faller hauled up in the nets, recorded by {investigator}", points: "cast:believer", text: "Recorded by {investigator} at {place}, {year}: a Faller who leapt on the feast day was caught in the League nets 40 fathoms down, the only one ever brought back. He said one thing: 'There is no bottom. There are only other tops.' He said nothing more and died within the month. The Fallers' preacher, {lead}, reads the faller's words at every leap." },
    { depth: "lore", about: "truth", source: "oral", bias: "garbled", reliable: "partial", who: "the netters of {place}", text: "A saying of the netters of {place}, spoken when a haul comes up over the brink, recorded in {year}: 'What the edge takes, the edge gives back, but never the same thing, and never to the same man.' The League's tally that season: 41 hulls up, 3 nets and 2 netters lost. The saying is older than the League." },

    { depth: "core", about: "truth:table", source: "ruin", bias: "true", reliable: true, plain: true, who: "carved on the timber shaft in the hub", points: "site:hub_peak", text: "Carved on the timber shaft inside the hub mountain at {lead}, in letters a yard high, copied by {investigator} through the crack in {year}: 'Disc set on nine legs. Second leg reset. Third leg cracked. Will return.' The carving is cut, not painted, with a tool as wide as a hand. The oak around it is darker than the rest, as if it had been oiled." },
    { depth: "core", about: "truth:table", source: "archive", bias: "true", reliable: "partial", cost: true, who: "the tide logs of {place}", points: "sub:tilting", text: "Tide logs of the harbour of {place}, compared over a century by the harbour-master, {person}, {year}: 'Eastern quarter: seas a foot higher. Western: a foot lower.' Appended: '{person} resigns the post. The lower town, 300 households including the harbour-master's own, was given up to the sea this spring.' Reports of the same tilt from other ports are filed at {lead}." },
    { depth: "core", about: "truth:table", source: "temple", bias: "pious", reliable: "partial", who: "{official}, examiner of the Hub Temple", text: "Sermon of {official}, examiner of the Hub Temple, to pilgrims at the bronze gate, {year}: 'The world is a plate set before the gods for their meal. A righteous people is never tipped off the plate. If the eastern seas rise, look to the sins of the east.' Collection that day: 600 candles sold. The east sent no pilgrims the following year." },
    { depth: "core", about: "truth:table", source: "library", bias: "official", reliable: false, who: "the royal natural philosopher", text: "From the treatise of the royal natural philosopher of {realm}, {year}, chapter one: 'The disc rests upon nothing and needs nothing, being held in place by the will of the gods. There are no supports. The tremors are of the deep rock, and the tides of the east are the work of the moon, which favours that quarter.'" },

    { depth: "core", about: "truth:lid", source: "person", bias: "true", reliable: true, plain: true, who: "{investigator}, brink philosopher", text: "Report of {investigator}, brink philosopher, written in the cable cradle 300 fathoms below the edge, {year}: 'Below is not empty. It is full of something alive, a surface that heaves slowly up and down like a sleeping chest. It is higher than last year by about 20 fathoms. The water from the edgefall goes into it, and so does everything else. The world is the lid on it.'" },
    { depth: "core", about: "truth:lid", source: "oral", bias: "garbled", reliable: "partial", who: "a netter's widow of {place}", text: "A netter's widow of {place}, speaking to {investigator} at the funeral, {year}: 'Our dead go over the edge too, wrapped in their own nets, two stones at the feet. That is why the edgefall roars: it is every voice there ever was, going down. Mine went over this morning. I listened for him for an hour.'" },
    { depth: "core", about: "truth:lid", source: "heretic", bias: "heretic", reliable: "partial", who: "a brinkward preacher", points: "site:last_stair", text: "A brinkward preacher at the market of {place}, {year}, before the constables arrived: 'Every river that falls feeds it. Every ship. Every corpse you throw over. Every ox you drive off the Last Stair at {lead} with a garland on its horns. Twelve oxen this year! And one day it will be full, and it will lift the lid.'" },
    { depth: "core", about: "truth:lid", source: "library", bias: "official", reliable: false, who: "the royal natural philosopher", text: "From the treatise of the royal natural philosopher of {realm}, {year}, chapter four: 'Waters that fall from the brink become mist and return as rain. The proof is that the seas have not run dry in a thousand years. Nothing is lost, and nothing waits below. The so-called brink philosophers are paid by the cable-makers.'" },
    { depth: "core", about: "truth:lid", source: "archive", bias: "true", reliable: "partial", cost: true, who: "the cable log of the brink philosophers", text: "Cable log of the brink philosophers, {year}: '{person}, philosopher, lowered past 300 fathoms to measure the surface, at the request of {investigator}. Bell signals normal to 410 fathoms. Then three bells, then none. Cable hauled up, 412 fathoms, bitten through. Cradle not recovered.' The next entry, a week later, lowers {investigator} to 300 fathoms and no further." },

    { depth: "core", about: "truth:many_plates", source: "ruin", bias: "true", reliable: true, plain: true, who: "a casket from a foreign wreck", points: "site:salvage_yard", text: "Contents of a sealed casket from a grey-timbered wreck, listed at the salvage yards at {lead}, {year}: a map on fine leather of another disc, with its own hub and twelve coasts. Our world is drawn small in one corner, with a dotted route to it, and labelled in their hand 'the near plate'. The yard clerk's note on the list: 'Not ours. Not a forgery. Somebody out there has been to look at us.'" },
    { depth: "core", about: "truth:many_plates", source: "traveller", bias: "exaggerated", reliable: "partial", who: "a netter, in the League house", points: "sub:foreign_relic", text: "Tale of a netter told in the League house at {place}, {year}: 'We hauled up a sailor alive, in grey clothes, holding a bronze tube. He spoke no tongue we knew. He wept when he saw the hub from the cliff, because, he said by signs, his world has one too. He lived nine days. The bronze tube went to the scholars at {lead}.'" },
    { depth: "core", about: "truth:many_plates", source: "archive", bias: "redacted", reliable: "partial", who: "the void-light keepers' log", points: "site:outward_lighthouse", text: "Log of the void-light keepers at {lead}, {year}: 'Answering light seen, seventh night running. Signal recorded, 40 flashes, read by the cipher as [removed]. Signal not to be shared with the temple, per standing order. Keeper on watch asks again to be allowed to reply. Refused.'" },
    { depth: "core", about: "truth:many_plates", source: "temple", bias: "official", reliable: false, who: "{official}, examiner of the Hub Temple", text: "Ruling of {official}, examiner of the Hub Temple, {year}: 'There is one world under heaven, and it is ours. Lights beyond the brink are reflections of our own lamps in the mist. Grey timber in the nets is ordinary oak, bleached by the spray. Any person who flashes a lamp toward the void will be sent centreward for correction.'" },
    { depth: "core", about: "truth:many_plates", source: "person", bias: "true", reliable: "partial", cost: true, who: "{person}, keeper of the void-light", text: "Letter of {person}, keeper of the void-light, from a cell in the Hub Temple, {year}: 'I answered them. One word, the name of our realm, 9 flashes. By morning the reply had come: an invitation and a date. For that I have been here two years and will be here for life. My lamp is out. Somebody must tell them we did not mean to be rude.'" },

    { depth: "sub", about: "sub:rim_netters", source: "archive", bias: "official", reliable: "partial", who: "the Netters' League tally", points: "archive", text: "Tally of the Netters' League for the summer season of {year}: '1,200 tons timber; 41 hulls; 3 bodies; 1 crate of coins of no known mint; 1 item, see sealed annex.' The annex is not in the League house. A clerk's note says it was sent under seal to {lead}, and that the cart needed eight horses." },
    { depth: "sub", about: "sub:climber", source: "archive", bias: "true", reliable: "partial", who: "minutes of the Netters' League council", points: "site:last_stair", text: "Minutes of the Netters' League council at {place}, {year}. Petition of {survivor}, netter, who hung under the brink for an hour on a broken line: 'The climber went up past me on the Last Stair, an arm's length away. It did not look at me. It went straight to the landing where we leave the oxen, at {lead}.' Resolved, 14 to 2: the feast of the brink to continue, and the garland money to be doubled. The petitioner is fined one silver for leaving a post." },
    { depth: "sub", about: "sub:river_diversion", source: "person", bias: "propaganda", reliable: false, who: "the river lords of {realm}", text: "Proclamation of the river lords, read in every village on the new canal, {year}: 'The water was being wasted over the brink, a whole river of it, for nothing. Now it feeds 40 villages of our people. Our neighbours' famine is their own folly. Any man found breaching the dam will be thrown over the edge after it.'" },
    { depth: "sub", about: "sub:tilting", source: "person", bias: "true", reliable: true, who: "the old harbour-master of {place}", text: "The old harbour-master of {place}, to the town council, {year}: 'The quay was a man's height above high tide when I was a boy. Now the fish swim through the market at spring tides. I have moved the tide-mark stone up four times. The town across the bay has the opposite trouble: their ships sit in the mud.'" },
    { depth: "sub", about: "sub:fallers", source: "temple", bias: "heretic", reliable: "partial", who: "the Fallers, led by {believer}", text: "Hymn sung by the Fallers at the brink of {place} on the feast day of {year}, {believer} leading: 'Step off, step off, the road goes down; there's another sea and another town.' Eleven stepped off after the third verse. The League netters had been paid to strip their nets that day, and did. The preacher sang on." },
    { depth: "sub", about: "sub:brink_philosophers", source: "library", bias: "true", reliable: "partial", who: "{investigator}, in the philosophers' report", text: "From the report of the brink philosophers, written by {investigator}, {year}: 'At dawn the sun, passing beneath the disc, lights structures on the underside: long dark ribs, or rafters, every 900 paces. We could not agree which. We agreed only that they are straight, and that nothing straight grows.'" },
    { depth: "site", about: "site:last_stair", source: "oral", bias: "garbled", reliable: "partial", who: "a notice of the Netters' League", text: "Notice nailed to the gate of the Last Stair by the Netters' League, {year}, below a skull: 'Never go down the Last Stair after dark. What lives below counts you on the way down, and knows if one fewer comes back. Two apprentices went down for a dare in spring. One came back. Key at the League house; ask for it in daylight only.'" },
    { depth: "site", about: "site:chained_isle", source: "traveller", bias: "exaggerated", reliable: "partial", who: "{survivor}, netter", points: "sub:sliding_isle", text: "{survivor}, the netter who went over the edge and was hauled back, writing from the chained isle in {year}: 'I touched the oldest chain. It was warm, and pulled tight, and the far end was pulling back. I felt it go slack for a breath, then tight again. The islanders think they are chaining their island to the land. They have it the wrong way round. I have sent the chain's measure to {lead}.'" },
  ],
};
