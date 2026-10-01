// The Charter Lords: corporations are the great houses, contracts are fealty, and the nations are a memory.
export default {
  id: "charter_lords",
  name: "The Charter Lords",
  family: "scifi",
  pitch: "Nations are a memory: trading houses rule as feudal lords, every oath is a contract, and every citizen is an employee, a customer or nobody at all.",
  slots: ["state-control", "economy-resource"],
  tone: ["noir", "satirical"],
  era: ["modern", "near-future", "far-future"],
  scale: "world",
  genres: ["cyberpunk", "farfuture"],
  bridge: false,
  w: 1,
  excludes: ["unending_mobilization"],
  pairs: [{ id: "vessel_peerage", w: 3 }, { id: "chrome_fever", w: 2 }, { id: "gentle_eye", w: 1.5 }, { id: "made_kin", w: 1.5 }, { id: "helix_peerage", w: 1.5 }],

  cast: [
    { role: "investigator", n: "an auditor of the Arbitration Court who follows ownership chains to their end", home: "capital", stance: "Believes every account balances in the end, and wants to see the last line of this one." },
    { role: "official", n: "a vice-president for public affairs of a great house", home: "capital", stance: "Holds that the houses keep the lights on, and that the truth is a liability to be managed like any other." },
    { role: "believer", n: "a chaplain of the Founder's Chapel who reads the quarterly reports as scripture", home: "inner", stance: "Believes the Founder's plan is good, the figures are holy, and Settlement Day will reward the loyal." },
    { role: "survivor", n: "an unlisted scavenger whose family farm was sold for famine grain", home: "border", stance: "Has no number, no contract and no family left, and so nothing more the houses can take." },
  ],

  truths: [
    { id: "one_board", n: "Every house has one owner", d: "Behind holding companies, trusts and dead men's proxies, all forty great houses are owned by one founding family through the Seventh Trust, whose chair votes in every boardroom by a wire from one sealed room. The rivalries, takeovers and deniable wars are theatre that keeps everyone else bidding against each other. The dead of those wars, about three thousand a year, are booked as industrial accidents.", tags: ["truth:one_board"],
      known: [
        "A shareholder register shows a house owned by the Seventh Trust, which is owned by the Seventh Trust. The chain runs for 31 pages and loops back on itself.",
        "A retired security general says both sides of a six-year house war had the same paymaster. The general saw the cheques.",
        "A sealed boardroom holds a switchboard with one line to every great house and a plate reading 'All voices to this room. One answer.'",
        "Confirmed: one family owns all forty houses. The wars between them are staged, and the casualties are real.",
      ] },
    { id: "world_asset", n: "The world was bought", d: "The world itself was bought long ago as a single asset. The Founding Charter is a licence agreement: the land is 'Lot 1', every citizen is listed under fixtures and fittings, and the licence expires in about twenty-two years. The holder named on it is no one now living. The houses' own lawyers have done the sums, and they are buying passage off-world instead of telling anyone.", tags: ["truth:world_asset"],
      known: [
        "Lawyers of the Exchange are quietly selling their land and buying one-way passage. One of them said the word 'term' and then would say nothing else.",
        "A photographed charter page lists 'Lot 1: land, water, atmosphere and improvements thereon', with a term that has been blacked out. The clerk who took the photograph is dead.",
        "A lawyer's diary works the term out at twenty-two years. The unlisted children count to twenty-two in their games and cannot say why.",
        "Confirmed: the world is leased property and the lease is ending. The people are listed as fittings, and the people who know are leaving.",
      ] },
    { id: "bought_collapse", n: "The fall was a purchase", d: "The old nations did not fail on their own. The houses bought their debts at forty to the crown, held back a year's grain in sealed company towns until the famine broke, and paid both armies in the last war. Then they bought the ruins at a discount and called it rescue. The old assembly's last vote refused the sale, and it was never counted.", tags: ["truth:bought_collapse"],
      known: [
        "A company town was sealed by court order the day before the old nation's grain fleet failed. Its people left in one night.",
        "Two-generation-old house minutes record a motion to buy the national debt, and a second motion 'to delay grain shipments'. The rest is cut away.",
        "The sealed town's storehouses hold 6,000 sacks of grain from the famine year, stencilled 'not for release until terms signed'.",
        "Confirmed: the houses made the famine and bought the nations. The ballots of the last vote are still under the dais, uncounted.",
      ] },
  ],

  tags: ["charter_houses"],

  subthemes: [
    { id: "company_town", n: "The Company Town Secedes", d: "A mining town paid in house scrip has torn up its contracts and declared itself free. The house has not sent soldiers yet; it has sent accountants, which is worse.", w: 1.4, mods: [["egalitarian", 2], ["mountain_folk", 1.5], ["origin:rebellion", 3]], tags: ["theme:company_town"] },
    { id: "deniable_war", n: "The Deniable War", d: "Two houses are at war, though neither admits it. Their mercenaries wear no colours, their dead are listed as industrial accidents, and the battles are fought in other people's streets.", w: 1.3, mods: [["mercenaries", 3], ["martial", 1.5]], truthLink: "one_board", tags: ["theme:deniable_war"] },
    { id: "merger_marriage", n: "The Merger Wedding", d: "The heirs of two rival houses are to marry, and the contract is four hundred pages long. The bride has read it. The groom has not.", w: 1, req: { any: ["hierarchical", "dynastic", "monarchy"] }, tags: ["theme:merger_marriage"] },
    { id: "scrip_crash", n: "The Scrip Crash", d: "A house's scrip lost nine tenths of its worth in a week. A whole district that was paid in it now owns nothing, and the house is buying the district back at a tenth of its price.", w: 1.2, req: { any: ["mercantile", "urbane", "has:city"] }, truthLink: "bought_collapse", tags: ["theme:scrip_crash"], mark: { kind: "zone", n: "The Defaulted Ward", color: "#6a6a5a", size: [1, 2], where: "inner" } },
    { id: "unlisted", n: "The Unlisted Margins", d: "In the gaps between enclaves live the unlisted: people with no contract, no number and no rights, who trade in favours and salvage. The houses pretend they do not exist, which suits them well.", w: 1.3, tags: ["theme:unlisted"], mark: { kind: "zone", n: "Unlisted sprawl", color: "#7a5a4a", size: [2, 4], where: "border" } },
    { id: "founder_cult", n: "The Founder's Chapel", d: "One house has a chapel in every office, where employees light candles before a portrait of the founder. Its quarterly reports are read aloud as scripture.", w: 1, req: { any: ["pious", "organised", "zealous"] }, truthLink: "one_board", tags: ["theme:founder_cult"] },
    { id: "recall", n: "The Product Recall", d: "A house recalled a batch of water purifiers from a river town. Every resident of the town was recalled with them.", w: 0.8, req: { any: ["river", "river_folk", "marsh"] }, tags: ["theme:recall"] },
    { id: "hostile_takeover", n: "The Hostile Takeover", d: "A city has been bought in a single afternoon's trading. Its council learned of the sale from the new signs on the gates.", w: 1, req: { any: ["has:city", "realm:large", "realm:vast"] }, truthLink: "bought_collapse", tags: ["theme:takeover"] },
    { id: "expiry_clause", n: "The Expiry Clause", d: "Lawyers have begun quietly selling their land and buying passage off-world. One of them, drunk, said the word 'term' and then would not say anything else.", w: 0.7, req: { any: ["scholarly", "learned", "mercantile"] }, truthLink: "world_asset", tags: ["theme:expiry"] },
    { id: "dream_adverts", n: "Advertising in Sleep", d: "A house now sells space in its employees' dreams. The jingles are catchy. The nightmares are cheaper.", w: 0.8, req: { any: ["urbane", "has:city"] }, tags: ["theme:dream_adverts"] },
    { id: "old_capitol", n: "The Museum of the Nation", d: "The old parliament stands preserved behind velvet ropes, its voting benches polished by tourists. The guides call democracy 'a charming early experiment in governance'.", w: 0.9, req: { any: ["near:ruins", "origin:successor"] }, truthLink: "bought_collapse", tags: ["theme:old_capitol"] },
    { id: "retired_executive", n: "The Retired Executive", d: "A vice-president who read the wrong ledger has been 'retired'. Her pension is paid on time, to an address that does not exist.", w: 0.9, req: { any: ["spy_network", "autocracy", "urbane"] }, truthLink: "world_asset", tags: ["theme:retired"] },
  ],

  sites: [
    { id: "charter_vault", n: "The Charter Vault of $", kind: "dig", where: "capital", truthLink: "world_asset", d: "A vault beneath the Exchange that holds the Founding Charter, the paper every house swears it has never read.",
      layers: {
        surface: { n: "Forty locks", text: "A bronze door under the Exchange with forty locks, one for each founding house, all rusted shut. Tourists may photograph it from behind a rope for two scrip, and most do." },
        study: { n: "The guards' ledgers", text: "The guards' ledgers show the door has opened once a year for 300 years, always on the same night, with a key no house admits to holding. {investigator} worked out that the night is the Charter's anniversary." },
        dig: { n: "Lot 1", text: "Inside lies one bound document, older than any house. The world is listed on its first page as 'Lot 1', with its people under 'improvements'. The term is written out in full. A copy of the term page went to the lawyers who are now leaving, by way of {lead}.", points: "sub:expiry_clause" },
        revelation: { n: "Fixtures and fittings", text: "The world is property, bought whole by a buyer three centuries dead. The houses hold it on licence, and the licence ends in twenty-two years. The lawyers who read it are leaving. Nobody has told the fixtures and fittings." },
      } },
    { id: "empty_boardroom", n: "The Boardroom at $", kind: "ruin", where: "inner", truthLink: "one_board", d: "A sealed boardroom at the top of a tower, where the chair of a great house has met the directors for ninety years without being seen.",
      layers: {
        surface: { n: "No stairs", text: "A tower whose top floor has no stairs, only a lift that answers to one card. The cleaners are sent up once a year and come down paid for a month, which is why nobody complains." },
        study: { n: "Attending remotely", text: "Ninety years of minutes show the chair's vote as decisive every time, and the chair's seat as 'attending remotely'. {investigator} counted 4,100 meetings and not one recorded absence in ninety years." },
        dig: { n: "The grille", text: "Behind the chair is a speaker grille wired to a line that runs, through 31 shell offices, to every other house's boardroom. The line's bills are paid by the Seventh Trust, whose filings are kept in {lead}.", points: "archive" },
        revelation: { n: "One answer", text: "Every great house answers to the same voice: the founding family, through the Seventh Trust. The wars between the houses are staged to keep {realm} bidding against itself. About 3,000 people a year die in those wars, and the books call them industrial accidents." },
      } },
    { id: "ghost_company", n: "The Offices of $ Holdings", kind: "anomaly", where: "any", d: "A corporation dissolved forty years ago that still pays its staff, still files reports, and still hires.",
      layers: {
        surface: { n: "Lit and empty", text: "A lit office block with no employees anyone has met. Salaries arrive monthly at 186 addresses. The newsagent on the corner delivers forty papers a day, and collects them unread in the evening." },
        study: { n: "The dead director", text: "The company was dissolved forty years ago. Its accounts still balance perfectly, signed each quarter by a director who died in its founding year. {investigator} compared the signatures: identical to the stroke." },
        dig: { n: "The clerking engine", text: "In the cellar a clerking engine still runs, writing contracts on a loop of punched tape. One tape is a lease renewal for a vault under the Exchange, at {lead}.", points: "site:charter_vault" },
        revelation: { n: "No one required", text: "The houses do not need people. Their machines write and enforce contracts by themselves, and would carry on if every worker were gone. The 186 salaries go to people who took the job and vanished into the building. The engine still counts them as staff." },
      } },
    { id: "company_ghost_town", n: "The Abandoned Works at $", kind: "ruin", where: "remote", truthLink: "bought_collapse", d: "A company town evacuated overnight, its records sealed by court order.",
      layers: {
        surface: { n: "Meals on the tables", text: "Rows of identical houses, each with a house logo over the door and a meal still on the table under thirty years of dust. The town's 1,800 people left in a single night." },
        study: { n: "The court order", text: "The town was emptied the week the old nation's grain fleet failed. {investigator} found that the court order sealing it was signed the day before the fleet failed, by a house judge." },
        dig: { n: "Full storehouses", text: "The storehouses are full: 6,000 sacks of grain dated the famine year and stencilled 'not for release until terms signed'. The order to hold them came from a house board whose minutes are now kept at {lead}.", points: "cast:official" },
        revelation: { n: "The bought famine", text: "The famine that broke the old nations was made here. The houses emptied the town and held its grain until the nations signed away their debts, then sold it back as relief. Nobody fed the 1,800 who left. Their names are on a list in the town hall, under 'redundancy'." },
      } },
    { id: "capitol_museum", n: "The People's Hall of $", kind: "wonder", where: "capital", d: "The old national assembly hall, kept as a museum, where children are taken to laugh at votes.",
      layers: {
        surface: { n: "Ropes and stalls", text: "A domed hall full of benches, velvet ropes and souvenir stalls. School parties visit daily. A stall by the door sells little ballot boxes for three scrip each, with pretend ballots inside." },
        study: { n: "The last ledger", text: "The last session's ledger lies open at a page of debts owed to banks that no longer exist under those names. {investigator} traced all nine banks. Each became a great house within the year." },
        dig: { n: "The uncounted box", text: "Under the speaker's dais is a box of ballots from the final vote, sealed and never counted. The seal is a house seal. The box's receipt names the storehouse town at {lead}.", points: "site:company_ghost_town" },
        revelation: { n: "Not counted", text: "The last vote of the old nation refused the houses, 412 to 120. It was never counted, and the nation was sold anyway. The guides who call democracy 'a charming early experiment' are house employees, and the house that bought the hall writes their scripts." },
      } },
  ],

  beings: [
    { id: "contract_hound", n: "Contract-hound", kind: "predator", d: "A bred and implanted guard dog that tracks debtors by the chip in their wrist. It will not stop until the debt is paid or the debtor is dead.", danger: 2, biomes: ["grass", "tempforest", "badlands", "dryforest"], look: { size: 1.3, group: [2, 5], move: "pack", speed: 13, col: "#2a2a30", col2: "#c8a040", body: "quad", active: "any", visible: true } },
    { id: "sentry_drone", n: "Sentry drone", kind: "bird", d: "A small flying watcher in house colours that patrols enclave borders and reads every face that passes.", danger: 1, biomes: ["grass", "coast", "desert", "tempforest", "river"], look: { size: 0.4, group: [1, 6], move: "flock", speed: 40, col: "#3a3a44", col2: "#d04030", body: "bird", active: "any", visible: true } },
    { id: "scrap_rat", n: "Scrip rat", kind: "small", d: "A sleek grey rat that thrives in the unlisted sprawl and gnaws the copper out of house cabling. The unlisted say it is the only free citizen left.", danger: 0, biomes: ["grass", "badlands", "river", "swamp"], look: { size: 0.3, group: [5, 30], move: "swarm", speed: 6, col: "#6a6a6a", col2: "#c09060", body: "quad", active: "night", visible: true } },
  ],

  techs: [
    { id: "cl_company_scrip", n: "Company scrip", field: "writing", level: 1, d: "Each house pays in its own currency, good only at its own stores. Debt becomes a leash." },
    { id: "cl_enclave_law", n: "Extraterritorial enclaves", field: "architecture", level: 2, d: "House compounds become sovereign ground, with their own courts, walls and police." },
    { id: "cl_private_legion", n: "Private legions", field: "warfare", level: 3, d: "Security divisions grow into armies that answer to the board, not the crown." },
    { id: "cl_loyalty_chip", n: "Loyalty implants", field: "medicine", level: 3, d: "A chip under the skin that carries a worker's contract, wages and debts. Removing it is breach of contract." },
    { id: "cl_cradle_contract", n: "Cradle-to-grave contracts", field: "writing", level: 4, d: "A house hires a child at birth and buries them at death, with every step in between on the books." },
    { id: "cl_planetary_title", n: "Planetary title", field: "natural_philosophy", level: 5, d: "Whole provinces, then whole worlds, are bought and sold as single lots on the Exchange." },
  ],

  units: [
    { id: "cl_security", n: "House security", role: "infantry", wpn: "xbow", kit: "plate", ranks: 3, gap: 1.4, size: 80, w: 1.5, mods: [["theme:deniable_war", 4], ["mercenaries", 2], ["mercantile", 1.5]] },
    { id: "cl_deniables", n: "Deniable operatives", role: "ranged", wpn: "xbow", kit: "light", ranks: 2, gap: 2.5, size: 30, w: 0.6, mods: [["theme:deniable_war", 8], ["spy_network", 3]] },
  ],

  govs: [
    { id: "cl_board", n: "Board of directors", d: "A realm run as a company: the ruler is a chief officer appointed by shareholders, and citizenship is a contract of employment.", tags: ["gov:board", "autocracy"], w: 1.5,
      forms: ["$ Holdings", "$ Company", "Chartered House of $"], ruler: "Chief Executive", mods: [["mercantile", 4], ["origin:merchant_charter", 6], ["has:port", 1.5]] },
  ],

  faiths: [
    { id: "cl_founder", n: "Founder veneration", d: "The founder of the house is honoured as a saint of prudence; scripture is the founding prospectus.", tags: ["faith:founder"], w: 0.6,
      names: ["The Prospectus of $", "The Founders' Trust", "The Chapel of the Ledger"], mods: [["mercantile", 3], ["hierarchical", 1.5]] },
  ],

  mapMarks: [
    { kind: "zone", n: "Enclave", color: "#b8b0a0", size: [1, 2], count: [2, 4], where: "coast", d: "Walled house ground where the realm's law does not run." },
  ],

  storylines: [
    { id: "cl_secession", n: "The Free Town of {place}", scale: "local", anchor: "town", w: 2, req: "charter_houses",
      stages: {
        start: { h: "{place} tears up its contracts", b: "The miners of {place} have burned the house ledgers in the square and declared themselves unlisted and free. {person} speaks for them.", wait: [2, 5], fx: { unrest: 10, flag: "seceded" },
          next: [{ to: "accountants", w: 2 }, { to: "soldiers", w: 1, mods: [["autocracy", 2], ["harsh_law", 2]] }] },
        accountants: { h: "The house sends auditors to {place}", b: "No soldiers came. Instead, the house called in every debt owed by every family in {place}, and bought the well.", wait: [3, 8], fx: { treasury: -20, unrest: 8 },
          next: [{ to: "bought_back", w: 2 }, { to: "commune", w: 1, mods: [["egalitarian", 3], ["origin:rebellion", 3]] }] },
        soldiers: { h: "Unmarked soldiers enter {place}", b: "Men with no colours and good rifles came to {place} at night. Officially, there was a gas leak.", wait: [2, 4], fx: { pop: 0.9, stability: -6 },
          next: [{ to: "bought_back", w: 1 }, { to: "uprising", w: 1, mods: [["martial", 2], ["unstable", 2]] }] },
        bought_back: { h: "{place} signs again", b: "One family at a time, the people of {place} signed new contracts on worse terms. {person} was the last to sign, and the first to be laid off.", fx: { stability: 4, treasury: 30 }, end: true },
        commune: { h: "{place} becomes a free commune", b: "The unlisted of the region have come to {place} to share what it has. The house has written the town off as a loss, for now.", fx: { found_town: true, prestige: 4 }, end: true },
        uprising: { h: "The miners of {place} take the enclave", b: "The town marched on the house enclave with picks and blasting powder. The walls came down, and so did the house's share price.", fx: { revolt: true, unrest: 20 }, end: true },
      } },
    { id: "cl_charter", n: "The Charter of {realm}", scale: "realm", anchor: "realm", w: 1.2, req: ["charter_houses", { any: ["learned", "scholarly", "mercantile"] }],
      stages: {
        start: { h: "A clerk of {capital} reads the Founding Charter", b: "{person}, a junior clerk at the Exchange, was sent to fetch a document from the deep vault, and read it on the way back up.", wait: [2, 6],
          next: [{ to: "leak", w: 2 }, { to: "silenced", w: 1, mods: [["spy_network", 3], ["harsh_law", 2]] }] },
        leak: { h: "Pages of the Charter appear in {capital}", b: "Copies of a page listing {realm} as 'Lot 1' are pasted on every wall. The houses call it a forgery, in the same words, at the same hour.", wait: [3, 8], fx: { unrest: 15, stability: -8, flag: "charter_leaked" },
          next: [{ to: "revolution", w: 1, mods: [["unstable", 2], ["poor", 2]] }, { to: "buy_silence", w: 1, mods: [["rich", 2]] }, { to: "exodus", w: 1 }] },
        silenced: { h: "A clerk of the Exchange is retired", b: "{person} has taken early retirement. The clerk's desk was emptied before {person} arrived to empty it.", fx: { stability: 2 }, end: true },
        revolution: { h: "{realm} tears up the Charter", b: "The crowds of {capital} have stormed the Exchange and burned the vault. Whoever owns the world must now come and collect it.", fx: { revolution: true, stability: -20 }, end: true },
        buy_silence: { h: "{realm} declares a dividend", b: "Every citizen of {realm} has received a bonus payment, and a reminder of their confidentiality clause. The posters came down within a week.", fx: { treasury: -60, stability: 5 }, end: true },
        exodus: { h: "The rich of {realm} sell everything", b: "Executives are quietly selling their land in {realm} and buying passage elsewhere. Those who cannot afford a ticket have begun asking where elsewhere is.", fx: { growth: -0.002, unrest: 10 }, end: true },
      } },
  ],

  fragments: [
    { depth: "lore", about: "truth", source: "library", bias: "propaganda", reliable: false, who: "Company-school reader, {realm}", text: "Primary reader for the company schools of {realm}, page 1, {year} edition: 'The houses rescued us when the old governments failed. A good worker is a free worker, and a free worker is a grateful one.' Exercise 3 at the foot of the page: 'Write a thank-you letter to your parents' employer. Use at least 40 words. Spelling counts toward your parents' annual review.'" },
    { depth: "lore", about: "truth", source: "archive", bias: "official", reliable: true, who: "{investigator}, court auditor", points: "archive", text: "Annual report of a great house, losses section, {year}, audited by {investigator}: 'Personnel attrition in the eastern works: 412 units. Written down against the quarter's goodwill.' The auditor's pencil note: 'Units means people. 412 deaths, no names. Requested the list.' The house replied that the list is commercially sensitive and has been filed under seal in {lead}." },
    { depth: "lore", about: "truth", source: "oral", bias: "true", reliable: "partial", who: "An old porter of the margins", text: "An old porter in the unlisted margins, talking to {investigator} in {year}: 'My grandfather said that before the houses there were countries, and you could vote, and nobody could fire you from being alive.' The porter keeps the grandfather's voting card in a tea tin, number 81,404, and shows it to children for a copper." },
    { depth: "lore", about: "truth", source: "heretic", bias: "heretic", reliable: "partial", who: "A factory wall at {place}", text: "Painted three feet high on the wall of a scrip factory at {place}, {year}: 'YOUR CONTRACT IS A CHAIN. YOUR SCRIP IS A CHAIN. YOUR CHILD'S BIRTH CERTIFICATE IS A CHAIN.' The house sent painters within the hour. The painters, on contract, billed for 4 hours, and the slogan still shows faintly through the new coat." },

    { depth: "core", about: "truth:one_board", source: "archive", bias: "redacted", reliable: "partial", who: "{investigator}, court auditor", points: "site:empty_boardroom", text: "Shareholder register of a great house, leaked to {investigator} in {year}: 'Majority holder of record: the Seventh Trust. See also: the Seventh Trust, majority holder of the Seventh Trust...' The chain runs for 31 pages and loops back to page 1. The trust's only registered address is the top floor of a tower at {lead}." },
    { depth: "core", about: "truth:one_board", source: "person", bias: "true", reliable: "partial", cost: true, who: "A retired general of house security", text: "A retired general of house security, talking to {investigator} in a bar at {place}, {year}: 'We fought them for six years and lost 2,000 men. Their commander and I had the same paymaster; I saw the cheques. My eldest, {person}, died in the fourth year, for a hill that belonged to the same people on both sides. The house sent me a fruit basket.'" },
    { depth: "core", about: "truth:one_board", source: "heretic", bias: "exaggerated", reliable: "partial", who: "Union pamphlet, gates of {place}", points: "heretic", text: "Union pamphlet handed out at the gates of {place}, {year}: 'There are forty houses and one hand in all forty gloves. Every war you die in is a puppet show. Every takeover is one man moving money from his left pocket to his right. Ask who owns the Seventh Trust.' Printed in 10,000 copies; 9,000 confiscated. The union cell now meets at {lead}." },
    { depth: "core", about: "truth:one_board", source: "ruin", bias: "true", reliable: true, plain: true, who: "{investigator}, court auditor", text: "Report of {investigator} on the sealed boardroom, {year}: 'The brass plate behind the chair reads: All voices to this room. One answer. Beside it is a switchboard of 40 lines, each labelled with a great house. Every house votes as this room tells it. The houses have one owner. Their wars with each other are staged.' The Court has not yet scheduled a hearing." },
    { depth: "core", about: "truth:one_board", source: "library", bias: "official", reliable: false, who: "{official}, vice-president for public affairs", text: "Statement of {official}, vice-president for public affairs, to the press of {realm}, {year}: 'The independence of the great houses is guaranteed by the Arbitration Court, whose 1,200 antitrust rulings are a matter of public record. Competition between the houses is fierce, healthy and real, as the casualty figures plainly show.'" },

    { depth: "core", about: "truth:world_asset", source: "archive", bias: "redacted", reliable: "partial", cost: true, who: "{person}, junior clerk of the Exchange", points: "site:charter_vault", text: "A charter page photographed in a hurry by {person}, a junior clerk of the Exchange, {year}: 'Lot 1. Land, water, atmosphere and improvements thereon. Term: [blacked out] years from settlement.' The print shows the edge of a door with 40 locks. A week later {person} was taken out of the river. The original page is still in {lead}." },
    { depth: "core", about: "truth:world_asset", source: "person", bias: "true", reliable: "partial", plain: true, who: "A lawyer of the Exchange", text: "Diary of a lawyer of the Exchange, {year}: 'I have done the arithmetic three times. The Charter is a lease. The world is Lot 1, and we are listed under fixtures and fittings. The term ends in 22 years, and the holder is a dead man. I am selling the house. The children are going to my sister's, wherever she ends up. Everyone in the firm is doing the same sums and not telling me.'" },
    { depth: "core", about: "truth:world_asset", source: "oral", bias: "garbled", reliable: "partial", who: "Unlisted children of {place}", text: "A counting rhyme of the unlisted children, heard by {investigator} in the margins at {place}, {year}, used to pick who is 'it': 'Fixtures and fittings, fixtures and fittings, when the lease runs out, who's left sitting?' The child left sitting must stand still while the others count to 22. None of the children could say why 22." },
    { depth: "core", about: "truth:world_asset", source: "temple", bias: "pious", reliable: "partial", who: "{believer}, chaplain of the Founder's Chapel", text: "Reading by {believer}, chaplain of the Founder's Chapel, at the quarterly service in {place}, {year}: 'All that we are is held in trust, and on the Day of Settlement every trust shall be returned to its Owner.' The congregation of 300 answered 'Amen'. The chaplain then read the quarter's figures and closed: 'Settlement draws nearer by four quarters every year.'" },
    { depth: "core", about: "truth:world_asset", source: "library", bias: "official", reliable: false, who: "{official}, for the Exchange", text: "Notice of the Exchange, signed by {official}, {year}: 'The Founding Charter is a ceremonial document of mutual respect between the 40 houses, without legal force. Rumours of an expiry are a known fraud. Employees who discuss the term of the Charter will have their own terms of employment reviewed.'" },

    { depth: "core", about: "truth:bought_collapse", source: "ruin", bias: "true", reliable: true, plain: true, who: "{investigator}, court auditor", points: "site:company_ghost_town", text: "Report of {investigator} on a sealed storehouse at {lead}, {year}: 'Sacks stencilled RESERVE GRAIN. NOT FOR RELEASE UNTIL TERMS SIGNED. I counted 6,000, dated the year of the great famine. The houses held this grain while the old nations starved, then sold it to them the week the nations signed. The famine was bought.'" },
    { depth: "core", about: "truth:bought_collapse", source: "archive", bias: "redacted", reliable: "partial", who: "{investigator}, court auditor", points: "cast:official", text: "Minutes of a house board, two generations old, found by {investigator}: 'Motion to acquire the national debt of {realm} at forty to the crown. Carried. Motion to delay grain shipments...' The rest is cut away with a blade. Among the 9 signatures is the grandparent of {official}, whose family papers are kept at {lead}." },
    { depth: "core", about: "truth:bought_collapse", source: "traveller", bias: "exaggerated", reliable: "partial", who: "An old smuggler at {place}", points: "site:capitol_museum", text: "An old smuggler at the ferry inn of {place}, {year}: 'Both armies in the last national war were paid in the same scrip. I know, because I carried it to both camps, 30 crates a month, in the same cart. The paymaster on both sides was a quiet man in a house coat. The war stopped the week the old assembly voted, at {lead}.'" },
    { depth: "core", about: "truth:bought_collapse", source: "library", bias: "propaganda", reliable: false, who: "Plaque at the People's Hall", text: "Bronze plaque at the People's Hall, unveiled by {official} in {year}: 'The old nations fell to their own corruption and debt. The houses, at great expense, stepped in to feed the starving and restore order. The famine relief cost the houses nine billion in scrip, since recovered in full.'" },
    { depth: "core", about: "truth:bought_collapse", source: "person", bias: "true", reliable: "partial", cost: true, who: "{survivor}, unlisted", text: "Letter of {survivor} to the Arbitration Court, {year}: 'In the famine year {person}, who raised me, sold our farm to the house for 3 sacks of grain. The sacks were stamped RESERVE. The farm is a house orchard now, and I am unlisted, because the farm's deed was my number. {person} died the next winter, still owing the house for the third sack.'" },

    { depth: "sub", about: "sub:scrip_crash", source: "person", bias: "true", reliable: true, who: "{person}, grocer of the Defaulted Ward", text: "Last page of the shop ledger of {person}, grocer in the Defaulted Ward of {place}, {year}: 'Bread: 4 scrip Monday. 40 scrip Thursday. Closed Friday.' Under it, in a clerk's hand: 'Premises bought back by the house at one tenth of value, Saturday. Former owner offered a position behind the counter.' The grocer took the position." },
    { depth: "sub", about: "sub:unlisted", source: "oral", bias: "true", reliable: "partial", who: "{survivor}, unlisted", text: "Said by {survivor} to {investigator} at a salvage fire in the unlisted margins, {year}: 'If you have no number, they cannot fire you, cannot bill you, cannot call you. They cannot hear you either. Two hundred of us live under this flyover, and on the house maps it is marked as empty ground.'" },
    { depth: "sub", about: "sub:founder_cult", source: "temple", bias: "pious", reliable: false, who: "{believer}, chaplain", text: "Daily devotion card of the Founder's Chapel, 5,000 printed for {year}, signed by {believer}: 'Our Founder never slept, never wasted and never doubted. Be as the Founder, and your quarter shall be blessed.' On the back: 'A candle before the Founder's portrait costs one scrip. Candles lit outside working hours are free.'" },
    { depth: "sub", about: "sub:deniable_war", source: "archive", bias: "official", reliable: false, who: "{official}, northern depot report", points: "archive", text: "Incident report of a great house's northern depot, {year}, signed by {official}: 'Fourteen staff lost to an unforeseen structural failure. No hostile action was involved.' Attached for the insurers are 31 photographs of the structure, which has bullet holes in it. The insurers' file is in {lead}." },
    { depth: "sub", about: "sub:dream_adverts", source: "person", bias: "exaggerated", reliable: "partial", who: "A clerk of {place}", points: "cast:official", text: "Complaint of a clerk to the Dream Standards office at {place}, {year}: 'I dreamed of my mother last night, who is 6 years dead. She was holding a tin of house soup, and she smiled, and she said the price. I want the advertisement removed. I also want to know how they had her voice.' Forwarded to the house's public affairs office at {lead}." },
    { depth: "sub", about: "sub:expiry_clause", source: "archive", bias: "true", reliable: "partial", who: "Port manifest, {place}", points: "site:charter_vault", text: "Shipping manifest from the port of {place}, {year}, passed to {investigator}: 'Passage off-world, one way, 14 berths. Passengers: 14 partners of the Exchange's law firms. Luggage: light. Property: sold.' The harbour clerk's note: 'Every one of them signed into the vault under the Exchange the month before. Ask the guards at {lead}.'" },
    { depth: "site", about: "site:ghost_company", source: "traveller", bias: "garbled", reliable: "partial", who: "{investigator}, court auditor", text: "A street rumour of {place}, noted by {investigator} in {year}: an office in {place} still takes job applications, and everyone who applies gets the job. The pay arrives every month for 40 years. Nobody who took the job has come home, and the families live quietly on the wages that keep arriving at the old addresses." },
    { depth: "site", about: "site:capitol_museum", source: "library", bias: "propaganda", reliable: false, who: "Guidebook to the People's Hall", text: "Guidebook to the People's Hall, {year}, page 6, price 2 scrip: 'Here our ancestors voted on everything, endlessly, which is why nothing was ever done. Children may sit on the benches and practise a vote. Results are not kept.' The guidebook is published by the house that owns the hall." },
  ],
};
