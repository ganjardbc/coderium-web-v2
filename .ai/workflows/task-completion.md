# Task Completion Workflow

## Purpose

Define what must happen after every completed task.

---

# Definition of Done

A task is considered DONE only if:

* Code implemented
* Typecheck passed
* Build passed
* Relevant documentation updated
* Progress tracker updated

---

# Documentation Update Rules

## Backend Change

Update if changed:

```txt
docs/api/api-contract.md
docs/database/prisma-schema-design.md
docs/database/database-design.md
```

---

## Frontend Change

Update if changed:

```txt
docs/frontend/frontend-routes.md
docs/frontend/ui-pages.md
docs/frontend/ui-components.md
```

---

## Architecture Change

Update if changed:

```txt
docs/architecture/design.md
docs/architecture/module-breakdown.md
```

---

# Backlog Update

When task completed:

Update status in `docs/development/backlog.md`:

```txt
Status: DONE
```

---

# Progress Update

Move task from TODO to DONE in `docs/development/progress.md`.

Update:

```txt
Current Tasks
Completed Tasks
Overall Progress
MVP Completion
```

---

# Milestone Update

If milestone target reached:

Update `docs/development/milestones.md` status from:

```txt
NOT_STARTED / IN_PROGRESS
```

to:

```txt
DONE
```

---

# Decision Log

If implementation introduces architectural decision:

Update `docs/development/progress.md` Decision Log section.

---

# Pull Request Checklist

Before marking task DONE:

* Documentation updated
* No TypeScript errors
* No lint errors
* No ownership violations
* No permission violations
* No duplicated types
* No duplicated utilities
* Follows AGENTS.md
