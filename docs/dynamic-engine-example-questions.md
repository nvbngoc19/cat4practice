# Ten Generated Dynamic NVR Examples

The accompanying [visual showcase](../dynamic-question-showcase.html) displays the actual generated SVG figures and five answer options. Correct answers are visible because this is a teacher-facing review artifact.

## 1. One-rule sequence
**Profile:** Su · **Format:** `sequence` · **Difficulty:** 2/5

**Student prompt:** Study the sequence. Which figure comes next?
**Correct answer:** C
**Composition:** `simultaneous` · 1 rule(s)
**Rule combination:** `sidesPlus1`
**Explanation:** Apply together: Increase each polygon’s side count by one.
**Reasoning steps:**
- Increase each polygon’s side count by one.
**Distractor logic:** Uses the wrong direction or magnitude for sidesPlus1; Applies the attribute change to the wrong component; Makes a one-step counting error; Changes the size of one component but preserves the rest
**Solver validation:** passed — independent-rule-replay
**Semantic fingerprint:** `quantitative-geometry|sequence|simultaneous|sidesPlus1||n1|d2`

## 2. Two-rule analogy
**Profile:** Su · **Format:** `analogy` · **Difficulty:** 3/5

**Student prompt:** The first figure changes into the second. Apply the same relationship to the third figure.
**Correct answer:** C
**Composition:** `simultaneous` · 2 rule(s)
**Rule combination:** `moveCCW + scaleDown`
**Explanation:** Apply together: Move every component one position anticlockwise around the six anchors. Reduce every component’s size by three units.
**Reasoning steps:**
- Move every component one position anticlockwise around the six anchors.
- Reduce every component’s size by three units.
**Distractor logic:** Ignores the final transformation; Misses the first transformation; Uses the wrong direction or magnitude for moveCCW; Uses the wrong direction or magnitude for scaleDown
**Solver validation:** passed — independent-rule-replay
**Semantic fingerprint:** `spatial-position+visual-attribute|analogy|simultaneous|moveCCW>scaleDown||n2|d3`

## 3. Three-rule sequence
**Profile:** Kem · **Format:** `sequence` · **Difficulty:** 5/5

**Student prompt:** Study the sequence. Which figure comes next?
**Correct answer:** B
**Composition:** `alternating` · 3 rule(s)
**Rule combination:** `swapParts + dotPlus1 + fillInvert`
**Explanation:** Alternate: Exchange the positions of the first two components. Add one internal dot. Invert the fill state of every component.
**Reasoning steps:**
- Apply one transformation per step, cycling through the rules in this order: Exchange the positions of the first two components. → Add one internal dot. → Invert the fill state of every component.
**Distractor logic:** Ignores the final transformation; Uses the wrong direction or magnitude for dotPlus1; Applies the attribute change to the wrong component; Makes a one-step counting error
**Solver validation:** passed — independent-rule-replay
**Semantic fingerprint:** `spatial-relationship+quantitative+attribute-change|sequence|alternating|swapParts>dotPlus1>fillInvert||n3|d5`

## 4. Four-rule compound analogy
**Profile:** Kem · **Format:** `transformation` · **Difficulty:** 5/5

**Student prompt:** Which option shows the result after all the transformations are applied?
**Correct answer:** E
**Composition:** `simultaneous` · 4 rule(s)
**Rule combination:** `sidesPlus1 + swapParts + lineWeightUp + dotMinus1`
**Explanation:** Apply together: Increase each polygon’s side count by one. Exchange the positions of the first two components. Increase the line thickness. Remove one internal dot.
**Reasoning steps:**
- Increase each polygon’s side count by one.
- Exchange the positions of the first two components.
- Increase the line thickness.
- Remove one internal dot.
**Distractor logic:** Misses the first transformation; Notices only one rule and ignores the others; Uses the wrong direction or magnitude for sidesPlus1; Omits swapParts
**Solver validation:** passed — independent-rule-replay
**Semantic fingerprint:** `quantitative-geometry+spatial-relationship+attribute-change+quantitative|transformation|simultaneous|sidesPlus1>swapParts>lineWeightUp>dotMinus1||n4|d5`

## 5. Cross-axis 3×3 matrix
**Profile:** Su · **Format:** `matrix` · **Difficulty:** 3/5

**Student prompt:** Each row and column follows a relationship. Which figure completes the 3×3 matrix?
**Correct answer:** D
**Composition:** `matrix-cross-axis` · 2 rule(s)
**Rule combination:** `rotate45 + componentPlus1`
**Explanation:** Across rows and columns: Down each column: Rotate the whole figure 45° clockwise. Across each row: Add one new component.
**Reasoning steps:**
- Column rule: Rotate the whole figure 45° clockwise.
- Row rule: Add one new component.
**Distractor logic:** Ignores the final transformation; Misses the first transformation; Notices only one rule and ignores the others; Uses the wrong direction or magnitude for rotate45
**Solver validation:** passed — independent-rule-replay
**Semantic fingerprint:** `orientation+quantitative|matrix|matrix-cross-axis|rotate45>componentPlus1||n2|d3`

