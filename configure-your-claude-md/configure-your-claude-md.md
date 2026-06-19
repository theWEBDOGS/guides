
# Configure Your CLAUDE.md

[Claude Code](https://claude.ai/code) reads one file at the start of every
session: `CLAUDE.md`, its standing instructions. A thoughtful one is the
difference between an assistant that's *generically* helpful and one that works
the way you do — verifying before it claims something's done, naming things
consistently, handling git without hand-holding. Below is a starter distilled
from heavy daily use, trimmed to rules that **earn their place by countering a
real failure** rather than restating what a capable model already does. Install
it, then adapt. **About 5 minutes.**

## Quick start (new machine)

Install it as your **global** `CLAUDE.md` so it applies to every project. **Copy
the block below into your terminal and press Return:**

```bash
mkdir -p ~/.claude
curl -fsSL https://guides.webdogs.com/configure-your-claude-md/starter-CLAUDE.md \
  -o ~/.claude/CLAUDE.md
```

That's the whole setup — there's nothing else to install. (Prefer to read it
first, or already have a `CLAUDE.md`? Open the [starter file](starter-CLAUDE.md)
and copy in the parts you want — don't blindly overwrite one you've already got.)
For a single project instead of your whole account, put the same content in a
`CLAUDE.md` at that project's root.

## What's in it — and why

Skim these so you can keep what fits and cut what doesn't — each maps to a section
of the file.

### Golden rules
*Brand fidelity* — render product names with their real spelling (`GitHub`, `npm`,
`macOS`); it's basic credibility. *Stop and replan* — blocked twice on the same
thing, surface it instead of trying a third variation; looping on a broken approach
is the classic agent failure.

### Verification — the heart of the file
Three habits that kill "it looks done" bugs: (1) **name the check before you start**
— say *how* you'll verify, as a specific falsifiable test, so you can't later slide
the goalpost to whatever happened to pass; (2) **run it and report honestly** —
never imply a check passed that you didn't run; (3) **verify the content, not the
surface** — that the thing actually works, not just that a file exists. Two more:
point deterministic checks (tests, lint, type-check) at a **hook** so they run
automatically, and on any **rename, `grep` the old term** and fix every straggler
in docs and config that refactoring tools miss.

### Skills
Give every skill a `## Gotchas` section — a running log of its own dead-ends, so the
next run steps around them instead of into them. **Capture each one in the moment**
— append the dated line the instant you hit the dead-end, while it's fresh — and
**graduate** recurring ones into a `## Principles` block. (Self-contained in the
file — no separate setup.)

### Naming
A folder's primary document carries the folder's name (`accordion/accordion.md`,
not a generic `index.md`), so the filesystem tells you what's what at a glance.

### Git
Commit finished work without asking (it's reversible); push to private remotes
silently but **confirm before a public push**; glance for secrets first; and ask
before anything irreversible — force-push, history rewrite, hard reset.

### Session wrap-up
When you're done, check the file still matches the project, capture any durable
lesson, and commit the leftovers.

## Then make it yours

This starter is the *generic* baseline — the craft that applies to any project. The
highest-value lines in a real `CLAUDE.md` are the ones only **you** can write: your
build and test commands, your project's conventions, the architecture a newcomer
needs, the gotcha that bit you last week. A capable model already knows general good
practice; what it *can't* know is your project. So treat this as the floor, not the
ceiling — drop it in, then add the project-specific rules that make it genuinely
yours.
