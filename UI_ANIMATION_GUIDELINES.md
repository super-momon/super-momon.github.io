# UI Animation Guidelines

## Purpose

Motion should explain feedback, state, spatial relationships, or continuity. Use it to make an interaction easier to understand, not to decorate an otherwise static interface. These guidelines complement `DESIGN.md`, `UI_DESIGN_LAWS.md`, `UI_DESIGN_CRITERIA.md`, and `PRODUCT.md`.

Prefer the smallest motion that communicates the change. If removing an animation does not remove meaning or useful feedback, remove the animation.

## Initial Checklist

- [ ] Scale buttons to `0.97` on press.
- [ ] Do not animate from `scale(0)`.
- [ ] Do not animate the next tooltip when moving directly between targets.
- [ ] Make popovers origin-aware.
- [ ] Keep animations fast.
- [ ] Do not animate repeated key presses.
- [ ] Do not animate frequent or routine UI updates.
- [ ] Hover the parent and move or reveal its child.
- [ ] Enlarge small tap areas independently of their visible artwork.
- [ ] Use `ease-out` to enter and exit.
- [ ] Use `ease-in-out` for moving UI.
- [ ] Do not add hover-only behavior on touch screens.
- [ ] Experiment with a custom easing curve only when it improves the interaction.
- [ ] Use a brief blur when transitioning between icons.
- [ ] Chain related items with a restrained stagger.
- [ ] Swap elements in place without shifting the surrounding layout.
- [ ] Move elements along arcs when a natural curved path supports the spatial story.
- [ ] Increase scale and shadow together while an element is lifted into mid-air.
- [ ] Roll numbers instead of swapping their text abruptly.
- [ ] Fix shaky animations before adjusting timing or easing.

## Press, Hover, and Touch Feedback

### Button presses

Scale the button itself to approximately `0.97` during a pointer or touch press, then return it to `1`. Keep the whole effect within about 80-120 ms. Do not delay activation to let the animation finish.

Do not animate every repeated keyboard event. Keyboard users should receive an immediate selected, pressed, disabled, or completed state plus a visible `:focus-visible` ring without a sequence that retriggers while a key is held.

### Hover containment

Attach hover detection to the stable parent surface and animate the child that should respond. This keeps the hit target still while an icon, label, image, or highlight moves inside it.

Guard hover-only transitions with a fine pointer and hover-capable media query:

```css
@media (hover: hover) and (pointer: fine) {
  .control:hover .control__icon {
    transform: translateX(0.25rem);
  }
}
```

Touch and keyboard states must expose the same essential feedback through `:active`, `:focus-visible`, or another non-hover interaction. Never hide required actions or content behind hover.

### Small targets

Keep the visible icon or label compact when appropriate, but provide at least a 44 by 44 CSS-pixel interactive area through padding, a wrapper, or spacing. Expanding an invisible hit area must not overlap a neighboring target.

## Entering and Exiting

### Use visible starting points

Enter overlays and content from an already legible scale such as `0.96` or `0.98`; do not animate from `scale(0)`. Pair the transform with opacity so the transition feels like a reveal rather than material appearing from a pinprick.

Keep the initial paint visible and understandable if JavaScript or animation fails. Motion must enhance content that already exists in a usable state.

### Make overlays origin-aware

Popover, menu, and dropdown transform origins should point toward their trigger. The surface should appear to grow from the control or placement cue, while its final alignment remains stable.

When users move directly between adjacent tooltip triggers, show the next tooltip at its new target without replaying an entrance animation or travelling from the previous target. A tooltip is reference information and should not become a choreographed tour.

### Timing and easing

Use these ranges as a starting budget:

| Effect | Typical duration |
|---|---:|
| Immediate press or icon feedback | 80-150 ms |
| Routine selection, tooltip, or state change | 120-220 ms |
| Menu, popover, or small layout transition | 180-300 ms |
| Large view or deliberately authored focal sequence | 300-500 ms |

Faster is usually better for frequent interaction. Keep exits shorter than entrances, and never animate to create a delay.

