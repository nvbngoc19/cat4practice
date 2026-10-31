# Changed-file inventory — v3.1 arrow and curve upgrade

## Modified files

| File | Change |
|---|---|
| `index.html` | Loads the new `advancedObjectReasoning.js` module after the core dynamic engine and links the stylesheet. |
| `styles.css` | Extracted responsive stylesheet required by the modular `index.html`; standalone embeds the same CSS. |
| `standalone.html` | Rebuilt as a self-contained application embedding current CSS and all modules, including the advanced arrow/curve engine. |
| `js/dynamicReasoningEngine.js` | Tightened matrix-pair eligibility so bounded transformations cannot silently stop changing the state partway through a 3×3 matrix. |
| `js/app.js` | Teacher inspector now displays object system and advanced rule definitions; result-difference labels now understand arrows and curve strokes/control points. |
| `README.md` | Documents v3.1 run instructions, new object systems, test results and limitations. |
| `docs/dynamic-engine-architecture.md` | Adds the two-engine architecture and arrow/curve integration. |
| `docs/dynamic-engine-algorithm.md` | Documents 16 new rules, state schemas, composition, solver and distractors. |
| `docs/dynamic-engine-test-report.md` | Replaced previous snapshot with the current measured v3.1 acceptance results. |
| `docs/dynamic-engine-test-report.json` | Machine-readable current acceptance results. |

## New files

| File | Purpose |
|---|---|
| `advanced-object-showcase.html` | Ten actual generated examples: five multi-arrow and five irregular-curve questions with options, answers and teacher reasoning. |
| `tools/build-advanced-showcase.js` | Reproducible builder for the advanced object showcase. |
| `js/figureRenderer.js` | Modular source extracted from the standalone bundle; original renderer for geometric figures. |
| `js/geometryKernel.js` | Modular source for straight-line geometry and topology. |
| `js/questionGenerators.js` | Modular source for the original generator bank. |
| `js/diversityEngine.js` | Modular source for the original diversity families. |
| `js/diversityExpansion.js` | Modular source for the expanded legacy families. |
| `js/ruleComposition.js` | Modular source for legacy transformation composition. |
| `js/advancedObjectReasoning.js` | New first-class multi-arrow and irregular-curve reasoning engine with 16 reusable rules, independent solver, distractor engine and SVG extensions. |
| `js/testEngine.js` | Modular source for timed test assembly. |
| `js/progressStorage.js` | Modular source for local progress storage. |
| `js/analytics.js` | Modular source for progress analytics. |
| `js/app.js` | Modular source for student and teacher UI. |
| `tests-dynamic-engine.js` | Reproducible 2,000-question, renderer, legacy compatibility and 100 timed-test acceptance suite. |

## Preserved files

The original legacy families, sample-test files, pattern library and prior v3 showcase remain in the package. No files were removed. The earlier v2 package was not overwritten.
