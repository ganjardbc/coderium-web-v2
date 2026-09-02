# Tasks: Ticket 32 - Fix Double View Count Increment on Public Post Detail

| Task ID | App / Module | Description | Agent Scope | Dependencies |
|---------|--------------|-------------|-------------|--------------|
| T-32-1  | `apps/api`   | Remove `prisma.post.update` incrementing `viewsCount` from `PostsService.findBySlugPublic` in `apps/api/src/posts/posts.service.ts` | `caf-backend` | None |
| T-32-2  | `apps/api`   | Add unit tests for `PostsService.findBySlugPublic` verifying it does not increment viewsCount | `caf-backend` | T-32-1 |

## Architecture Decision Needed
None. Simple single-service bug fix in `apps/api`. Skip Architect stage.
