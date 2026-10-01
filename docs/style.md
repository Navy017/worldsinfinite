# Writing style for Worlds Infinite text

Everything a player reads (storylines, news, lore fragments, site layers, truths, subthemes, codex
sections) follows these rules. The aim: a reader skimming one line understands **who did what, where,
and what it costs**. Mystery comes from what is *unknown*, not from vague wording.

## Rules

1. **Say what happened, plainly.** Subject, verb, object. Concrete nouns: people, places, objects, numbers.
   Prefer "Forty miners died when the shaft flooded" to "The deep drank its due."
2. **Ground it in ordinary life.** Who is affected, and how: money, food, jobs, family, safety, law.
   Strange things are reported the way a clerk, a soldier or a farmer would report them: matter-of-fact.
3. **Stakes in the sentence.** What will be lost or won? Who wants what? Name the cost.
4. **One idea per sentence; short sentences.** Aim for 8-20 words. No stacked metaphors.
5. **No poetry by default.** Avoid: "older than the stars", "breathing slowly", "angles that look wrong",
   "the wind of its breathing", rhetorical questions, ominous fragments, "something" as the subject.
   Use a vivid concrete detail instead of an atmospheric phrase.
   **Exception:** text that is *in-world* poetry or ritual (a hymn, a prayer, a prophecy, a children's rhyme,
   a madman's scrawl) may be poetic, and should then be labelled as such ("The old hymn says: ...").
6. **Lore fragments are documents.** Write them as the real thing: a ledger entry, a court record, a
   letter, a sermon, a sailor's story, a primer. Keep the voice of the source, but make the content
   clear: a reader should understand what the writer believed, even if the writer is wrong or lying.
   Partial knowledge = the writer doesn't know everything, *not* the sentence is vague.
7. **Truths and revelations state the fact directly.** "The catalyst is made from the lives of
   prisoners; each stone costs about three hundred." Not "The catalyst is a crowd."
8. **Explain premise terms on first use** in subthemes and storylines ("the wardens, who guard the ash-wall").
9. **People:** never pair `{person}`/`{person2}` with he/she/him/her/his/hers (names are random, so gender is
   unknown). Repeat the name, use their role ("the physician"), or rephrase. "They" is fine.
10. **Keep the facts.** Do not change what happens, who, the outcome, slots, fx, ids or structure.
    Only rewrite the words.

## Before and after

- Before: "The spire is the topmost point of something that is still under the sea floor, and it is breathing in time with the tides."
  After: "The spire is the tip of a structure buried under the sea floor. Its doors open and close with the tides, and the air inside is warm."
- Before: "It is not evil. That is the worst of it. We are dust on the sill of a window it has never looked out of."
  After: "A scholar's last letter: 'It is not angry with us. It does not know we exist. Each time it shifts in its sleep, a coast sinks, and that is all.'"
- Before: "The stone is not a stone. It is a crowd."
  After: "The stone is made from people. Three hundred prisoners went into the workshop; one red stone came out."
- Before: "It breathes slower each year. When it stops, so will every circle in the world."
  After: "Carved in an old mine: 'The current is weaker every year. When it runs out, no circle anywhere will work.'"
- Fine as is (concrete, clear stakes): "Four of ninety come home. The ship came back with four survivors and a sealed chest. The ship's surgeon will not speak of the far shore."

## Lore fragments and sites: the Stellaris / Destiny manner

Research behind this: `docs/research/lore-stellaris.md`, `lore-destiny.md`, `lore-gap.md`.
Stellaris text reads like a plain report from competent people slightly out of their depth. Destiny's
best pages are a named person telling someone something for a reason. Both keep the *words* clear and
put the mystery in the *gaps between documents*.

11. **Frame first.** Every fragment opens with who wrote or said it, in what role, and when or where:
    "Case notes of {investigator}, physician at {place}, {year}:" — then the content. Set `who` too.
12. **Length.** Fragments 40-90 words; site chapters 30-60 words. Graffiti, inscriptions and sayings may
    be short, but at most 3 per premise.
13. **One number and one object** in every report-type fragment: a count, a date, a distance, a price;
    a doll, a ledger, a ring, a chalk mark. Numbers and objects make the past real.
14. **Each truth gets one `plain: true` fragment** that states it outright from a credible witness (the
    puzzle is whether to trust them, not what the words mean), and one `cost: true` fragment in which a
    named person pays for it (loses a child, a hand, a town, a name).
15. **Revelations are history:** what they believed, what they did, what it cost, and a last line with a
    sting. Name who is responsible. A child should be able to retell it in three sentences.
16. **Pointers.** At least a third of fragments name a next place, record or person, using `points` and
    the `{lead}` slot: "...the requisition was filed in {lead}." The instructions are plain; the mystery
    is in the findings.
17. **Folk voice capped:** at most one grandmother/grandfather saying per premise, always with context
    (who says it, where, when).
18. **Gloss coined words** in plain words the first time a reader is likely to meet them (lore-depth and
    library fragments).
19. **People recur.** Each premise has a small cast (investigator, official, believer, survivor). Use their
    slots so the same people write across the world and turn up in storylines. Readers follow people.
20. **One tone per text, many per world.** Dread, wonder and dry humour live in separate texts. Put humour
    in institutions: guild minutes, disclaimers, a clerk's complaint.

Example, a site written as four chapters (Stellaris archaeology manner):
- I. *Sick wrights.* Five licensed wrights have entered the valley since {year}. All five came out within a day with nosebleeds and fever, and none of their circles did anything. The shepherds graze it happily and think wrights are soft.
- II. *The needle survey.* A survey party hung a current-needle on a thread at every mile. Everywhere else the needle points up. Here all fourteen pointed down, toward a sinkhole at the head of the valley. The report asks for miners.
- III. *The shaft.* Under the sinkhole is a shaft deeper than nine hundred feet of rope. Warm air flows out for four minutes, then in for four. On the wall beside the miners' tally is an older tally in Academy chalk. The Academy's flow ledger is kept in {lead}.
- IV. *What the wrights draw on.* The current is drawn from a living animal far beneath the valley, and every circle pulls a little from it. The flow ledger records its rhythm for 300 years. It has quickened by a third since the crown put a wright in every regiment.
