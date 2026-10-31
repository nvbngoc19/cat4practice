# Sample 24-question simulation — Kem

Seed: `DEMO-KEM-20261031-6` · 24 questions · 10 minutes · five choices per question. This is a generated demonstration set, not an official CAT4 paper.

| Q | Generator family | Format | Rule(s) | Structural distinction |
|---:|---|---|---|---|
| 1 | `matrixUnion` | 2x2-matrix | set-union + cell-position-mapping | Binary matrix set-union: combine occupied cells once without duplication |
| 2 | `nested` | nested-analogy | nested + secondary-feature-cycle | Inner/outer polygon side-count invariant plus separate shading cycle |
| 3 | `polygonDots` | relationship-match | polygonDots | Polygon edge count linked to internal dot count |
| 4 | `objectIndependentMove` | spatial-arrangement | independent-component-motion + component-identity-preservation | Two components follow independent positional cycles while identities stay fixed |
| 5 | `composedAnalogy` | compound-transformation | scaleDown + fillInvert + mirrorV | Ordered composition of three rules from distinct categories |
| 6 | `nestedLayers` | missing-component | nested-side-growth + fill-alternation | Multiple nested layers with independent side and shading cycles |
| 7 | `setRelationship` | relational-equivalence | set-intersection + exclusive-component-rejection | Set intersection and shared/exclusive component identity |
| 8 | `matching` | exact-match | matching | Exact identity across shape, orientation, fill and internal mark |
| 9 | `nestedParity` | nested-figure-match | outer-even-parity + inner-one-less | Parity plus fixed inner/outer side difference |
| 10 | `topologyLoops` | structural-property | cycle-rank | Graph cycle rank: count independent loops rather than enclosed visual regions |
| 11 | `arrowSequence` | next-figure | quarter-turn-direction-cycle + orientation-cycle | Directional cycle with an independent orientation marker |
| 12 | `countParity` | find-matching-figure | parity-plus-total + parity-classification + zero-square-condition | Parity conditions combined with a zero-count constraint |
| 13 | `geometrySideParity` | figure-classification | odd-sides-and-unfilled | Polygon side-count parity plus fill-state condition |
| 14 | `analogySwapAndFill` | visual-analogy | pairwise-swap + global-fill-inversion | Paired component position swap plus global fill inversion |
| 15 | `matrixRows` | 3x3-matrix | row-column-dual-progression + nested-side-difference | 3×3 matrix with simultaneous row and column rules |
| 16 | `nestedContainment` | equivalent-figure | inner-contained-by-outer | Containment order: one polygon must remain strictly inside another |
| 17 | `oddSideClass` | odd-one-out | polygon-side-parity | Classify polygon by odd/even side-count property |
| 18 | `geometryRegularityProxy` | find-equivalent-figure | polygon-side-gap + two-boundary-counting | Difference between inner and outer polygon side counts |
| 19 | `containment` | matching-property | containment-order | Inside/outside membership and relative polygon size |
| 20 | `countComposite` | two-condition-classification | typed-component-count + shading-count | Shape-type count vector combined with shading count |
| 21 | `positionCycle` | transformed-figure | paired-position-exchange + fixed-component-invariant | Two objects exchange positions while a third component stays fixed |
| 22 | `relationAnalogy` | analogy | relational-invariant-transfer + component-count-difference + fill-toggle | A→B analogy with simultaneous side-count, dot-difference and fill changes |
| 23 | `sequence` | sequence-completion | sequence + secondary-feature-cycle | Polygon side-count progression plus independent shading alternation |
| 24 | `gridRowCount` | grid-completion | row-count-progression | Grid row occupancy increases 1, then 2, then 3 |

## Answer key and explanations

### Q1 — matrixUnion

**Prompt:** The first two grids combine to make the third. Which grid completes the same relationship for the fourth?

**Underlying rule:** Combine the shaded cells from both figures, keeping each occupied cell once. Apply the same union rule to the second pair.

**Correct answer:** B

**Reasoning:** Compare the first two grids cell by cell. Identify whether shared cells cancel or remain. Apply the same operation to the second pair. Check both the cell positions and total.

### Q2 — nested

**Prompt:** Which nested figure follows both relationships?

