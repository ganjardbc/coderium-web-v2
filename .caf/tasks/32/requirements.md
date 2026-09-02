# Requirements: Ticket 32 - Fix Double View Count Increment on Public Post Detail

## Objective
Ensure `viewsCount` on posts is incremented only once per page view via the dedicated engagement endpoint (`EngagementService.trackView()`), and remove the duplicate `viewsCount` increment from `PostsService.findBySlugPublic()`.

## User / System Impact
- View count metrics will accurately reflect single view events instead of inflating by 2x.
- Post rankings (popular posts), dashboard analytics, and public view counters will display correct numbers.

## Acceptance Criteria
1. `PostsService.findBySlugPublic(slug)` must fetch the post and attach media without updating/incrementing `post.viewsCount`.
2. `EngagementService.trackView(slug, ...)` remains responsible for recording `PostView` and incrementing `post.viewsCount`.
3. Existing unit and integration behavior for `findBySlugPublic` and post retrieval functions properly without regressions.
4. Unit tests are added/verified for `PostsService.findBySlugPublic` and `EngagementService.trackView`.
