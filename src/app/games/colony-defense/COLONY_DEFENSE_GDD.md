# Colony Defense - Game Design Document

## Document Purpose

This document defines the intended gameplay, player goals, systems, interface, balance, and implementation priorities for Colony Defense. It supersedes assumptions made by the prototype and is the reference for future design and engineering work.

## Implemented Gameplay Snapshot

The current implementation includes:

- An 8-second opening grace period.
- Continuous survival runs with no fixed population ceiling.
- 10-durability organism parts and 400-durability nutrient nodes.
- Colony growth continues independently of the active fire target, including while a cache is prioritized.
- Threat stages for Seedling, Spreading, Hyperplasia, Invasion, and Crisis.
- Temporary rapid-spread, armored, and nutrient-seeking colony mutations.
- Cache reward choices between research and a random turret upgrade.
- Keyboard targeting and pause controls.
- Emergency 50-durability wall stabilization.
- Fire-rate chain traits and damage siege-piercing traits at upgrade milestones.
- Visible in-run threat, suppression, wall, cache, and feedback states.
- A short How to Play tutorial on the intro screen.

## Current Status

Colony Defense is a playable-system prototype with a fixed turret, spreading organism, nutrient nodes, research economy, turret upgrades, wall repair, randomized runs, and end-of-run scoring.

The survival loop now uses no fixed population ceiling, stronger organism parts, readable threat stages, cache choices, tutorial and keyboard controls. The colony is suppressed and stops generating when no organism parts remain. Remaining work should focus on long-run balancing and playtest validation rather than restoring core survival behavior.

## Game Overview

### Player Fantasy

The player operates the final defensive turret in a microscopic habitat. The colony is always growing, so every decision is about prioritizing pressure and spending limited research before the organism reaches the turret.

### Core Promise

Protect the habitat for as long as possible by:

1. Shooting high-value organism parts.
2. Denying nutrient nodes.
3. Capturing temporary research-cache bonuses.
4. Repairing the turret wall.
5. Spending research on fire-rate and damage upgrades.

### Primary Mode

Colony Defense begins as a single-player, endless-survival run.

- The habitat starts intact.
- The organism starts near one edge.
- The run ends only when habitat vitality reaches zero.
- Optional future content may add extraction, boss, or objective modes, but they must not replace the survival loop.

## Design Pillars

1. **Read, Prioritize, Adapt:** The player should understand the immediate threat and choose one or two priorities rather than manage every detail.
2. **Escalation with Counterplay:** The organism grows faster over time, but the turret gains research and upgrades in response.
3. **Continuous Pressure:** The colony generates continuously until the player suppresses all organism parts. Cache targeting must never pause colony growth.
4. **Simple Actions, Consequential Timing:** Targeting is direct, while deciding what to deny and when to spend research creates strategy.
5. **Readable Micro-Scale:** Threat, nutrients, cache, turret, and habitat states must remain visually distinct at desktop and mobile sizes.

## Core Gameplay Loop

### 0-15 seconds: Establishing

- The organism spawns at a random edge.
- A short grace period allows the player to learn the starting shape.
- The automatic target selects the nearest organism part.
- Base research income begins accumulating.
- The player can place a target area or prioritize a nutrient node.

### 15-60 seconds: Building

- New organism parts spread toward nutrients or the turret.
- The player decides between suppressing colony growth, denying nutrients, and saving research.
- The first research cache appears.
- The player makes the first meaningful turret upgrade.

### 60-180 seconds: Escalation

- Territory, biomass, consumed nodes, and population bonuses increase growth.
- The colony begins reaching the turret wall repeatedly.
- Cache appearances create short-lived bonus choices.
- Wall repairs become important if the player focuses too heavily on growth.

### 180 seconds and beyond: Crisis

- Growth exceeds the base turret's ability to suppress it without upgrades.
- Mutation or equivalent threat stages signal a clear difficulty transition.
- Scoring becomes a record of survival and habitat preservation.

## Win and Loss Conditions

### Loss

The habitat is lost when turret durability reaches zero.

The final screen should identify the cause:

- The wall was breached repeatedly.
- Nutrients accelerated the organism.
- The organism reached the turret while resources were being spent elsewhere.

### Victory

For the primary endless mode, there is no organism-eradication victory. Optional future modes may have a victory condition, such as clearing three mutation waves or surviving a fixed duration.

Any objective mode must visibly state its objective before the run starts and must not reuse the survival mode's empty-colony result.

## Colony System

### Organism Parts

Organism parts should have meaningful durability, not one-hit durability, so targeting and fire rate remain tactically relevant.

Baseline implementation target:

