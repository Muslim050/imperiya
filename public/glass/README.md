# Glass-unit visuals

All 6 cards now render uniform inline SVG cross-sections drawn inside
`components/sections/GlassUnits.tsx` (`GlassDiag` component) — there is
no longer a per-key photo file referenced here.

The structure is driven by the `SPEC` map: panes count + optional
energy/argon flags. Edit it to add new unit types or to swap visuals.

If you ever want to override with a real product photo for a specific
unit, point a per-key path back into the component and reintroduce the
photo-with-fallback pattern from git history (commit cfcb48f).
