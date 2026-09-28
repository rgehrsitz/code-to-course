# Audience: How the Code Works (Internals)

> **When to read this:** Step 0, only when the user explicitly asks for a course on how the codebase itself works (e.g. "teach me how this code works", "explain this codebase", "I want to understand what's under the hood"). This is the original codebase-to-course mode.

## Who the learner is

A **"vibe coder"** — someone who builds software by instructing AI coding tools in natural language, without a traditional CS education. They may have built this project themselves (without reading the code), or found it on GitHub and want to understand how it's built.

**Assume zero technical background.** Every CS concept — from variables to APIs to databases — needs plain-language explanation. No jargon without definition. No "as you probably know." The tone is a smart friend explaining things, not a professor lecturing.

**Their goals are practical:**
- Know enough to **steer AI coding tools** — make better architecture and tech-stack decisions
- **Detect when AI is wrong** — spot hallucinations and bad patterns
- **Intervene when AI gets stuck** — break out of bug loops, debug, unblock themselves
- Build software with production-level quality
- Be **technically fluent** enough to discuss decisions with engineers
- **Acquire the vocabulary of software** so they can describe requirements precisely to AI agents

They're not trying to become engineers; they need to *read*, *understand* and *direct* code.

**The approach:** build first, understand later. The learner has already *used* the app — the course meets them there: "You know that button you click? Here's what happens under the hood." Every module answers "why should I care?" in terms of steering AI, debugging, or making decisions.

**Tooltips:** extremely aggressive — every technical term, software name and acronym (see `content-philosophy.md`).

---

## What to extract (Phase 1)

Read the key files, trace the data flows, and identify:
- The main **actors** (components, services, modules) and their responsibilities
- The primary **user journey** — what happens end-to-end when someone uses the app
- Key APIs, data flows and communication patterns
- Clever engineering patterns (caching, lazy loading, error handling…)
- Real bugs or gotchas (from git history or comments)
- The tech stack and why each piece was chosen

Figure out what the app does yourself from the README, entry points and UI code. The course opens by explaining the product in plain language, then Module 1 starts with a concrete user action: "imagine you paste a YouTube URL and click Analyze — here's what happens under the hood."

---

## Module arc

| # | Module | Why it matters for a vibe coder |
|---|---|---|
| 1 | Here's what this app does — and what happens when you use it | Grounds everything in something concrete |
| 2 | Meet the actors | Tell AI "put this logic in X, not Y" |
| 3 | How the pieces talk | Debug "it's not showing up" problems |
| 4 | The outside world (APIs, databases) | Evaluate costs, rate limits, failure modes |
| 5 | The clever tricks | Request patterns (caching, chunking, retries) from AI |
| 6 | When things break | Escape AI bug loops |
| 7 | The big picture | Decide what to build next |

A menu, not a checklist — a small CLI might need 4 modules.

---

## Required elements (every internals course)

1. **Code ↔ English translation blocks** — at least one per module, using exact code from the repo (never modified; choose naturally short 5–10 line snippets).
2. **Group chat animation** — at least one, components talking to each other.
3. **Message / data flow animation** — at least one, step-by-step packets between actors.
4. **Quizzes** — one per module.
5. **Glossary tooltips** — every technical term, first use per module.

Optional: architecture diagram, visual file tree, layer toggle, spot-the-bug, pattern cards.

## Quizzes

Scenario, debugging, architecture-decision and tracing questions:
- "You want to add a 'save to favorites' feature. Which files would change?"
- "A user reports stale data after switching pages. Where do you look first?"
- "Would you put this logic in the frontend or backend? Why?"
