# Learning mode diversity update — v3.2

## Previous behaviour
Learning mode selected one family from a seed-derived index and kept requesting that same family. Several legacy generators use fixed templates, so new seeds could still produce the same visible item.

## New behaviour
- A shuffled family cycle covers all 63 available families before cycling again.
- Adjacent questions are prevented from using the same family where alternatives exist.
- Every candidate is passed through its generator validation (and the independent dynamic solver when applicable).
- A canonical visual key is compared with a rolling 60-question session history.
- Repeated visuals and generation failures are rejected; the scheduler tries other families.
- If no family can provide a fresh visual, the logic-first dynamic engine is used as a fallback.
- Skill repair remains pinned to the requested family, with dynamic fallback only when fresh variants cannot be generated.

## Additional clock corrections
- Renderer uses nullish coalescing so a valid 0-degree hand angle is not replaced.
- Clock mutation preserves zero-valued angles.
- Clock distractors change visible hand directions; the invisible `filled` property is excluded from the clock visual signature.

## Verification
- `node tests-learning-mode.js`: 500 accepted learning questions, all 63 families represented, no duplicates in the rolling 60-item history, no generation rejections in the regression batch.
- `node tests-dynamic-engine.js`: existing dynamic-engine suite passed, including 2,000 generated questions, 2,400 timed-test questions, 16,015 render checks, 62 legacy families and zero solver failures.

The test batch validates the generator and scheduling policy in a Node harness; it is not a substitute for browser testing on GitHub Pages or real-student calibration.
