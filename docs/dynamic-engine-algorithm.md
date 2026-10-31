# Dynamic NVR Engine — Algorithm Documentation (v3.1)

## 1. Two logic-first rule registries

The application now uses two compatible generation systems behind the same test interface.

### Core geometric registry — 21 transformation primitives

| Group | Rule IDs |
|---|---|
| Orientation / reflection | `rotate45`, `rotate90`, `rotate180`, `rotate270`, `reflectH`, `reflectV` |
| Fill / attributes | `fillInvert`, `lineWeightUp`, `scaleUp`, `scaleDown` |
| Quantitative | `dotPlus1`, `dotMinus1`, `componentPlus1`, `componentMinus1`, `sidesPlus1`, `sidesMinus1` |
| Spatial | `moveCW`, `moveCCW`, `swapParts` |
| Structural | `addLayer`, `removeLayer` |

Odd-one-out also uses three classification invariants: `componentCountInvariant`, `filledParityInvariant` and `dotParityInvariant`.

### Advanced object registry — 16 transformation primitives

| Object type | Rule IDs | What changes |
|---|---|---|
| Arrow group | `arrowGroupRotate90` | Whole arrangement: positions and directions |
| Arrow group | `arrowDirectionsQuarterTurn` | Every arrow direction, positions fixed |
| Arrow group | `arrowInvertAll` | Reverse every arrow direction |
| Arrow group | `arrowAddOne`, `arrowRemoveOne` | Arrow count |
| Arrow group | `arrowMoveCW` | Positions around an eight-slot ring; directions fixed |
| Arrow group | `arrowSwapDirections` | Exchange directions of the first two arrows, positions fixed |
| Curves | `curveRotate90`, `curveReflectH` | Complete doodle orientation/reflection |
| Curves | `curveAddLoop`, `curveRemoveLoop` | Closed-loop count |
| Curves | `curveAddLobe`, `curveRemoveLobe` | Open curved-lobe count |
| Curves | `curveScaleUp`, `curveScaleDown` | Whole-doodle scale |
| Curves | `curveAddBend` | Main stroke control-point/bend structure |

Each advanced rule has a stable ID, cognitive skill, compatibility category, difficulty weight, description, input requirements, output properties, preconditions and independent validation method. These rules are held in `AdvancedObjectReasoning.RULES`, separately from the core `DynamicReasoning.RULES`, so legacy prerequisite checks are not affected.

## 2. Logical state representation

### Arrow state

```js
{
  kind: "arrowGroup",
  arrows: [
    { id: "a0", x: 100, y: 30, slot: 0, dir: 90 },
    { id: "a1", x: 145, y: 75, slot: 2, dir: 180 }
  ]
}
```

Directions use cardinal angles: 0° up, 90° right, 180° down, 270° left. Positions use an eight-slot spatial ring. Each arrow retains identity, location and direction as separate attributes.

### Doodle state

```js
{
  kind: "doodle",
  strokes: [
    { id: "main", type: "main", points: [[62,48],[82,35],[112,45]], closed: false },
    { id: "loop0", type: "loop", points: [[...]], closed: true }
  ]
}
```

The complete state contains stroke types, ordered control points and closure. The SVG renderer smooths the points into cubic paths. The SVG output is not the source of truth.

## 3. Composition

The object engine supports:

- **Simultaneous:** all selected transformations are applied in declared order at each transition.
- **Alternating:** one rule is applied per step, cycling through the selected rule list.
- **Format adaptation:** the same rule set can be expressed as a sequence, analogy or matching relationship when the format is compatible.

Destructive rules are constrained by their preconditions. For example, a removal rule is not selected unless the starting state contains the object to remove. If repeated application would exhaust an object, the generator uses a one-transition analogy/matching format or rejects the candidate.

## 4. Generation pipeline

1. Choose the core geometric engine or advanced object engine from a deterministic seeded selection.
2. Select the object type (arrows or curves) when the advanced engine is selected.
3. Generate a valid structured starting state.
4. Select compatible rules using object type, category and preconditions.
5. Choose simultaneous or alternating composition and a compatible question format.
6. Execute the rules to construct examples and target state.
7. Generate distractors from omitted rules, wrong direction, wrong position, wrong count, wrong curve segment, extra/missing loop or scale misconceptions.
8. Run the independent solver.
9. Require five distinct options and exactly one solver-matching option.
10. Store cognitive skill, rule details, composition, difficulty and semantic fingerprint.

## 5. Independent answer solver

`independentObjectSolve()` has its own switch implementation. It does not call the object generation functions or transformation executor. It independently updates arrow positions/directions and curve control-point/stroke structures. Validation compares the solver-derived state with all five options and requires exactly one match.

This is implementation-level independence: the generator and solver are separate code paths, but both implement the same documented rule semantics. It is not a substitute for teacher review of whether a rule is visually clear to a child.

## 6. Misconception distractors

Arrow distractors include omitted rules, one-arrow direction errors, incorrect direction reversal, position swaps without the matching directional relationship, and arrow-count errors.

Doodle distractors include omitted rules, incorrect main-curve control-point changes, extra or missing loops, lobe-count errors and incorrect scaling.

Each distractor is tagged with a misconception category. All five rendered figure states must be distinct; otherwise generation is rejected.

## 7. Semantic fingerprints

The advanced object fingerprint includes:

`cognitiveSkill | objectType | format | compositionMode | orderedRuleIDs | next-step rule IDs | interacting-rule count | difficulty`

The core engine has its own corresponding fingerprint for shape/component questions. The timed-test selector rejects duplicate fingerprints within a test and avoids fingerprints from the previous ten automatically seeded tests. The ten-test history is local to the browser/device. Reuse can occur against older tests outside that rolling window.

## 8. Difficulty

Difficulty is estimated from rule weights, number of interacting rules, alternating structure and question format. Su is capped at difficulty 3 and at two interacting rules. Kem can receive difficulty 2–5 and up to four rules. This is an engineering heuristic; it has not been calibrated against real CAT4 data or student response times.

## 9. Formats

The core engine supports sequence, analogy, transformation, matching, spatial arrangement, 3×3 matrix and odd-one-out. The new object engine currently uses sequence, analogy and matching. These formats show enough examples for the student to infer the transformation rather than requiring the student to guess an unstated rule from a single starting figure.

## 10. Failure handling

There is no static fallback substitution. A candidate that violates preconditions, cannot generate four unique distractors, fails the independent solver or produces duplicate options is rejected. Timed-test assembly retries with deterministic alternative seeds and logs generation failures for the teacher inspector.

## 11. Current limitations

- Arrow direction is cardinal and position uses an eight-anchor ring; arbitrary free-position vector fields are not modelled.
- Curves are smooth structured paths with control points. General self-intersection counts, endpoint topology, path homotopy and arbitrary curve equivalence are not implemented.
- Core geometry and advanced object rules use separate typed state schemas and solver registries. They share the application/test contract but are not yet one universal object graph.
- Difficulty and suitability need real student pilot data.
