// The Helix Peerage: gene-written castes, sorted before birth, and the secret of the lines that rule.
export default {
  id: "helix_peerage",
  name: "The Helix Peerage",
  family: "scifi",
  pitch: "Every child is written before birth into a caste of worker, soldier, thinker or lord, and the written look down on the chance-born, who may be the only healthy people left.",
  slots: ["bloodline", "augmentation", "state-control"],
  tone: ["grim", "melancholy"],
  era: ["near-future", "far-future"],
  scale: "world",
  genres: ["cyberpunk", "farfuture"],
  bridge: false,
  w: 1,
  excludes: [],
  pairs: [{ id: "gentle_eye", w: 3 }, { id: "charter_lords", w: 1.5 }, { id: "made_kin", w: 2 }, { id: "fleshwright_covenant", w: 1.5 }, { id: "branching", w: 1.2 }],

  cast: [
    { role: "investigator", n: "a registry physician who tracks the wasting blight in the upper lines", home: "capital", stance: "Was written for the work and believes in it, and cannot make the blight tables add up any more." },
    { role: "official", n: "a registrar of the Hall of Lines, keeper of the open registry", home: "capital", stance: "Holds that the registry is the realm's memory and that some memories are kinder filed away." },
    { role: "believer", n: "a hatchery chaplain who teaches that the Writer loves every station", home: "inner", stance: "Believes each caste is a gift fitted to its bearer, and has buried too many of one kind to be easy about it." },
    { role: "survivor", n: "a chance-born elder of the hill reserve who gives blood to the registry men every spring", home: "remote", stance: "Wants to know where the hill children's blood goes, and why the lords who take it look so much like them." },
  ],

  truths: [
    { id: "sterile_crown", n: "The upper lines are barren", d: "The highest written lines wrote out their own fertility to keep their blood pure, and could not write it back. Every 'heir' of the Peerage is built in the registry's template rooms from material taken from the chance-born of the hill reserves, who are told they are giving blood for a test. The lords who call the chance-born stock are their own donors' grandchildren.", tags: ["truth:sterile_crown"],
      known: [
        "Palace midwives have delivered many noble children, but none can recall a noble lady with child. The open registry records every heir as born in the ordinary way, and nobody has asked to see the cradles.",
        "Registry men visit the hill reserves every spring to take blood from the young, and sealed cold-wagons leave the reserves the same week. The template rooms under the registry are guarded better than the palace.",
        "Intake ledgers in the template rooms list chance-born 'donors' by number and assign their material to named noble lines. The heirs appear to be built, and built from the hills.",
        "Confirmed: the great lines are barren, and every noble heir is made from chance-born donors in the hills who were never told what was taken. The registry signs both ends of the ledger.",
      ] },
    { id: "failing_script", n: "The writing is failing", d: "Every written line copies its errors forward, and each generation carries more of them; the thinker line has only a few generations left. The chance-born, whom the registry calls defective, are the only people whose blood is still sound. The founders froze an unwritten cure in a glacier vault, and the registry marked it spoiled so that nobody would fetch it.", tags: ["truth:failing_script"],
      known: [
        "A wasting sickness, the written blight, spreads through the upper lines and passes over the chance-born. The physicians call it rare. Their own case books, kept year by year, say otherwise.",
        "A registry table counts copying errors in the thinker line rising every generation, and projects a number of viable generations left. The number that matters has been blotted out with ink.",
        "A steel door in a glacier bears the founders' warning 'in case of copying error'. Behind it are thousands of frozen unwritten seeds and embryos. The registry lists the vault as spoiled.",
        "Confirmed: the written lines are dying of their own copies, and the founders left a cure. The Peerage forbids unwritten blood, so the cure stays in the ice while its children die.",
      ] },
    { id: "one_hand", n: "One hand wrote every caste", d: "Every caste template was written by a single designer whose mind still runs the hatcheries three hundred years on. The castes are scaffolding for a breeding programme toward one final design, and whole castes are retired when it no longer needs them, as the long-hand labourers were. Nobody in the Peerage has been told what the design is, and the designer's notes say only 'not yet'.", tags: ["truth:one_hand"],
      known: [
        "The registry says an open council of physicians revises the caste templates. Yet every template on file bears the same small designer's mark, from the first, three hundred years old, to this month's.",
        "A lost diary in a pawnshop sketches faces and traits and repeats 'not yet' in the margins. Its mark, a circle cut by a line, matches the hatchery labels exactly.",
        "In the first hatchery's deepest vault, a cabinet of thinking-glass is still writing templates nobody collects. In the desert lie the bones of a caste that was written, used and retired.",
        "Confirmed: one designer's mind wrote every caste and still writes. The castes are steps in a breeding programme toward a design no one has been shown, and the steps are discarded when used.",
      ] },
  ],

  tags: ["gene_caste"],

  subthemes: [
    { id: "borrowed_line", n: "The Borrowed Line", d: "A chance-born youth is living under a written identity bought from a crippled heir. It runs on the heir's blood samples, the heir's name and the youth's own nerve. The registry tests come every month.", w: 1.4, mods: [["urbane", 1.5], ["spy_network", 2]], tags: ["theme:borrowed_line"] },
    { id: "death_date", n: "The Designed Death Date", d: "The labour caste is written to die at forty, healthy until the week it happens. A foreman has turned thirty-nine and has stopped working.", w: 1.3, req: { any: ["hierarchical", "autocracy", "artisans"] }, truthLink: "one_hand", tags: ["theme:death_date"] },
    { id: "cross_caste", n: "The Cross-Caste Lovers", d: "A soldier-line woman and a thinker-line man have been found together. Their families want them parted; the registry wants their child.", w: 1, req: { any: ["hierarchical", "pious"] }, truthLink: "sterile_crown", tags: ["theme:cross_caste"] },
    { id: "written_blight", n: "The Written Blight", d: "A wasting sickness spreads through the upper lines and passes over the chance-born entirely. The physicians call it rare. It is not rare any more.", w: 1.2, truthLink: "failing_script", tags: ["theme:written_blight"] },
    { id: "sister_clones", n: "The Sisters", d: "A woman has met her own face in a market, then a third time in a court. There are at least eleven of them, and someone is counting.", w: 0.9, req: { any: ["urbane", "has:city"] }, truthLink: "one_hand", tags: ["theme:sisters"] },
    { id: "crop_fail", n: "The Written Harvest Fails", d: "The gene-written wheat that feeds the realm has all fallen to one blight in one season, because it was all one plant.", w: 1, req: { any: ["river", "grass", "river_folk", "warm"] }, truthLink: "failing_script", tags: ["theme:crop_fail"], mark: { kind: "zone", n: "Blighted fields", color: "#8a7a3a", size: [2, 4], where: "inner" } },
    { id: "chance_born_reserve", n: "The Chance-Born Hills", d: "In the wild hills live people born the old way, by luck and love. The realm calls them a reserve. The hatcheries call them stock.", w: 1.3, req: { any: ["mountain", "hills", "forest", "mountain_folk", "forest_folk"] }, truthLink: "sterile_crown", tags: ["theme:chance_reserve"], mark: { kind: "zone", n: "Chance-born reserve", color: "#5a8a4a", size: [2, 4], where: "remote" } },
    { id: "made_soldiers", n: "The Written Regiments", d: "A soldier caste bred for war: tall, painless, obedient, and ill at ease in peacetime. Its officers have begun to ask what peace is for.", w: 1.2, mods: [["martial", 2], ["standing_army", 2], ["gov:stratocracy", 3]], tags: ["theme:made_soldiers"] },
    { id: "designers_diary", n: "The Designer's Diary", d: "A lost notebook has surfaced in a pawnshop: sketches of faces, lists of traits, and in the margins the same note over and over: 'not yet'.", w: 0.8, req: { any: ["scholarly", "learned", "academies"] }, truthLink: "one_hand", tags: ["theme:diary"] },
    { id: "line_forgers", n: "The Line-Forgers", d: "A guild of back-room physicians sells forged blood: false readings, borrowed samples, a new life for a year's wages. The registry burns one of their shops every month and two more open.", w: 1, req: { any: ["mercantile", "urbane", "has:port"] }, tags: ["theme:line_forgers"] },
  ],

  sites: [
    { id: "first_hatchery", n: "The First Hatchery of $", kind: "ruin", where: "inner", truthLink: "one_hand", d: "The ruined birthplace of the castes, where the first written children were grown.",
      layers: {
        surface: { n: "The cradle halls", text: "Long halls of cracked glass cradles stand in the ruins, each labelled with a caste mark: hammer, sword, lamp, crown. {survivor} counted 1,200 cradles in the first hall before the light failed. The registry calls the site a monument and charges for entry." },
        study: { n: "One small mark", text: "Every cradle label is signed with the same small mark, a circle cut by a line, from the first row to the last. {investigator} compared labels made three hundred years apart and found the strokes identical, as if drawn by one hand on one day." },
        dig: { n: "Spools nobody collects", text: "In the deepest vault, a humming cabinet of thinking-glass is still writing templates onto spools. Forty spools lie uncollected on the floor, the newest dated this month. Each carries the circle-and-line mark found in the margins of a diary sold at {lead}.", points: "sub:designers_diary" },
        revelation: { n: "Scaffolding", text: "One mind wrote every caste and is still writing. The founding designer built the castes as scaffolding for a final design, and the hatcheries have served it for three hundred years without asking what it is. The registry's council of physicians, which claims to revise the templates, has never been let into this vault." },
      } },
    { id: "seed_vault", n: "The Unwritten Vault at $", kind: "dig", where: "mountain", truthLink: "failing_script", d: "A frozen vault of unedited seeds and embryos, sealed before the castes began.",
      layers: {
        surface: { n: "Door in the ice", text: "A steel door is set in a glacier face two days above the tree line, frosted with old warnings. Hill herders shelter against it in storms; it is the only warm wall on the mountain. No registry party has climbed to it in living memory." },
        study: { n: "In case of copying error", text: "{investigator} cleared the frost and read the warning, 'In case of copying error', in the formal script of the founders and in four languages. The registry index lists this vault as 'decommissioned, contents spoiled' since {year}." },
        dig: { n: "Racks of frozen seed", text: "Inside are racks of frozen seed and embryos, about nine thousand, every one unwritten and sound. A founders' letter on the first rack is addressed to 'the physicians of the future'. A copy of it was filed with the registrar at {lead} and marked not for circulation.", points: "cast:official" },
        revelation: { n: "The cure in the ice", text: "The founders knew the writing would fail copy by copy, and froze unwritten stock for the day it did. A century later the Peerage forbade unwritten blood, and the registrar's office marked the vault spoiled so nobody would fetch it. The upper lines are dying of a disease whose cure the registry filed away." },
      } },
    { id: "template_lab", n: "The Template Rooms of $", kind: "dig", where: "capital", truthLink: "sterile_crown", d: "Locked rooms under the registry where the heirs of the great lines are 'conceived'.",
      layers: {
        surface: { n: "The archive wing", text: "A wing of the registry in {place} is marked 'archive'. Its guards are better armed than the palace's, and its yard takes in a sealed cold-wagon from the hills every spring. {survivor} has watched those wagons leave the reserve for thirty years." },
        study: { n: "Donors by number", text: "The intake ledgers list 'donors' from the chance-born reserves by number, never by name. {investigator} counted 4,471 numbers for the eastern reserve alone, and matched their ages to the girls the registry men 'tested' each spring." },
        dig: { n: "The cold-chests", text: "Cold-chests of harvested material line the vault, each tagged with a reserve village and a lord's line. One tag pairs the High Line with a single hill village. The family of that donor still lives at {lead}.", points: "cast:survivor" },
        revelation: { n: "Built from the hills", text: "The great lines wrote out their own fertility to keep their blood pure, and could not write it back. The registry builds every noble heir from material taken from the hill reserves, and tells the donors it is a blood test. Each spring the High Line sends the donor villages a gift of salt, in thanks for their loyalty." },
      } },
    { id: "clone_village", n: "The Empty Village of $", kind: "ruin", where: "remote", d: "A village of identical cottages where everyone shared one face, abandoned in a single season.",
      layers: {
        surface: { n: "Fifty doors", text: "Fifty identical cottages stand in a valley, with fifty identical doors and fifty identical graves behind the chapel. Shepherds will not use the cottages even in snow. The roofs are still sound after sixty years." },
        study: { n: "One name", text: "The graves bear one name with fifty numbers, all dated within a single autumn. {believer} read the burial register and found that the chaplain who signed it came from the hatchery, not from any parish." },
        dig: { n: "Fifty-one portraits", text: "A schoolroom wall is covered in children's drawings: fifty self-portraits with the same face, and one that is different, signed with a different name. The register of the batch, with that child's number, was sent back to the hatchery at {lead}.", points: "site:first_hatchery" },
        revelation: { n: "The odd one", text: "The village was a trial batch of fifty, raised from one template to test it in ordinary life. When one child came out unlike the rest, the hatchery ended the trial and the fifty were 'retired' in a single autumn. The odd child ran. A fifty-first grave was dug, and it is still empty." },
      } },
    { id: "failed_caste", n: "The Bone Pits of $", kind: "dig", where: "desert", d: "A pit of bones from a caste that was written, used and retired.",
      layers: {
        surface: { n: "Long bones", text: "Scavengers find long, thin bones in hollows in the desert and sell them to carvers as ivory. A carver of {place} bought three hundred in one year and noticed that they all came from people of exactly the same size." },
        study: { n: "Hands too long", text: "The skeletons are all the same height and age, with hands too long for any tool now made, the fingers a span longer than ours. {investigator} measured forty and found no difference larger than the width of a nail." },
        dig: { n: "Retire stock", text: "Caste collars lie with the bones, and a sealed order: 'Template 9 discontinued. Retire stock.' The order carries the circle-and-line mark of the hatchery designer. The registry's own copy of Template 9 should be at {lead}, and is not.", points: "archive" },
        revelation: { n: "Never existed", text: "A whole caste was written to thread the fine wiring of the first hatcheries, and erased when the task was done. Four thousand people were walked into the desert in one season on the designer's order. The registry lists Template 9 as never having existed, and the carvers still sell its bones as ivory." },
      } },
  ],

  beings: [
    { id: "written_hound", n: "Registry hound", kind: "predator", d: "A gene-written tracking dog that can smell caste in the blood. It hunts line-forgers and runaways.", danger: 2, biomes: ["grass", "tempforest", "alpine", "dryforest", "coldsteppe"], look: { size: 1.2, group: [2, 4], move: "pack", speed: 13, col: "#c8c0b0", col2: "#4a4a5a", body: "quad", active: "any", visible: true } },
    { id: "feral_kine", n: "Feral written kine", kind: "grazer", d: "Cattle written to fatten fast, escaped from the estates. They breed true, eat everything and die young.", danger: 0, biomes: ["grass", "savanna", "coldsteppe", "tempforest"], look: { size: 1.9, group: [6, 25], move: "herd", speed: 5, col: "#e0d8c8", col2: "#a08060", body: "quad", active: "day", visible: true } },
    { id: "soldier_line_deserter", n: "Soldier-line deserter", kind: "beast", d: "A bred soldier gone to the wilds: tall, scarred, painless and very hard to kill. Most only want to be left alone.", danger: 3, biomes: ["boreal", "tempforest", "badlands", "alpine"], look: { size: 2.1, group: [1, 3], move: "solo", speed: 7, col: "#5a5a48", col2: "#b0a080", body: "biped", active: "dusk", visible: true } },
  ],

  techs: [
    { id: "hp_selection", n: "Embryo selection", field: "medicine", level: 1, d: "The best of many is chosen before birth. The rest are not discussed." },
    { id: "hp_gene_registry", n: "The blood registry", field: "writing", level: 2, d: "Every person's line is read and recorded; doors, jobs and marriages open to the right blood." },
    { id: "hp_written_crops", n: "Written crops", field: "agriculture", level: 2, d: "Wheat and cattle written for yield. Every field is copies of one plant, so a single blight can kill them all." },
    { id: "hp_caste_templates", n: "Caste templates", field: "medicine", level: 3, d: "Whole castes are written to a pattern: strength, patience, brilliance, beauty, and a date to die." },
    { id: "hp_adult_rewrite", n: "Adult rewriting", field: "medicine", level: 4, d: "Grown bodies are rewritten by slow fevers. It usually works, and the fevers are brutal." },
    { id: "hp_designer_kind", n: "Designer peoples", field: "natural_philosophy", level: 5, d: "New kinds of people, written whole for worlds and tasks no human could endure." },
  ],

  units: [
    { id: "hp_written_regiment", n: "Written regiment", role: "infantry", wpn: "pike", kit: "plate", ranks: 5, gap: 1, size: 120, w: 1, mods: [["theme:made_soldiers", 8], ["standing_army", 2], ["autocracy", 1.5]] },
  ],

  govs: [
    { id: "hp_peerage", n: "Gene peerage", d: "Rule by the highest written line. Rank is read from the blood, and no vote can change it.", tags: ["gov:gene_peerage", "monarchy", "autocracy"], w: 1.2,
      forms: ["Peerage of $", "Lineage of $", "High Line of $"], ruler: "First of the Line", mods: [["hierarchical", 4], ["egalitarian", 0.1], ["origin:old_dynasty", 2]] },
  ],

  mapMarks: [
    { kind: "zone", n: "Hatchery district", color: "#a0b8c0", size: [1, 1], count: [1, 3], where: "capital", d: "A walled quarter of glass halls where the next generation is written." },
  ],

  storylines: [
    { id: "hp_borrowed", n: "The Borrowed Name of {person}", scale: "local", anchor: "town", w: 2, req: "gene_caste",
      stages: {
        start: { h: "A chance-born youth of {place} vanishes", b: "{person} left the reserve with a stolen blood-vial and a name bought from {person2}, a crippled heir of a thinker line.", wait: [3, 8],
          next: [{ to: "rising", w: 2 }, { to: "caught", w: 1, mods: [["harsh_law", 2], ["spy_network", 2]] }] },
        rising: { h: "A brilliant young scholar rises in {place}", b: "The new star of the academy at {place} wins every examination. The newcomer never eats in company and never sheds a hair.", wait: [6, 14], fx: { science: { natural_philosophy: 0.5 } },
          next: [{ to: "triumph", w: 1, mods: [["learned", 2]] }, { to: "unmasked", w: 1 }, { to: "caught", w: 0.5 }] },
        caught: { h: "A line-forger is taken in {place}", b: "The registry's hounds found {person} at the gate of {place}. The blood was borrowed; the crime is theft of a birthright.", fx: { stability: 2, unrest: 5 }, end: true },
        unmasked: { h: "The academy of {place} in scandal", b: "A dropped eyelash, a routine test: {person} was never written. Yet the results stand, and every student in {place} knows it.", wait: [2, 6], fx: { unrest: 12, flag: "unmasked" },
          next: [{ to: "reform", w: 1, mods: [["egalitarian", 3], ["learned", 1.5]] }, { to: "caught", w: 1 }] },
        triumph: { h: "{person} sails for the far stars", b: "The chance-born youth from the hills has left {realm} on the long voyage under a borrowed name. {person2} kept the secret, and died soon after, smiling.", fx: { prestige: 5, discovery: "navigation" }, end: true },
        reform: { h: "{realm} opens the examinations to all blood", b: "After the case of {person}, the examinations of {realm} are open to chance-born and written alike. The high lines are furious.", fx: { stability: -5, science: { writing: 0.5 }, prestige: 4 }, end: true },
      } },
    { id: "hp_blight", n: "The Blight of the High Lines", scale: "realm", anchor: "realm", w: 1.2, req: ["gene_caste", { any: ["hierarchical", "autocracy", "big"] }],
      stages: {
        start: { h: "A wasting sickness in the palace of {capital}", b: "Three nobles of the highest line have fallen ill in {capital}. The physicians speak of overwork. The servants, who are chance-born, are all perfectly well.", wait: [3, 6], fx: { stability: -3 },
          next: [{ to: "spreads", w: 2 }, { to: "vault", w: 1, mods: [["learned", 2], ["scholarly", 2]] }] },
        spreads: { h: "The blight spreads through the written of {realm}", b: "Whole lines are failing in {realm}. Even the royal heir has taken to wearing gloves.", wait: [4, 10], fx: { pop: 0.92, stability: -8 },
          next: [{ to: "harvest", w: 1, mods: [["ruler:cruel", 3], ["harsh_law", 2]] }, { to: "vault", w: 1 }, { to: "collapse", w: 1 }] },
        vault: { h: "{person} finds the founders' vault", b: "A registry physician has found the frozen stores of unwritten seed and blood that the founders left 'in case of copying error'.", fx: { discovery: "medicine", prestige: 8 }, end: true },
        harvest: { h: "{ruler} orders a levy of blood", b: "The reserves of the chance-born are to give their blood to the dying lines. They have not been asked.", fx: { revolt: true, unrest: 25 }, end: true },
        collapse: { h: "The high lines of {realm} fail", b: "There are no more written heirs. The chance-born stewards of {capital} have quietly begun running the realm, because no one else is left to.", fx: { revolution: true, stability: -15 }, end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "truth", source: "library", bias: "official", reliable: "partial", who: "the registry primer", points: "library", text: "From the registry primer, lesson 1, {year} edition: 'Blood is destiny made kind. Every child is written before birth into a caste: labour, soldier, thinker or lord. The written child is spared the cruelty of chance; the chance-born, born the old way, is spared nothing.' The primer has 4 pages on the castes and none on who writes them. An earlier edition with a fifth page is kept at {lead}." },
    { depth: "lore", about: "truth", source: "oral", bias: "true", reliable: true, who: "a hill lullaby, sung by {survivor}", text: "A lullaby of the chance-born hills, sung by {survivor} to a grandchild while a registry physician waited at the door, {year}: 'Nobody wrote you, nobody planned, you came out of love with a crooked hand.' The physician wrote in the visit book that the child was healthy, had five fingers on each hand, and that the song was 'not a medical matter'." },
    { depth: "lore", about: "truth", source: "archive", bias: "official", reliable: true, who: "the Hatchery Manual, chapter 9", points: "site:failed_caste", text: "Hatchery Manual, chapter 9, issued to every hatchery physician, {year}: 'Labour stock shall be written for vigour to the fortieth year and swift decline thereafter, to spare the realm the cost of age.' Chapter 10, on the retirement of templates no longer required, has been cut out of every copy. A water-stained page of it was found among bones at {lead}." },

    { depth: "core", about: "truth:sterile_crown", source: "archive", bias: "redacted", reliable: "partial", cost: true, who: "an intake ledger of the template rooms", text: "Intake ledger, template rooms, spring of {year}: 'Donor 4471, {person}, eastern reserve, female, 19. Material assigned to the High Line, heir of [removed]. Donor returned to reserve.' A second hand has added: 'Donor 4471 dead of fever, day 6, after the harvest. Replacement donor requested from same family.' The eastern reserve's burial book records {person} as dying of a cold." },
    { depth: "core", about: "truth:sterile_crown", source: "person", bias: "true", reliable: "partial", plain: true, who: "a palace midwife", text: "Confession of a palace midwife to {believer}, the night before the midwife's retirement, {year}: 'I have delivered forty noble children. I never once saw a noble lady with child. The babies came up from the template rooms in a warmed box. The great lines cannot have children. Every one of their heirs is grown from what the registry takes from the hills, and I was paid to scream in the right room.'" },
    { depth: "core", about: "truth:sterile_crown", source: "oral", bias: "garbled", reliable: "partial", who: "{survivor}, hill elder, to a peddler", points: "site:template_lab", text: "{survivor}, elder of the hill reserve, to a peddler at the spring fair, {year}: 'In the hills we say the registry men come for the young ones every spring, and take only a little blood, and the lords grow a little younger. I have watched them take it for 30 springs. The wagon goes to a wing of the registry at {lead} that is marked archive. Nobody guards an archive like that.'" },
    { depth: "core", about: "truth:sterile_crown", source: "heretic", bias: "exaggerated", reliable: "partial", who: "a line-forgers' pamphlet", points: "cast:survivor", text: "A pamphlet of the line-forgers, printed in 400 copies in {place}, {year}: 'Your lords are not your betters. They are your grandchildren, built in a cellar from your daughters. Ask the hill elder at {lead} how many girls went to the spring testing and how many noble heirs were announced that summer. The numbers match. They have matched for a hundred years.'" },
    { depth: "core", about: "truth:sterile_crown", source: "library", bias: "official", reliable: false, who: "{official}, registrar of the Hall of Lines", text: "Statement of {official}, registrar of the Hall of Lines, to the assembly of {realm}, {year}: 'The noble lines are the most fertile in the realm. Their heirs are born in the ordinary way and recorded in the open registry, which any citizen may inspect on the first day of each month between nine and ten, by appointment made 6 months in advance.'" },

    { depth: "core", about: "truth:failing_script", source: "archive", bias: "redacted", reliable: "partial", who: "{investigator}, registry physician", points: "site:seed_vault", text: "Table drawn up by {investigator}, registry physician, on the thinker line, {year}: 'Errors per copy: 3 in the founders' generation, 11 in my mother's, 26 in mine. Projected viable generations remaining: [ink spilled].' Attached is a request to inspect the founders' frozen stock at {lead}. Across the request, in the registrar's hand: 'Stock spoiled. Request refused.'" },
    { depth: "core", about: "truth:failing_script", source: "ruin", bias: "true", reliable: true, plain: true, who: "{investigator}, at the vault door", text: "Field note of {investigator}, at the glacier vault, {year}: 'On the door, in founders' script: EVERY COPY LOSES A LITTLE. KEEP THIS FOR THE DAY THE COPIES FAIL. Behind it, nine thousand unwritten seeds and embryos. Tested forty at random: all forty sound. Findings for the board, in order: the written lines are failing. The chance-born are not. The cure is in this ice, and it was never spoiled. Someone in the registry wrote that it was.'" },
    { depth: "core", about: "truth:failing_script", source: "traveller", bias: "exaggerated", reliable: "partial", who: "a salt trader of the hill roads", points: "sub:chance_born_reserve", text: "A salt trader of the hill roads, in a tavern of {place}, {year}: 'In the hills the chance-born live to a hundred, crooked teeth and all. I sold salt to a woman of 97 who carried it home herself. And the lords who ride up to hunt there cough blood on the way home. Go to the reserve at {lead} and count the grey heads. Then count them in the capital.'" },
    { depth: "core", about: "truth:failing_script", source: "person", bias: "true", reliable: "partial", cost: true, who: "a mother of the thinker line", text: "Letter of a mother of the thinker line to {investigator}, {year}: 'My son {person} was written top of the line, with the finest memory in the academy. At 16 the blight took the memory first. At 18 it took the rest. The physicians said it was rare. There were three more in {person}'s year. Please do not tell me it is rare. Tell me what the copies have done to us.'" },
    { depth: "core", about: "truth:failing_script", source: "library", bias: "propaganda", reliable: false, who: "the Peerage Gazette", text: "From the Peerage Gazette, {year}: 'Each generation of the written lines is finer than the last. The so-called written blight is a rare inherited weakness, affecting fewer than 1 in 1,000, and is already cured. Unwritten blood remains barred by law from the hatcheries, for the protection of the lines.' The same issue carries the obituary of the Gazette's editor, of the thinker line, aged 31. Cause of death: overwork." },

    { depth: "core", about: "truth:one_hand", source: "person", bias: "true", reliable: "partial", plain: true, who: "the designer, in the lost diary", text: "From the designer's diary, sold in a pawnshop of {place} in {year} for 6 coins, a page dated three hundred years ago: 'Soldier, labourer, thinker, lord. I have written all four. None of them is the point. They are scaffolding. When the final line is ready the others can be retired, as I retired the long hands. Not yet. Not yet.' The circle-and-line mark is drawn beside every entry." },
    { depth: "core", about: "truth:one_hand", source: "archive", bias: "redacted", reliable: "partial", cost: true, who: "a registry index of templates", points: "archive", text: "Registry index of caste templates, {year}: 'Every template on file bears the same designer's mark. Signature: [withheld]. Date of first template: three hundred years ago. Date of last template: this month.' Note pinned behind it: 'Clerk {person}, who compiled this index, has been reclassified to labour stock for disclosure. Fourteen years to the fortieth year.' The index was refiled at {lead}." },
    { depth: "core", about: "truth:one_hand", source: "temple", bias: "pious", reliable: "partial", who: "{believer}, hatchery chaplain", points: "site:first_hatchery", text: "Sermon of {believer}, chaplain of the hatchery, to 200 newly written soldiers, {year}: 'The Writer made each of you for your station, and loves each station equally, and is not finished writing.' After the service the chaplain asked to be posted to the old first hatchery at {lead}, where the Writer's mark is on every cradle, 'to see the hand that loves us'." },
    { depth: "core", about: "truth:one_hand", source: "library", bias: "official", reliable: false, who: "the registry's public charter", text: "The registry's public charter, article 12, {year} revision: 'The caste templates are revised by an open council of 12 hatchery physicians, whose debates are published every decade.' The most recent published debate is 70 years old. It concerns the colour of the caste badges." },

    { depth: "sub", about: "sub:death_date", source: "person", bias: "true", reliable: true, who: "a labour-line son, to {believer}", text: "A son of the labour line, to {believer}, at the father's burial, {year}: 'My father knew the day he would die since the day he learned to count. Written for forty years, and forty it was, the week after his birthday. He spent the last 7 days fishing. He said it was the first holiday he ever had. He caught nothing and said it was the best week of his life.'" },
    { depth: "sub", about: "sub:borrowed_line", source: "heretic", bias: "true", reliable: "partial", who: "a line-forger, to a new client", points: "sub:line_forgers", text: "A line-forger's advice to a new client, written on the wrapper of a borrowed blood-vial, {year}: 'Scrub every morning. Burn your hair. Never bleed in public. Test day is the 1st of the month; be ill on the 1st. And never, ever fall in love with someone who can read blood.' The forger's shop at {lead} charged a year's wages for the vial and the advice was free." },
    { depth: "sub", about: "sub:sister_clones", source: "person", bias: "true", reliable: "partial", who: "a weaver of {place}, in a diary", points: "site:clone_village", text: "Diary of a weaver of {place}, {year}: 'I met myself today, at the fish market. She had my scar, the one on the chin I got at 9. She said, quite calmly, there are eleven of us, have they come for you yet? She told me where we were made: a village of fifty doors at {lead}, where she says the graves have our name on them, with numbers.'" },
    { depth: "sub", about: "sub:crop_fail", source: "archive", bias: "official", reliable: false, who: "the registry's Office of Seed", text: "Notice of the registry's Office of Seed, {year}: 'The harvest shortfall in {realm}, estimated at 6 parts in 10, is due to unseasonal rain, and has no connection to the written seed, which is immune to all known blights. Farmers who have saved unwritten seed from before the reform are reminded that its sowing is an offence.'" },
    { depth: "sub", about: "sub:made_soldiers", source: "oral", bias: "exaggerated", reliable: "partial", who: "a barmaid of a garrison town", text: "A barmaid of the garrison town of {place}, to a travelling pedlar, {year}: 'The written soldiers can't feel pain, so they say they can't feel anything, so they don't know what the war was for. Rubbish. Their sergeant drinks here every night since the peace. Nine years. He asks me every night what peace is for. I tell him it's for drinking.'" },
    { depth: "site", about: "site:clone_village", source: "traveller", bias: "garbled", reliable: "partial", who: "a drover passing the village of one face", text: "A drover passing the village of one face, to a fellow at the inn, {year}: 'Fifty graves in a row behind the chapel, all the same name, and one more at the end with no stone. The shepherd up there told me it is for the child who came out different, and that it is empty, because they never caught the child. Sixty years ago. Says the child would be old now, and probably looks like nobody.'" },
    { depth: "site", about: "site:failed_caste", source: "archive", bias: "redacted", reliable: true, who: "a registry order, found in the desert", text: "A registry order sealed in wax, found in a collar case in the desert bone pits by a scavenger in {year}: 'Template 9, long-hand labour: discontinued. Remaining stock, 4,000: retired. Records: purged. This page: to be destroyed after reading.' It was not destroyed. The scavenger sold it to {investigator} for the price of a pair of boots." },
  ],
};