## 6. Spatial arrangement
**Profile:** Su · **Format:** `spatial-arrangement` · **Difficulty:** 3/5

**Student prompt:** Which option shows the group in its new spatial arrangement?
**Correct answer:** D
**Composition:** `simultaneous` · 2 rule(s)
**Rule combination:** `dotPlus1 + moveCW`
**Explanation:** Apply together: Add one internal dot. Move every component one position clockwise around the six anchors.
**Reasoning steps:**
- Add one internal dot.
- Move every component one position clockwise around the six anchors.
**Distractor logic:** Ignores the final transformation; Misses the first transformation; Uses the wrong direction or magnitude for dotPlus1; Uses the wrong direction or magnitude for moveCW
**Solver validation:** passed — independent-rule-replay
**Semantic fingerprint:** `quantitative+spatial-position|spatial-arrangement|simultaneous|dotPlus1>moveCW||n2|d3`

## 7. Single-invariant odd one out
**Profile:** Su · **Format:** `odd-one-out` · **Difficulty:** 2/5

**Student prompt:** Four figures share the same underlying property. Which figure is the odd one out?
**Correct answer:** C
**Composition:** `invariant-classification` · 1 rule(s)
**Rule combination:** `dotParityInvariant`
**Explanation:** Four figures have a even number of internal dots.
**Reasoning steps:**
- Count the internal dots and check their parity.
**Distractor logic:** Four options preserve every stated invariant; the keyed option violates at least one.
**Solver validation:** passed — independent-invariant-evaluation
**Semantic fingerprint:** `classification|odd-one-out|invariant-classification|dotParityInvariant|dotParityInvariant:0|n1|d2`

## 8. Two-invariant odd one out
**Profile:** Kem · **Format:** `odd-one-out` · **Difficulty:** 4/5

**Student prompt:** Four figures share the same underlying property. Which figure is the odd one out?
**Correct answer:** C
**Composition:** `invariant-classification` · 2 rule(s)
**Rule combination:** `dotParityInvariant + filledParityInvariant`
**Explanation:** Four figures have a odd number of internal dots. Four figures have a odd number of filled components.
**Reasoning steps:**
- Count the internal dots and check their parity.
- Count filled components and check whether the total is even or odd.
**Distractor logic:** Four options preserve every stated invariant; the keyed option violates at least one.
**Solver validation:** passed — independent-invariant-evaluation
**Semantic fingerprint:** `classification|odd-one-out|invariant-classification|dotParityInvariant>filledParityInvariant|dotParityInvariant:1&filledParityInvariant:1|n2|d4`

## 9. Matching relationship
**Profile:** Su · **Format:** `matching` · **Difficulty:** 3/5

**Student prompt:** Study the transformation pair. Which option shows the same relationship for the new figure?
**Correct answer:** D
**Composition:** `simultaneous` · 2 rule(s)
**Rule combination:** `scaleDown + moveCCW`
**Explanation:** Apply together: Reduce every component’s size by three units. Move every component one position anticlockwise around the six anchors.
**Reasoning steps:**
- Reduce every component’s size by three units.
- Move every component one position anticlockwise around the six anchors.
**Distractor logic:** Ignores the final transformation; Misses the first transformation; Uses the wrong direction or magnitude for scaleDown; Uses the wrong direction or magnitude for moveCCW
**Solver validation:** passed — independent-rule-replay
**Semantic fingerprint:** `visual-attribute+spatial-position|matching|simultaneous|scaleDown>moveCCW||n2|d3`

## 10. Alternating three-rule sequence
**Profile:** Kem · **Format:** `sequence` · **Difficulty:** 5/5

**Student prompt:** Study the sequence. Which figure comes next?
**Correct answer:** A
**Composition:** `alternating` · 3 rule(s)
**Rule combination:** `sidesPlus1 + dotMinus1 + rotate45`
**Explanation:** Alternate: Increase each polygon’s side count by one. Remove one internal dot. Rotate the whole figure 45° clockwise.
**Reasoning steps:**
- Apply one transformation per step, cycling through the rules in this order: Increase each polygon’s side count by one. → Remove one internal dot. → Rotate the whole figure 45° clockwise.
**Distractor logic:** Uses the wrong direction or magnitude for dotMinus1; Applies the attribute change to the wrong component; Changes the size of one component but preserves the rest; Moves one component to an incorrect position
**Solver validation:** passed — independent-rule-replay
**Semantic fingerprint:** `quantitative-geometry+quantitative+orientation|sequence|alternating|sidesPlus1>dotMinus1>rotate45||n3|d5`
