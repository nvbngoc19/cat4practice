# Dynamic NVR Engine — v3.1 Validation Report

**Command:** `node tests-dynamic-engine.js`

## 1. Generation and independent validation

| Metric | Su | Kem |
|---|---:|---:|
| Generated | 1000 | 1000 |
| Rejected | 0 | 0 |
| Independent solver passes | 1000 | 1000 |
| Unique semantic fingerprints | 395 | 818 |
| Repeated semantic fingerprints in 1,000-sample batch | 605 | 182 |
| Unique ordered rule combinations | 242 | 656 |

The fingerprint is a logic-level fingerprint (skill, object type, format, composition, ordered rules and difficulty), not a visual-image fingerprint. Repeated fingerprints are expected in a 1,000-item batch because the rule registry is finite. Timed-test selection rejects duplicates within each test and against the previous ten automatically seeded tests; reuse can occur outside that rolling history window.

### Advanced object question coverage

| Object system | 2,000-question sample | 100 timed tests |
|---|---:|---:|
| Multi-arrow | 465 | 430 |
| Irregular curves / doodles | 460 | 475 |
| Total advanced-object questions | 925 | 905 |

### Rule-count distribution in the 2,000-question sample

| Profile | 1 rule | 2 rules | 3 rules | 4+ rules |
|---|---:|---:|---:|---:|
| Su | 709 | 291 | 0 | 0 |
| Kem | 43 | 475 | 349 | 133 |

### Difficulty distribution

| Profile | Level 1 | Level 2 | Level 3 | Level 4 | Level 5 |
|---|---:|---:|---:|---:|---:|
| Su | 138 | 584 | 278 | 0 | 0 |
| Kem | 0 | 9 | 453 | 372 | 166 |

### Question-format distribution

| Format | Questions |
|---|---:|
| `matching` | 508 |
| `analogy` | 506 |
| `sequence` | 382 |
| `odd-one-out` | 160 |
| `transformation` | 157 |
| `spatial-arrangement` | 144 |
| `matrix` | 143 |

### Transformation and invariant rule usage

The sample exercised 40 rule IDs, including all 21 core transformation primitives, all 16 advanced object transformations and the three classification invariants. New object rule usage:

| Advanced rule | Count |
|---|---:|
| `curveScaleDown` | 106 |
| `arrowDirectionsQuarterTurn` | 87 |
| `curveAddLoop` | 107 |
| `arrowAddOne` | 137 |
| `arrowSwapDirections` | 108 |
| `arrowGroupRotate90` | 139 |
| `arrowInvertAll` | 108 |
| `curveReflectH` | 124 |
| `curveRotate90` | 106 |
| `arrowRemoveOne` | 120 |
| `curveAddLobe` | 108 |
| `curveRemoveLobe` | 26 |
| `arrowMoveCW` | 163 |
| `curveAddBend` | 107 |
| `curveScaleUp` | 95 |
| `curveRemoveLoop` | 38 |

## 2. One hundred timed-test simulations

| Metric | Result |
|---|---:|
| Tests attempted / passed | 100 / 100 |
| Test generation failures | 0 |
| Total timed-test questions | 2400 |
| Duplicate fingerprints within a test | 0 |
| Duplicates against previous ten tests | 0 |
| Unique fingerprints across all 100 tests | 1626 |
| Repeated occurrences outside global unique count | 774 |

The global duplicate count includes valid reuse beyond the ten-test rolling history. The engine is not claiming all 2,400 questions are globally unique.

## 3. Rendering, legacy compatibility and reproducibility

| Check | Result |
|---|---:|
| SVG figure render checks | 16015 |
| Blank figure render checks | 0 |
| Legacy generator families validated | 62 / 62 |
| Same-seed reproducibility | True |
| Different-seed variation | True |
| Independent solver failures | 0 |
| Five distinct options per accepted question | Passed |
| Scoring/navigation smoke test | 23/24 |
| Collinear-overlap geometry regression | Passed (1 component, 2 endpoints) |
| Proper-crossing geometry regression | Passed |
| Responsive CSS media-query presence | Passed |

The SVG tests use a lightweight DOM shim to verify that generated SVGs contain visible child elements. Responsive CSS breakpoints and local asset paths are checked in the package. This is not a full browser or physical-device rendering test.

## 4. Application integration

- `DynamicReasoning.makeQuestion()` deterministically routes a share of questions to the advanced object engine; the timed-test engine uses the same question interface.
- The student-facing UI continues to render five options and 24-question / ten-minute tests.
- Learning mode and teacher question-bank generation use the same wrapped dynamic generation interface.
- The teacher inspector shows object type, detailed rule descriptions, composition, difficulty rationale, misconception categories, semantic fingerprint and independent solver status.
- The modular `index.html` now loads all local JavaScript modules; `standalone.html` embeds the same current modules.
- All JavaScript modules passed `node --check`; all local script paths referenced by `index.html` exist.

## 5. Limitations and unverified areas

- No physical iPhone/Safari session was available for manual touch and layout testing. The existing responsive CSS is retained, but this upgrade has not been certified on a real mobile device.
- Arrow directions are cardinal and positions use an eight-slot ring; arbitrary continuous arrow arrangements are not yet modelled.
- Doodles use smooth structured control-point paths with loops and lobes. General self-intersection count, endpoint topology and arbitrary curve equivalence are not yet implemented.
- The core geometric engine and advanced object engine have separate typed state schemas and solver registries. They share the application contract but are not yet a single universal object graph.
- Difficulty remains a heuristic and needs real-student pilot calibration.