- Starting organism-part durability: 8-12.
- No fixed population ceiling; the organism continues producing parts until suppressed or no valid habitat position remains.
- Growth interval begins at 1.2 seconds and increases with territory, biomass, mutation, and consumed nutrients.
- Suppressed parts can be cleared, but clearing the whole colony must not end the run in survival mode.

### Growth Rules

Growth should be a readable contest:

- Colony spread follows active nutrient nodes, the turret, and random directions.
- Territory occupation increases growth.
- Biomass increases growth.
- Mutation is a timed, visible escalation stage.
- Consumed nutrient nodes permanently increase growth and damage scaling.

### Suppression State

When the final organism part is destroyed, generation stops and the HUD shows that the colony is suppressed.

- Clearing the colony does not end the run.
- No automatic reseed occurs.
- Growth resumes only after a new organism source is introduced or a future objective mode adds a restart mechanic.

## Turret System

### Targeting

The target is fixed at the habitat center. The player controls what the turret attacks.

Target priority should be:

1. A targeted cache, while it remains valid.
2. A targeted nutrient node, while it remains active.
3. A manual organism target area.
4. Nearest organism part in automatic mode.

Priorities should be temporary, visible, and reversible. If a priority target is cleared or destroyed, the turret should return to the next valid priority.

### Manual Target Area

- Dragging a target circle moves the organism target area.
- The selected area highlights colony parts and reports the part count.
- Clicking outside the existing area creates or moves the area.
- Clearing the area restores automatic targeting.

### Nutrient Priorities

Selecting a node should help deny it or slow colony growth. The HUD should show:

- Active, destroyed, or consumed state.
- Remaining durability.
- Whether it is currently targeted.
- The biomass or growth threat it represents.

### Research Caches

A cache is a high-value optional objective. Its reward should be visible before targeting:

- Research grant, scaling by elapsed run time.
- Random damage or fire-rate upgrade.

At 0 elapsed minutes, cache research rewards remain in the 20-100 base range. At 1 elapsed minute, the range doubles; at 2 elapsed minutes, it triples. The applied multiplier is `1 + elapsedMinutes × 1`, rounded to whole research values. Cache UI always shows the current multiplier and final reward.

Targeting a cache should not permanently abandon more urgent colony or nutrient threats unless the player explicitly chooses that behavior.

## Turret Wall and Habitat

The wall and habitat are two separate defense layers.

- The wall absorbs contact damage first.
- The habitat loses durability only after wall breach or direct turret contact.
- Wall repair restores the wall to full durability for a research cost.
- Repair is a clear tradeoff against turret upgrades.

The UI should show:

- Habitat vitality and maximum durability.
- Wall durability and maximum durability.
- Whether either layer is under attack.
- The exact wall repair cost.

Habitat loss should not use a generic vitality percentage alone. The player should also receive a clear breach warning.

## Economy and Upgrades

### Research Sources

- Passive research per second.
- Bonus research for each active nutrient node.
- Research for destroying organism parts.
- Research for denying nutrient nodes.
- Cache rewards.

The baseline economy should let a player afford an early upgrade in 10-30 seconds, but should prevent upgrades from removing all tension.

### Turret Upgrades

Two meaningful upgrade paths remain:

- Damage: increases pressure against parts, nodes, and caches.
- Fire rate: improves targeting speed and response to growth.

Costs should increase, gains should remain visible, and unlimited upgrades should not become mathematically opaque.

Recommended UI rules:

- Show current value, next value, and exact cost.
- Disable unaffordable purchases.
- Keep one primary "most urgent" recommendation optional.
- Avoid a 100-line balance sheet as the only source of player guidance.

## Scoring

Scoring rewards three aspects:

- Survival time.
- Habitat vitality and average vitality.
- Colony suppression.

The run summary should show the formula and a concise breakdown:

- Time held.
- Organism parts cleared.
- Nutrient nodes denied.
- Caches destroyed.
- Average habitat vitality.

Scores should not count only time. A long run with low vitality should be meaningfully different from a shorter high-vitality run.

## Interface Requirements

### Start Screen

The start screen must communicate one sentence and one primary action:

"Protect the habitat, deny nutrients, and spend research to survive."

The start screen should include:

- Begin Run.
- A concise How to Play panel.
- A separate detailed stats or field manual panel.

The How to Play panel should cover only the first-minute decisions.

### Live HUD

On desktop, the arena should remain the visual anchor and the console should prioritize live decisions:

1. Habitat vitality.
2. Wall durability.
3. Immediate threat stage.
4. Research.
5. Target controls.
6. Upgrades.
7. Detailed node and cache information.

Avoid showing low-level metrics unless the player opens the field manual.

### Target Feedback

The player needs immediate feedback for:

- Targeted organism area.
- Priority node or cache.
- Wall breach.
- Nutrient consumed.
- Mutation stage.
- Cache arrival.
- Upgrade purchase.
- Repopulation after suppression.

### End Screen

The result screen should report:

- Outcome.
- Run time.
- Run score.
- Score breakdown.
- Cause of loss.
- One clear retry action.
- Return to portfolio.

## Threat Stages

Threat stages provide readable escalation:

| Stage | Suggested trigger | Player-visible change |
|---|---|---|
| Seedling | 0-30 seconds | Single edge colony and initial growth |
| Spreading | 30-75 seconds | Faster spread and early nutrient pressure |
| Hyperplasia | Biomass threshold | Colony growth and territory accelerate |
| Invasion | Nodes consumed or wall contact | Growth and habitat damage increase |
| Crisis | Population near cap or repeated wall breach | Strong warning, cache and repair urgency |

The stage should be announced by the HUD and arena, not only as a small status value.

## Audio and Motion

Audio and motion should communicate changes rather than decorate them.

- Turret fire should have a restrained impact sound.
- Wall and habitat damage should escalate audibly.
- Cache arrival should give a clear one-time cue.
- Mutation should use a brief, non-flashing visual transition.
- Reduced-motion preference should disable pulsing and ornamental transitions.

## Accessibility

The game must support:

- Keyboard canvas targeting or an equivalent keyboard control scheme.
- Visible keyboard focus.
- Screen-reader labels for all controls and status meters.
- Text labels in addition to color-coded threat states.
- Reduced-motion support.
- Mobile touch controls.
- A way to pause or inspect the game without losing the run state unintentionally.

## Randomization

Every run should vary:

- Colony origin edge.
- Nutrient-node placement.
- Cache position.
- Cache reward.
- Growth direction.

Randomization should avoid:

- Nutrients inaccessible because of overlap or poor placement.
- Spawn positions within unsafe or unreachable neighborhoods.
- Caches adjacent to the turret or beneath a colony.
- Starting conditions where a run ends before player input.

## Balance Requirements

Current constants are useful prototype baselines, but every major behavior should be measurable and tunable:

| System | Prototype baseline | Review requirement |
|---|---|---|
| Habitat durability | 1,000 | Keep as a long-run resource |
| Wall durability | 250 | Repair and breach should be meaningful |
| Organism-part durability | 1 | Increase to preserve target tradeoffs |
| Nutrient durability | 1,000 | Review against new turret damage |
| Base turret damage | 0.1 | Target long-run sustained suppression |
| Base fire interval | 0.35 seconds | Preserve responsiveness |
| Population ceiling | None | Keep dense growth stable and visually readable |
| Cache timing | 12-20 seconds first | Grace period and cache must both feel fair |
| Cache research scaling | 20-100 × (1 + elapsed minutes) | Late-run cache bonuses grow continuously |
| Fire-rate upgrade cost | 10 x 1.35^level | Expose as cost progression |
| Damage upgrade cost | 16 x 1.45^level | Expose as cost progression |

## Implementation Priorities

### P0: Make Survival Functional

1. Remove organism-eradication victory from survival mode.
2. Keep suppression visually explicit when the final organism part is cleared.
3. Rebalance organism-part durability.
4. Add a grace period before initial growth damage.
5. Confirm the organism, node, cache, wall, and habitat never enter a permanently idle or contradictory state.

### P1: Make Strategy Readable

1. Replace the dense first-run experience with a short How to Play panel.
2. Add clear threat-stage and cache-arrival announcements.
3. Improve live target feedback.
4. Separate detailed scaling stats from essential run controls.
5. Add keyboard targeting and pause behavior.

### P2: Deepen the Economy

1. Tune cache and upgrade timing.
2. Reassess node durability and deny-reward value.
3. Add milestone rewards or a small asymmetric upgrade choice.
4. Add fixed-duration objective modes only after survival stability.

### P3: Finish and Extend

1. Add persistent personal best or leaderboard behavior.
2. Add stronger audio and visual feedback.
3. Add run variants, mutations, or boss stages.
4. Add automated simulation tests and balance dashboards.

## Acceptance Criteria

The game is ready for broader playtesting when:

- A run cannot end after a few seconds from normal successful suppression.
- The organism remains an active threat until habitat vitality reaches zero.
- The player can understand controls without the balance sheet.
- Every visible priority and upgrade state can be canceled or redirected.
- Nutrients, wall damage, caches, and upgrades create different decisions instead of merely changing numbers.
- Habitat loss is explained by a clear cause.
- The game remains controllable on mobile and keyboard is available on desktop.
- The 15-second, 60-second, 180-second, and crisis stages are distinguishable in play.