- Use `ease-out` for elements entering or exiting a resting state, so they arrive decisively.
- Use `ease-in-out` for an element moving between two established positions.
- Start with a project-standard or platform-standard curve. Introduce a custom curve only after comparing it with a simpler option and verifying that it remains natural on interruption.

## Spatial Continuity

### Stagger related items

Use a stagger only when the items form one coherent group, such as a list of newly revealed results. Keep the per-item delay small and cap the total sequence so the last item is not waiting on earlier ones.

Do not stagger routine page sections, repeated controls, timers, or frequently refreshed data.

### Preserve the slot

When swapping status text, icons, or a content state, keep the element in the same usable footprint. Crossfade, clip, translate, or blur inside a fixed slot instead of moving the rest of the interface.

For changing numeric values, use a fixed-width tabular-numeric container. Prefer a vertical roll for meaningful numerical transitions over replacing the digits in place. Skip the roll for live timers or values that update too often to read.

### Follow a believable path

Move an object along an arc when doing so explains where it came from or where it is going. A straight transform is better when a curved path adds no information.

When an element lifts toward the viewer, let scale and shadow change together. A small scale increase without depth feels flat; a shadow without an aligned lift feels detached. Keep the effect bounded so it does not imply a draggable state that is not available.

### Transition icons deliberately

For related icon states such as loading, success, or error, use a brief blur, opacity transition, or matched cutout to soften the swap. The old and new icon should share the same box, center, and semantic meaning; the motion must not obscure the status long enough to make the control ambiguous.

## Frequency and Interruption

Do not animate frequent UI simply because a value changed. Timers, typing, live counters, pointer tracking, rapid selections, and background refreshes should remain steady unless motion conveys a meaningful milestone.

Animations must:

- be interruptible when the user changes direction or repeats the action;
- use the latest state rather than queueing stale transitions;
- avoid replaying long entrance motion on hover, focus, resize, or rerender;
- remain legible while fast-forwarding, pausing, or reversing;
- stop or simplify nonessential loops when offscreen or when the page is hidden.

## Performance and Stability

Prefer transform and opacity. Use layout animation, FLIP, or a measured layout transition only when moving between spatial states is the point; avoid casually animating `width`, `height`, `top`, `left`, or margins.

Bound expensive blur, shadows, filters, and backdrop effects to small regions. Do not apply permanent `will-change`; reserve it for a known, short animation and remove it afterward.

If an animation shakes or jumps:

1. Keep the animated and surrounding elements at stable dimensions.
2. Check transform origin, clipping, fractional dimensions, and text alignment.
3. Avoid mixing layout-driving and transform animation on the same change.
4. Prefer an integer-aligned travel distance when subpixel rendering causes visible drift.
5. Test at the affected device and zoom level before tuning the easing curve.

Never solve instability by making the animation longer.

## Accessibility

Provide an intentional `prefers-reduced-motion: reduce` alternative for every nonessential animation:

- Preserve meaningful feedback with color, opacity, text, icons, or border changes.
- Replace spatial travel and scale changes with a short or immediate state update.
- Disable ornamental loops, pulsing, stagger, and parallax.
- Do not flash, rapidly pulse, or place motion next to a quiz timer or other time-sensitive status.

Reduced motion means fewer and gentler transitions, not the removal of state communication. Test animation, focus, and control availability with keyboard navigation, touch input, light and dark themes, and mobile widths.

## Implementation Review

Before shipping motion, confirm:

- [ ] It has a defined purpose: feedback, state, relationship, or continuity.
- [ ] The initial and interrupted states are both usable.
- [ ] Duration matches frequency; routine interactions do not make users wait.
- [ ] Transform origins and layout footprints remain stable.
- [ ] Hover adds enhancement only and has keyboard/touch equivalents.
- [ ] Focus, labels, contrast, and error recovery remain visible during transitions.
- [ ] Reduced-motion behavior preserves meaning without spatial excess.
- [ ] Expensive effects are isolated and the result is smooth on the target device.
- [ ] Removing the motion would remove useful meaning or authorship.
