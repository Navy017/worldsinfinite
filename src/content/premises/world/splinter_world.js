// The Splinter World: the world is one shard of a greater whole that broke; at its edges, reality frays into nothing.
export default {
  id: "splinter_world",
  name: "The Splinter World",
  kind: "shape",
  family: "world",
  pitch: "The world is one broken piece of a much larger world that shattered long ago. Other pieces hang in the night sky, and gaps called seams open where they touch ours. At the edges, our land fades into grey nothing.",
  slots: ["world-shape", "world-edge", "cosmology"],
  tone: ["melancholy", "wonder"],
  era: ["stone", "bronze", "medieval", "renaissance", "industrial"],
  scale: "world",
  genres: ["fantasy", "mythic", "grimdark"],
  w: 0.9,
  excludes: [],
  pairs: [{ id: "broken_writ", w: 3 }, { id: "leavings", w: 2 }, { id: "rim", w: 1.2 }],

  truths: [
    { id: "shattered_whole", n: "The world can be mended", d: "The world was once whole, and one great blow broke it apart. Its peoples linked arms across the first fracture and held it for nine days before their hands slipped. The pieces can be joined again, but that would force together peoples and lands that have grown apart for ages, and the one trial so far left families on both sides unable to recognise each other.", tags: ["truth:mendable"],
      known: [
        "Other lands hang in the night sky, and seams open where they touch ours. The crown's library calls the breaking a myth of the seam-peoples. A ring of stones carries patterns farmers take for fields.",
        "Old maps, withdrawn from public view, show the world as one great land with ours a sliver near the middle. Joined together, the patterns on the standing stones make the same map.",
        "The central map stone says the world was held together for nine days and 'can be held again'. {believer}, a Mend-Seeker, joined two lands for a day and lost a sibling's recognition doing it.",
        "Confirmed: the world was whole and was broken, and it can be mended. Mending forces apart lives that grew separately, and the first attempt to hold it cost about four thousand people.",
      ] },
    { id: "holding_shard", n: "Our shard holds a god's piece", d: "What broke was a god, and our shard holds one piece of it, its heart, chained in a mountain vault. People on other shards know this, and they send raiders through each new seam to take it, because whoever gathers the most pieces holds the god. Our crown sealed the vault and calls the stone a lodestone.", tags: ["truth:god_shard"],
      known: [
        "Miners will not work a gallery where lamps flicker and plants grow toward the dark. The crown says the stone there is a large lodestone, sealed to prevent theft, and has withdrawn its guard.",
        "Riders on six-legged beasts keep coming through new seams. A captured rider told {official} that every shard has a piece and that 'whoever holds the most pieces holds the god'.",
        "A carving above the humming vault says 'the heart of the god is here; the others will smell it'. The guards' bones inside all face outward, with a seam-rider's spearhead among them.",
        "Confirmed: the broken world was a god, and its heart lies in our mountains. Other shards are hunting the pieces. The crown has hidden it and sends no one to guard it.",
      ] },
    { id: "frayed_edge", n: "The shard is coming apart", d: "The shard is disintegrating from the edge inward. It lost a cord's length a century three hundred years ago and loses a cord's length a decade now. What the grey takes is also forgotten, so the only proof is the edge-watchers' book of names, and the crown has stopped reading it.", tags: ["truth:fraying"],
      known: [
        "The grey at the world's edge took a mile of farmland this year. The crown says the grey is fixed and has not moved since the founding. Farmers at the brink cannot remember their old neighbours' names.",
        "{survivor} lost a farm to the grey and knows there was a neighbour, but not who. Half a city at the brink stands cut off, and nobody living remembers the half that is gone.",
        "{investigator}'s cord-tally shows the brink moving a cord a century three hundred years ago and a cord a decade now. The city's tax records list 3,100 people that no one remembers.",
        "Confirmed: the shard is coming apart from the edge inward, faster each generation, and the grey erases memory as well as land. At this pace the children of our grandchildren will see the end.",
      ] },
  ],

  tags: ["shard_world"],

  subthemes: [
    { id: "edge_moves", n: "The Edge Moves In", d: "The grey at the world's edge took a mile of farmland this year. The farmers who stayed on that land did not die. They vanished, and their neighbours are already forgetting them.", w: 1.4, req: { any: ["frontier", "realm:small", "realm:tiny"] }, truthLink: "frayed_edge", tags: ["theme:edge_moves"], mark: { kind: "zone", n: "The greying march", color: "#9a9a9a", size: [1, 3], where: "border" } },
    { id: "seam_opens", n: "The Open Seam", d: "A seam, a crossing where another shard touches ours, has opened in the hills. The air on the far side smells of cinnamon and the sun there is green.", w: 1.2, mods: [["near:rift", 3], ["mountain", 1.3]], tags: ["theme:seam_opens"], mark: { kind: "zone", n: "The seam", color: "#6a8a5a", size: [1, 2], where: "remote" } },
    { id: "shard_refugees", n: "The Refugees of a Dying Shard", d: "Strangers with copper skin and three-fingered hands have poured through a seam, fleeing a shard that is ending. They have nowhere to go back to.", w: 1, req: { any: ["frontier", "hospitable", "has:city"] }, truthLink: "frayed_edge", tags: ["theme:shard_refugees"] },
    { id: "god_piece", n: "The God-Piece", d: "Miners found a stone that hums and heals and makes plants turn toward it. The temple claims it; the crown claims it; travellers from a seam are asking about it.", w: 0.8, req: { any: ["mountain", "pious", "near:ruins"] }, truthLink: "holding_shard", tags: ["theme:god_piece"] },
    { id: "old_maps", n: "The Maps of the Whole", d: "A trove of pre-breaking maps shows the world as one great land. Ours is a sliver near the middle, with mournful notes written in the margin.", w: 1, req: { any: ["scholarly", "academies", "near:ruins"] }, truthLink: "shattered_whole", tags: ["theme:old_maps"] },
    { id: "seam_war", n: "The Seam War", d: "Armoured riders on six-legged beasts came through a seam and took a valley. They say it was theirs before the breaking, and they have the deeds.", w: 0.9, mods: [["martial", 1.5], ["frontier", 2]], truthLink: "holding_shard", tags: ["theme:seam_war"] },
    { id: "failed_mending", n: "The Failed Mending", d: "The Mend-Seekers tried to rejoin a sliver of a neighbouring shard. For a day the two lands were one. Then they split again, and people on both sides no longer recognised their own families.", w: 0.7, req: { any: ["arcane", "mystic", "magic:high", "scholarly"] }, truthLink: "shattered_whole", tags: ["theme:failed_mending"] },
    { id: "shard_lords", n: "The Shard-Lords", d: "A dynasty whose power rests on the world staying broken: they own the seam-crossings and tax every trader through them.", w: 1.2, req: { any: ["monarchy", "autocracy"] }, mods: [["mercantile", 1.5]], tags: ["theme:shard_lords"] },
    { id: "edge_watchers", n: "The Edge-Watchers", d: "Monks who live on the world's brink, measuring the grey with knotted cords and writing down the names of everything it takes.", w: 1.1, req: { any: ["pious", "ascetic", "scholarly"] }, tags: ["theme:edge_watchers"] },
    { id: "seam_traders", n: "The Seam Market", d: "A market town grew up at a stable seam. Goods from three shards pass through, and its coins are stamped with no king's face.", w: 1.1, req: { any: ["mercantile", "has:city", "free_trade"] }, tags: ["theme:seam_traders"] },
    { id: "splinter_faith", n: "The Splinter Faith", d: "A creed that holds the breaking was holy: the old whole was a tyranny, and every shard is a freedom. Its zealots sabotage the Mend-Seekers.", w: 1, req: { any: ["zealous", "pious", "egalitarian"] }, tags: ["theme:splinter_faith"] },
  ],

  sites: [
    { id: "the_edge", n: "The Grey Brink at $", kind: "anomaly", where: "remote", truthLink: "frayed_edge", d: "The place where the land ends in colourless, windless nothing.",
      layers: {
        surface: { n: "White grass", text: "At the brink the land thins into a grey haze. The grass goes white for the last hundred paces, then goes. There is no wind at the edge and no sound. The edge-watchers' hut stands 300 paces back; it stood 600 back when it was built." },
        study: { n: "Thrown things", text: "Objects thrown into the grey do not fall. They lose their colour, then vanish. {investigator} threw a red ball in on a cord and pulled it back: the ball came back white, and the last yard of the cord was gone." },
        dig: { n: "The stakes", text: "The edge-watchers' stakes, driven in every ten years for three centuries, run in a line behind the hut. The gaps between them grow wider toward the grey. The watchers' full cord-tally is kept by {lead}.", points: "cast:investigator" },
        revelation: { n: "A cord a decade", text: "The shard is coming apart from the edge inward, and faster: a cord's length a century three hundred years ago, a cord's length a decade now. The watchers' book of names has 1,900 pages, and the last hundred took nine years to fill. The crown's surveyors stopped coming that decade, so the court need not read the figures." },
      } },
    { id: "map_stones", n: "The Map Stones of $", kind: "ruin", where: "any", truthLink: "shattered_whole", d: "Standing stones carved with a map of a world far larger than ours.",
      layers: {
        surface: { n: "Field patterns", text: "A ring of twelve standing stones carries patterns the farmers say are fields. They plough around the ring and leave a bowl of milk at the tallest stone at harvest. The milk is always gone by morning; the farm has a great many cats." },
        study: { n: "The map", text: "Laid side by side, the patterns make a map, and our whole world is one small piece of it, near the middle. {investigator} made rubbings of all twelve stones and joined them on a barn floor. The map is forty paces across." },
        dig: { n: "The fracture", text: "The central stone shows a line of fracture and, around it, hundreds of small figures linking arms across the break. Beside them is a short carved text. A Mend-Seeker, {lead}, keeps a copy of the text.", points: "cast:believer" },
        revelation: { n: "Held for nine days", text: "The world was whole, and when the blow came its peoples tried to hold it together with their own bodies. They held it for nine days, then their hands slipped. The text says it can be held again if enough hands are willing. The figures show how many it took the first time: about four thousand." },
      } },
    { id: "seam_ruin", n: "The Halved Temple of $", kind: "ruin", where: "border", d: "A temple cut in half by a seam, its other half in another world.",
      layers: {
        surface: { n: "The glassy cut", text: "A temple ends in a clean, glassy cut, and beyond the cut is another sky, faintly green. The cut runs through the middle of the nave and the altar. Pilgrims light candles on our half, about thirty a day." },
        study: { n: "The far half", text: "The far half is visible through the seam, and it is in better repair: fresh paint, swept floors. Someone there is tending it. {investigator} watched for a week and saw a priest come at dawn and at dusk, every day." },
        dig: { n: "Two halves of a prayer", text: "Our side of the altar bears half an inscription; theirs bears the other half, freshly painted. Together they make a prayer for the day the halves meet. A copy of our half is in the temple register at {lead}.", points: "temple" },
        revelation: { n: "Both waiting", text: "The same faith survived on both shards, and both sides have kept the temple for centuries, waiting for the halves to meet. Neither has crossed. Each is afraid that one person stepping through would count as the meeting, and that it would be wasted." },
      } },
    { id: "god_vault", n: "The Humming Vault of $", kind: "dig", where: "mountain", truthLink: "holding_shard", d: "A vault deep in the mountains where something hums.",
      layers: {
        surface: { n: "The flickering gallery", text: "Miners will not work one gallery in the mountain; their lamps flicker there and their teeth ache. The owners lose about forty tons of good ore a year to the refusal. They have tried paying double, and then triple." },
        study: { n: "Plants in the dark", text: "The hum is felt in the teeth. Ferns and pale grass grow in the gallery without light, all leaning toward the end wall. {investigator} set a pot of beans at the entrance. Within a week they had grown two feet, sideways." },
        dig: { n: "The chained stone", text: "Behind the end wall a sealed chamber holds a stone of light wrapped in chains, with guards' bones around it, all facing outward. A seam-rider's spearhead lies among them. The crown's order sealing the chamber is kept at {lead}.", points: "archive" },
        revelation: { n: "The heart", text: "What broke was a god, and this is its heart. Our ancestors hid it here and died guarding it from raiders who came through the seams. Other shards are still looking for it. The crown sealed the chamber, named the stone a lodestone and withdrew the guard to save money." },
      } },
    { id: "halved_city", n: "The Cut City of $", kind: "ruin", where: "border", truthLink: "frayed_edge", d: "A city cut in half by the grey.",
      layers: {
        surface: { n: "Streets that stop", text: "Half a city stands at the brink. Its streets run up to the grey and stop in the middle of a cobble. The remaining half has two thousand people and a market on market-day, and the stalls all face away from the edge." },
        study: { n: "Laid tables", text: "The cut houses are still furnished. Tables are laid for meals no one ate; one spoon lies half over a table's cut edge, and the half that crossed is gone. {survivor} lived two streets back and cannot say who ate there." },
        dig: { n: "The records", text: "The city records list the half that is gone, by name, street and trade: 3,100 people. Nobody living remembers any of them. The records survived only because a copy went to {lead} for the tax.", points: "archive" },
        revelation: { n: "What the grey takes", text: "What the grey takes is not just destroyed. People forget it ever existed, and only written records remain. The tax copy is the only proof that 3,100 people lived here. The crown still bills the missing half every year and lists them as defaulters." },
      } },
  ],

  beings: [
    { id: "edge_wraith", n: "Edge-wraith", kind: "beast", d: "A pale, half-there shape that drifts out of the grey brink at dusk and sits beside the living, saying nothing, until they too begin to fade.", danger: 2, biomes: ["tundra", "colddesert", "badlands", "grass"], look: { size: 1.8, group: [1, 3], move: "solo", speed: 3, col: "#c8c8c8", col2: "#8a8a8a", body: "biped", active: "dusk", visible: false } },
    { id: "seam_beast", n: "Seam-beast", kind: "predator", d: "A six-legged hunter from another shard that came through a seam and found our deer slow and foolish.", danger: 3, biomes: ["tempforest", "grass", "boreal", "dryforest"], look: { size: 2.4, group: [1, 4], move: "pack", speed: 13, col: "#5a7a4a", col2: "#c0a040", body: "quad", active: "night", visible: true } },
    { id: "seam_moth", n: "Seam-moth", kind: "insect", d: "Iridescent moths that cluster at seams and fly between shards. Merchants follow them to find new crossings.", danger: 0, biomes: ["grass", "tempforest", "alpine", "savanna"], look: { size: 0.1, group: [20, 200], move: "swarm", speed: 6, col: "#a080c0", col2: "#60c0a0", body: "insect", active: "dusk", visible: true } },
  ],

  techs: [
    { id: "sw_edge_cords", n: "Edge-cords", field: "natural_philosophy", level: 1, d: "Knotted cords staked at the brink to measure how far the grey has come." },
    { id: "sw_seam_charts", n: "Seam charts", field: "navigation", level: 2, d: "Charts of which seams are stable, which drift and which close, and what lies beyond each." },
    { id: "sw_seam_tongues", n: "Seam tongues", field: "writing", level: 3, d: "Grammars and lexicons of the peoples of neighbouring shards." },
    { id: "sw_brink_wards", n: "Brink wards", field: "arcana", level: 4, d: "Wards that slow the grey for a generation. Each warder loses years of their own life to raise them." },
    { id: "sw_mending_rite", n: "The mending rite", field: "arcana", level: 5, d: "A working that can fuse two shards along a seam. It has never been completed safely." },
  ],

  units: [
    { id: "sw_seam_riders", n: "Seam riders", role: "cavalry", mounted: 1, wpn: "lance", kit: "plate", ranks: 2, gap: 3.5, size: 50, w: 0.4, mods: [["theme:seam_war", 8], ["theme:shard_lords", 2]] },
  ],

  faiths: [
    { id: "splinter_faith", n: "The Splinter Faith", d: "The breaking set us free. To mend the world is to rebuild the prison.", tags: ["faith:splinter"], w: 0.5, names: ["The Splinter Faith", "The Freed Shards", "The Broken Vessel of $"], mods: [["theme:splinter_faith", 6], ["egalitarian", 1.5]] },
  ],

  mapMarks: [
    { kind: "forbidden", n: "The Unmade Lands", d: "The far lands where the grey has already begun: colourless, windless and fading, claimed by no one who means to stay." },
    { kind: "zone", n: "The fraying edge", color: "#b0b0b0", size: [2, 4], count: [1, 2], where: "remote", d: "Land going grey at the brink of the shard, where the world thins into nothing." },
  ],

  storylines: [
    { id: "sw_seam_opens", n: "The Seam at {place}", scale: "realm", anchor: "frontier", w: 1.4, req: "shard_world",
      stages: {
        start: { h: "A seam opens near {place}", b: "The hills above {place} split along a glassy line, and through it is another country under a green sun. Figures on the far side are watching.", wait: [1, 4], fx: { unrest: 10 }, next: [{ to: "traders", w: 1.5, mods: [["mercantile", 2], ["hospitable", 1.5]] }, { to: "riders", w: 1, mods: [["frontier", 1.5]] }] },
        traders: { h: "Traders come through the seam at {place}", b: "Copper-skinned merchants came through with spice, glass and a phrasebook. {person} of {place} is learning their tongue.", wait: [4, 12], fx: { treasury: 30 }, next: [{ to: "seam_market", w: 1.5 }, { to: "seam_closes", w: 1 }] },
        riders: { h: "Riders come through the seam at {place}", b: "Armoured riders on six-legged mounts came through the seam and planted a banner above {place}. They claim the valley was theirs before the breaking.", wait: [2, 6], fx: { stability: -6 }, next: [{ to: "driven_back", w: 1, mods: [["martial", 2], ["standing_army", 1.5]] }, { to: "valley_lost", w: 1 }] },
        seam_market: { h: "A seam market flourishes at {place}", b: "{place} is now the richest town in {realm}, and its streets are loud with three worlds' tongues.", fx: { treasury: 60, prestige: 6, found_town: true }, end: true },
        seam_closes: { h: "The seam at {place} closes", b: "Without warning the seam sealed itself. Twelve traders were on our side; they are guests of {place} forever now.", fx: { stability: 2 }, end: true },
        driven_back: { h: "The seam riders are driven back", b: "The army of {realm} drove the riders back through the seam, and {person} sealed it with a rite that cost the rite-worker twenty years of life.", fx: { prestige: 8, discovery: "arcana" }, end: true },
        valley_lost: { h: "The valley of {place} passes to another world", b: "The riders hold the valley. Their banner flies over {place}, and its people pay taxes to a king under a green sun.", fx: { abandon_town: true, prestige: -10 }, end: true },
      } },
    { id: "sw_grey_comes", n: "The Grey Comes to {realm}", scale: "realm", anchor: "realm", w: 1, req: ["shard_world", { any: ["frontier", "small", "pious"] }],
      stages: {
        start: { h: "The edge-watchers of {realm} sound the alarm", b: "{investigator}, of the edge-watchers, has come to {capital} with the watchers' measuring cords: the grey has moved in faster this decade than in the century before.", wait: [3, 8], next: [{ to: "wards", w: 1, mods: [["arcane", 2], ["learned", 1.5]] }, { to: "ignored", w: 1.5 }] },
        wards: { h: "{realm} raises the brink wards", b: "Volunteers have gone to the brink to raise the wards, knowing what it will cost them. The grey has slowed.", wait: [6, 18], fx: { pop: 0.98, stability: 3 }, next: [{ to: "held", w: 1.5 }, { to: "mending", w: 1, mods: [["theme:failed_mending", 3], ["learned", 1.5]] }] },
        ignored: { h: "{ruler} dismisses the edge-watchers", b: "The court of {realm} had other worries. {investigator} went back to the brink alone.", wait: [8, 20], next: [{ to: "province_lost", w: 1.5 }, { to: "held", w: 0.5 }] },
        held: { h: "The grey holds still at the border of {realm}", b: "For now, the grey has stopped. The wards are hung with the names of the warders, and pilgrims come to read them.", fx: { monument: { tier: 1, name: "The Wall of Warders" }, stability: 4 }, end: true },
        mending: { h: "{realm} attempts the great mending", b: "Rather than hold the edge, the Mend-Seekers of {realm} tried to fuse the shard with its neighbour. The sky changed colour for a week, and the world is a little bigger.", fx: { discovery: "arcana", unrest: 15, prestige: 12 }, end: true },
        province_lost: { h: "A province of {realm} goes grey", b: "The farms, the roads and the market town at the brink have gone. The maps of {realm} have been redrawn, and the old ones burned to spare the grief.", fx: { abandon_town: true, pop: 0.9, stability: -8 }, end: true },
      } },
  ],

  cast: [
    { role: "investigator", n: "an edge-watcher, one of the monks who measure the grey with knotted cords", home: "remote", stance: "Writes down the names of everything the grey takes, because nobody else will remember them." },
    { role: "official", n: "a toll-master of the shard-lords who keeps the seam toll-rolls", home: "capital", stance: "Wants the world to stay broken and the seams taxed; treats mending as the worst crime there is." },
    { role: "believer", n: "a Mend-Seeker who once joined two lands for a day", home: "inner", stance: "Believes the world must be made whole again, whatever it costs the people in between." },
    { role: "survivor", n: "a brink farmer whose land went grey, along with a neighbour's name", home: "border", stance: "Knows something is missing and keeps a written list so the next loss is not forgotten too." },
  ],

  fragments: [
    { depth: "lore", about: "truth", source: "library", bias: "official", reliable: "partial", who: "a primer of {realm}", text: "From a primer of {realm}, {year} edition: 'The world is bounded by the grey, a colourless haze at the edge of every land, which is no more than a mist of the far country. The other lands seen in the night sky are reflections of our own. A seam is a crack in the hills where the reflection shows through. Children must not go within a mile of one.'" },
    { depth: "lore", about: "truth", source: "oral", bias: "garbled", reliable: "partial", who: "an innkeeper of {place}", text: "Told by the innkeeper of {place} to the children at the hearth on long nights, as noted by a traveller in {year}: 'Once there was one bowl, and everyone ate from it. Then it fell, and every family took a piece, and now we eat from a sliver and call it the world.' The innkeeper keeps a cracked clay bowl on the mantel, mended with nine copper staples, to show them." },
    { depth: "lore", about: "truth", source: "traveller", bias: "exaggerated", reliable: "partial", who: "a seam trader", points: "sub:seam_traders", text: "A copper-skinned seam trader, talking over a deal at the seam market, {year}, as set down in a ledger now at {lead}: 'On my shard we have a story of the breaking too. Same bowl, same fall. Only in ours, you broke it. Your ancestors dropped it. We teach it to children, so they do not trust you.' The trader then sold four bolts of cloth at a good price and left smiling." },

    { depth: "core", about: "truth:shattered_whole", source: "ruin", bias: "true", reliable: true, plain: true, who: "the central map stone", points: "site:map_stones", text: "The text on the central map stone at {lead}, read by {investigator} in {year}: 'The world was one land. A blow broke it. We held it with our hands for nine days, four thousand of us. Hands slipped. Forgive us. It can be held again, if enough hands are willing.' Around the text, the carved figures link arms across the fracture line. None of the figures has a face." },
    { depth: "core", about: "truth:shattered_whole", source: "person", bias: "true", reliable: "partial", cost: true, who: "{believer}, Mend-Seeker", text: "Journal of {believer}, Mend-Seeker, after the trial at the seam of {place}, {year}: 'For one day the seam was gone and the two lands were one. Twelve of us held the rite. Then I looked at my sibling {person}, and {person} had a stranger's eyes, and looked at me the same way. We split again at dusk. {person} lives on the other side now, and does not write.'" },
    { depth: "core", about: "truth:shattered_whole", source: "heretic", bias: "heretic", reliable: "partial", who: "a Splinter Faith tract", points: "sub:old_maps", text: "Tract of the Splinter Faith, handed out at the seam market, {year}: 'The Mend-Seekers call the whole a paradise. Ask who sat at the head of the table in paradise. Look at the old maps at {lead}: one capital, one throne, and every road running to it. The breaking was a freedom. We will break every mending tool we find, as we broke nine last year.'" },
    { depth: "core", about: "truth:shattered_whole", source: "library", bias: "official", reliable: false, who: "the royal historian of {realm}", text: "From the royal history of {realm}, first chapter, {year}: 'The world was made as it is, with its edge and its sky. The so-called breaking is a myth of the seam-peoples and has no place in sound history. Standing stones said to show a larger world show fields, as the farmers who plough them have always said.'" },

    { depth: "core", about: "truth:holding_shard", source: "ruin", bias: "true", reliable: true, plain: true, who: "carved above the humming vault", points: "site:god_vault", text: "Carved above the door of the humming vault at {lead}, copied by {investigator} in {year}: 'What broke was a god. The heart of the god is here. The other shards will smell it and come for it. Keep it in the dark and keep it quiet, and set the guard facing out.' The letters are cut deep and filled with lead, and the door has seven locks." },
    { depth: "core", about: "truth:holding_shard", source: "traveller", bias: "true", reliable: "partial", who: "a seam rider, questioned by {official}", text: "Interrogation of a captured seam rider by {official}, toll-master, through an interpreter, {year}: 'Every shard has a piece. Ours was taken by the riders of the red shard in my grandfather's time. Whoever holds the most pieces holds the god. We will not be last.' The rider's saddlebag held a brass compass whose needle points at our mountains." },
    { depth: "core", about: "truth:holding_shard", source: "temple", bias: "pious", reliable: "partial", who: "miners of {place}", text: "Prayer said by the miners of {place} at the shaft head before every shift, as written in the parish book in {year}: 'The god sleeps in pieces, and one piece sleeps beneath us. Let it sleep, and let no stranger wake it.' The priest notes that 60 miners say it, and that none of them will say which gallery it means." },
    { depth: "core", about: "truth:holding_shard", source: "archive", bias: "official", reliable: false, who: "an order of the crown", text: "Order of the crown of {realm}, {year}: 'The so-called humming stone of the mountains is a lodestone of unusual size. It was ordered sealed only to prevent theft. The guard of twelve posted there is withdrawn, to save 200 crowns a year. Reports of riders seeking it are rumours of the seam markets.'" },
    { depth: "core", about: "truth:holding_shard", source: "person", bias: "true", reliable: "partial", cost: true, who: "the inquest at {place}", text: "Inquest at {place} into the night raid of {year}: 'Riders on six-legged beasts came through the new seam and rode straight for the mountain, passing three villages without stopping. {person}, the last vault guard, unpaid since the crown withdrew the twelve, met them at the gallery mouth alone with a pick. Found dead at dawn. The riders did not find the door.'" },

    { depth: "core", about: "truth:frayed_edge", source: "archive", bias: "true", reliable: true, plain: true, who: "{investigator}, edge-watcher", points: "site:the_edge", text: "Cord-tally of the edge-watchers at {lead}, summed by {investigator} in {year}: 'Three hundred years ago the grey took a cord's length a century. Now it takes a cord's length a decade. The shard is coming apart from the edge inward, and faster each generation. At this pace the children of our grandchildren will see the end. Cord's length: 40 paces.'" },
    { depth: "core", about: "truth:frayed_edge", source: "person", bias: "true", reliable: "partial", cost: true, who: "{survivor}, brink farmer", text: "Statement of {survivor}, farmer at the brink, to the edge-watchers in {year}: 'My neighbour's farm went grey last spring, and my own top field with it, eleven acres. I can't remember the neighbour's name now. I know I had a neighbour. There is a path worn from my gate to the grey. I keep a list on the barn door now, so I'll know what else goes.'" },
    { depth: "core", about: "truth:frayed_edge", source: "oral", bias: "garbled", reliable: "partial", who: "a schoolteacher at the brink", points: "site:halved_city", text: "Note of a schoolteacher at the cut city of {lead}, {year}: 'The children play a game called the grey. One child is the grey, and whoever it touches must stand still and say nothing, and everyone else must forget them. Today the class of 22 played it for an hour. Nobody went to fetch the touched ones at the bell. I had to.'" },
    { depth: "core", about: "truth:frayed_edge", source: "library", bias: "propaganda", reliable: false, who: "a proclamation of the crown", text: "Proclamation of the crown of {realm}, {year}: 'The grey is fixed and eternal and has not moved since the founding of {realm}. Alarmist reports from the brink are to be disregarded. Maps showing a smaller realm than the map of the founding are to be surrendered and burned. Sixty were burned last year.'" },

    { depth: "sub", about: "sub:shard_lords", source: "archive", bias: "official", reliable: "partial", who: "{official}, toll-master", points: "sub:seam_opens", text: "Seam toll-roll kept by {official}, toll-master of the shard-lords, {year}, filed at {lead}: 'Tariff on goods from the green-sun shard: one fifth. Tariff on persons: one half of all they carry. Tariff on mending-tools: death.' Takings for the year: 9,000 crowns. Persons executed under the last line: four." },
    { depth: "sub", about: "sub:edge_watchers", source: "temple", bias: "pious", reliable: true, who: "{investigator}, in the book of names", text: "From the edge-watchers' book of names, in the hand of {investigator}, {year}: 'The mill at the brink. The miller's daughter. The dog. The bridge of five arches. The road to the next village, and the next village, 40 households. Remember them, for the world does not.' The book has 1,900 pages. The watchers read a page aloud each evening." },
    { depth: "sub", about: "sub:shard_refugees", source: "person", bias: "true", reliable: "partial", who: "a magistrate's clerk at {place}", text: "Record of a magistrate's clerk at {place}, taking the statement of a refugee mother from a dying shard, {year}, through signs: 'She laid her hand flat, like a land. Then spread her three fingers, like dust. Then pressed the hand to her heart.' Note: '340 crossed with her. Housing found for 90. The rest are camped by the seam.'" },
    { depth: "sub", about: "sub:old_maps", source: "library", bias: "redacted", reliable: "partial", who: "a library catalogue", points: "archive", text: "Catalogue entry of the royal library of {realm}, {year}: 'Map of the Whole, made before the breaking, very fine, ink and gold on hide, 12 feet across. Our realm shown as a sliver near the middle, with a note in the margin: we will miss you. Withdrawn from public view by order of the court. Reason: distressing to the populace. Removed to {lead}.'" },
    { depth: "sub", about: "sub:seam_war", source: "archive", bias: "official", reliable: "partial", who: "the court of claims at {place}", text: "Record of the court of claims at {place}, {year}: 'The riders' herald presented a deed on bronze, dated before the breaking, for the valley of {place} with its two mills, its ford and 300 souls. The court found the deed genuine and the seal correct. The court adjourned to consider whether a deed can bind a world that no longer exists.' Clerk's note: the riders did not wait for the ruling." },
    { depth: "sub", about: "sub:seam_traders", source: "traveller", bias: "exaggerated", reliable: "partial", who: "a pedlar's letter", text: "Letter of a pedlar home from the seam market, {year}: 'Goods from three shards here, and coins with no king's face on them. I bought a fruit that tasted of music, for two coppers, and a knife that cuts only lies, for a silver. The knife has not cut anything yet. I am keeping it for when I get home.'" },
    { depth: "site", about: "site:halved_city", source: "person", bias: "true", reliable: "partial", who: "the mayor of the cut city", text: "The mayor of the cut city of {place}, to the edge-watchers in {year}: 'There was a temple on the other side of the square. I think there was. The records say so, and the tax copy lists a priest and 3,100 parishioners. I walked to the grey with the record in my hand and stood there an hour. I do not remember any of them.'" },
    { depth: "site", about: "site:seam_ruin", source: "traveller", bias: "true", reliable: "partial", who: "a pilgrim at the halved temple", points: "sub:seam_opens", text: "A pilgrim's letter from the halved temple, {year}: 'Through the seam I saw a priest on the far half of the temple, lighting the far half of our altar candles, twelve of them, at the same moment as ours. The priest waved. I waved back. Neither of us stepped forward. Reports of the same seam opening in the hills are filed at {lead}.'" },
  ],
};
