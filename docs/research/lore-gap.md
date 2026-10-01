# The lore gap: Worlds Infinite against Stellaris and Destiny

A frank comparison of how Worlds Infinite writes, structures and shows its premise lore, against the two
games the owner keeps pointing to. It builds on the two research notes in this folder
(`lore-stellaris.md`, `lore-destiny.md`) and on a close read of the current system:
`docs/world-premises.md`, `docs/style.md`, `src/content/premises/FORMAT.md`, six premise files
(`power/balanced_circle`, `power/underchord`, `world/sleeper`, `world/hush_below`,
`scifi/forgotten_landing`, `scifi/chrome_fever`), `src/gen/premise.js` (genLore),
`src/sim/lore.js`, `src/sim/storylines.js`, `src/app/journal.js`, and the storyline, news and
ticker code in `src/app/main.js`.

The owner's latest feedback was that our writing is too cryptic and mystical, and that they want
grounded, easy-to-follow text with real content and stakes. This document says where that feeling
comes from and what would fix it.

---

## 0. The short answer

**The sentences are no longer the main problem. The format is.** The style pass has worked. Many
fragments are now concrete and good: the dock foreman who "had the keyring" and turned 200 arms
back on, the payroll with "the same seven names" forty years apart, the guild minutes ending
"Motion to tell the town: defeated." A Stellaris writer would keep those.

The text still *reads* cryptic for five reasons the style rules do not reach:

1. **Every piece is a one-line quote with no frame.** The average fragment is 26 words. A
   Stellaris anomaly is 60-120 words, and a Destiny lore page is a few hundred. At 26 words there
   is only room for the punchline, so the setup (who, where, when, what happened before) is cut. A
   punchline without a setup reads as an aphorism, however plain its words are.
2. **Nobody is anyone.** Fragments are signed with a role ("A hunter's journal", "A scholar's last
   letter"). Only 9 of 1,751 use a generated `{person}`, and none of the writers come back. The
   "person" holders get a random name and a random role from a fixed list (`ROLES` in
   `gen/premise.js`), so "A dying wright's confession, taken down by a priest" can be held by
   "Tavo, a ferryman of Ostrel". Readers follow people. We give them none to follow.
3. **No numbers, few dates, few places.** 19 of 1,751 fragments contain a numeral. 31 use
   `{year}`, 87 use `{place}`. Stellaris makes the past feel real with "12 million years", "86%",
   "in the seventeenth year". We mostly say "old", "deep" and "for a thousand years".
4. **Pieces do not lead anywhere.** A fragment never says "the requisition was filed in the
   archives of X". Site layers unlock by counting fragments ("two things you have read"), not by
   following a clue. The journal's leads are vague ("People say the inn of X know more than they
   let on"). Stellaris keeps the mystery in the *results* and makes the *instructions* plain. We do
   the reverse: the instructions are vague, and the results are a short line.
5. **Nothing visibly happens when you find something.** Reading a place drops its texts into a
   list. There is no find moment, no "this adds evidence to X", no map pin with a reason, no
   consequence in the simulation. Stellaris pays something on every beat. Destiny shows a book
   with 13 slots and 4 filled.

The mystical tone that is left sits in a few places we can name and cut: 61 grandmother or
grandfather sayings, 220 fragments tagged `garbled`, a hymn or chant as the "temple" voice, and
cosmic truths with no human cost attached.

---

## Part A. Writing

### A.1 Voice

| | Stellaris | Destiny | Worlds Infinite now |
|---|---|---|---|
| Default narrator | The empire's own scientists, in a calm report voice | A named person writing to someone for a reason | An unnamed role, quoted mid-sentence |
| Frame | Who found it, where, how they know | Who writes, to whom, why now | Usually only the document type ("A royal requisition, half-burned") |
| Length of one unit | 60-120 words per event or chapter | A page of a few hundred words, in a book of 10-25 pages | 26 words on average, 49 at most |
| Poetic voice | Rare; mostly in option text and nature writing | Kept for gods, dragons and scripture, always framed | Concentrated in oral and temple fragments, often unframed |

What we do well: our document *types* already vary like Destiny's (ledger, warrant, minutes,
graffiti, sermon, black-box recording, ordination rite). The bias labels (`official`, `redacted`,
`propaganda`) are a real strength; neither game shows source trust this clearly.

