<!--
  Starter CLAUDE.md - a general-purpose working agreement for Claude Code,
  distilled from the conventions we use every day. Drop it in at
  ~/.claude/CLAUDE.md (applies to every project) or a project's ./CLAUDE.md
  (that project only), then adapt. Every rule here earns its place by
  countering a recurring failure - not by stating something a capable model
  already does. Keep it lean: a long file dilutes attention on the rules that
  matter, and the highest-value CLAUDE.md content is project-specific anyway.
-->

## Golden rules
- **Brand fidelity.** Render product, company, and tool names with their official
  spelling and capitalization (GitHub, npm, macOS, 1Password). If a source gets
  one wrong, fix it in what you produce and flag it once - but preserve deliberate
  stylizations; don't "correct" them.
- **Stop and replan.** Blocked twice on the same issue? Surface the blocker
  instead of thrashing on a third attempt.

## Verification
- **Name the check before you start; run it after; report honestly.** For
  non-trivial, change-producing work, say up front how you'll verify it - a
  specific, falsifiable check (a named command, an observable output, the exact
  condition to satisfy), not "I'll confirm it works." Naming it first stops you
  sliding the goalposts to whatever happened to pass. Run it when done and report
  the result plainly; if you truly can't run it, say so and name the residual
  risk - **never imply a check passed that you didn't run.**
- **Verify at the content level, not the surface** - check that the actual
  content meets the requirement, not just that a file exists or a heading looks
  right, and say what you verified.
- **Run the project's own checks before calling it done** - type-checker, tests,
  linter, whatever it has. These are deterministic, so automate them where you
  can: a pre-commit or stop hook that runs them beats relying on memory.
- **On any rename or shape change, `grep` for the old term and resolve every
  hit.** A rename, a moved field, a vocabulary change - the file in front of you
  is rarely the only place it appears; `grep -rn` catches the stragglers in docs,
  examples, and config that refactoring tools miss.

## Skills
- **Give every skill a `## Gotchas` section** - where its accumulated mistakes and
  dead-ends live, so the next run steps around them instead of into them. Start it
  empty ("none yet"); if you scaffold skills from a template, bake the heading in.
- **Capture gotchas in the moment** - the instant a skill hits a dead-end or takes
  a correction that'll recur, append a dated line before moving on, while the
  detail is fresh.
- **Graduate recurring gotchas into a `## Principles` block** above them, once
  several share a root cause: state the rule that predicts the mistake. Promote
  only a real pattern - a principle drawn from one gotcha is overfitting.

## Naming
- **A folder's primary document carries the folder's name** - `accordion/accordion.md`,
  never a generic `index.md` / `doc.md` / `notes.md`. Any file that represents its
  container takes the container's name. The one exception is a filename a tool
  forces on you (`index.html` for a web server, `SKILL.md` for a skill) - there
  the folder name carries the identity. Applies to generated output too.

## Git
- **Commit completed units of work without asking** - it's local and reversible.
  Report what landed.
- **Push to private remotes silently. For public remotes, show what's about to
  publish (commits + files) and confirm first** - a public push is an irreversible
  publication.
- **Glance for secrets before every push** - private-key blocks, `AKIA…`-style
  keys, `*_TOKEN` / `*_SECRET` / `*_PASSWORD` set to real values, high-entropy
  literals. If anything trips, stop and surface it. (Deterministic, so a pre-push
  hook does this more reliably than memory.)
- **Ask before irreversible git:** force-push, rewriting already-pushed history,
  branch/tag deletion, `reset --hard` on work you didn't create.

## Session wrap-up
When the user signals the end of a session ("wrap up", "we're done", "that's it
for today"):
1. **Check CLAUDE.md still matches reality** - stack, structure, status - and fix
   mechanical drift.
2. **Distill durable lessons** - a stated preference, a correction made more than
   once, a procedure worth repeating - into CLAUDE.md, or into a skill if it's a
   repeatable procedure. Skip one-off trivia.
3. **Commit and push any leftover work.**
