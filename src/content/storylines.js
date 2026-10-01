// Storylines: multi-stage stories started by the history simulation at an anchor (a realm, town, mystery
// site, titan's domain, port, frontier province or realm at war) that unfold over months or years.
// Format: { id, n: title template, scale: "world"|"realm"|"local", anchor, site?: [mystery types], req?, w,
//   stages: { start: {...}, <id>: { h, b, wait: [minMonths, maxMonths], fx?, next: [{ to, w, mods?, req? }] },
//             <ending>: { h, b, fx?, end: true } } }. Every entered stage becomes a news item and a log line.
// Conditions (req, mods) use core/rules.js format and are tested against the anchor realm's tags at that
//   moment: static culture/faith/government/ideal/land tags from society.js, plus dynamic tags (atwar, peace,
//   winning, losing, stable, unstable, rich, poor, prestigious, big, small, learned, backward, plague,
//   has:rival, has:ally, heir, no_heir, ruler:<trait>, flag:<name>, chance:low, chance:high...).
// Effects (fx): stability prestige treasury unrest pop growth science discovery war peace revolt revolution
//   ruler_dies ruler_trait heir monument plague titan found_town abandon_town relation spawn flag.
// Slots: {realm} {short} {ruler} {heir} {capital} {place} {site} {titan} {faith} {deity} {people} {rival}
//   {ally} {war} {person} {person2} {year} {beast} {good}, and the power words {power} {user} {users} {node}
//   (magic/mage/mages/the ley lines, or the active power premise's words). Use optional slots only where req/anchor
//   guarantees them. World tags are in the realm tags too: premise:<id> slot:<slot> tone:<tone> genre:<genre>
//   default:power default:cosmos (ley/rift tags only exist under these; near:node/near:breach always).
//   Every non-end stage needs a `next` without req; aim for 3+ endings, depth 3-7.