**Underlying rule:** The inner polygon has exactly 2 more side(s) than the outer polygon. Shading alternates independently.

**Correct answer:** A

**Reasoning:** Count the sides of the outer polygon. Count the sides of the inner polygon. Compare inner minus outer in every example. Preserve the shading alternation as a separate feature.

### Q3 — polygonDots

**Prompt:** Which option continues the same relationship between polygon sides and dots?

**Underlying rule:** The number of dots is always 1 more than the polygon's number of sides.

**Correct answer:** C

**Reasoning:** Count the polygon sides in each example. Count the dots separately. Calculate dots minus sides. Apply the same difference to the answer.

### Q4 — objectIndependentMove

**Prompt:** Which arrangement follows the independent two-track position cycle?

**Underlying rule:** The triangle advances one anchor to the right while the circle advances one anchor to the right on its own lower track, wrapping after the third anchor.

**Correct answer:** A

**Reasoning:** Track the triangle’s upper row position. Track the circle’s lower row position independently. Apply one-step cyclic movement to both tracks.

### Q5 — composedAnalogy

**Prompt:** The first figure changes into the second by a set of rules. Apply the same rules, in the same order, to the third figure. Which option completes the analogy?

**Underlying rule:** Reduce each component proportionally. Then Invert the fill of every component. Then Reflect the figure across a vertical axis.

**Correct answer:** A

**Reasoning:** Compare the first figure with its transformed partner. Identify each independent change; do not focus on only one feature. Reduce each component proportionally. Invert the fill of every component. Reflect the figure across a vertical axis. Apply the same ordered rule sequence to the final reference figure. Check the answer against every component and property.

### Q6 — nestedLayers

**Prompt:** Which nested figure completes the two-rule sequence?

**Underlying rule:** The outer and inner polygons each gain one side, while the fill state alternates at each step. Both the geometric relation and shading cycle matter.

**Correct answer:** B

**Reasoning:** Count the sides of both outlines. Compare the changes from the first example to the second. Track fill alternation independently. Select the only option preserving both.

### Q7 — setRelationship

**Prompt:** Which option contains exactly the components shared by both reference sets?

**Underlying rule:** The shared component set is circle and square; triangle and pentagon are exclusive. Select exactly the shared shapes.

**Correct answer:** C

**Reasoning:** List identities in set A. List identities in set B. Keep only identities in both. Ignore component positions.

### Q8 — matching

**Prompt:** Which option is exactly the same figure as the reference?

**Underlying rule:** Match the complete feature profile: outline, orientation, fill and internal mark. Only one option is identical in every feature.

**Correct answer:** B

**Reasoning:** Compare the outer shape. Check its orientation and shading. Inspect the internal symbol. Reject any option with even one changed feature.

### Q9 — nestedParity

**Prompt:** Which nested figure satisfies both geometric conditions?

**Underlying rule:** The outer polygon has an even number of sides and the inner polygon has exactly one fewer side.

**Correct answer:** D

**Reasoning:** Count outer sides. Check even parity. Count inner sides. Check the one-side difference.

### Q10 — topologyLoops

**Prompt:** Which arrangement contains exactly two independent closed loops?

**Underlying rule:** Adding one diagonal to a square creates exactly two independent closed loops. Count independent cycles, not visual regions.

**Correct answer:** D

**Reasoning:** Identify vertices and edges. Trace independent closed paths. A square has one cycle. One diagonal splits the square into two independent cycles.

### Q11 — arrowSequence

**Prompt:** Which arrow comes next in the direction cycle?

**Underlying rule:** The arrow turns 90° clockwise at each step and cycles through four directions.

**Correct answer:** D

**Reasoning:** Track the arrowhead. Compare consecutive quarter-turns. Continue the four-position cycle. Do not substitute reflection for rotation.

### Q12 — countParity

**Prompt:** Which option satisfies all three numerical conditions?

**Underlying rule:** The correct option has an even number of triangles, an odd number of circles and no squares; all three conditions must hold.

**Correct answer:** E

**Reasoning:** Count triangles and check even/odd. Count circles and check even/odd. Check that no square is present.

### Q13 — geometrySideParity

**Prompt:** Which option is shaded and has an odd number of sides?

