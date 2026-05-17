# Fatigue, Reward, and Level Balance Design

## Summary

This pass changes the stamina economy from a 1000-point scale to a 100-point scale. One stage entry costs 3 fatigue, so a full bar supports about 33 runs before recovery, ads, or purchases.

## Decisions

- Fatigue maximum: 100.
- Stage entry cost: 3.
- Natural recovery: keep 1 fatigue per 5 minutes.
- Rewarded ad fatigue: +6, equal to 2 extra stage entries.
- Ad fallback fatigue: +3, equal to 1 extra stage entry.
- Paid fatigue small pack: +18, equal to 6 extra stage entries.
- Paid fatigue large pack: +45, equal to 15 extra stage entries.
- Starter pack fatigue: +9, equal to 3 extra stage entries.
- Local shop fatigue items are rescaled to the 100-point economy.
- A stage difficulty that was already cleared at 1 star or higher grants 50% gold and 50% EXP on later clears.
- First clears still grant full rewards, even if they improve from 1 star to 3 stars later only as replay rewards.

## Level Balance

The current curve reaches about level 13 after the first 24 Normal stages. The new target slows early growth:

- End of continent 1 Normal: about level 8.
- End of all 144 Normal stages: about level 20.
- End of Hard progression: about level 29.
- End of Hell progression: about level 37.

This keeps story progress from outpacing equipment gates while leaving Hard and Hell as meaningful growth routes.

## Integration

- Existing saves with 1000-point fatigue are migrated by preserving their fatigue ratio on load.
- UI labels use the existing constants, so changing constants updates stage select, result, and village fatigue displays.
- Cash shop should expose both fatigue small and fatigue large products.
- Release docs must describe the new reward amounts without changing live ad unit IDs.

## Risks

- Existing local saves can feel like they lost points because 1000/1000 becomes 100/100. This is intended ratio migration.
- Lower fatigue numbers make each reward more visible, so ad and IAP amounts must stay conservative.
- Replay reward reduction should use the state before calling `completeStage`, or a first clear can be mistaken as a repeat clear.