export const STORYLINES = [
  /* =============================== WORLD =============================== */
  {
    id: "comet_omen", n: "The Comet of {year}", scale: "world", anchor: "realm", w: 0.8,
    stages: {
      start: { h: "A comet burns above {capital}", b: "A tailed star hangs over {realm} night after night. In {capital}, astrologers, priests and drunkards all claim to know exactly what it means.", wait: [2, 5],
        next: [
          { to: "omen_doom", w: 1, mods: [["seers", 2], ["faith:stars", 2], ["unstable", 1.5], ["pious", 1.3]] },
          { to: "star_charts", w: 1, mods: [["scholarly", 2.5], ["learned", 2], ["academies", 2], ["faith:philosophy", 2]] },
        ] },
      omen_doom: { h: "Preachers name the comet a sign of doom", b: "{person}, a hedge-preacher, walks the streets of {capital} crying that the comet has come for the throne. Crowds follow, and the markets empty before dusk.", wait: [3, 8], fx: { unrest: 10, stability: -5 },
        next: [
          { to: "doom_revolt", w: 1, mods: [["unstable", 2], ["poor", 1.5], ["harsh_law", 0.6]] },
          { to: "ruler_falls", w: 0.7, mods: [["ruler:old", 2.5], ["ruler:sickly", 3]] },
          { to: "omen_fades", w: 1, mods: [["stable", 2], ["ruler:charismatic", 2]] },
        ] },
      star_charts: { h: "Stargazers of {capital} chart the comet", b: "{person2} and the stargazers of {realm} have tracked the comet night by night and claim it will return. Their tables are being copied far and wide.", wait: [4, 10], fx: { science: { astronomy: 0.6 } },
        next: [
          { to: "comet_returns", w: 1, mods: [["learned", 2], ["scholarly", 1.5]] },
          { to: "charts_condemned", w: 0.6, mods: [["zealous", 3], ["theocratic", 2.5], ["faith:stars", 2]] },
          { to: "omen_doom", w: 0.4, mods: [["seers", 2]] },
        ] },
      doom_revolt: { h: "The comet's faithful rise in {place}", b: "Convinced the world is ending, the followers of {person} have burned the tax rolls and barred the gates. They mean to greet the end as free people.", fx: { revolt: true, stability: -10, unrest: 20 }, end: true },
      ruler_falls: { h: "A ruler dies beneath the comet", b: "As the comet dimmed, the ruler of {realm} was found cold in bed. {person} is hailed as a true prophet, and every astrologer's fee has trebled.", fx: { ruler_dies: true, prestige: -3 }, end: true },
      omen_fades: { h: "The comet passes and nothing happens", b: "The tailed star has faded from the sky over {realm}. {person} has quietly left {capital}, and the crowds have gone back to their fields.", fx: { stability: 5 }, end: true },
      comet_returns: { h: "The comet returns exactly as foretold", b: "To the night, the comet reappeared where {person2} said it would. Scholars from distant courts now write to {capital} for its star tables.", fx: { discovery: "astronomy", prestige: 8 }, end: true },
      charts_condemned: { h: "Stargazers condemned for blasphemy", b: "The priests of {faith} have declared that the heavens are not for measuring. The star tables of {person2} were burned on the temple steps.", fx: { prestige: -4, unrest: 8, stability: 3 }, end: true },
    },
  },
  {
    id: "plague_saint", n: "The Saint of {place}", scale: "world", anchor: "town", w: 0.8,
    stages: {
      start: { h: "The plague reaches {place} at last", b: "Ships and carts have brought the sickness to {place}. Red crosses mark the doors of whole streets, and the physicians have fled or fallen.", wait: [1, 3], fx: { plague: true, pop: 0.92 },
        next: [
          { to: "saint_appears", w: 2 },
          { to: "rich_flee", w: 1, mods: [["poor", 1.5], ["unstable", 1.5], ["hierarchical", 1.3]] },
        ] },
      rich_flee: { h: "The rich abandon {place} to the sick", b: "Carts of the wealthy choke the roads out of {place}, leaving the poor behind with the dying. Only {person}, a humble healer, walks the other way.", wait: [1, 3], fx: { unrest: 12 },
        next: [{ to: "saint_appears", w: 1 }] },
      saint_appears: { h: "A healer walks among the dying", b: "{person} goes door to door in {place}, washing the sick and burying the dead. People say that some of the sick {person} touches recover.", wait: [3, 8], fx: { stability: 3 },
        next: [
          { to: "canonised", w: 1, mods: [["pious", 2.5], ["ruler:pious", 3], ["theocratic", 1.5]] },
          { to: "burned", w: 0.7, mods: [["zealous", 3], ["harsh_law", 2], ["ruler:paranoid", 2.5], ["ruler:cruel", 2]] },
          { to: "saint_dies", w: 0.8, mods: [["plague", 1.5], ["poor", 1.3]] },
          { to: "physicians_learn", w: 0.7, mods: [["learned", 2.5], ["scholarly", 2], ["faith:philosophy", 3]] },
        ] },
      canonised: { h: "{person} proclaimed a saint of {faith}", b: "The plague has passed from {place}, and the priests of {faith} have named its healer a saint. A shrine is being built over the house where the healer slept.", fx: { prestige: 8, stability: 8, monument: { tier: 1, name: "Shrine of {person}" } }, end: true },
      burned: { h: "Healer of {place} burned as a witch", b: "{person} was accused of spreading the sickness and burned in the square of {place}. The plague kept spreading anyway.", fx: { unrest: 20, stability: -8, pop: 0.85 }, end: true },
      saint_dies: { h: "The healer of {place} dies of plague", b: "{person} caught the sickness at last and died on a borrowed pallet. The town mourns, and the plague rages on through the winter.", fx: { pop: 0.82, stability: -4 }, end: true },
      physicians_learn: { h: "Physicians study the healer's methods", b: "Boiled linen, clean water, the sick kept apart: scholars of {realm} have written down every habit of {person} and found no miracle, only sense.", fx: { science: { medicine: 1 }, discovery: "medicine" }, end: true },
    },
  },
  {
    id: "titan_cult", n: "The Voice of {titan}", scale: "world", anchor: "titan", w: 1,
    stages: {
      start: { h: "Pilgrims gather in the shadow of {titan}", b: "Folk of {realm} have begun leaving offerings where {titan} walks. {person}, who claims to hear the titan's voice, preaches to a swelling crowd.", wait: [3, 6],
        next: [
          { to: "cult_grows", w: 1, mods: [["faith:titan", 3], ["titan_touched", 2], ["pious", 1.3]] },
          { to: "crackdown", w: 1, mods: [["origin:titan_slayers", 4], ["zealous", 2], ["harsh_law", 1.5]] },
        ] },
      cult_grows: { h: "The titan's cult spreads through {realm}", b: "Shrines of bone and moss appear in every village near {place}. The cultists of {person} refuse the tithe and say {titan} alone is their lord.", wait: [4, 10], fx: { stability: -4, unrest: 8, flag: "cult" },
        next: [
          { to: "titan_rampage", w: 1, mods: [["sacrifice", 2.5], ["chance:low", 2]] },
          { to: "titan_blessing", w: 1, mods: [["faith:titan", 2], ["stable", 1.5]] },
          { to: "cult_rules", w: 0.6, mods: [["unstable", 3], ["theocratic", 1.5]] },
        ] },
      crackdown: { h: "{ruler} outlaws the titan cult", b: "Soldiers of {realm} have torn down the shrines near {place} and put a price on the head of {person}. The pilgrims scatter into the hills.", wait: [2, 6], fx: { unrest: 10 },
        next: [
          { to: "martyrs", w: 1, mods: [["faith:titan", 2], ["unstable", 1.5]] },
          { to: "cult_crushed", w: 1, mods: [["stable", 2], ["martial", 1.5], ["harsh_law", 1.5]] },
          { to: "titan_rampage", w: 0.5, mods: [["chance:low", 3]] },
        ] },
      titan_rampage: { h: "{titan} rises and tramples the faithful", b: "Whether called by prayers or angered by them, {titan} stirred at last. The pilgrim camps near {place} are gone, and the land shakes still.", fx: { titan: true, pop: 0.75, stability: -10 }, end: true },
      titan_blessing: { h: "Rich harvests follow in {titan}'s wake", b: "Wherever {titan} has passed, the soil runs black and deep. {person} has raised a great altar, and even sceptics now leave a sheaf there.", fx: { growth: 0.003, prestige: 6, monument: { tier: 2, name: "The Altar of {titan}" } }, end: true },
      cult_rules: { h: "Titan-priests seize the court of {realm}", b: "With half the army kneeling to {person}, the old government of {realm} simply dissolved. The titan's prophet now speaks from the throne room.", fx: { revolution: true, stability: -15 }, end: true },
      martyrs: { h: "Titan martyrs spark a rising", b: "{person} was taken and executed, and the hill villages near {place} rose within the week. They fight with the titan's name on their lips.", fx: { revolt: true, unrest: 25 }, end: true },
      cult_crushed: { h: "The titan cult broken in {realm}", b: "The last shrines are ash and {person} has fled beyond the border. {ruler} declares that {realm} bows to no beast, however large.", fx: { stability: 5, prestige: 3 }, end: true },
    },
  },
  {
    id: "rift_spawn", n: "What Came Through the {site}", scale: "world", anchor: "site", site: ["Planar Rift", "Bottomless Sinkhole"], w: 1.2,
    stages: {
      start: { h: "Lights and dead livestock at the {site}", b: "Shepherds near {place} report lights moving inside the {site} and livestock found drained and cold. {person}, a warden of the deep places, rides out to look.", wait: [1, 4],
        next: [
          { to: "breach", w: 1, mods: [["magic:high", 1.5], ["faith:void", 1.5]] },
          { to: "wardens_hold", w: 1, mods: [["arcane", 2], ["arcane_council", 2], ["learned", 1.3]] },
        ] },
      breach: { h: "Creatures pour from the {site}", b: "Pale creatures with too many legs came out of the {site} at moonrise. The villages around {place} are burning, and {person} has not been seen since.", wait: [2, 5], fx: { unrest: 20, pop: 0.85, stability: -6 },
        next: [
          { to: "host_marches", w: 1, mods: [["martial", 2], ["standing_army", 1.5], ["rich", 1.3]] },
          { to: "land_lost", w: 1, mods: [["small", 2], ["poor", 1.5], ["atwar", 2]] },
          { to: "void_cult", w: 0.5, mods: [["faith:void", 4], ["origin:rift_touched", 2]] },
        ] },
      wardens_hold: { h: "Wardens seal the {site}", b: "{person} and a circle of {users} have woven wards of salt and iron across the {site}. Every night the guards hear scratching from below the wards.", wait: [3, 8], fx: { science: { arcana: 0.5 } },
        next: [
          { to: "rift_lore", w: 1, mods: [["learned", 2], ["scholarly", 1.5]] },
          { to: "breach", w: 0.6, mods: [["chance:low", 3], ["magic:high", 1.5]] },
        ] },
      host_marches: { h: "Rift-spawn driven back by {short}", b: "The host of {realm} marched on {place} with fire and spears and pushed the creatures back into the {site}. The cost in coin and lives was high.", fx: { prestige: 10, treasury: -80 }, end: true },
      land_lost: { h: "{place} abandoned to the rift", b: "No army came. The last families of {place} left with what they could carry, and the creatures of the {site} now nest in the empty houses.", fx: { abandon_town: true, stability: -10 }, end: true },
      void_cult: { h: "Rift cultists welcome the visitors", b: "Priests of the rift went out to meet the creatures with gifts. Now they lead them, and the province around {place} has thrown off the crown.", fx: { revolt: true, unrest: 25 }, end: true },
      rift_lore: { h: "Rift-lore enriches the {users} of {realm}", b: "The wards held, and years of watching taught {person} more about the {site} than any book. The {users} of {realm} have learned to draw on it safely.", fx: { discovery: "arcana", prestige: 5 }, end: true },
    },
  },
  {
    id: "star_iron", n: "The Star-Iron of {place}", scale: "world", anchor: "site", site: ["Meteor Crater"], w: 1.2,
    stages: {
      start: { h: "Star-iron found in the {site}", b: "Miners digging at the {site} near {place} have struck a black metal no forge can soften. {person}, a stubborn smith, swears it can be worked.", wait: [2, 5],
        next: [
          { to: "forge_secret", w: 1, mods: [["artisans", 2], ["learned", 2], ["mountain_folk", 1.5]] },
          { to: "rush", w: 1, mods: [["mercantile", 1.5], ["poor", 1.5]] },
        ] },
      rush: { h: "Fortune-seekers flood the {site}", b: "Every idle hand in {realm} seems to be digging at the {site}. Tent-towns sprawl around {place}, and knives come out over every claim.", wait: [2, 6], fx: { pop: 1.15, unrest: 10, treasury: 40 },
        next: [
          { to: "forge_secret", w: 1 },
          { to: "rush_riots", w: 1, mods: [["unstable", 2], ["poor", 1.5], ["harsh_law", 0.7]] },
        ] },
      forge_secret: { h: "{person} forges a blade of star-iron", b: "After a year of failures, {person} found the heat and the chant that make star-iron yield. The blade cuts plain steel like cheese.", wait: [3, 8], fx: { science: { metallurgy: 0.8 } },
        next: [
          { to: "star_arms", w: 1, mods: [["martial", 2], ["warrior_code", 1.5]] },
          { to: "star_war", w: 0.6, req: "has:rival", mods: [["ruler:warlike", 3], ["ruler:ambitious", 2]] },
          { to: "star_wonder", w: 1, mods: [["artisans", 2], ["lavish", 1.5], ["rich", 1.5]] },
          { to: "cursed_metal", w: 0.5, mods: [["chance:low", 3], ["seers", 1.5]] },
        ] },
      star_arms: { h: "Star-iron arms the host of {realm}", b: "The guard of {ruler} now carries star-iron. Enemy envoys who visit {capital} are shown the blades, and leave thoughtful.", fx: { discovery: "warfare", prestige: 6 }, end: true },
      star_war: { h: "Armed with star-iron, {short} marches on {rival}", b: "Certain that no army can stand against star-iron, {ruler} has declared war on {rival}. The forges near {place} work day and night.", fx: { war: "rival", relation: { rival: -20 }, prestige: 3 }, end: true },
      star_wonder: { h: "A gate of star-iron rises at {place}", b: "Instead of swords, {person} forged a gate: black, gleaming, and warm to the touch. Pilgrims and merchants now come to {place} just to see it.", fx: { monument: { tier: 2, name: "The Star-Iron Gate" }, prestige: 5 }, end: true },
      cursed_metal: { h: "Star-iron sickness strikes the forges", b: "The smiths who worked the metal lose their hair, then their teeth. {person} has died, and the {site} is fenced off with thorns.", fx: { pop: 0.85, stability: -5 }, end: true },
      rush_riots: { h: "Claim-jumpers riot at the crater", b: "A brawl over a single claim became a battle, then a sacking. The tent-towns around {place} answer to no one now.", fx: { unrest: 25, stability: -6, pop: 0.9 }, end: true },
    },
  },
  {
    id: "storm_moves", n: "The Walking Storm", scale: "world", anchor: "site", site: ["Eternal Storm"], w: 1.2,
    stages: {
      start: { h: "The {site} begins to move", b: "For as long as anyone remembers the {site} stayed where it was. This season its edge crept toward {place}, and the wind has not dropped since.", wait: [2, 5], fx: { unrest: 5 },
        next: [
          { to: "storm_advances", w: 1, mods: [["magic:high", 1.5]] },
          { to: "storm_readers", w: 1, mods: [["seers", 2], ["arcane", 2], ["faith:stars", 1.5], ["learned", 1.5]] },
        ] },
      storm_readers: { h: "{person} walks into the storm", b: "{person}, a weather-witch, went into the {site} with a lantern and a notebook. The witch came out nine days later, deaf in one ear and full of notes.", wait: [3, 8], fx: { science: { natural_philosophy: 0.6 } },
        next: [
          { to: "storm_tamed", w: 1, mods: [["arcane", 2], ["arcane_council", 2], ["magic:high", 1.5]] },
          { to: "storm_advances", w: 1 },
        ] },
      storm_advances: { h: "The storm swallows the fields of {place}", b: "Hail flattened the wheat and lightning walks the hedgerows. The farms nearest the {site} stand roofless, and their people crowd into {place}.", wait: [3, 8], fx: { pop: 0.88, growth: -0.002, stability: -5 },
        next: [
          { to: "exodus", w: 1, mods: [["poor", 1.5], ["small", 1.5]] },
          { to: "storm_stills", w: 1, mods: [["chance:low", 2], ["pious", 1.3]] },
          { to: "town_lost", w: 0.5, mods: [["chance:low", 2]] },
        ] },
      exodus: { h: "The people of {place} flee inland", b: "Led by {person2}, half the town packed its carts and walked away from the storm. They have staked out a new settlement beyond its reach.", fx: { pop: 0.7, found_town: true, stability: -4 }, end: true },
      town_lost: { h: "{place} lost to the {site}", b: "The storm closed over {place} in a single night. Survivors describe clouds as tall as towers and voices in the thunder.", fx: { abandon_town: true, prestige: -5 }, end: true },
      storm_stills: { h: "The {site} halts at last", b: "The storm has stopped at the edge of {place} and stirs no further. The priests of {faith} claim the credit, and nobody argues too loudly.", fx: { stability: 6 }, end: true },
      storm_tamed: { h: "The {site} bent to the will of {short}", b: "With rods of copper and a chant no one else understands, {person} has steered the storm away from {place}. Sailors pay well for the witch's forecasts.", fx: { discovery: "arcana", prestige: 10, science: { navigation: 0.5 } }, end: true },
    },
  },
  {
    id: "temple_rises", n: "The Risen Temple", scale: "world", anchor: "site", site: ["Sunken Temple"], w: 1.2,
    stages: {
      start: { h: "The {site} rises from the waves", b: "At low tide the drowned spires of the {site} now stand clear of the water near {place}. Fishermen say bells ring inside at night.", wait: [2, 5],
        next: [
          { to: "divers", w: 1, mods: [["seafaring", 2], ["mercantile", 1.5]] },
          { to: "priests_claim", w: 1, mods: [["pious", 2], ["zealous", 1.5], ["faith:sea", 3]] },
        ] },
      divers: { h: "Divers loot the {site}", b: "{person} and a crew of pearl-divers have brought up gold cups and green-stained tablets from the {site}. Every boat in {place} wants a share.", wait: [3, 6], fx: { treasury: 80, flag: "looted" },
        next: [
          { to: "temple_gold", w: 1, mods: [["mercantile", 1.5]] },
          { to: "drowned_curse", w: 1, mods: [["faith:sea", 2], ["seers", 1.5], ["chance:low", 2]] },
          { to: "tablets_read", w: 1, mods: [["learned", 2], ["scholarly", 2]] },
        ] },
      priests_claim: { h: "Priests of {faith} claim the {site}", b: "The priesthood has declared the {site} holy ground and forbidden the divers. Processions wade out at every low tide to pray among the spires.", wait: [3, 8], fx: { stability: 4 },
        next: [
          { to: "pilgrims_come", w: 1, mods: [["pilgrims", 3], ["pious", 1.5]] },
          { to: "drowned_curse", w: 0.6, mods: [["faith:sea", 2]] },
          { to: "temple_war", w: 0.4, req: "has:rival", mods: [["zealous", 3], ["militant", 2]] },
        ] },
      temple_gold: { h: "Temple gold floods the markets of {place}", b: "The {site} has given up its treasure, and {place} has never been richer. {person} now dines with lords.", fx: { treasury: 150, prestige: 4 }, end: true },
      drowned_curse: { h: "The sea takes back its temple", b: "A great wave rolled over {place} at dawn and the {site} sank beneath it. Many drowned; the old folk say the sea wanted its bells back.", fx: { pop: 0.8, stability: -8 }, end: true },
      tablets_read: { h: "The temple tablets deciphered", b: "Scholars of {realm} have read the tablets from the {site}: tide tables, star charts, and the names of forgotten gods.", fx: { science: { writing: 0.8 }, discovery: "navigation" }, end: true },
      pilgrims_come: { h: "Pilgrims throng the risen temple", b: "From every corner of {realm} the faithful come to wade among the spires of the {site}. The inns of {place} are full year round.", fx: { growth: 0.003, prestige: 6, pop: 1.15 }, end: true },
      temple_war: { h: "Holy war over the {site}", b: "When {rival} claimed the risen temple for its own gods, the priests of {faith} called for war. {ruler} could not refuse them.", fx: { war: "rival", relation: { rival: -25 } }, end: true },
    },
  },
  {
    id: "barefoot_saint", n: "The Barefoot Peace", scale: "world", anchor: "war", w: 1,
    stages: {
      start: { h: "A barefoot pilgrim crosses the battle lines", b: "{person}, a wandering holy one of {faith}, walked unharmed between the armies of {war}. Soldiers on both sides lay down their spears to listen.", wait: [2, 5],
        next: [
          { to: "carries_terms", w: 1, mods: [["pacifist", 3], ["pious", 2], ["losing", 1.5], ["ruler:peaceful", 2], ["ruler:pious", 1.5]] },
          { to: "pilgrim_jailed", w: 1, mods: [["zealous", 2], ["ruler:cruel", 2], ["ruler:warlike", 2], ["winning", 1.5]] },
        ] },
      carries_terms: { h: "{person} carries terms between the camps", b: "The pilgrim walks from tent to tent with bread and a list of grievances. Captains of {realm} admit, grudgingly, that the list is fair.", wait: [2, 6],
        next: [
          { to: "saint_peace", w: 1, mods: [["ruler:just", 1.5], ["ruler:peaceful", 2], ["losing", 2], ["unstable", 1.3]] },
          { to: "talks_fail", w: 1, mods: [["ruler:warlike", 2], ["winning", 2], ["ruler:ambitious", 1.5]] },
        ] },
      pilgrim_jailed: { h: "{ruler} jails the barefoot pilgrim", b: "Calling the pilgrim a spy, {ruler} had {person} dragged to {capital} in chains. The soldiers who listened to the sermons mutter at their fires.", wait: [1, 4], fx: { unrest: 12 },
        next: [
          { to: "martyrdom", w: 1, mods: [["ruler:cruel", 2], ["harsh_law", 2]] },
          { to: "carries_terms", w: 1, mods: [["ruler:pious", 2], ["ruler:just", 2], ["stable", 1.2]] },
        ] },
      saint_peace: { h: "The pilgrim's peace ends {war}", b: "Both sides signed beneath a tree where {person} had slept. The armies of {realm} march home, and a cairn marks the spot.", fx: { peace: true, prestige: 5, stability: 8, monument: { tier: 1, name: "The Pilgrim's Cairn" } }, end: true },
      talks_fail: { h: "Talks collapse and the war goes on", b: "Neither court would yield an inch. {person} has walked away toward the mountains, and the drums of {war} sound again.", fx: { stability: -4, unrest: 6 }, end: true },
      martyrdom: { h: "Execution of the pilgrim shakes the army", b: "{person} was put to death in {capital}. Whole companies of {realm} have thrown down their arms, and the priests of {faith} speak openly against the throne.", fx: { stability: -10, unrest: 20, prestige: -5 }, end: true },
    },
  },

  /* =============================== REALM =============================== */
  {
    id: "prophet_heresy", n: "The Prophet {person}", scale: "realm", anchor: "realm", w: 1.2,
    stages: {
      start: { h: "A prophet preaches outside {capital}", b: "{person} claims that {deity} has spoken again, and that the priests of {faith} twisted the old words. Crowds swell every market day.", wait: [2, 6],
        next: [
          { to: "heresy_spreads", w: 1, mods: [["tolerant", 1.5], ["unstable", 1.5], ["egalitarian", 1.5], ["mystic", 2]] },
          { to: "council", w: 1, mods: [["scholarly", 1.5], ["tolerant", 2], ["ruler:just", 1.5]] },
          { to: "persecution", w: 1, mods: [["zealous", 3], ["theocratic", 2], ["ruler:pious", 1.5], ["harsh_law", 1.5]] },
        ] },
      heresy_spreads: { h: "The new teaching wins converts across {realm}", b: "Village priests now read the words of {person} alongside the old scripture. In {capital}, the high clergy call it rot.", wait: [4, 10], fx: { stability: -5, flag: "spread" },
        next: [
          { to: "schism", w: 1, mods: [["unstable", 2], ["zealous", 1.5]] },
          { to: "reform", w: 1, mods: [["ruler:reformer", 3], ["tolerant", 2], ["republic", 1.3]] },
        ] },
      council: { h: "Council of priests weighs the prophet's words", b: "The high priests of {faith} have summoned {person} to {capital} to defend the new teaching. The debate fills the temple for weeks.", wait: [3, 6], fx: { prestige: 2 },
        next: [
          { to: "reform", w: 1, mods: [["tolerant", 2], ["scholarly", 1.5], ["ruler:reformer", 2]] },
          { to: "persecution", w: 0.8, mods: [["zealous", 2], ["ruler:traditionalist", 2]] },
        ] },
      persecution: { h: "{ruler} orders the prophet seized", b: "Guards have ransacked the lodgings of {person} and burned every copy of the sermons they could find. The prophet's followers hide the rest.", wait: [2, 5], fx: { unrest: 12 },
        next: [
          { to: "martyr_revolt", w: 1, mods: [["unstable", 2], ["poor", 1.5], ["egalitarian", 1.5], ["flag:spread", 2]] },
          { to: "heresy_crushed", w: 1, mods: [["stable", 2], ["harsh_law", 2], ["martial", 1.3]] },
        ] },
      schism: { h: "Schism splits the faith of {realm}", b: "Two priesthoods now claim to speak for {deity}. Temples have been barricaded, and whole provinces follow {person} instead of {capital}.", fx: { stability: -15, revolt: true }, end: true },
      reform: { h: "The prophet's teaching becomes doctrine", b: "{ruler} has embraced the reforms of {person}, and the faith of {realm} is renewed. Scribes are busy copying the new scripture.", fx: { stability: 6, prestige: 5, science: { writing: 0.4 } }, end: true },
      martyr_revolt: { h: "The prophet's blood sparks rebellion", b: "{person} died on the scaffold singing. By nightfall the followers had seized the gates, and now they march in the prophet's name.", fx: { revolt: true, unrest: 30 }, end: true },
      heresy_crushed: { h: "Heresy stamped out in {realm}", b: "The followers of {person} have recanted, fled or died. The temples of {faith} ring with the old words, if a little emptier than before.", fx: { stability: 5, prestige: -2, pop: 0.97 }, end: true },
    },
  },
  {
    id: "disputed_succession", n: "The Empty Chair of {realm}", scale: "realm", anchor: "realm", req: ["monarchy", { any: ["ruler:old", "ruler:sickly"] }], w: 1.3,
    stages: {
      start: { h: "Court whispers over {ruler}'s failing health", b: "{ruler} has not been seen in public for a month. In the halls of {capital}, {person} and {person2} have each begun gathering friends.", wait: [2, 6],
        next: [
          { to: "deathbed", w: 1.5 },
          { to: "recovery", w: 0.6, mods: [["ruler:strong", 2.5], ["chance:low", 1.5]] },
        ] },
      recovery: { h: "{ruler} rises from the sickbed", b: "To the dismay of half the court, {ruler} is walking the gardens again and asking pointed questions about who met whom.", wait: [2, 5],
        next: [
          { to: "purge", w: 1, mods: [["ruler:paranoid", 3], ["ruler:cruel", 2], ["harsh_law", 1.5]] },
          { to: "forgiven", w: 1, mods: [["ruler:just", 2], ["ruler:generous", 2]] },
        ] },
      deathbed: { h: "The ruler of {realm} is dead", b: "The bells of {capital} rang through the night. The chamberlain broke the seals of state, and every eye turned to see who would claim them.", wait: [1, 3], fx: { ruler_dies: true, stability: -8 },
        next: [
          { to: "smooth", w: 1.5, req: "heir", mods: [["stable", 2], ["hierarchical", 1.5], ["divine_right", 1.5]] },
          { to: "claims", w: 1, mods: [["unstable", 2], ["no_heir", 3], ["gov:elective", 2], ["dynastic", 1.5]] },
        ] },
      claims: { h: "{person} and {person2} both claim the throne", b: "Each has a charter, a bishop and an army of cousins. Lords of {realm} are choosing sides, and the treasury guards have barred the vaults.", wait: [2, 6], fx: { stability: -10, unrest: 15 },
        next: [
          { to: "civil_war", w: 1, mods: [["unstable", 2], ["martial", 1.5]] },
          { to: "compromise", w: 1, mods: [["stable", 1.5], ["gov:elective", 2], ["hospitable", 1.3]] },
          { to: "foreign_meddling", w: 0.7, req: "has:rival", mods: [["unstable", 1.5], ["small", 1.5]] },
        ] },
      purge: { h: "{ruler} purges the would-be heirs", b: "{person} has been exiled and {person2} imprisoned. The court of {capital} is quieter now, and a good deal more frightened.", fx: { stability: 5, prestige: -2, ruler_trait: "paranoid" }, end: true },
      forgiven: { h: "{ruler} forgives the ambitious lords", b: "Rather than punish them, {ruler} invited {person} and {person2} to dinner and made them swear an oath of peace. It seems to have worked.", fx: { stability: 8, prestige: 3 }, end: true },
      smooth: { h: "The heir crowned without a quarrel", b: "Whatever {person} and {person2} had plotted came to nothing. The new ruler of {realm} was crowned in {capital} before the snow fell.", fx: { stability: 8, prestige: 3 }, end: true },
      civil_war: { h: "Civil war over the crown of {realm}", b: "Talk has failed. The banners of {person} and {person2} face each other across the fields outside {capital}.", fx: { revolt: true, stability: -15 }, end: true },
      compromise: { h: "The lords settle on a compromise crown", b: "Exhausted by quarrelling, the great houses crowned a harmless cousin. Neither {person} nor {person2} is pleased, which the lords count as fairness.", fx: { stability: 5, prestige: -3 }, end: true },
      foreign_meddling: { h: "{rival} backs a pretender in {realm}", b: "Gold and soldiers from {rival} arrived for {person2}, and the court of {realm} has answered with steel. The succession has become a war.", fx: { relation: { rival: -30 }, war: "rival", stability: -5 }, end: true },
    },
  },
  {
    id: "bastard_claimant", n: "The Tanner's Crown", scale: "realm", anchor: "realm", req: "monarchy", w: 0.9,
    stages: {
      start: { h: "A royal bastard appears in {place}", b: "{person}, raised in a tannery outside {place}, carries an old signet ring and a face every greybeard at court recognises. The commons adore the tale.", wait: [3, 6],
        next: [
          { to: "court_accepts", w: 1, mods: [["ruler:generous", 2], ["ruler:just", 1.5], ["no_heir", 3], ["egalitarian", 1.5]] },
          { to: "court_rejects", w: 1, mods: [["hierarchical", 2], ["divine_right", 1.5], ["ruler:paranoid", 2], ["heir", 1.5]] },
        ] },
      court_accepts: { h: "{person} welcomed at the court of {ruler}", b: "{ruler} embraced the tanner's child before the whole court. The old nobility smiles thinly and counts the new rival for favour.", wait: [4, 10], fx: { prestige: 2 },
        next: [
          { to: "loyal_shield", w: 1, mods: [["ruler:charismatic", 1.5], ["stable", 1.5]] },
          { to: "named_heir", w: 1.5, req: "no_heir" },
          { to: "bastard_coup", w: 0.5, mods: [["ruler:lazy", 2], ["unstable", 2], ["ruler:old", 1.5]] },
        ] },
      court_rejects: { h: "{ruler} brands the claimant an impostor", b: "Heralds read out the verdict in every square: {person} is a fraud and a forger. In the taverns of {place}, nobody believes a word of it.", wait: [2, 5], fx: { unrest: 10 },
        next: [
          { to: "commons_rise", w: 1, mods: [["poor", 1.5], ["unstable", 2], ["egalitarian", 1.5]] },
          { to: "vanishes", w: 1, mods: [["stable", 1.5], ["harsh_law", 2], ["spy_network", 2]] },
          { to: "flees_to_rival", w: 0.8, req: "has:rival" },
        ] },
      loyal_shield: { h: "The bastard becomes the realm's shield", b: "{person} has proven a tireless servant of the crown, riding the borders and settling feuds. The commons call it proof of good blood.", fx: { stability: 5, prestige: 5 }, end: true },
      named_heir: { h: "{person} named heir of {realm}", b: "Having no child of the marriage bed, {ruler} has legitimised {person} and named the tanner's child heir before the assembled lords.", fx: { heir: true, stability: 6 }, end: true },
      bastard_coup: { h: "The bastard seizes the throne", b: "With the palace guard bought and the commons cheering, {person} took the crown by night. The old ruler of {realm} did not live to see the dawn.", fx: { ruler_dies: true, stability: -12 }, end: true },
      commons_rise: { h: "Commons rise for the bastard of {place}", b: "The people of {place} have hidden {person} and armed themselves with pitchforks and tanning knives. They call their champion the true heir.", fx: { revolt: true, unrest: 20 }, end: true },
      vanishes: { h: "The claimant vanishes from {place}", b: "One morning {person} was simply gone. Nobody asks where, and the signet ring has been quietly returned to the royal treasury.", fx: { stability: 3, unrest: -5 }, end: true },
      flees_to_rival: { h: "The bastard finds shelter in {rival}", b: "{person} has crossed the border and is feasting at the court of {rival}, which now speaks of the rightful heir of {realm}.", fx: { relation: { rival: -20 }, stability: -4 }, end: true },
    },
  },
  {
    id: "peasant_messiah", n: "The Plough-Hand Messiah", scale: "realm", anchor: "realm", w: 1,
    stages: {
      start: { h: "A plough-hand preaches the end of lords", b: "{person}, a field labourer from the farms around {capital}, promises that {deity} will soon lift the poor over the proud. Thousands walk miles to hear it.", wait: [2, 6],
        next: [
          { to: "march", w: 1, mods: [["poor", 2], ["hierarchical", 1.5], ["unstable", 1.5], ["plague", 1.5], ["harsh_law", 1.3]] },
          { to: "sect", w: 1, mods: [["rich", 1.5], ["stable", 2], ["egalitarian", 1.5], ["ruler:generous", 2]] },
        ] },
      march: { h: "A peasant host marches on {capital}", b: "Carrying scythes and a painted banner, the followers of {person} are walking toward {capital}. Every village they pass adds to their number.", wait: [1, 3], fx: { unrest: 25, stability: -8 },
        next: [
          { to: "massacre", w: 1, mods: [["ruler:cruel", 3], ["harsh_law", 2], ["standing_army", 1.5], ["martial", 1.3]] },
          { to: "charter", w: 1, mods: [["ruler:just", 2], ["ruler:reformer", 2], ["ruler:generous", 1.5], ["republic", 1.3]] },
          { to: "triumph", w: 0.6, mods: [["unstable", 2.5], ["losing", 2], ["atwar", 1.5], ["poor", 1.5]] },
        ] },
      sect: { h: "The messiah's following settles into a sect", b: "No trumpet has sounded yet. The followers of {person} now share their bread, work each other's fields and wait patiently for {deity}.", wait: [6, 12],
        next: [
          { to: "free_village", w: 1, mods: [["egalitarian", 2], ["tolerant", 1.5]] },
          { to: "forgotten", w: 1 },
          { to: "march", w: 0.4, mods: [["poor", 3], ["plague", 2]] },
        ] },
      massacre: { h: "The peasant host is cut down at the gates", b: "Horsemen rode into the crowd before {capital} and did not stop. {person} was among the dead, and the fields go untended this spring.", fx: { pop: 0.88, stability: -5, prestige: -5, unrest: 15 }, end: true },
      charter: { h: "{ruler} grants the peasants a charter", b: "Meeting {person} under the walls, {ruler} agreed to lower dues and a court for the common folk. The host went home singing.", fx: { stability: 8, treasury: -60, growth: 0.002 }, end: true },
      triumph: { h: "The plough-hand's host takes {capital}", b: "The gates opened from inside. The lords of {realm} have fled or hang from the walls, and {person} sits among the people in the council hall.", fx: { revolution: true }, end: true },
      free_village: { h: "Messiah's followers found a free village", b: "The sect of {person} bought a stretch of wild land and built a village with no lord and no tithe. More families join every season.", fx: { found_town: true, growth: 0.001 }, end: true },
      forgotten: { h: "The plough-hand dies in obscurity", b: "{person} died old and poor, still waiting. A few followers keep the sermons, but most have gone back to their lords' fields.", fx: { stability: 2 }, end: true },
    },
  },
  {
    id: "merchant_bubble", n: "The {good} Mania", scale: "realm", anchor: "realm", req: { any: ["mercantile", "has:port", "gov:merchant", "free_trade"] }, w: 1,
    stages: {
      start: { h: "Mania for {good} grips {capital}", b: "Contracts for {good} change hands ten times a day in {capital}. {person}, a promoter of ventures, promises every investor a fortune by spring.", wait: [2, 5], fx: { treasury: 40 },
        next: [{ to: "boom", w: 1 }] },
      boom: { h: "Fortunes soar on {good} contracts", b: "Cobblers and countesses alike are buying {good} they will never see. {person} has built a palace, and prices climb every week.", wait: [3, 8], fx: { treasury: 80, prestige: 2 },
        next: [
          { to: "crash", w: 1, mods: [["chance:high", 1.5]] },
          { to: "soft_landing", w: 0.8, mods: [["learned", 1.3], ["gov:merchant", 2], ["ruler:cunning", 2], ["ruler:brilliant", 2]] },
          { to: "crown_buys", w: 0.6, mods: [["ruler:greedy", 3], ["ruler:ambitious", 1.5]] },
        ] },
      crown_buys: { h: "{ruler} stakes the treasury on {good}", b: "Against all advice, {ruler} has put the royal reserves into {good} contracts. For now, the ledgers glow with paper profits.", wait: [2, 5], fx: { treasury: 100 },
        next: [
          { to: "crash", w: 1, mods: [["chance:high", 2]] },
          { to: "crown_windfall", w: 0.6, mods: [["ruler:cunning", 2]] },
        ] },
      crash: { h: "The {good} bubble bursts", b: "One ship failed to arrive, one buyer failed to pay, and the whole edifice fell in a day. The exchange of {capital} is shuttered.", wait: [1, 4], fx: { treasury: -150, stability: -10, unrest: 15 },
        next: [
          { to: "promoter_hanged", w: 1, mods: [["harsh_law", 2], ["ruler:cruel", 2]] },
          { to: "burgher_riots", w: 1, mods: [["poor", 2], ["unstable", 2]] },
          { to: "slow_recovery", w: 1 },
        ] },
      soft_landing: { h: "Council cools the {good} fever", b: "New rules on contracts let the air out slowly. {person} grumbles, but the merchants of {capital} have kept most of their gains.", fx: { treasury: 60, stability: 3 }, end: true },
      crown_windfall: { h: "The crown sells at the very peak", b: "{ruler} sold every contract a week before the fall. The treasury is fat, and the ruined investors curse the royal name.", fx: { treasury: 200, prestige: 3, unrest: 10 }, end: true },
      promoter_hanged: { h: "{person} hanged before the exchange", b: "The crowd cheered as the promoter of the {good} mania dropped. It returned no coin to anyone, but it was felt to be justice.", fx: { stability: 4, unrest: -10 }, end: true },
      burgher_riots: { h: "Ruined burghers riot in {capital}", b: "Merchants who lost everything have joined with the dockhands they can no longer pay. The counting houses of {capital} burn.", fx: { revolt: true, unrest: 20 }, end: true },
      slow_recovery: { h: "The exchange reopens under stern new rules", b: "Months after the crash, the exchange of {capital} opens its doors again. Trade in {good} is sober, slow and closely watched.", fx: { stability: 3, growth: -0.001 }, end: true },
    },
  },
  {
    id: "mad_alchemist", n: "The Alchemist of {capital}", scale: "realm", anchor: "realm", req: "!alchemy", w: 1,
    stages: {
      start: { h: "An alchemist sets up in {capital}", b: "{person} has leased a tower in {capital} and fills it with foul smoke and brighter promises: gold from lead, youth from quicksilver.", wait: [3, 6],
        next: [
          { to: "patron", w: 1, mods: [["ruler:greedy", 2], ["ruler:ambitious", 1.5], ["ruler:scholar", 2], ["ruler:sickly", 2]] },
          { to: "academy_study", w: 1, mods: [["scholarly", 2.5], ["academies", 3], ["learned", 2], ["faith:philosophy", 2]] },
        ] },
      patron: { h: "{ruler} becomes the alchemist's patron", b: "Crates of silver and quicksilver roll into the tower each week. {ruler} visits by night and leaves smelling of sulphur.", wait: [4, 10], fx: { treasury: -40, flag: "patron" },
        next: [
          { to: "elixir", w: 1, mods: [["ruler:old", 1.5], ["ruler:sickly", 2]] },
          { to: "explosion", w: 1 },
          { to: "fraud", w: 1, mods: [["ruler:cunning", 2], ["spy_network", 2]] },
        ] },
      academy_study: { h: "Scholars examine the alchemist's work", b: "The masters of {realm} have taken {person}'s notebooks. Beneath the ravings they found careful records of a hundred reactions.", wait: [4, 8],
        next: [
          { to: "tamed_fire", w: 1.5, mods: [["learned", 2], ["scholarly", 2]] },
          { to: "explosion", w: 0.5 },
        ] },
      elixir: { h: "The elixir of life proves fatal", b: "The ruler of {realm} drank the first cup of {person}'s elixir before the whole court and fell dead within the hour. The alchemist has fled.", fx: { ruler_dies: true, stability: -8 }, end: true },
      explosion: { h: "The alchemist's tower explodes over {capital}", b: "A green flash, a roar, and the tower was gone. Half a street burned with it, and the stink lingered for a month.", fx: { pop: 0.94, unrest: 10, science: { alchemy: 0.4 } }, end: true },
      fraud: { h: "{person} unmasked as a swindler", b: "The gold was gilded lead and the elixir coloured wine. The alchemist sits in a cell, and some of the silver has been recovered.", fx: { treasury: 30, stability: 2, prestige: -3 }, end: true },
      tamed_fire: { h: "The academies tame the alchemist's fire", b: "Working from {person}'s notes, the scholars of {realm} have produced a fire that burns on water. Nobody has died making it, yet.", fx: { discovery: "alchemy", science: { alchemy: 1 }, prestige: 4 }, end: true },
    },
  },
  {
    id: "great_inventor", n: "The Engine of {person}", scale: "realm", anchor: "realm", w: 1,
    stages: {
      start: { h: "A tinkerer's contraption astonishes {capital}", b: "{person}, a millwright's child, has built a machine of wheels and weights that lifts water without an ox. Crowds gather to watch it turn.", wait: [3, 6],
        next: [
          { to: "patronage", w: 1, mods: [["rich", 2], ["learned", 1.5], ["ruler:scholar", 2], ["ruler:brilliant", 2], ["academies", 2]] },
          { to: "guilds_oppose", w: 1, mods: [["guilds", 3], ["artisans", 1.5], ["ruler:traditionalist", 2], ["backward", 1.5]] },
        ] },
      patronage: { h: "The court funds {person}'s workshop", b: "{ruler} has granted {person} a workshop, apprentices and a purse. The hammering can be heard across half of {capital}.", wait: [6, 14], fx: { treasury: -50 },
        next: [
          { to: "breakthrough", w: 1, mods: [["learned", 2]] },
          { to: "war_engines", w: 0.8, mods: [["atwar", 3], ["ruler:warlike", 2], ["martial", 1.5]] },
          { to: "accident", w: 0.4, mods: [["chance:low", 2]] },
        ] },
      guilds_oppose: { h: "Guildsmen smash {person}'s machine", b: "Masters who feared for their trade broke into the workshop at night and took hammers to the engine. {person} has vowed to build it again.", wait: [2, 6], fx: { unrest: 8 },
        next: [
          { to: "flees", w: 1, mods: [["has:rival", 1.5]] },
          { to: "patronage", w: 0.8, mods: [["ruler:reformer", 3], ["ruler:brilliant", 2]] },
        ] },
      breakthrough: { h: "{person}'s engine changes {realm}", b: "Mills that grind without wind, pumps that drain the mines: the engines of {person} are copied in every town, and {realm} grows richer by the year.", fx: { discovery: "engineering", growth: 0.003, prestige: 8 }, end: true },
      war_engines: { h: "The war engines of {person} roll out", b: "Engines that hurl stone twice as far and three times as often now serve the army of {realm}. {person} is said to weep at night.", fx: { discovery: "warfare", science: { warfare: 0.8 }, prestige: 4 }, end: true },
      accident: { h: "{person} dies in a workshop accident", b: "A great wheel broke loose and crushed the inventor at the bench. The apprentices have kept the drawings, though few can read them.", fx: { science: { engineering: 0.3 }, prestige: -2 }, end: true },
      flees: { h: "The inventor flees {realm} with the plans", b: "Disgusted, {person} has crossed the border with a satchel of drawings. Some foreign court will soon have the engine instead.", fx: { prestige: -4 }, end: true },
    },
  },
  {
    id: "secret_society", n: "The Masked Brotherhood", scale: "realm", anchor: "realm", w: 0.9,
    stages: {
      start: { h: "Masked meetings in the cellars of {capital}", b: "Watchmen report hooded figures slipping into the old cisterns of {capital}. A token found on a drowned clerk bears an eye within a key.", wait: [3, 6],
        next: [
          { to: "brotherhood_grows", w: 1, mods: [["urbane", 1.5], ["unstable", 1.3]] },
          { to: "betrayed", w: 1, mods: [["spy_network", 3], ["ruler:paranoid", 2], ["harsh_law", 1.5]] },
        ] },
      brotherhood_grows: { h: "The masked brotherhood reaches the court", b: "Ministers now wear the eye-and-key ring beneath their gloves. Laws are now passed in {capital} that no council ever debated.", wait: [6, 12], fx: { flag: "inside" },
        next: [
          { to: "libraries", w: 1, mods: [["scholarly", 2], ["learned", 1.5], ["egalitarian", 1.5]] },
          { to: "puppets", w: 1, mods: [["ruler:lazy", 3], ["ruler:young", 2], ["ruler:content", 1.5]] },
          { to: "masked_coup", w: 0.6, mods: [["unstable", 2], ["republic", 1.5]] },
        ] },
      betrayed: { h: "{person} betrays the masked brotherhood", b: "A frightened initiate, {person} has given the watch a list of names. Some of them are very great names indeed.", wait: [1, 4],
        next: [
          { to: "show_trials", w: 1, mods: [["harsh_law", 2], ["ruler:cruel", 2], ["ruler:paranoid", 2]] },
          { to: "brotherhood_grows", w: 0.5, mods: [["ruler:lazy", 2]] },
        ] },
      libraries: { h: "The brotherhood unveils its hidden libraries", b: "The masked ones were scholars all along, guarding forbidden books. With {person2} as their face, they have opened their archive to {realm}.", fx: { science: { natural_philosophy: 1 }, discovery: "natural_philosophy", stability: 3 }, end: true },
      puppets: { h: "The masked brothers rule behind the throne", b: "{ruler} signs what is put in front of the throne. The treasury pays for things no one has seen, and the brotherhood's houses grow grand.", fx: { treasury: -80, prestige: -5, stability: 4 }, end: true },
      masked_coup: { h: "Masked conspirators seize {capital}", b: "At a signal of bells, the brotherhood's men took the gates, the treasury and the palace. They have not yet removed their masks.", fx: { revolution: true }, end: true },
      show_trials: { h: "Show trials empty the cellars of {capital}", b: "Dozens stood trial for the brotherhood; many were guilty of nothing but a rumour. The gallows in {capital} are busy.", fx: { stability: -4, unrest: 15, prestige: -3 }, end: true },
    },
  },
  {
    id: "assassination_plot", n: "The Cupbearer's Plot", scale: "realm", anchor: "realm", w: 1,
    stages: {
      start: { h: "Poisoners hired against {ruler}", b: "Tavern rumour in {capital} says a purse of gold has changed hands, and that {person}, a court cupbearer, has been seen with strangers.", wait: [1, 4],
        next: [
          { to: "foiled", w: 1, mods: [["spy_network", 3], ["ruler:paranoid", 2.5], ["ruler:cunning", 2]] },
          { to: "attempt", w: 1 },
        ] },
      attempt: { h: "A blade strikes at {ruler} in {capital}", b: "At the high feast, {person} dropped the cup and drew a knife. The hall erupted, and the physicians were called for.", wait: [1, 2], fx: { stability: -6 },
        next: [
          { to: "assassinated", w: 1, mods: [["ruler:old", 1.5], ["ruler:sickly", 2], ["chance:low", 1.5]] },
          { to: "wounded", w: 1, mods: [["ruler:strong", 2], ["ruler:brave", 1.5]] },
          { to: "bodyguard", w: 1, mods: [["martial", 1.5], ["chance:high", 1.2]] },
        ] },
      foiled: { h: "Plot against {ruler} uncovered", b: "The cupbearer {person} was taken with a vial in hand. Under questioning, names have begun to spill out.", wait: [1, 3],
        next: [
          { to: "plotters_hanged", w: 1 },
          { to: "blame_rival", w: 1, req: "has:rival", mods: [["ruler:warlike", 2.5], ["ruler:paranoid", 2], ["martial", 1.5]] },
        ] },
      assassinated: { h: "The ruler of {realm} is assassinated", b: "The blade found its mark. {realm} is without its ruler, and the court is tearing itself apart looking for the hand that paid {person}.", fx: { ruler_dies: true, stability: -15, unrest: 15 }, end: true },
      wounded: { h: "{ruler} survives, scarred and vengeful", b: "The wound was deep but not deep enough. {ruler} now eats only what a taster has tried first, and trusts no one at all.", fx: { ruler_trait: "paranoid", stability: -3 }, end: true },
      bodyguard: { h: "{person2} takes the blade meant for {ruler}", b: "A guard named {person2} stepped in front of the knife and died on the feast-hall floor. {realm} mourns a hero; {person} hangs at dawn.", fx: { stability: 4, prestige: 4 }, end: true },
      plotters_hanged: { h: "The plotters hang in {capital}", b: "{person} and three accomplices were hanged on the palace wall. The crowds admire {ruler}'s luck, or the gods' favour.", fx: { stability: 5, prestige: 3 }, end: true },
      blame_rival: { h: "{short} blames {rival} for the plot", b: "The confession named envoys of {rival}. Whether true or not, {ruler} has declared war on the court that bought the poison.", fx: { war: "rival", relation: { rival: -30 } }, end: true },
    },
  },
  {
    id: "runaway_princess", n: "The Runaway of {capital}", scale: "realm", anchor: "realm", req: "monarchy", w: 0.8,
    stages: {
      start: { h: "A royal daughter vanishes from {capital}", b: "{person}, a daughter of the royal house, slipped out of the palace the night before the betrothal. A maid swears the princess left with a travelling player.", wait: [2, 5], fx: { stability: -3 },
        next: [
          { to: "search", w: 1 },
          { to: "surfaces_abroad", w: 0.7, req: "has:rival", mods: [["chance:low", 2]] },
        ] },
      search: { h: "Riders scour {realm} for {person}", b: "Every road out of {capital} is watched and every inn searched. The players' troupe was last seen heading for the border with a new actress.", wait: [2, 6], fx: { treasury: -20 },
        next: [
          { to: "dragged_home", w: 1, mods: [["stable", 1.5], ["spy_network", 2], ["great_roads", 1.5]] },
          { to: "love_wins", w: 1, mods: [["egalitarian", 2], ["ruler:generous", 2], ["ruler:just", 1.5]] },
          { to: "never_found", w: 0.6 },
        ] },
      surfaces_abroad: { h: "{person} surfaces at the court of {rival}", b: "The runaway has turned up among the courtiers of {rival}, where the princess is treated as an honoured guest and kept as a useful hostage.", wait: [2, 5],
        next: [
          { to: "rival_wedding", w: 1, mods: [["dynastic", 2.5], ["ruler:peaceful", 2]] },
          { to: "hostage_war", w: 1, mods: [["ruler:warlike", 2], ["martial", 1.5], ["ruler:cruel", 1.5]] },
        ] },
      dragged_home: { h: "{person} dragged home to the wedding", b: "Found singing in a market square, {person} was brought back to {capital} under guard. The wedding took place a week later, without smiles.", fx: { prestige: 2, stability: 3 }, end: true },
      love_wins: { h: "The runaway weds the player; {ruler} relents", b: "Rather than lose a daughter, {ruler} has blessed the match. The court is scandalised, the commons delighted, the ballads endless.", fx: { stability: 4, prestige: -3 }, end: true },
      never_found: { h: "The search for {person} abandoned", b: "A year on, the riders have come home empty-handed. Some say {person} lives by the sea under another name; some say worse.", fx: { prestige: -4, stability: -3 }, end: true },
      rival_wedding: { h: "The runaway weds into the court of {rival}", b: "{person} has married a prince of {rival}, and the family at home has grudgingly blessed it. The two courts exchange gifts instead of insults, for now.", fx: { prestige: 4, stability: 3 }, end: true },
      hostage_war: { h: "{ruler} goes to war to reclaim {person}", b: "When {rival} refused to send the princess home, {ruler} called the banners. The whole realm marches for one runaway daughter.", fx: { war: "rival", relation: { rival: -30 } }, end: true },
    },
  },
  {
    id: "famine", n: "The Hungry Year", scale: "realm", anchor: "realm", w: 1.2,
    stages: {
      start: { h: "Harvest fails across {realm}", b: "Blight and rain have rotted the grain in the fields around {capital}. Bread prices doubled within the month, and the granaries are half empty.", wait: [2, 4], fx: { stability: -4 },
        next: [
          { to: "relief", w: 1, mods: [["rich", 2], ["ruler:generous", 2.5], ["ruler:just", 1.5], ["great_roads", 1.5], ["has:port", 1.3]] },
          { to: "hoarding", w: 1, mods: [["ruler:greedy", 2.5], ["poor", 2], ["hierarchical", 1.3], ["mercantile", 1.3]] },
        ] },
      relief: { h: "{ruler} opens the royal granaries", b: "Carts of grain roll out from the royal stores to every market in {realm}. {person}, the steward, rations each loaf with care.", wait: [3, 6], fx: { treasury: -80 },
        next: [
          { to: "weathered", w: 1.5 },
          { to: "bread_riots", w: 0.4, mods: [["poor", 2]] },
        ] },
      hoarding: { h: "Grain hoarders grow fat as {capital} starves", b: "Merchants led by {person} hold back their grain for higher prices. Children beg at the gates of {capital} while barns stand full.", wait: [2, 4], fx: { unrest: 15, pop: 0.93 },
        next: [
          { to: "bread_riots", w: 1, mods: [["poor", 1.5], ["unstable", 2], ["urbane", 1.5]] },
          { to: "relief", w: 0.6, mods: [["ruler:just", 2]] },
        ] },
      bread_riots: { h: "Bread riots in {capital}", b: "A baker's shop was stormed at dawn; by noon the whole market district was aflame. The mob marches on the granaries with torches.", wait: [1, 3], fx: { unrest: 25, stability: -8 },
        next: [
          { to: "riots_crushed", w: 1, mods: [["harsh_law", 2], ["ruler:cruel", 2], ["standing_army", 1.5]] },
          { to: "hunger_revolution", w: 0.6, mods: [["unstable", 3], ["poor", 1.5], ["egalitarian", 1.5]] },
          { to: "famine_fever", w: 0.5, mods: [["chance:low", 2]] },
        ] },
      weathered: { h: "{realm} weathers the lean year", b: "The grain lasted, barely. When the new harvest came in, the people of {realm} remembered who had fed them.", fx: { stability: 6, prestige: 4 }, end: true },
      riots_crushed: { h: "Soldiers clear the bread queues with steel", b: "The rioting in {capital} ended at spear point. Order has returned, and so has hunger; few will forget either.", fx: { pop: 0.95, stability: -3, prestige: -4 }, end: true },
      hunger_revolution: { h: "Hunger topples the government of {realm}", b: "The soldiers would not fire on their own starving families. The mob took the palace, and a council of bakers and porters now rules.", fx: { revolution: true }, end: true },
      famine_fever: { h: "Famine fever follows the hunger", b: "Weakened by months of want, the poor of {capital} have begun to die of a spotted fever. It is spreading through the realm.", fx: { plague: true, pop: 0.9 }, end: true },
    },
  },
  {
    id: "great_working", n: "The Great Working", scale: "realm", anchor: "realm", req: [{ any: ["magic:high", "arcane", "arcane_council", "gov:magocracy", "near:ley", "near:node"] }, "!premise:bound_nine", "!premise:hungerfruit"], w: 1.2,
    stages: {
      start: { h: "The {users} of {capital} begin a great working", b: "{person}, the foremost {user} of {capital}, has gathered forty apprentices to draw raw power from {node} beneath the city. The air tastes of copper.", wait: [3, 6],
        next: [{ to: "working_hums", w: 1 }] },
      working_hums: { h: "The great working hums beneath {capital}", b: "Candles burn blue across {capital} and dogs will not stop howling. {person} says the working is halfway done.", wait: [3, 8], fx: { science: { arcana: 0.5 } },
        next: [
          { to: "success", w: 1, mods: [["learned", 2], ["scholarly", 1.5], ["magic:high", 1.3]] },
          { to: "backlash", w: 1, mods: [["chance:low", 2], ["unstable", 1.5], ["near:rift", 2]] },
          { to: "denounced", w: 0.7, mods: [["zealous", 2], ["faith:one_god", 1.5]] },
        ] },
      denounced: { h: "{person2} denounces the working", b: "A rival {user}, {person2}, has warned the court that the working will crack the city's foundations. Apprentices are beginning to desert.", wait: [2, 4],
        next: [
          { to: "success", w: 1, mods: [["ruler:brilliant", 2]] },
          { to: "sabotage", w: 1, mods: [["ruler:paranoid", 1.5]] },
          { to: "backlash", w: 0.6 },
        ] },
      success: { h: "The great working succeeds", b: "At midnight, light ran through {node} like water in a ditch. {capital} now glows faintly at night, and its fields give two harvests a year.", fx: { discovery: "arcana", prestige: 10, growth: 0.002 }, end: true },
      backlash: { h: "A backlash of {power} levels a quarter of {capital}", b: "The working slipped. A wave of raw power tore through {capital}, turning stone to glass and people to ash. {person} was at its heart.", fx: { pop: 0.8, stability: -10, unrest: 20 }, end: true },
      sabotage: { h: "{person2} sabotages the working", b: "Chalk lines were scuffed, a candle snuffed, and the working collapsed harmlessly. {person} has vanished, and {person2} holds the academy.", fx: { science: { arcana: 0.3 }, prestige: -5 }, end: true },
    },
  },
  {
    id: "hero_tyrant", n: "The Captain {person}", scale: "realm", anchor: "war", w: 1,
    stages: {
      start: { h: "{person} wins glory in {war}", b: "A captain of low birth, {person} broke the enemy line when the generals of {realm} had given up. The soldiers chant the name at every fire.", wait: [2, 6], fx: { prestige: 4 },
        next: [
          { to: "raised_high", w: 1, mods: [["ruler:generous", 2], ["ruler:just", 1.5], ["stable", 1.5], ["winning", 1.5]] },
          { to: "slighted", w: 1, mods: [["ruler:paranoid", 2.5], ["ruler:greedy", 1.5], ["hierarchical", 2], ["losing", 1.5]] },
        ] },
      raised_high: { h: "{ruler} raises {person} to high command", b: "The low-born captain now commands the armies of {realm}. Old generals seethe; the soldiers would follow {person} into the sea.", wait: [4, 10],
        next: [
          { to: "honourable_peace", w: 1, mods: [["stable", 2], ["ruler:charismatic", 1.5]] },
          { to: "marches_on_capital", w: 0.7, mods: [["unstable", 2], ["ruler:lazy", 2], ["ruler:young", 1.5], ["autocracy", 1.3], ["republic", 1.5]] },
        ] },
      slighted: { h: "{person} passed over for command", b: "A noble fool was given the army instead. {person} was thanked, paid, and dismissed; the soldiers took it as an insult to them all.", wait: [2, 6], fx: { unrest: 8 },
        next: [
          { to: "marches_on_capital", w: 1, mods: [["losing", 2], ["unstable", 1.5]] },
          { to: "retires", w: 1, mods: [["stable", 1.5]] },
        ] },
      marches_on_capital: { h: "{person} marches on {capital}", b: "Declaring that {realm} is betrayed by its own court, {person} has turned the army around. The road to {capital} is open.", wait: [1, 3], fx: { stability: -8 },
        next: [
          { to: "protector", w: 1, mods: [["martial", 1.5], ["unstable", 2], ["gov:stratocracy", 2]] },
          { to: "coup_fails", w: 1, mods: [["stable", 2], ["ruler:brave", 1.5]] },
        ] },
      honourable_peace: { h: "{person} forces an honourable peace", b: "After a string of victories, {person} persuaded both courts to end {war}. The captain returns to {capital} a hero, and a loyal one.", fx: { peace: true, prestige: 6, stability: 5 }, end: true },
      protector: { h: "{person} rules as Protector of {realm}", b: "The court fled or knelt. The captain wears no crown, only a plain soldier's coat, but no law is passed in {realm} without that nod.", fx: { revolution: true }, end: true },
      coup_fails: { h: "The captain's coup collapses", b: "The regiments would not fire on the gates of {capital}. {person} was taken in the night and the army is being purged.", fx: { stability: -6, unrest: 12, prestige: -2 }, end: true },
      retires: { h: "{person} retires to the plough", b: "Refusing all offers from plotters, the captain has gone home to farm. Songs of {person} are sung in every tavern of {realm}.", fx: { stability: 2 }, end: true },
    },
  },
  {
    id: "traitor_general", n: "The Marshal's Letters", scale: "realm", anchor: "war", w: 1,
    stages: {
      start: { h: "Treasonous letters found in the marshal's tent", b: "A courier was taken carrying letters sealed with the ring of {person}, marshal of {realm}. The ink speaks of enemy gold and open gates.", wait: [1, 3],
        next: [
          { to: "marshal_arrested", w: 1, mods: [["ruler:paranoid", 2.5], ["ruler:just", 1.5], ["stable", 1.5]] },
          { to: "letters_ignored", w: 1, mods: [["ruler:lazy", 2], ["ruler:content", 1.5]] },
        ] },
      marshal_arrested: { h: "Marshal {person} in chains", b: "The marshal was taken before the whole army and sent to {capital} for trial. The soldiers are uneasy, and the enemy is watching.", wait: [2, 4], fx: { stability: -3 },
        next: [
          { to: "marshal_hanged", w: 1, mods: [["ruler:just", 1.5], ["chance:high", 1.2]] },
          { to: "forgery", w: 1, mods: [["spy_network", 2], ["ruler:cunning", 2]] },
          { to: "army_mutiny", w: 0.7, mods: [["losing", 2.5], ["martial", 1.5], ["unstable", 1.5]] },
        ] },
      letters_ignored: { h: "{ruler} dismisses the letters as forgeries", b: "Nonsense, says {ruler}, and {person} keeps the command. The officer who found the letters, {person2}, has been sent to a distant fort.", wait: [2, 6],
        next: [
          { to: "betrayal", w: 1, mods: [["losing", 2], ["chance:high", 1.3]] },
          { to: "vindicated", w: 0.8 },
        ] },
      betrayal: { h: "{person} opens the gates to the enemy", b: "The letters were true. At a signal the marshal's own regiments stood aside, and the enemy of {war} poured through into {realm}.", wait: [1, 3], fx: { stability: -12, prestige: -8, unrest: 15 },
        next: [
          { to: "forced_peace", w: 1, mods: [["losing", 2.5], ["poor", 1.5]] },
          { to: "last_stand", w: 1, mods: [["martial", 2], ["ruler:brave", 2]] },
        ] },
      marshal_hanged: { h: "{person} hanged for treason", b: "The marshal confessed on the scaffold. {ruler} has given the army to younger hands and ordered prayers of thanks.", fx: { stability: 4, prestige: 2 }, end: true },
      forgery: { h: "The letters were forged; the marshal freed", b: "{person2}, a jealous rival, confessed to forging the letters with enemy help. {person} returns to the army, grim and loyal.", fx: { stability: 3, prestige: 3 }, end: true },
      army_mutiny: { h: "The army mutinies to free its marshal", b: "Soldiers who loved {person} broke open the prison wagon and turned on their officers. {realm} now faces its own army as well as the enemy.", fx: { revolt: true, stability: -10 }, end: true },
      vindicated: { h: "{person} wins a battle and silences the rumours", b: "The marshal answered the whispers with a great victory in {war}. Whoever forged those letters has not been found.", fx: { prestige: 5 }, end: true },
      forced_peace: { h: "{realm} sues for peace after the betrayal", b: "With the army broken, {ruler} had no choice but to seek terms. The peace is humiliating, and {person} lives in comfort abroad.", fx: { peace: true, prestige: -6 }, end: true },
      last_stand: { h: "Loyal levies avenge the betrayal", b: "The levies of {realm} rallied under {person2} and threw the invaders back. The traitor's name is cursed in every village.", fx: { prestige: 5, stability: 4 }, end: true },
    },
  },
  {
    id: "border_marriage", n: "A Marriage to End {war}", scale: "realm", anchor: "war", req: "monarchy", w: 1,
    stages: {
      start: { h: "Envoys propose a marriage to end {war}", b: "Heralds under a white flag came to {capital} with an offer: {person}, of the royal house, to wed a scion of the enemy, and the war to end at the altar.", wait: [2, 5],
        next: [
          { to: "betrothal", w: 1, mods: [["losing", 2.5], ["ruler:peaceful", 2], ["dynastic", 3], ["unstable", 1.3]] },
          { to: "spurned", w: 1, mods: [["winning", 2.5], ["ruler:warlike", 2], ["ruler:ambitious", 1.5], ["zealous", 1.5]] },
        ] },
      betrothal: { h: "Betrothal of {person} proclaimed", b: "The betrothal was read out in {capital} and in the enemy camp alike. A truce holds while the dowry is argued over.", wait: [2, 6], fx: { stability: 3 },
        next: [
          { to: "wedding", w: 1.5 },
          { to: "poisoned_feast", w: 0.4, mods: [["chance:low", 2], ["spy_network", 1.5]] },
          { to: "bride_flees", w: 0.5 },
        ] },
      bride_flees: { h: "{person} flees the betrothal", b: "The night before the wedding, {person} climbed out of a window and was gone. The enemy envoys call it a deliberate insult.", wait: [1, 3], fx: { prestige: -3 },
        next: [{ to: "war_goes_on", w: 1 }] },
      spurned: { h: "{ruler} spurns the marriage offer", b: "{ruler} tore the offer in two before the envoys. No child of {realm} will be bartered while the war can still be won.", wait: [1, 3], fx: { prestige: 2 },
        next: [{ to: "war_goes_on", w: 1 }] },
      wedding: { h: "Wedding bells end {war}", b: "{person} was married in a tent on the border before both armies. The soldiers of {realm} drank to the couple and marched home.", fx: { peace: true, stability: 8, prestige: 4 }, end: true },
      poisoned_feast: { h: "Poison at the wedding feast", b: "The groom collapsed at the high table and did not rise. Each side accuses the other, and {war} resumes with new hatred.", fx: { stability: -10, unrest: 15, prestige: -6 }, end: true },
      war_goes_on: { h: "The war goes on, bitterer than before", b: "With the marriage gone, so is any hope of an early peace. Recruiters walk the villages of {realm} once again.", fx: { stability: -4, unrest: 8 }, end: true },
    },
  },
  {
    id: "guild_revolt", n: "The Silent Workshops", scale: "realm", anchor: "realm", req: { any: ["guilds", "artisans", "urbane", "has:city"] }, w: 1,
    stages: {
      start: { h: "Guilds of {capital} refuse the new levy", b: "{person}, master of the weavers' hall, has called the guilds of {capital} to refuse the new tax on {good}. Workshops across the city stand silent.", wait: [1, 4], fx: { treasury: -30 },
        next: [
          { to: "negotiation", w: 1, mods: [["ruler:just", 2], ["republic", 2], ["gov:merchant", 2], ["ruler:reformer", 1.5]] },
          { to: "lockout", w: 1, mods: [["ruler:greedy", 2], ["autocracy", 1.5], ["harsh_law", 2], ["hierarchical", 1.5]] },
        ] },
      negotiation: { h: "Guildmasters and court meet at the table", b: "In a hall that smells of dye and wax, {person} and the ministers of {ruler} argue over every clause. The city holds its breath.", wait: [2, 5],
        next: [
          { to: "charter", w: 1.5 },
          { to: "lockout", w: 0.5, mods: [["ruler:cruel", 2]] },
        ] },
      lockout: { h: "Soldiers seal the guild halls of {capital}", b: "By order of {ruler}, the guild halls are chained shut and their treasuries seized. Journeymen gather on street corners with nothing to do.", wait: [1, 4], fx: { unrest: 20 },
        next: [
          { to: "uprising", w: 1, mods: [["unstable", 2], ["urbane", 1.5], ["poor", 1.5]] },
          { to: "commune", w: 0.4, mods: [["egalitarian", 3], ["republic", 1.5], ["unstable", 1.5]] },
          { to: "guilds_broken", w: 1, mods: [["standing_army", 1.5], ["stable", 1.5]] },
        ] },
      charter: { h: "A guild charter signed in {capital}", b: "The guilds won a seat on the city council and a lower levy; the crown won their loyalty. The workshops are loud again.", fx: { growth: 0.002, stability: 5, treasury: -40 }, end: true },
      uprising: { h: "Journeymen seize the streets of {capital}", b: "Behind barricades of looms and barrels, the craftsmen of {capital} defy the crown. {person} speaks from the steps of the weavers' hall.", fx: { revolt: true }, end: true },
      commune: { h: "The guilds proclaim a free commune", b: "The old government has fled {capital}. The guilds rule now, by assembly and show of hands, with {person} as first among equals.", fx: { revolution: true }, end: true },
      guilds_broken: { h: "The guilds bow to the crown", b: "Hungry and leaderless, the guilds of {capital} paid the levy and more. {person} is in prison, and many masters have left the realm.", fx: { treasury: 60, stability: -3, growth: -0.002 }, end: true },
    },
  },
  {
    id: "relic_stolen", n: "The Stolen Relic", scale: "realm", anchor: "realm", req: "has:rival", w: 1,
    stages: {
      start: { h: "The holy relic of {faith} is stolen", b: "The reliquary in {capital} was found empty at dawn prayers. A priest named {person} swears to have seen riders from {rival} on the road.", wait: [1, 3], fx: { stability: -6, unrest: 10 },
        next: [
          { to: "demand_return", w: 1, mods: [["zealous", 2.5], ["militant", 2], ["ruler:warlike", 1.5]] },
          { to: "investigation", w: 1, mods: [["spy_network", 2.5], ["ruler:just", 1.5], ["ruler:cunning", 1.5]] },
        ] },
      demand_return: { h: "{short} demands that {rival} return the relic", b: "Envoys of {realm} have told {rival} to give back what was stolen. {rival} denies everything, and laughs.", wait: [1, 4], fx: { relation: { rival: -20 } },
        next: [
          { to: "relic_war", w: 1, mods: [["militant", 2], ["zealous", 2], ["martial", 1.5]] },
          { to: "relic_returned", w: 0.8, mods: [["chance:high", 1.3], ["prestigious", 1.5]] },
        ] },
      investigation: { h: "The trail of the relic leads back into {capital}", b: "Searchers under {person2} found hoofprints that turn back toward the city, and a pawnbroker who asks far too many questions.", wait: [2, 5],
        next: [
          { to: "inside_job", w: 1 },
          { to: "relic_lost", w: 0.7 },
          { to: "relic_war", w: 0.4, mods: [["ruler:warlike", 2]] },
        ] },
      relic_war: { h: "Holy war declared to reclaim the relic", b: "The priests of {faith} have blessed the banners. The host of {realm} marches on {rival} to bring the relic home.", fx: { war: "rival", relation: { rival: -20 } }, end: true },
      relic_returned: { h: "{rival} returns the relic under protest", b: "A plain cart crossed the border with the reliquary and no letter. {realm} celebrates, and {rival} insists it merely found it.", fx: { prestige: 6, stability: 5 }, end: true },
      inside_job: { h: "{person} unmasked as the thief", b: "The priest who cried loudest had sold the relic to pay off debts. It has been recovered from a cellar and restored to its altar.", fx: { stability: 4, prestige: 2 }, end: true },
      relic_lost: { h: "The relic is never found", b: "The altar in {capital} stands empty. Doubters whisper that {deity} has withdrawn, and a new preacher has begun to say so aloud.", fx: { stability: -5, prestige: -5, spawn: "prophet_heresy" }, end: true },
    },
  },
  {
    id: "lost_expedition", n: "The Voyage of {person}", scale: "realm", anchor: "coast", req: { any: ["!slot:world-edge", "compat:open_sea"] }, w: 1,
    stages: {
      start: { h: "Ships sail west from {place}", b: "{person}, a navigator with a stolen chart, has sailed from {place} with three ships and the blessing of {ruler}, seeking land beyond the maps.", wait: [3, 6], fx: { treasury: -60 },
        next: [{ to: "silence", w: 1 }] },
      silence: { h: "No word from the fleet of {person}", b: "A year has passed without a sail. Wives of the crew keep watch on the harbour wall at {place}, and the priests of {faith} stop saying their names.", wait: [6, 14],
        next: [
          { to: "fleet_returns", w: 1, mods: [["seafaring", 2], ["navy", 1.5], ["learned", 1.3]] },
          { to: "lost_at_sea", w: 1, mods: [["backward", 1.5]] },
          { to: "ghost_ship", w: 0.6 },
        ] },
      fleet_returns: { h: "The fleet of {person} returns laden", b: "Two ships of three came home to {place}, holds full of strange spices and stranger stories. {person} speaks of a green coast across the sea.", wait: [2, 6], fx: { prestige: 6 },
        next: [
          { to: "colony", w: 1, mods: [["seafaring", 2], ["mercantile", 1.5], ["big", 1.3]] },
          { to: "trade_route", w: 1, mods: [["mercantile", 2], ["gov:merchant", 2]] },
        ] },
      ghost_ship: { h: "A lone ship drifts into {place}", b: "The flagship came home without its sisters, its crew gaunt and raving of fevers and sea-fog. {person} was not aboard.", wait: [1, 3],
        next: [
          { to: "fever_ashore", w: 1, mods: [["chance:high", 1.3]] },
          { to: "survivor_charts", w: 1, mods: [["learned", 2]] },
        ] },
      colony: { h: "A colony planted beyond the sea", b: "{person} has sailed again, this time with settlers, seed and cattle. A new town of {people} now stands on a far shore.", fx: { found_town: true, growth: 0.002, prestige: 6 }, end: true },
      trade_route: { h: "A new trade route enriches {place}", b: "Merchants of {place} now sail the route {person} charted, returning with cargoes no rival can match.", fx: { treasury: 150, pop: 1.1, discovery: "navigation" }, end: true },
      lost_at_sea: { h: "The fleet of {person} given up for lost", b: "The priests have sung the drowning rites for the crews. The stolen chart, people say, was cursed from the start.", fx: { prestige: -4, stability: -2 }, end: true },
      fever_ashore: { h: "Survivors bring a fever ashore at {place}", b: "The crew of the ghost ship carried more than stories. A burning fever runs through the docks of {place} and beyond.", fx: { plague: true }, end: true },
      survivor_charts: { h: "The survivors' charts copied in secret", b: "The ship's mate kept the logs. Cartographers of {realm} are copying winds and currents no one else in the world has seen.", fx: { science: { navigation: 1 } }, end: true },
    },
  },

  /* =============================== LOCAL =============================== */
  {
    id: "beast_hunt", n: "The Hunt for the {beast}", scale: "local", anchor: "town", req: "near:beasts", w: 1.2,
    stages: {
      start: { h: "A great {beast} preys on {place}", b: "Herds vanish and a shepherd's hut near {place} was found flattened. A {beast} has come down from the wilds, and {ruler} offers gold for its head.", wait: [1, 4], fx: { unrest: 10 },
        next: [{ to: "the_hunt", w: 1 }] },
      the_hunt: { h: "{person} leads the hunt for the {beast}", b: "Hunters, glory-seekers and a few fools follow {person} into the hills above {place}, with spears, nets and a cart of bait.", wait: [2, 5],
        next: [
          { to: "slain", w: 1, mods: [["martial", 1.5], ["ruler:brave", 1.3]] },
          { to: "tamed", w: 0.5, mods: [["beast_tamers", 5], ["beast_cavalry", 2]] },
          { to: "hunters_lost", w: 0.8, mods: [["chance:low", 2], ["small", 1.3]] },
        ] },
      hunters_lost: { h: "The hunters of {place} do not return", b: "A week overdue, then two. Only a torn banner came back down the mountain. The {beast} still hunts, and {place} bars its doors at dusk.", wait: [2, 5], fx: { pop: 0.93, unrest: 15 },
        next: [
          { to: "second_hunt", w: 1, mods: [["martial", 1.5]] },
          { to: "town_flees", w: 0.5, mods: [["small", 2], ["poor", 1.5]] },
        ] },
      slain: { h: "The {beast} slain; {person} hailed a hero", b: "After a fight in a ravine, {person} drove a spear home. The {beast}'s skull now hangs above the gate of {place}.", fx: { prestige: 5, stability: 4, monument: { tier: 1, name: "The Skull Gate of {place}" } }, end: true },
      tamed: { h: "{person} rides the {beast} into {place}", b: "Instead of killing it, {person} fed it, sang to it and at last rode it. The town is terrified and immensely proud.", fx: { prestige: 8, stability: 3 }, end: true },
      second_hunt: { h: "{person2} finally brings down the {beast}", b: "Leading a second, larger hunt, {person2} cornered the {beast} in its den. The dead of the first hunt are buried with honours.", fx: { prestige: 3, unrest: -5 }, end: true },
      town_flees: { h: "{place} abandoned to the {beast}", b: "The last families of {place} left in a single long column. The {beast} sleeps now in the market square.", fx: { abandon_town: true, stability: -5 }, end: true },
    },
  },
  {
    id: "sleepwalkers", n: "The Sleepwalkers of {place}", scale: "local", anchor: "town", w: 0.8,
    stages: {
      start: { h: "Sleepers walk the streets of {place}", b: "Folk in {place} have begun rising in their sleep and walking, eyes open, toward the hills. They wake at dawn remembering nothing.", wait: [1, 4], fx: { unrest: 8 },
        next: [
          { to: "spreads", w: 1, mods: [["near:mystery", 1.5], ["magic:high", 1.5]] },
          { to: "healer_studies", w: 1, mods: [["learned", 2], ["scholarly", 1.5]] },
        ] },
      spreads: { h: "The walking sleep spreads", b: "A hundred walk each night now, always toward the same hills. Families tie their sleepers to the bedposts, and the ropes are found gnawed.", wait: [2, 5], fx: { pop: 0.96 },
        next: [
          { to: "vanish", w: 1, mods: [["near:ruins", 2], ["near:mystery", 1.5], ["seers", 1.5]] },
          { to: "burnings", w: 1, mods: [["zealous", 2], ["harsh_law", 1.5], ["unstable", 1.5]] },
          { to: "cured", w: 0.5 },
        ] },
      healer_studies: { h: "{person} studies the sleepwalkers", b: "{person}, a physician of {place}, sits up each night with the sleepers, noting what they ate, where they walk and what they murmur.", wait: [2, 6],
        next: [
          { to: "cured", w: 1.5, mods: [["learned", 1.5]] },
          { to: "spreads", w: 0.6 },
        ] },
      cured: { h: "{person} cures the walking sleep", b: "Bad rye, not a curse: the grain of one miller carried a mould. The sacks were burned, and {place} sleeps soundly at last.", fx: { science: { medicine: 0.6 }, stability: 3 }, end: true },
      vanish: { h: "The sleepers vanish into the hills", b: "One night the sleepers of {place} walked out and did not come back. Searchers found only footprints ending at a ring of old stones.", fx: { pop: 0.85, stability: -5, unrest: 10 }, end: true },
      burnings: { h: "Frightened neighbours burn the sleepers' houses", b: "Convinced the walkers were possessed, a mob set fire to their homes. The walking stopped; so did much else in {place}.", fx: { unrest: 20, pop: 0.9 }, end: true },
    },
  },
  {
    id: "harbour_terror", n: "The Terror of {place} Harbour", scale: "local", anchor: "coast", w: 1,
    stages: {
      start: { h: "A sea beast sinks boats off {place}", b: "Three fishing boats went down off {place} in a single week, dragged under by something with a grey back as long as a street.", wait: [1, 3], fx: { unrest: 10 },
        next: [
          { to: "harbour_closed", w: 1 },
          { to: "offerings", w: 1, mods: [["faith:sea", 4], ["pious", 1.5], ["sacrifice", 3]] },
        ] },
      harbour_closed: { h: "The fleet of {place} stays in port", b: "No crew will put to sea. Nets rot on the quay, fish prices soar, and the merchants of {place} count their losses.", wait: [2, 5], fx: { treasury: -30, pop: 0.96 },
        next: [
          { to: "harpoon_fleet", w: 1, mods: [["seafaring", 2], ["navy", 2], ["rich", 1.3]] },
          { to: "beast_leaves", w: 1 },
        ] },
      offerings: { h: "Offerings cast into the sea at {place}", b: "Led by {person}, a priestess of the tides, the townsfolk cast bread, wine and a white bull into the harbour mouth.", wait: [2, 5],
        next: [
          { to: "appeased", w: 1, mods: [["faith:sea", 2]] },
          { to: "harbour_closed", w: 1 },
        ] },
      harpoon_fleet: { h: "Harpoon ships sail from {place}", b: "{person2}, an old whaler, has fitted six ships with harpoons and chains. Half the town watches them go from the harbour wall.", wait: [1, 3],
        next: [
          { to: "beast_slain", w: 1, mods: [["seafaring", 1.5], ["navy", 1.5]] },
          { to: "ships_lost", w: 0.8 },
        ] },
      beast_slain: { h: "Sea beast slain; its bones line the quay", b: "After a day-long fight, the beast was dragged ashore dead. Its ribs now arch over the harbour gate of {place}.", fx: { prestige: 6, monument: { tier: 1, name: "The Bone Arch of {place}" } }, end: true },
      ships_lost: { h: "The beast drags the harpoon fleet down", b: "Only one boat came back, splintered and silent. {place} mourns its best sailors, and the beast still circles.", fx: { pop: 0.9, prestige: -4, unrest: 10 }, end: true },
      beast_leaves: { h: "The sea beast moves on from {place}", b: "One morning the grey back was simply gone. The boats creep out again, and the fishermen of {place} never sail alone.", fx: { stability: 2 }, end: true },
      appeased: { h: "The sea goes calm off {place}", b: "Since the offerings the waters have been still and the catch rich. The priestess {person} is now the most honoured figure in {place}.", fx: { stability: 5, pop: 1.05 }, end: true },
    },
  },
  {
    id: "haunted_fort", n: "The Drummer of {place}", scale: "local", anchor: "frontier", w: 1,
    stages: {
      start: { h: "The garrison flees the old fort at {place}", b: "Soldiers of the border fort near {place} deserted in the night, raving of cold hands and a drummer beating on the empty walls.", wait: [1, 4], fx: { unrest: 8 },
        next: [
          { to: "exorcism", w: 1, mods: [["pious", 2], ["faith:ancestors", 2], ["ancestor_bound", 2]] },
          { to: "night_watch", w: 1, mods: [["scholarly", 1.5], ["ruler:scholar", 2], ["learned", 1.3]] },
          { to: "rival_ruse", w: 0.7, req: "has:rival", mods: [["spy_network", 1.5]] },
        ] },
      exorcism: { h: "Priests of {faith} march on the haunted fort", b: "With bells, salt and the bones of a saint, the priests of {faith} entered the fort at {place} to lay the drummer to rest.", wait: [2, 5],
        next: [
          { to: "laid_to_rest", w: 1, mods: [["pious", 1.5]] },
          { to: "priests_flee", w: 0.7 },
        ] },
      night_watch: { h: "{person} spends a night on the walls", b: "{person}, a sceptical captain, took a lamp and a crossbow up to the haunted walls at {place}. The drum began at midnight.", wait: [1, 3],
        next: [
          { to: "smugglers", w: 1 },
          { to: "exorcism", w: 0.8 },
        ] },
      rival_ruse: { h: "Agents of {rival} found in the fort's cellars", b: "The drummer was a man with a drum. {person} caught the drummer in the cellars at {place}, carrying the seal of {rival}.", wait: [1, 3],
        next: [
          { to: "border_war", w: 1, mods: [["martial", 2], ["ruler:warlike", 2]] },
          { to: "ruse_exposed", w: 1 },
        ] },
      laid_to_rest: { h: "The drummer of {place} laid to rest", b: "Under the fort's floor the priests found an old soldier's bones and gave them burial. The drum has not sounded since.", fx: { stability: 5, prestige: 2 }, end: true },
      priests_flee: { h: "The priests flee the fort too", b: "The drum beat louder than the bells. The priests ran, and the fort at {place} stands empty; the border lies unwatched.", fx: { unrest: 12, prestige: -3 }, end: true },
      smugglers: { h: "The ghost of {place} was smugglers all along", b: "Behind the drumming, {person} found a tunnel, a cellar of contraband and three terrified smugglers. The fort is manned again.", fx: { treasury: 40, stability: 3 }, end: true },
      border_war: { h: "{short} marches on {rival} over the haunting", b: "Outraged by the ruse, {ruler} has sent the army across the border near {place}. Frightening soldiers, it seems, is an act of war.", fx: { war: "rival", relation: { rival: -25 } }, end: true },
      ruse_exposed: { h: "The ruse of {rival} exposed", b: "The captured drummer was paraded through {place} and sent home with his drum. The whole border is laughing at {rival}.", fx: { prestige: 3, relation: { rival: -15 } }, end: true },
    },
  },
  {
    id: "bandit_queen", n: "The Bandit Queen of {place}", scale: "local", anchor: "frontier", w: 1.1,
    stages: {
      start: { h: "Bandits rule the roads near {place}", b: "{person}, a deserter with a crooked grin, leads three hundred outlaws in the hills above {place}. Caravans pay {person}'s toll or are burned.", wait: [2, 5], fx: { treasury: -20, unrest: 10 },
        next: [
          { to: "bandits_grow", w: 1, mods: [["poor", 1.5], ["unstable", 1.5], ["atwar", 2]] },
          { to: "sweep", w: 1, mods: [["martial", 1.5], ["stable", 1.5], ["frontier_forts", 2], ["standing_army", 1.5]] },
        ] },
      bandits_grow: { h: "The bandit queen takes a crown", b: "In a hall of stolen tapestries, {person} put on a crown of horseshoe nails. Peasants near {place} now pay their taxes to the outlaws instead of the crown.", wait: [4, 10], fx: { unrest: 15 },
        next: [
          { to: "bandit_realm", w: 1, mods: [["unstable", 2], ["atwar", 1.5]] },
          { to: "pardoned", w: 1, mods: [["ruler:cunning", 2], ["ruler:generous", 1.5], ["mercenaries", 2]] },
          { to: "rival_hires", w: 0.6, req: "has:rival" },
        ] },
      sweep: { h: "Soldiers sweep the hills above {place}", b: "Columns of soldiers are burning the outlaw camps one by one. {person} has fallen back to a hill fort with the toughest of the outlaws.", wait: [2, 5], fx: { treasury: -40 },
        next: [
          { to: "queen_hanged", w: 1.2 },
          { to: "bandits_grow", w: 0.6 },
        ] },
      bandit_realm: { h: "A bandit kingdom proclaimed at {place}", b: "{person} has taken {place} itself and declared the hills a free realm. Deserters and runaways are flocking to join.", fx: { revolt: true, stability: -8 }, end: true },
      pardoned: { h: "{person} pardoned and made warden of the march", b: "{ruler} offered the bandit queen a title and a salary to guard the roads the outlaws used to rob. The bandit queen accepted, and the roads are safe.", fx: { stability: 4, prestige: 2, unrest: -10 }, end: true },
      rival_hires: { h: "{rival} hires the bandit queen", b: "Gold from {rival} now pays {person}'s outlaws, who raid deep into {realm}. The border around {place} is burning.", fx: { relation: { rival: -20 }, unrest: 10 }, end: true },
      queen_hanged: { h: "The bandit queen hangs at {place}", b: "{person} was taken alive when the hill fort fell and was hanged in the market of {place}. The roads are open again.", fx: { stability: 5, prestige: 3, unrest: -10 }, end: true },
    },
  },
  {
    id: "whispering_grove", n: "The Voice in the {site}", scale: "local", anchor: "site", site: ["Whispering Grove", "Singing Caves", "Standing Stones"], w: 1.2,
    stages: {
      start: { h: "The {site} begins to speak", b: "Woodcutters near {place} swear the {site} whispered their names. {person}, a charcoal-burner's widow, now sits there all day, listening.", wait: [2, 5],
        next: [
          { to: "oracle", w: 1, mods: [["seers", 2.5], ["faith:spirits", 3], ["forest_folk", 2], ["mystic", 2]] },
          { to: "axes", w: 1, mods: [["ruler:greedy", 1.5], ["zealous", 2], ["faith:one_god", 1.5], ["poor", 1.3]] },
        ] },
      oracle: { h: "The oracle of the {site} foretells the harvest", b: "{person} passes on what the {site} says: when to sow, which wells will fail, which calf will sicken. So far every answer has been right.", wait: [3, 8], fx: { stability: 3 },
        next: [
          { to: "wise_counsel", w: 1.5 },
          { to: "listeners_mad", w: 0.5, mods: [["chance:low", 2]] },
        ] },
      axes: { h: "Loggers ordered into the {site}", b: "Calling the whispers a pagan snare, the lords of {place} have sent loggers and quarrymen into the {site}. {person} stands in their way.", wait: [1, 4], fx: { unrest: 6 },
        next: [
          { to: "grove_revenge", w: 1, mods: [["magic:high", 2], ["near:node", 1.5]] },
          { to: "silenced", w: 1 },
        ] },
      wise_counsel: { h: "The counsel of the {site} enriches {place}", b: "Farmers from three valleys now ask the {site} before they plant. The harvests around {place} have never been better.", fx: { growth: 0.003, prestige: 4, science: { agriculture: 0.6 } }, end: true },
      listeners_mad: { h: "Listeners at the {site} go mad", b: "Those who sit longest at the {site} have started talking back to it, and now say nothing else. {person} was the first.", fx: { pop: 0.95, unrest: 12 }, end: true },
      grove_revenge: { h: "The {site} swallows the workmen", b: "The workmen went in at dawn and did not come out. Their tools were found at the edge, rusted as if left for a century.", fx: { pop: 0.93, unrest: 15, stability: -4 }, end: true },
      silenced: { h: "The {site} falls silent under the axe", b: "Timber and stone were hauled to market, and {person} wept. The voice near {place} has stopped.", fx: { treasury: 60, prestige: -3, growth: -0.002 }, end: true },
    },
  },
  {
    id: "sealed_vault", n: "The Vault Beneath the {site}", scale: "local", anchor: "site", site: ["Ancient Ruins", "Petrified Titan", "Glass Desert"], w: 1.2,
    stages: {
      start: { h: "A sealed vault opened in the {site}", b: "Diggers near {place} broke into a vault in the {site} untouched for thousands of years. {person}, a scholar, went down first.", wait: [2, 5],
        next: [
          { to: "study", w: 1, mods: [["scholarly", 2], ["learned", 1.5], ["origin:ruin_heirs", 3]] },
          { to: "plunder", w: 1, mods: [["poor", 1.5], ["mercantile", 1.5], ["ruler:greedy", 2]] },
        ] },
      study: { h: "{person} deciphers the vault's inscriptions", b: "Months of lamplight and chalk have yielded a grammar. {person} reads of builders, of wars, and of a crown kept in the deepest room.", wait: [4, 10], fx: { science: { writing: 0.5 } },
        next: [
          { to: "old_secrets", w: 1 },
          { to: "crown_claimed", w: 0.8, req: "monarchy", mods: [["ruler:ambitious", 2.5]] },
        ] },
      crown_claimed: { h: "{ruler} claims the crown of the ancients", b: "The ancient crown was carried from the {site} to {capital} and set on {ruler}'s head before the court. It fitted perfectly.", wait: [3, 8], fx: { prestige: 10 },
        next: [
          { to: "crown_blesses", w: 1, mods: [["stable", 1.5]] },
          { to: "crown_curse", w: 1, mods: [["chance:low", 2], ["seers", 1.5]] },
        ] },
      plunder: { h: "Treasure hunters strip the {site}", b: "Gold, jewels and carved stone are being carted out of the vault by the wagonload. {person} protests, and nobody listens.", wait: [2, 5], fx: { treasury: 80 },
        next: [
          { to: "wards_wake", w: 1, mods: [["magic:high", 1.5]] },
          { to: "vault_gold", w: 1 },
        ] },
      old_secrets: { h: "Secrets of the ancients restored", b: "From the vault's walls {person} copied the methods of the old builders: domes without centring, mortar that sets under water.", fx: { discovery: "architecture", prestige: 6 }, end: true },
      crown_blesses: { h: "The ancient crown blesses {realm}", b: "Old folk claim the crown's return has brought good seasons and loyal lords. Whatever the cause, {realm} prospers.", fx: { stability: 8, prestige: 5 }, end: true },
      crown_curse: { h: "The crown's curse falls on the court", b: "The ruler who wore the ancient crown wasted away within a season. The crown has been walled up again, and {person} with the key.", fx: { ruler_dies: true, stability: -10 }, end: true },
      wards_wake: { h: "Old wards kill the looters of {place}", b: "The vault's old wards came to life. Looters were found turned to salt, and the entrance near {place} has sealed itself.", fx: { pop: 0.92, unrest: 10 }, end: true },
      vault_gold: { h: "Vault gold fills the coffers of {place}", b: "The vault was emptied without mishap. {place} spends its windfall on walls, wells and a very large feast.", fx: { treasury: 100, pop: 1.1 }, end: true },
    },
  },
  {
    id: "oasis_spring", n: "The Spring of {person}", scale: "local", anchor: "town", req: { any: ["desert", "desert_wanderers", "hot"] }, w: 1.2,
    stages: {
      start: { h: "A new spring rises near {place}", b: "Sweet water burst from the sand a day's ride from {place}. {person}, a caravan master, has fenced it and charges every traveller a coin a cup.", wait: [2, 5],
        next: [
          { to: "gardens_bloom", w: 1 },
          { to: "clan_dispute", w: 1, mods: [["nomadic", 2], ["desert_wanderers", 1.5], ["hierarchical", 1.5]] },
        ] },
      clan_dispute: { h: "Clans fight over the new spring", b: "Three clans claim the spring by right of ancestor, conquest and thirst. Blood has already been spilled on the sand near {place}.", wait: [1, 4], fx: { unrest: 20 },
        next: [
          { to: "gardens_bloom", w: 1, mods: [["ruler:just", 2], ["hospitable", 1.5]] },
          { to: "spring_fails", w: 0.7 },
        ] },
      gardens_bloom: { h: "Palm gardens bloom at the new spring", b: "Date palms and melon beds now ring the spring. Caravans that once passed {place} by now stop to water and trade.", wait: [4, 10], fx: { pop: 1.05, treasury: 30 },
        next: [
          { to: "spring_kingdom", w: 0.7, mods: [["unstable", 2], ["egalitarian", 1.3]] },
          { to: "caravan_town", w: 1.2, mods: [["stable", 1.5], ["ruler:just", 1.5], ["hospitable", 1.5]] },
          { to: "spring_fails", w: 0.5, mods: [["chance:low", 2]] },
        ] },
      spring_kingdom: { h: "{person} proclaims a kingdom of the spring", b: "Rich on water-tolls, {person} has hired swords and declared the oasis free of {realm}. Caravans now pay two masters.", fx: { revolt: true, prestige: -3 }, end: true },
      caravan_town: { h: "A caravan town rises at the oasis", b: "With the blessing of {ruler}, a walled town has been built around the spring. {person} is its first governor.", fx: { found_town: true, growth: 0.002, treasury: 50 }, end: true },
      spring_fails: { h: "The new spring runs dry", b: "As suddenly as it came, the water sank back into the sand. The gardens wither, and the people of {place} blame each other.", fx: { pop: 0.92, unrest: 8 }, end: true },
    },
  },
  {
    id: "citadel_thaw", n: "The Thaw of the {site}", scale: "local", anchor: "site", site: ["Frozen Citadel", "Floating Isles"], w: 1.2,
    stages: {
      start: { h: "The way into the {site} opens", b: "A warm season has melted the ice from the gates of the {site} near {place}, the first time in living memory. Smoke is rising from inside, though nobody lives there.", wait: [2, 5],
        next: [{ to: "expedition", w: 1 }] },
      expedition: { h: "{person} leads an expedition into the {site}", b: "Twenty volunteers with rope, lamps and a priest of {faith} followed {person} through the gates of the {site}.", wait: [2, 6], fx: { treasury: -30 },
        next: [
          { to: "sleeper_wakes", w: 1, mods: [["magic:high", 2], ["near:node", 1.5], ["chance:low", 1.5]] },
          { to: "archives", w: 1, mods: [["learned", 2], ["scholarly", 2]] },
          { to: "expedition_lost", w: 0.6 },
        ] },
      sleeper_wakes: { h: "A sleeper wakes in the {site}", b: "The expedition found a sleeper on a throne of ice, and it opened its eyes. {person} sent back a single runner with the news.", wait: [1, 4],
        next: [
          { to: "killing_frost", w: 1 },
          { to: "ancient_teacher", w: 1, mods: [["arcane", 2], ["scholarly", 1.5]] },
        ] },
      archives: { h: "Libraries carried out of the {site}", b: "Crates of brittle books, star maps and strange instruments are being hauled from the {site} to {place}. Scholars fight over every page.", fx: { science: { astronomy: 0.6 }, discovery: "natural_philosophy" }, end: true },
      expedition_lost: { h: "The expedition of {person} never returns", b: "The gates of the {site} have closed again. Of {person} and the twenty, there is no sign but a lamp hanging at the threshold.", fx: { prestige: -3, unrest: 5 }, end: true },
      killing_frost: { h: "A killing frost spreads from the {site}", b: "Since the sleeper woke, frost comes every night to the fields around {place}, even at midsummer. The crops blacken.", fx: { pop: 0.85, growth: -0.003, stability: -8 }, end: true },
      ancient_teacher: { h: "The ancient sleeper teaches {person}", b: "The sleeper on the ice throne spoke, and {person} took notes. The knowledge carried back to {place} is changing what the {users} of {realm} believe.", fx: { discovery: "arcana", prestige: 6 }, end: true },
    },
  },
  {
    id: "wild_colony", n: "The Settlers of {person}", scale: "local", anchor: "town", w: 1,
    stages: {
      start: { h: "Settlers leave {place} for the wilds", b: "{person} has led two hundred landless families out of {place} to clear new land beyond the last farms of {realm}.", wait: [3, 6], fx: { pop: 0.95 },
        next: [{ to: "first_winter", w: 1 }] },
      first_winter: { h: "The settlers face their first winter", b: "Log huts, a palisade and a single field of rye: that is all the colony of {person} has against the cold months ahead.", wait: [3, 6],
        next: [
          { to: "takes_root", w: 1.2, mods: [["forest_folk", 1.5], ["stable", 1.5]] },
          { to: "camp_empty", w: 0.8, mods: [["cold", 2], ["poor", 1.5], ["chance:low", 1.5]] },
          { to: "beasts_attack", w: 0.8, req: "near:beasts" },
          { to: "declare_free", w: 0.5, mods: [["egalitarian", 2], ["unstable", 1.5]] },
        ] },
      beasts_attack: { h: "Beasts besiege the settlers' stockade", b: "A large beast from the deep wilds has been circling the colony every night. {person} has sent to {place} for spears and help.", wait: [1, 4], fx: { unrest: 10 },
        next: [
          { to: "takes_root", w: 1, mods: [["martial", 1.5], ["beast_tamers", 2]] },
          { to: "camp_empty", w: 1 },
        ] },
      takes_root: { h: "The new settlement takes root", b: "Spring came, the rye came up, and more families followed. The settlement of {person} is now a town in its own right.", fx: { found_town: true, growth: 0.002 }, end: true },
      camp_empty: { h: "The settlers' camp found empty", b: "Traders reached the colony in spring and found cold hearths and open doors. What became of {person} and the settlers, no one knows.", fx: { prestige: -2, stability: -3 }, end: true },
      declare_free: { h: "The settlers declare themselves free", b: "Owing nothing to lords who never helped them, the settlers of {person} have refused the tax collector and called themselves free.", fx: { found_town: true, stability: -5, unrest: 10 }, end: true },
    },
  },
];
