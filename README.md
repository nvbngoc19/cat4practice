# Vinschool NVR — Dynamic Reasoning Engine v3.1

This package preserves the v3 logic-first timed-test engine and adds first-class **multi-arrow** and **irregular curve / doodle** reasoning. The timed-test path now mixes the original structured-figure engine with the advanced object engine. Both construct a logical specification first, derive figures and options from it, and validate the correct answer with an independent solver.

## Run the application

- **Standalone:** open `standalone.html` in a modern browser. It embeds all current CSS and JavaScript and needs no server or external assets.
- **Modular / GitHub Pages:** publish the package contents and open `index.html`. Keep `styles.css` and the complete `js/` module directory beside `index.html`.
- **Teacher showcase:** open `advanced-object-showcase.html` for five generated arrow questions and five irregular-curve questions, with answers and teacher explanations. `dynamic-question-showcase.html` retains the original v3 sample set. The live teacher question-bank inspector also generates the new question types.

The package has not been deployed to a public GitHub Pages URL. Progress is saved locally in the browser/device.

## New v3.1 object systems

`js/advancedObjectReasoning.js` adds 16 reusable operations:

**Multi-arrow configurations (7)**
- Rotate the whole arrow group 90°.
- Turn every arrow 90° without moving it.
- Reverse every arrow direction.
- Add or remove an arrow.
- Move arrows around an eight-position spatial ring.
- Exchange the directions of two arrows while preserving their positions.

**Irregular curves / doodles (9)**
- Rotate the complete doodle.
- Reflect the doodle horizontally.
- Add or remove a closed loop.
- Add or remove an open curved lobe.
- Scale the doodle up or down.
- Add a bend to the main curved stroke.

The original engine has 21 transformation primitives plus three classification invariants. The combined transformation library therefore has **37 operations** (21 original + 16 object-specific), alongside the three classification invariants. Su receives at most two interacting rules and difficulty 1–3; Kem can receive up to four rules and difficulty 2–5.

The object rules use structured state, not image templates. Arrow states store each arrow's position and cardinal direction. Doodle states store curve strokes, control points, loop/lobe types and closure. SVG is only the renderer. A separate object solver replays each rule using an independent implementation and checks that exactly one of the five options matches.

The advanced object questions use sequence, analogy and matching formats so the student sees enough examples to infer the rule. Destructive rules that would exhaust an object (for example, repeatedly removing the last loop) are constrained to one-transition formats or rejected.

## Architecture

1. `js/dynamicReasoningEngine.js` — original structured-figure rules, classification invariants, simultaneous/alternating/matrix composition, solver, distractors, fingerprints and difficulty.
2. `js/advancedObjectReasoning.js` — multi-arrow and irregular-curve state models, 16 object rules, object-specific composition, misconception distractors, independent solver and SVG rendering extensions.
3. `js/figureRenderer.js` — structured figure-to-SVG rendering; the advanced module extends it for arrow groups and smooth irregular curves.
4. `js/geometryKernel.js` — straight-segment intersection and topology metrics; collinear overlaps are merged correctly in the topology graph.
5. `js/testEngine.js` — 24-question / 10-minute tests, semantic duplicate avoidance and rolling ten-test history.
6. `js/app.js` — student UI, progress, review and teacher inspector. The teacher inspector displays object system, rule definitions, composition, distractor categories, difficulty and solver status.
7. Legacy modules remain available for learning/review and compatibility.

## Acceptance tests

Run:

```bash
node tests-dynamic-engine.js
```

The suite generates 1,000 questions per profile, validates each with the independent solver, renders all examples and answer options through a lightweight SVG DOM shim, checks all 62 legacy families, verifies seed reproducibility, and generates 100 complete timed tests. It also checks five-option uniqueness, navigation/scoring and duplicate prevention within tests and against the previous ten tests.

Latest measured results are in `docs/dynamic-engine-test-report.md` and the machine-readable `docs/dynamic-engine-test-report.json`.

## Important limitations

- This is a finite but extensible reasoning-rule library, not an unrestricted visual theorem prover.
- Arrow directions are cardinal (90° increments) and arrow positions use an eight-position anchor ring. It does not yet model arbitrary continuous arrow fields or every possible arrangement in the reference questions.
- Doodles are generated as smooth structured paths with control points, loops and lobes. They are not arbitrary scanned handwriting. Self-intersection count, crossing topology, endpoint topology and arbitrary curve equivalence are not yet composable rule primitives.
- Some of the 21 original rules and three classification invariants remain separate from the object-specific rule system. Both systems share the same test adapter and teacher inspection contract, but are not yet one fully unified typed rule graph.
- Difficulty is an engineering heuristic, not an official Cambridge/CAT4 scale. Real student timing, clarity and distractor-quality pilot testing is still required.
- Automated SVG structure checks passed, but a physical iPhone/Safari usability test has not been performed in this environment.