What we lack: the frame. A Stellaris event tells you who is speaking before the strange part. A
Destiny page tells you who is writing to whom. Ours start at the strange part.

### A.2 Specificity

The Stellaris pattern is one big fact (a scale, a date, a count) plus one small object (a doll, a
photograph, a potted plant). Our best fragments have the object (the christening ring on the thing
the hunter killed; the cell wall count of three hundred), but few have the number, and almost none
tie the object to a place on the map and a date in the world's calendar. The generator knows all
of these. The content just does not ask for them.

### A.3 Stakes

Our storyline endings have real stakes (`abandon_town`, `revolt`, `pop: 0.85`), and they are the
strongest writing we have. The fragments and site layers mostly do not. A truth like "the song is
ending" or "the world is the ship" is stated as a fact about the cosmos, with no person who loses
anything. Destiny's lesson is that the truth should hurt a particular person. Stellaris's is that a
reveal is a moral story: what people believed, what they did, what it cost, and a last sentence
with a sting.

Several of our truths are good moral stories already: Chrome Fever's "the cure is the illness"
(the same house brews the draught, sells the implants and runs the clinics), and the Balanced
Circle's "the catalyst is made of souls". The weakest are the purely cosmic ones (`vessel_world`,
`world_dream`, `we_are_notes`, `song_ending`). They need a cause that people are responsible for,
and a cost someone is paying now.

### A.4 Character

Neither game is a bag of quotes. Stellaris's chains name the scientist who keeps going back
(Horizon Signal names the same three scientists, again and again). Destiny is built on recurring
people: a gunslinger, a warlock commentator, a gunsmith's family. Worlds Infinite has:

- storyline people (`{person}`, `{person2}`), who are new for each storyline and never appear in
  the lore;
- fragment writers, who are roles without names;
- holder people, whose names and roles are random and do not match what they hold.

So a player never thinks "what will the surveyor find next?" There is no surveyor.

### A.5 Humour

We have some dry institutional humour, and it is the right kind: "Motion to tell the town:
defeated", the Wakeful being "very rarely mad", the college cellars "used for storage and for
punishing first-year students". Stellaris puts this in guild disclaimers, merchants' newsletters
and bored officials. Destiny puts it in a bored Hunter's search log. We should do this on purpose:
one or two light pieces per premise, and always in an institutional voice, never inside a horror
piece.

### A.6 How revelations land

| | Stellaris | Destiny | Worlds Infinite now |
|---|---|---|---|
| Where the truth is stated | A sober history paragraph at the end of a chain, with a cause and a sting | One plain-statement page in a book ("We aren't native to..."); the doubt is whether to trust the speaker | The `revelation` layer (about 17 words) and the truth's `d` text, shown in the journal once 4 accounts agree |
| Can the player guess first? | Yes. Every site in a chain shows the same pattern (every Vultaum site ends in a blast from inside) | Yes. Several voices describe the same event | Partly. Fragments are scattered at random, so the pattern only shows if you happen to read the right ones |
| What changes after | A reward, a new place, sometimes your species | The next book reframes the old one | The theory card turns green |

