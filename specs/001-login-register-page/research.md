# Phase 0 Research: login/register visibility and mail delivery

Decision: Investigate two root causes in parallel — (A) UI visibility and visual noise (colors/animations) and (B) mail sending (sync vs queued and environment). Fixes must follow the constitution: no scattered CSS; prefer component/design-token fixes.

Rationale:
- The bug report indicates forms are "invisible" and mail isn't sent despite `.env` having mail config. These are separate subsystems (frontend rendering/CSS and backend mailer/queue). We must gather evidence from DOM, CSS, server logs, and queue status.
- The constitution requires avoiding ad-hoc CSS fixes; any style changes must prefer existing Tailwind tokens or shared components.

Research tasks:
1. Reproduce UI issue in local environment: open `/login` and `/register` and capture HTML, computed styles, and console logs in desktop and mobile widths. Check if forms exist in DOM but are hidden (visibility, opacity, position, z-index, or parent overflow) or not rendered.
2. Search frontend code for classes and components used in auth pages (`resources/js/pages/auth/*`, `resources/js/layouts/*`, `resources/js/components/*`) to find likely culprits (background elements, decorative spans, large blurs, or overlays with high z-index and/or pointer-events blocking content).
3. Identify any global styles or layout wrappers that inject animations or big background elements (e.g., `bg-...` spans with absolute positioning) and assess whether they are decorative-only and removable for a "clean background" mode.
4. Mail delivery: verify `.env` MAIL_ settings, `QUEUE_CONNECTION`, and whether `mail` calls are synchronous or wrapped in jobs. Inspect `app/Http/Controllers/Auth/*`, `app/Notifications`, and any mail Jobs in `app/Jobs` or `app/Mail`.
5. If queued: verify whether a worker is running in the runtime environment or if there are failures in the queue logs (failed_jobs table or log files). If synchronous: inspect mailer logs, SMTP responses, and any exceptions raised during mail send.

Alternatives considered:
- Quick CSS override (bad): would fix visibility fast but violates constitution (no scattered CSS). Preferred approach: adjust shared component styles or layout tokens, or introduce a context-driven class to disable decorative elements on auth pages.
- Force synchronous mail sending (temporary): useful for debugging but may not reflect production; acceptable as a temporary debug fallback.

Output requirements:
- `research.md` (this file) with findings and recommended approach.
- Evidence artifacts: DOM snapshots, console logs, sample server log entries (to be collected during reproduction step).
