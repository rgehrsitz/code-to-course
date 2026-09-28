# Content Philosophy

> **When to read this:** Phase 2.5 (module briefs) and Phase 3 (writing modules). These principles apply to every mode; the audience file for the chosen mode adjusts tone, tooltip density and quiz style.

## Accuracy Is the Product

The course's advantage over hand-written docs is that it is derived from the source. Protect that.
- **Exact strings.** Menu labels, button text, setting names, shortcuts, error messages, API signatures and option names are copied verbatim from the code. If you can't find the exact label, describe the control instead of inventing a name.
- **Real code only.** Code snippets are exact copies from the repository (internals: source files; library: examples, tests, README). Never trim, simplify or "clean up" a snippet — *choose* a naturally short one. If a library example must be composed, it uses only real APIs exactly as defined, and its header says `example` rather than a file path.
- **Real defaults and limits** come from constants and config in the code.
- **Nothing that isn't shipped.** No disabled feature flags, dev-only menus, dead code or deprecated APIs presented as current.
- **Say what it won't do.** Knowing the boundaries saves learners time; include them where relevant.

## Show, Don't Tell — Aggressively Visual

People's eyes glaze over text. The course should feel closer to an infographic than a manual.

**Text limits**
- Max **2–3 sentences** per text block. About to write a fourth? Convert it into a visual.
- Every screen is **at least 50% visual** — screenshots, diagrams, cards, code, animations, key caps.

**Convert text to visuals**
- A list of 3+ items → pattern cards or icon rows
- A sequence of steps → step cards, flow steps, or a flow animation
- "Click X, then Y happens" → action ↔ result block
- "This part of the window does…" → UI tour or UI map
- Explaining code → code ↔ English translation
- Comparing approaches → do/don't comparison or side-by-side columns
- A list of shortcuts / settings / errors → shortcut list / setting cards / error cards

**Every module has one hero visual** that teaches its core idea at a glance.

## One Concept per Screen

Each `.screen` teaches exactly one idea. Need more space? Add a screen.

## Metaphors First, Then Reality

Introduce new concepts with an everyday metaphor, then immediately ground it: "In Driftwood, this is the Notebook sidebar." **Never recycle metaphors** and never default to "restaurant" or "kitchen". Pick the metaphor that feels inevitable for *that* concept: notebooks are drawers in a filing cabinet; sync conflicts are two people editing the same paper form; rate limits are a nightclub's capacity; an event loop is an air-traffic controller.

In library mode, use metaphors more sparingly — for genuinely new abstractions, not for things developers already know.

## Learn by Doing and Tracing

- **End-user:** follow a real task from start to finish ("You want to send your packing list to a friend…"), then let them do it (try-it checklist).
- **Library:** start from a working call and trace what happens through the library's public objects.
- **Internals:** follow what happens under the hood when the user clicks something they already know.

## Make It Memorable

"Aha!" callouts for the insights that change how someone works (max two per module). Humor where natural, never forced. Give recurring parts of the product a consistent personality and color — they're characters in a story.

## Glossary Tooltips — No Term Left Behind (calibrated to the audience)

Wrap terms in `<span class="term" data-definition="…">` on first use per module. Definitions are 1–2 sentences, everyday language, a metaphor when it helps.

- **End-user:** app-specific concepts and any general computing term a non-technical person might not know (file path, export, cache, sync, plugin, PDF/CSV). Never programming terms — they shouldn't appear.
- **Library:** only project-specific concepts and specialist domain terms. Don't define programming basics.
- **Internals:** extremely aggressive — every technical term, acronym and unfamiliar software name. The vocabulary *is* the learning: teach terms so learners can use them with AI tools ("say 'add a flag for verbose output'").

Don't tooltip terms the learner already knows from their own domain.

## Quizzes That Test Application, Not Memory

The point of learning is being able to *do* something. Quizzes present a new situation and ask what to do.

**What to quiz (most to least valuable)**
1. **"What would you do?" scenarios** — a realistic new situation.
2. **Troubleshooting** — "X is happening. What's the likely cause / first thing to check?"
3. **Choosing between approaches** — "Which feature (or API) fits this job, and why?"
4. **Boundaries** — "Which of these can't it do?"
5. **Tracing** — "When you do X, what happens next?"

**Don't quiz:** definitions (that's what tooltips are for), menu positions, file names, default values, shortcut recall, exact syntax, or anything answerable by scrolling up.

**Tone:** wrong answers get an encouraging explanation that teaches something new ("Not quite — …"); right answers reinforce the principle ("Exactly! This works because…"). No scores, no judgment.

**How many:** one quiz per module at the end, 3–5 questions, each one worth pausing on.