**Underlying rule:** All examples are unfilled polygons with an even number of sides. Choose the only option that is both shaded and has an odd number of sides.

**Correct answer:** A

**Reasoning:** Count the sides. Check whether the count is even or odd. Check fill state as a separate condition.

### Q14 — analogySwapAndFill

**Prompt:** Which option applies the same two-part transformation?

**Underlying rule:** The two upper components exchange positions, and every component reverses its fill state. Apply both operations to C.

**Correct answer:** E

**Reasoning:** Track the triangle and circle by identity. Check the upper-position exchange. Invert the fill of all three components. Reject options that apply only one operation.

### Q15 — matrixRows

**Prompt:** Which figure completes the 3×3 matrix?

**Underlying rule:** Across every row and column, both outlines gain one side per step. The inner outline always has exactly one fewer side than the outer outline; the missing cell is 7 sides outside and 6 inside.

**Correct answer:** D

**Reasoning:** Read each row from left to right. Check the same +1 change down each column. Track outer and inner side counts separately. Preserve the one-side difference.

### Q16 — nestedContainment

**Prompt:** Which option preserves the same nested relationship?

**Underlying rule:** In each example the inner boundary is a polygon with fewer sides than the outer boundary and remains fully enclosed. Choose another figure preserving inner-within-outer order.

**Correct answer:** D

**Reasoning:** Identify which boundary is outer. Compare side counts. Check that the smaller boundary remains inside.

### Q17 — oddSideClass

**Prompt:** Which polygon belongs in the same group?

**Underlying rule:** Every example has an odd number of sides. Select the option with an odd side count.

**Correct answer:** C

**Reasoning:** Count the vertices. Record side-count parity. Choose the only odd side count.

### Q18 — geometryRegularityProxy

**Prompt:** Which nested figure preserves the same outer–inner side-count difference?

**Underlying rule:** The outer polygon always has exactly 2 more sides than the inner polygon. Preserve this side-count difference.

**Correct answer:** B

**Reasoning:** Count the outer polygon sides. Count the inner polygon sides. Calculate outer minus inner. Choose the figure with the same fixed difference.

### Q19 — containment

**Prompt:** Which figure has the same inside–outside relationship as the reference?

**Underlying rule:** Match the containment relationship: the smaller three-sided figure is fully inside the larger six-sided figure. Ignore fill state.

**Correct answer:** A

**Reasoning:** Identify the outer boundary. Identify the inner boundary. Compare which shape contains the other. Ignore irrelevant shading changes.

### Q20 — countComposite

**Prompt:** Which figure satisfies both conditions at once?

**Underlying rule:** The target must contain exactly two filled components and two circles in total. Count by shape type and fill state separately.

**Correct answer:** E

**Reasoning:** Count all components. Count circles only. Count filled components only. Choose the only option satisfying both counts simultaneously.

### Q21 — positionCycle

**Prompt:** Which option shows the same paired position exchange?

**Underlying rule:** The triangle and circle exchange left/right positions; the square stays fixed and shading is preserved.

**Correct answer:** C

**Reasoning:** Track each shape by identity. Record the two positions that exchange. Check the fixed square. Reject options that alter fill or move the fixed component.

### Q22 — relationAnalogy

**Prompt:** A is to B as C is to which option?

**Underlying rule:** A→B increases the polygon side count by 2, keeps the dot-to-side difference fixed, and toggles fill. Apply the same relationship to C.

**Correct answer:** C

**Reasoning:** Compare side counts in A and B. Check the dot-minus-side difference. Record the fill change separately. Apply all parts of the relationship to C.

### Q23 — sequence

**Prompt:** Which figure completes the sequence?

**Underlying rule:** Two features change: the polygon gains one side at each step, and the fill alternates black, white, black, white.

**Correct answer:** B

**Reasoning:** Count polygon sides from left to right. Identify the constant increase of one side. Track fill separately as an alternating feature. Apply both rules to the next figure.

### Q24 — gridRowCount

**Prompt:** Which grid follows the 1–2–3 shaded-cell rule from top to bottom?

**Underlying rule:** Each row contains one more shaded cell than the row above: 1, then 2, then 3.

**Correct answer:** E

**Reasoning:** Count shaded cells in row one. Count row two. Continue the progression. Check all three cells in the final row.

