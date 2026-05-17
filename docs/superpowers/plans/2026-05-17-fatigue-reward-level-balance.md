# Fatigue Reward Level Balance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebalance fatigue, paid/ad recovery, replay rewards, and level progression for Hero Sword.

**Architecture:** Keep the current constants-driven economy, but move fatigue to a 100-point scale. Add a small reward-rate helper for repeat clears and pass that rate into gold and EXP calculation.

**Tech Stack:** TypeScript, Phaser 3, Vite, Vitest.

---

### Task 1: Fatigue Economy Tests

**Files:**
- Modify: `tests/state.test.ts`
- Create: `tests/save.test.ts`

- [ ] Write tests that expect max fatigue 100, stage cost 3, ad reward 6, fallback 3.
- [ ] Write a save-load migration test where a legacy 1000/1000 save loads as 100/100 and 970/1000 loads as 97/100.
- [ ] Run `npm test -- --run tests/state.test.ts tests/save.test.ts` and verify the new tests fail before implementation.

### Task 2: Fatigue Economy Implementation

**Files:**
- Modify: `src/game/core/state.ts`
- Modify: `src/game/services/save.ts`

- [ ] Set `FATIGUE_MAX = 100`, `FATIGUE_COST_PER_STAGE = 3`, `AD_REWARD_FATIGUE = 6`, `AD_FALLBACK_FATIGUE = 3`.
- [ ] Normalize loaded fatigue to the new max while preserving the old ratio.
- [ ] Run `npm test -- --run tests/state.test.ts tests/save.test.ts` and verify it passes.

### Task 3: Reward and Level Tests

**Files:**
- Create: `tests/progression.test.ts`

- [ ] Write tests for the new EXP curve: stage 1 Normal clear gives 50 EXP, first Normal story pass ends around level 20, and repeat reward rate is 0.5 after a prior clear.
- [ ] Write tests that gold and EXP accept the repeat clear reward rate.
- [ ] Run `npm test -- --run tests/progression.test.ts` and verify the new tests fail before implementation.

### Task 4: Reward and Level Implementation

**Files:**
- Modify: `src/game/core/progression.ts`
- Modify: `src/game/data/world.ts`
- Modify: `src/game/scenes/BattleScene.ts`
- Modify: `src/game/types.ts`

- [ ] Change level cap to `140 + (level - 1) * 55 + floor((level - 1)^2 * 2)`.
- [ ] Change clear EXP to `34 + stage.order * 4 + stage.recommendedPower * 0.017`, with existing difficulty and fail scaling.
- [ ] Add repeat clear reward rate helper using pre-completion stage progress.
- [ ] Apply that reward rate to clear gold and EXP in `BattleScene.finishBattle`.
- [ ] Include the reward rate in `BattleResult` for debugging/result context.
- [ ] Run `npm test -- --run tests/progression.test.ts tests/battle.test.ts`.

### Task 5: Recovery Products and Docs

**Files:**
- Modify: `src/config/runtime.ts`
- Modify: `src/game/data/shop.ts`
- Modify: `src/game/scenes/CashShopScene.ts`
- Modify: `tests/store.test.ts`
- Modify: `tests/metaSystems.test.ts`
- Modify: `docs/game/SYSTEM_RULES.md`
- Modify: `docs/game/CORE_LOOP.md`
- Modify: `docs/release_ops/RELEASE_INPUTS.md`
- Modify: `docs/ui/FATIGUE_UIUX_AD_RECOVERY_PLAN_2026-05-16.md`
- Modify: `docs/PROJECT_BRIEF.md`
- Modify: `progress.md`

- [ ] Rescale paid products and local shop fatigue grants.
- [ ] Expose the large fatigue pack in the cash shop.
- [ ] Update tests to assert capped fatigue at 100 and consumable use under the new grants.
- [ ] Update docs with the new 100-point fatigue economy and replay reward rule.
- [ ] Run `npm test -- --run tests/store.test.ts tests/metaSystems.test.ts tests/shopOffers.test.ts`.

### Task 6: Final Verification

**Files:**
- No additional edits unless verification reveals failures.

- [ ] Run `npm run typecheck`.
- [ ] Run `npm test -- --run`.
- [ ] Run `npm run build`.
- [ ] Run `npm run test:smoke`.
- [ ] If a dev server is already needed, run the web-game Playwright client against the local Vite app and inspect the latest screenshot/output.
