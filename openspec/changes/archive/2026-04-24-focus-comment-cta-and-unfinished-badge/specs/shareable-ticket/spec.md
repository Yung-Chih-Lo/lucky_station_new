## REMOVED Requirements

### Requirement: Result modal exposes a self-reminder copy action
**Reason**: Post-ship review (UX/IA + growth + behavioral psychology) converged on this action being redundant with the existing "搶先留下這一站的心得 →" CTA and framed in an engineer-first vocabulary that users did not map onto. Its intended purpose (return-to-write) is better served by promoting the existing comment CTA and adding a "未寫心得" badge on the pick-history panel.

**Migration**: No data migration required. The `navigator.clipboard.writeText` payload was only held in the user's own clipboard transiently — no persisted state exists to clean up. Users who had copied the reminder text can still paste and use the URL; the `/comment?token=` endpoint is unchanged. The QR-points-to-root change from the same earlier iteration remains in force.