Our revelations are short, correct and flat. They state the fact ("The catalyst is made of
people.") but do not tell it as history, and nothing happens when it lands.

### A.7 Side by side: six current texts and how they would read

Each rewrite keeps our setting and slots, follows `docs/style.md` (no gendered pronouns on
`{person}`, poetry only when it is in-world and labelled) and is original. The aim is to show the
*manner*, not to fix these six lines.

---

**1. A village saying (Hush Below, `lore`, oral, garbled)**

> Now: "Under the water there is more water, and under the quiet there is more quiet. Don't listen
> too hard, or something will listen back."

No speaker, no place, no fact, and "something" as the subject, which `style.md` already bans.

> **Destiny manner** (a person, to someone, for a reason):
> A well-digger of {place}, to an apprentice, {year}: "Past sixty feet the bucket comes up empty
> and cold as a cellar. {person} lay at the shaft mouth one night to listen. By morning the old
> fool was chatting to a brother eleven years drowned. We capped it and weighted the lid. Nobody
> puts an ear to a well in this valley. That's the whole of the trade."

What changed: a speaker with a job, a listener, a number, a named victim, a consequence and a
rule. The mystery (what is down there) is untouched, but the reader knows exactly what happened.

---

**2. A temple hymn (Balanced Circle, `truth:stolen_flow`, temple, pious)**

> Now: "The old hymn says the world sleeps on a sleeping god, and that the wise do not wake their
> beds."

> **Stellaris manner** (a report, with numbers, the hymn kept as context and a wry last line):
> Temple register of {place}, {year}, in the sacristan's hand: "Third year running the harvest rite
> has failed. All five wrights who drew the field circle fell sick by noon. In the morning the chalk
> lines were smudged inward, toward the centre, as if pulled. At the rite we sing the old line about
> the land lying on a sleeper, and the wise not waking their beds. I always took it to be about
> thrift."

What changed: the hymn is still there, but now it is evidence inside a clear account, and the
irony is in the sacristan's understatement, not in the hymn.

---

**3. A sleep-talker's transcript (Sleeper, `truth:world_dream`, person, garbled)**

> Now: "Taken down from a sleeper in the Vale, who spoke for an hour in her sleep: 'the walls are
> thin the walls are its eyelids when they lift there will be no walls'"

> **Stellaris manner, with institutional humour:**
> Case notes of {person}, physician to the long ward at {place}, day 40: "212 sleepers, none awake
> since spring. At the second bell all of them spoke at once for an hour, the same words in every
> bed: 'the walls are thin; the walls are its eyelids.' Afterwards the three empty beds at the far
> end had sunk a hand's width into the floor. I measured twice. I have asked the council for more
> beds, and for a second physician who sleeps badly."

What changed: the mad line stays, framed by a sane observer who counts and measures. The stake is
physical (the floor moved). The dry last sentence is the Stellaris register.

---

**4. A truth and its revelation (Underchord, `song_ending`)**

> Now (truth): "The first singers have fallen silent one by one. Each time one stopped, something
> vanished from the world: a species, a colour, a wind. When the last one stops, the world will
> end."
> Now (Humming Cave, revelation): "This is one of the first voices, still singing. It is slowly
> running down."

A cosmic fact with nobody responsible and nothing anyone can do.

> **Stellaris manner** (plain history with cause, cost and a sting):
> The choirmasters' marks in the Humming Cave go back 1,140 years, one per generation. Side by
> side, they show the note falling a little each century, and three times faster since the great
> choirs were founded. Every hymn a choir sings borrows from notes like this one. The old hymnals
> list twelve such caves. Nine are silent now, and the beasts, winds and dyes listed beside them in
> the bestiaries are gone. The choirs of {realm} sing four services a day, and they are recruiting.

What changed: the truth now has a cause people own (the choirs speed it up), a count the reader
can check against the world (nine of twelve), and a sting. It is still a world-ending truth, but
it is a political one: someone could stop singing. (This adds a cause the current truth does not
state. That is the point: Stellaris truths are about what people did.)

---

**5. A site's four layers (Balanced Circle, the Dead Valley)**

> Now: *surface* "Wrights fall ill here; their circles stay chalk." / *study* "The earth-current
> here runs backwards, down into the ground." / *dig* "A shaft far deeper than any mine. Warm air
> pushes up out of it, then is drawn back down, every few minutes." / *revelation* "The power does
> not come from the earth. It is drawn from a living thing far below, and that thing is waking up."

Each layer is fine, but they are captions, not chapters. Nothing points anywhere, and the
revelation arrives with no evidence behind "waking up".

> **Stellaris archaeology manner** (titled chapters, one fact and one find each, a pointer, a reward):
>
> *I. Sick wrights.* Five licensed wrights of {realm} have entered the valley since {year}. All five
> came out within a day with nosebleeds and fever, and none of their circles did anything. The
> shepherds graze it happily and think wrights are soft.
>
> *II. The needle survey.* A survey party hung a current-needle on a thread at every mile. Everywhere
> else in {realm} the needle points up. Here all fourteen pointed down, toward a sinkhole at the
> head of the valley. The report asks for miners.
>
> *III. The shaft.* Under the sinkhole is a shaft cut with tools, deeper than nine hundred feet of
> rope. Warm air flows out of it for four minutes, then in for four. The miners kept a tally for a
> week. On the wall beside theirs is an older tally in Academy chalk. **Lead:** the Academy's sealed
> flow ledger, in the archives of {capital}.
>
> *IV. What the wrights draw on.* The current is not heat from the earth. It is drawn from a living
> animal far beneath the valley, and every circle in {realm} pulls a little from it. The flow ledger
> records the shaft's rhythm for 300 years. It has quickened by a third since the crown put a wright
> in every regiment. **Adds:** the theory "The flow is not ours" is confirmed.

What changed: every chapter answers one small question and opens the next; the evidence for
"waking" is a number the player saw build up; the third chapter sends the player to a named
archive; the last one says what it unlocked.

---

**6. A storyline stage (Underchord, "The Quiet of {place}", start)**

> Now: h "Sound stops in {place}" / b "On a market morning in {place}, every sound stopped: bells,
> voices, the river. People shout and hear nothing; children cry without a sound."

Vivid, but no size, no cost, no one in charge, no sense of what could happen next.

> **Stellaris Situation manner:**
> h: "Silence falls on the market of {place}"
> b: "At the third bell on market day, sound stopped across four streets of {place} and the river
> bridge. Inside the line, people shout and hear nothing. Traders have fled with half their stock,
> and the miller cannot hear the stones crack. The edge has moved forty paces since morning.
> Magistrate {person} has sent to {capital} for a choir."
> Shown under it: *Stage 1 of 3 · spreading · Next in 1-3 months: a choir comes, or the town is
> given up. A learned or pious realm is likelier to send singers.*

What changed: size, cost to ordinary trade, a measured spread (the stakes rising), a named person
acting, and the lever and deadline made visible, all from data the engine already has.

---

### A.8 Writing rules this adds to `docs/style.md`

`style.md` already covers plain sentences, no poetry by default and stating truths directly. It
does not yet cover:

1. **Frame first.** Every fragment opens with who wrote or said it, in what role, and when or
   where ("Case notes of {person}, physician at {place}, {year}:"). Then the content.
2. **Length 40-90 words** for fragments, 30-60 words per site chapter. Short is fine for graffiti
   and sayings, but those should be at most 3 per premise.
3. **One number and one object** in every report-type fragment.
4. **Each truth gets one plain-statement fragment** from a credible witness, and one fragment where
   a named person pays the cost.
5. **Revelations as history:** what they believed, what they did, what it cost, and a last line
   with a sting. Name who is responsible.
6. **Pointers:** at least a third of fragments name another place, record or person to look for.
7. **Cap the folk voice:** at most one grandmother or grandfather saying per premise (there are 61
   now), and every saying gets a line of context (who says it, where, when).
8. **Gloss coined words** (the Hush, the counter-theme, the earth-current, the Watch) in plain words
   in the fragments most likely to be found first, meaning `lore` depth and library sources.

---

## Part B. Structure

### B.1 Chain shapes

| Shape | Stellaris / Destiny | Worlds Infinite now | Gap |
|---|---|---|---|
| Single find | Anomaly: title, teaser, 60-120 word result, reward | Each fragment, about 26 words, no reward | Too short, no reward |
| Layered site | Dig site: 3-6 titled chapters, dice rolls, reward and pointer at the end | 4 untitled layers of about 17 words, unlocked by fragment counts | No titles, no pointers, generic unlock rules |
| Scatter, then converge | Precursor hunt: 6-8 place-type finds with a shared pattern, a counter, then the homeworld | Fragments scattered at random by source type; a truth confirmed by a count of 4 | No shared visible pattern, no counter, no convergence site |
| Linear trail | Each site's record gives the next site's location | None | Missing |
| Escalating chain | Horizon Signal: a motif repeated three times, stronger each time, refusable | Storylines are 3-7 stages, but rarely repeat a motif | Rule of three missing |
| Crisis | Ghost signal, symptoms with numbers, partial explanation, arrival, hunt, end | Some world storylines (`fl_falling_star`) have this shape | Partly there |
| Book | Destiny: one narrator, 10-25 titled pages, locked slots visible | None | Missing |

Our data model already has most of the parts. What it lacks is **links between pieces**: a fragment
pointing to a site, a site chapter pointing to an archive, a set of pages that belong together, a
person who wrote several of them.

### B.2 Lore-book collections

Destiny's books do three things our flat bag of fragments cannot:

- **They give the reader a shape**: "The Liar, 4 of 13". Knowing how much is missing is a reason to
  keep going.
- **They let one voice build up a story**: a beginning, a turn and an end, told by someone the
  reader comes to know.
- **Page titles promise what is coming** ("The Mistake").

For us, each premise would add one or two books: a single narrator (a surveyor, a physician, an
excommunicated wright, a pilots' guild clerk), 5-9 pages of 60-120 words each, with page titles, and
pages scattered along a route (the narrator's home town, the archive that seized the papers, the
site itself). The narrator's truth can be the world's real one, or a wrong theory, written by
someone sincere.

### B.3 Many voices on one event

Today our "multi-voice" design works on the *truth*: each truth has an official denial, a heretic
claim, a true witness and garbled folk memory. That is a good skeleton, but it is abstract. The
voices argue about a cosmic fact, not about something that happened on a date at a place.

Destiny's strongest lore is several accounts of **one event**. Our history simulation produces
events all the time (battles, plagues, revolts, deaths of rulers, town abandonments) and never
writes documents about them. For example, take a battle at {place} in a Hush Below world where the
`passions` truth is true:

- *The official chronicle:* "{realm} won the field at {place}; 3,000 enemy dead. The victory is
  credited to {ruler}'s command."
- *A soldier's letter home:* "Nobody could stop. The captain ordered the halt three times. We kept
  killing after the trumpets, and none of us can say why."
- *A deep-pilot's log, the same night:* "Storm in the Hush, worst in a decade. It began at the hour
  of the battle at {place}. That is the fourth time this year."

Three clear voices; the contradiction is the puzzle. None of them is cryptic.

### B.4 Signposting

Stellaris's rule is that **the mystery is in the results, never in the instructions**. Ours:

- The mystery card is headed "Something is not as it seems" until four pieces are found. That is
  the most cryptic line in the UI, and the first one a player meets.
- Site study failures read "You need two things you have read about this world's mysteries first."
- Leads for non-public places read "People say the inn of X know more than they let on."

These should be plain imperatives with a place and a reason: "Read the guild minutes in the
library of {place}: the miners' tally mentions them." See C.2.

### B.5 Rewards

Worlds Infinite's viewer does not run a realm, so the Stellaris reward (minerals, research) has no
direct equivalent. Three kinds of reward do fit:

1. **Knowledge with a visible effect:** a theory gains evidence, a site appears on the map, a layer
   opens, a book page fills, a person's file grows. Each read should say which of these it did.
2. **Map change:** a zone appears, a site gets its real name, a lead pin goes up.
3. **Consequences in the simulation:** knowledge should matter to the realms too. A realm whose
   library holds the true account could gain a `knows:<truth>` tag, which storylines and history
   rules then read. A crown that knows what the stone is made of can ban it or use it. That is the
   Fallen Empire lesson from the Stellaris notes: lore becomes stakes when someone acts on it.

### B.6 What the simulation adds today

`sim/lore.js` does three things: scholars copy existing fragments into libraries (news: "A scholar
of X copies a strange text... Few read it; fewer believe it.", the same text every time), diggers
publish a site's `dig` layer and sometimes its `revelation`, and zealous realms burn presses. All
three are good ideas. None of them writes new content: they move existing text around. The
storylines (170 premise storylines, about 25 words per stage) are our best "living" content, but
they never write into the journal, never open a site, and never mention a fragment or a truth by
name.

---

## Part C. Delivery and UX

### C.1 The journal (`src/app/journal.js`)

| Tab | Now | What the games suggest |
|---|---|---|
| Mysteries | One card per premise: a count, the power as taught, theories with "N for, M denying", up to 3 leads | A **Situation log**: a plain paragraph of *current knowledge* that is rewritten at each stage, a counter ("3 of 5 sites of the circle found"), leads written as tasks with map links |
| Texts found | A flat list of every fragment, in the order found | Group by **book**, **person**, **truth** and **place**; show the frame (who, when) as a heading; mark what each one added |
| Places | Sites with their open layers and "Go there" | Keep it, with chapter titles and the next step stated plainly |
| Talk of the world | Subthemes per realm | Fine; give each 2-3 voices instead of the description repeated |
| (missing) Books | | Locked page slots, page titles, narrator |
| (missing) People | | Every recurring writer or witness, their home town, what they wrote, whether they are alive in the history |
| (missing) Timeline | | Dated lore milestones: "{year}: diggers opened the Undercroft of X", "{year}: the bronze box of X spoke", mixed with the premise storylines |

### C.2 The province card and the find moment

Reading a holder in the province card (`loreSection`) expands the texts inline. That is quick, but
it has no moment. Stellaris makes every find a small event: a title, the text, and a footer naming
the reward. We should open a card when a holder is read or a site layer opens:

- a title (the document's frame: "The sacristan's register, {place}, {year}");
- the text;
- a footer: "Adds evidence to: *The flow is not ours* (3 for, 1 against) · Marks on your map: the
  Dead Valley · New lead: the Academy flow ledger, archives of {capital}."

The site study failure text should name the missing piece: "The diggers' report on this valley is
in the library of {place}."

### C.3 Storylines and news (`src/app/main.js`)

- **Storylines page** (`storylinesPage`): a good timeline of stages already entered. It lacks what
  Stellaris Situations show: which stage this is out of how many, what could come next and which way
  the world is leaning ("Pious rulers tend to seal it"), roughly when ("next in 1-3 years"), and
  which mystery it belongs to. The engine has all of this (`nextAt`, `next` with `mods`,
  `liveTags`).
- **News** (`newsPage`): premise storyline stages, excavations and revelations show up as news
  items, alongside wars and markets. They can be filtered under "The world", but there is no filter
  for "the mystery", and an item links only to a province, not to the story or to the journal.
- **Ticker** (`showTicker`): shows the latest important headline for 7 seconds. Clicking it opens
  the whole news page, not the item. A revelation or a storyline ending should open its own card.
- **Lore news text** is templated and repeats (the scholar line above; "In the taverns of X, nobody
  talks about anything else").

### C.4 The map

Sites appear once seen; zones and the wall are drawn. Missing: **lead pins** (where the journal
says to go next), **site state** (unknown, seen, studied, solved), and **zones that change** as
storylines run (the silence that "grows a street a month", the hedge-line of the Wrong Lands, the
Hollow Parishes). Destiny's Dreaming City lesson is that a truth shown on the map lands far harder
than one stated in a text.

### C.5 Lore on things people already click

Techs, units, beings, faiths and governments from premises each have a one-line `d`. Destiny's item
lore tabs and Stellaris's tech flavour show that these are the most-read lore in any game, because
players look at them anyway. A one-line attributed quote on each ("Glass eyes in a dozen colours,
and every one of them reports home." — a Plated Quarter cutter) would put the premise into parts of
the UI people already use.

### C.6 Small bugs worth fixing on the way

- `holderIn("person")` names a random person with a random role from `ROLES`, unrelated to the
  fragment it holds. The holder should be the fragment's author or the person it was given to.
- Generated rumours (`gen/premise.js`, the `rumour()` calls) paste a subtheme's description
  verbatim, twice per theme, in two templates. They read as filler.
- The `lead` flag (a wrong theory's evidence) is shown only in god view. A player has no way to tell
  that a source belongs to a school of thought. Destiny solves this by naming the believer.

---

## Prioritised plan

Ordered by how much of the gap each closes for the effort. "Content" means agents can write it in
the premise files under the existing format; "engine" and "UI" need code.

**1. A new fragment template, and a lint that enforces it.** *Content rules plus a small tool. Effort: S.*
Add the rules in A.8 to `docs/style.md` (frame first, 40-90 words, one number and one object, a
plain-statement fragment per truth, a named cost, a third with pointers, at most one folk saying per
premise, gloss coined words). Add optional fragment fields `who` (author and role), `to`, `when` and
`points` to `src/content/premises/FORMAT.md`. Write `scripts/lint-lore.mjs` to report, for each
premise: average length, fragments with no number, uses of grandmother/grandfather, "something" as
subject, unglossed coined terms, and missing plain-statement or cost fragments. This turns the
owner's complaint into something that can be checked.

**2. Rewrite fragments, site layers and truths to the template.** *Content. Effort: L (73 premises),
in batches.*
Start with the ten premises most often rolled in the default fantasy preset. For each premise:
expand core and site fragments to framed documents; rewrite site layers as titled chapters (one
fact and one find each, the third naming a lead, as in example 5); rewrite each truth's `d` as cause,
cost and sting (example 4); cut grandmother sayings to one; add one or two dry institutional pieces.
Files: `src/content/premises/*/*.js`. Keep ids, `about`, `reliable` and storyline structure as they
are.

**3. Authors who match their texts, and a recurring cast.** *Engine M, content M.*
Add a `cast` field per premise: 3-4 recurring roles (the investigator, the official, the believer,
the survivor), each with a role, a home kind of place and a stance. In `genLore`
(`src/gen/premise.js`), bind each role to a generated name and town, and make `holderIn("person")`
use the fragment's `who` or a cast member instead of `ROLES`. Add `{cast:<role>}` slots to `fill`
(`src/core/text.js`) and let premise storylines pick `person` from the cast (`slotsFor` in
`src/sim/storylines.js`). Add a People tab in `journal.js`. This is the change that lets players
follow people.

**4. Concrete leads and pointer-based unlocks.** *Engine M, content S.*
Resolve each fragment's and site chapter's `points` (for example `site:flowless_valley`,
`source:archive@capital`, `cast:investigator`) to an actual holder or site in `genLore`, and make sure
that holder exists. In `journal.js`: rewrite `siteNeeds` so the next layer opens when its specific
clue has been read (with the old count as a fallback), rewrite `hintFor` and the Leads list as plain
tasks naming the place and the reason, and replace "Something is not as it seems" with a plain
first observation. Add lead pins on the map (`src/app/render.js`, or the overlay used for sites).

**5. The find card: show what each read gives.** *UI M.*
Make `readHolder` and `studySite` return what changed (theory evidence, sites now seen, layers
opened, new leads, book pages filled). In `main.js`'s inspector click handler, open a card with the
document's frame as its title, the text, and a footer listing those changes, styled like a Stellaris
event. Also mark each fragment in the Texts tab with what it added.

**6. The mystery as a Situation log.** *Content M, UI S.*
Add a `known` field to each truth: 3-4 plain paragraphs of "current knowledge", from first
suspicion to confirmed (Stellaris situation log text), plus a convergence counter over the truth's
linked sites. In `mysteryCard` (`journal.js`), show the paragraph that matches how much has been
found, the counter, and the leads as tasks. That gives the player a clear summary of where things
stand, rewritten as they learn more.

**7. Storylines that write lore and change the map.** *Engine M, content M.*
Add an optional stage field `doc: { who, text }` (a letter, report or warrant written at that moment)
and new effects `site` (mark a premise site as seen or dug) and `zone` (grow a premise zone) to
`src/sim/storylines.js` (`enter`, `applyFx`). Write the doc into a holder in the anchor town through
`src/sim/lore.js`, so it appears in the journal. Give a realm that ends up holding true accounts a
`knows:<truth>` tag in `liveTags`, so storylines and history can act on what realms know. Content:
add `doc` to the key stage and the ending of each premise storyline, and use the rule of three
(a motif that comes back three times, stronger each time) when writing new ones.

**8. Lore books.** *Content L, engine M.*
Add a `books` field to `FORMAT.md`: `{ id, n, narrator (a cast role), truth or theory, pages: [{ n,
text, where }] }`, with 5-9 pages per book and 1-2 books per premise. In `genLore`, scatter the pages
along a route (narrator's home, the archive that seized the papers, the site). Add a Books tab to the
journal with titled, locked page slots and "4 of 9". Do this after items 3 and 4, because books need
the cast and the pointers.

**9. Several accounts of real events.** *Engine M, content M.*
In `src/sim/lore.js`, react to the big history events the simulation already reports (battles,
plagues, revolts, a ruler's death, a town abandoned) by writing 2-3 short accounts from different
voices into holders near the event: the official chronicle, a witness's letter, and, where a premise
truth applies, a premise-specific voice (the pilots' log in B.3). Add an optional `accounts` field to
premises (`{ battle: [...], plague: [...] }`, templates with slots) and generic ones in
`src/content/lore.js`. This puts the premise inside the history the player is already watching.

**10. Storylines shown as Situations, with links.** *UI S-M.*
In `storylinesPage` (`main.js`): show the stage number and the expected length, the possible next
steps with a plain note on what the world currently favours (from `next[].mods` and `liveTags`), a
rough "next in N-M months" from `nextAt` and `wait`, and a link to the premise's mystery card. Make
ticker clicks open the item's own story or journal entry rather than the news page, and add a "The
mystery" filter to `newsPage`.

**11. Replace templated filler with written variety.** *Content S-M, engine S.*
Give each subtheme 2-3 `talk` lines in different voices (a merchant, a priest, a soldier), and use
them in `genLore`'s `rumour()` instead of pasting the subtheme's description. Replace the fixed
treatise, excavation and revelation news in `src/sim/lore.js` with small pools that name the scholar,
the site and what was found.

**12. Attributed flavour on techs, units, beings and faiths.** *Content M, UI S.*
Add an optional `q: { text, who }` to premise techs, units, beings and faiths, and show it in the
places those already appear (the codex and the science page: `src/app/codex.js`,
`src/app/science.js`). This is cheap, the most-read lore in both games, and it carries the premise
into the parts of the app people look at without opening the journal.

### Suggested order

Items 1 and 2 answer the owner's complaint directly and can start at once, since they are content
plus a lint. Items 3, 4 and 5 are the engine work that makes the new writing pay off (people to
follow, clues that lead somewhere, a find moment). Item 6 is a quick win once 4 is in. Items 7-9 are
the larger structural steps toward the Stellaris and Destiny feel. Items 10-12 are polish that can be
done in parallel at any point.
