---
public: true
title: "Self-Improving Claude Code Skills with Gotchas"
slug: self-improving-skills
verified: 2026-06-18
description: "Give every Claude Code skill a running log of its own mistakes, so the next run doesn't repeat them. About 5 minutes to set up."
---

# Self-Improving Claude Code Skills with Gotchas

[Claude Code](https://claude.ai/code) skills tend to make the *same mistake
twice* — each run starts fresh, with no memory of last time's dead-ends. This
convention fixes that: give every skill a **`## Gotchas` section** — a running
log of what went wrong — and add to it the moment something does. The next run
reads those notes and steps around the trap instead of into it. Just a heading
and a habit, no tooling. **About 5 minutes to set up.**

---

## Step 1 — Add the convention to your CLAUDE.md

`CLAUDE.md` is where Claude Code keeps its standing instructions — the rules it
reads at the start of every session. Putting the convention here means it
applies to every skill you'll ever run.

**Copy the block below and paste it into your `CLAUDE.md`** — your global
`~/.claude/CLAUDE.md`, or a single project's own copy:

```markdown
## Skills
- **Every skill carries a `## Gotchas` section.** Author each new skill with one (empty — "none yet" — is fine; it's a standing invitation). It's where that skill's accumulated mistakes, dead-ends, and corrections live so a future run doesn't repeat them. The most robust enforcement is structural: if you keep a skill template or scaffold, bake the heading into it so every new skill is born with the section.
- **Capture gotchas in-flight.** While running a skill, the moment you hit a dead-end or take a correction that will recur, append a dated bullet to its `## Gotchas` before you finish — that's when the detail is freshest and most accurate.
- **(Optional) Backstop at session's end.** If you run an end-of-session review, use it to sweep up any gotcha that in-flight capture missed.
```

That's the whole policy. Everything below is just putting it into practice.

## Step 2 — Bake the section into your skill template

A rule you have to *remember* is a rule you'll eventually forget. The reliable
fix is structural: if you scaffold new skills from a template, put the
`## Gotchas` heading **in the template** — so every new skill is born with the
section already there, empty and waiting.

A minimal skill template:

```markdown
# <skill name>

<what it does, and when to use it>

## Steps

1. …

## Gotchas

<!-- none yet -->
```

Now you can't create a skill *without* the section. (No template? Step 1's rule
still has you covered — just add the heading by hand when you write a new
skill.)

## Step 3 — Capture gotchas the moment they happen

This is the habit that makes the whole thing work. **The instant a skill hits a
dead-end or takes a correction that's likely to recur, write it down** — append
a dated bullet to that skill's `## Gotchas` before you move on. Right then is
when the detail is freshest; an hour later you'll only half-remember it.

A gotcha is one dated line: *what you tried, why it failed, what to do instead.*

```markdown
## Gotchas
- 2026-06-18 — Ran the migration before snapshotting; lost the dev database.
  Always back up first.
- 2026-06-18 — `build --fast` silently skips type-checking. Use plain `build`
  for anything you'll ship.
```

You can write the bullet yourself, or just tell Claude: *"add that to the
skill's Gotchas section."* Either way the note lands with the skill, where the
next run will read it.

## Tips

- Keep gotchas short and specific. "Don't run X before Y" beats a paragraph of
  backstory — a gotcha is a guardrail, not a diary.
- Date every entry. When a tool changes and an old gotcha stops applying, the
  date tells you it's safe to prune.
- Catch the stragglers at session's end — if you do any end-of-session review,
  use it to sweep up the gotchas you missed in the moment.
- Let the log grow, then weed it. A skill that's failed ten interesting ways
  has a `## Gotchas` section worth its weight in saved reruns.
