# CurioSeek: Fandom Vibes link activity

## Seven-day results

Source: Replit project analytics, queried with authorized access.
Window: October 20, 2026 at 13:29:45 UTC through October 27, 2026 at
13:29:45 UTC (9:29:45 a.m. EDT on both dates). This is a rolling seven-day
window, not seven complete calendar days.

| Measure | Recorded count |
| --- | ---: |
| `fandom_vibes_link_activated` custom events | 0 |
| Pageviews across the project | 0 |
| Homepage (`/`) pageviews | 0 |

The Fandom Vibes activation event is configured in `index.html`, but no
activations were recorded during this window. The query succeeded; these
are empty collected results, not an analytics service error.

## Pageview-to-click context

The homepage activation-to-pageview ratio would be the number of homepage
Fandom Vibes activation events divided by homepage pageviews. It cannot be
calculated for this period because the denominator is zero. Do not report
this as a 0% click-through rate or conclude that there were no visitors.
No source comparison or visitor funnel is supported by these empty results.

An outbound activation measures choosing the link, not confirmed arrival
at the destination.

## Collection limitations and next steps

Analytics only reflects activity collected after analytics was enabled and
the app was published or republished. These results alone do not establish
whether collection was enabled, whether the deployed version includes the
instrumentation, or whether anyone visited the published app.

The owner should check Publishing settings and publish or republish if the
instrumentation is newer than the deployed page. Replit injects its tracker
into supported published pages; the application must not add its own Umami
script or website ID. No code changes or publishing were performed for
this analytics summary.

Once activity is recorded, useful questions are:

- What share of homepage visits include a Fandom Vibes activation?
- Which referring sources lead to Fandom Vibes activations?

## Query

```sql
SELECT
  now() AS window_end_utc,
  now() - INTERVAL 7 DAY AS window_start_utc,
  countIf(event_type = 1) AS pageviews,
  uniqIf(session_id, event_type = 1) AS approximate_visitors,
  countIf(event_type = 1 AND url_path = '/') AS homepage_pageviews,
  countIf(
    event_type = 2 AND event_name = 'fandom_vibes_link_activated'
  ) AS fandom_activations,
  uniqIf(
    session_id,
    event_type = 2 AND event_name = 'fandom_vibes_link_activated'
  ) AS approximate_clickers
FROM website_event
WHERE created_at >= now() - INTERVAL 7 DAY
  AND created_at <= now()
```
