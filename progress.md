Original prompt: 현재까지 진행상황 체크해줘. 게임 웹에서 실행해줘. 글자들이 너무 겹쳐 있어. 안겹치게 정리해줘.

# progress.md

## 2026-05-17 - fatigue, replay reward, and level balance

- Rebalanced fatigue from `1000 / 10` to `100 / 3`, so a full bar now supports about 33 stage entries.
- Changed rewarded fatigue ad grant to `+6` and fallback to `+3`.
- Rescaled paid fatigue grants:
  - starter pack `+9`
  - small fatigue pack `+18`
  - large fatigue pack `+45`
- Added the large fatigue pack to the cash shop product list.
- Added save migration so legacy `1000` point fatigue saves preserve their ratio on load, e.g. `970/1000 -> 97/100`.
- Slowed EXP progression so the full 144-stage Normal route lands around level 20 instead of level 35.
- Added repeat clear reward scaling: if the same stage difficulty was already cleared at least once, clear gold and EXP use `0.5`.
- Added/updated tests:
  - `tests/state.test.ts`
  - `tests/save.test.ts`
  - `tests/progression.test.ts`
  - `tests/store.test.ts`
  - `tests/metaSystems.test.ts`
- Verification so far:
  - `npm test -- --run tests/state.test.ts tests/save.test.ts tests/progression.test.ts tests/store.test.ts tests/metaSystems.test.ts`
  - `npm run typecheck`
  - `npm test -- --run`
  - `npm run build`
  - `npm run test:smoke`
  - `npm run test:town`
  - Direct Playwright cash shop capture under `output/fatigue-balance-2026-05-17/`; it shows starter, small fatigue, and large fatigue products with no console/page errors.
- Remaining:
  - Android device QA is still needed for real rewarded ad completion/cancel/fallback and IAP grant callbacks.

## 2026-05-16 - fatigue visibility and rewarded recovery ad

- Added a fixed village fatigue HUD bar so the player can see current fatigue without opening a menu.
- Added stage-select fatigue context: current fatigue, entry cost, post-entry estimate, and ad recovery amount.
- Added a result-screen fatigue strip with current fatigue, next-entry cost preview, and a rewarded recovery button. Current balance is `광고 +6`.
- Split rewarded ad units into `rewardedFatigue` and `rewardedGacha` so AdMob reporting can separate fatigue recovery from daily ad 10-summon.
- Added planning and release handoff docs:
  - `docs/ui/FATIGUE_UIUX_AD_RECOVERY_PLAN_2026-05-16.md`
  - `docs/release_ops/ADS_UNITS_FATIGUE_RECOVERY_2026-05-16.md`
- Verification so far:
  - `npm run typecheck`
  - `npm test -- --run tests/ads.test.ts tests/state.test.ts`
  - `npm test -- --run`
  - `npm run build`
  - `npm run test:town`
  - `npm run test:smoke`
  - develop-web-game client capture under `output/fatigue-ui-web-client-2026-05-16/`; it still captures the boot surface in this repo.
  - Direct Playwright captures under `output/fatigue-ui-direct-2026-05-16/` verified the old village/stage/result fatigue UI before the 2026-05-17 balance update.
- Remaining:
  - Real Android AdMob completion/cancel/fallback is still device QA.

## 2026-05-16 - AdMob live unit values applied

- Applied the user-provided AdMob App ID and Unit IDs:
  - `banner`: `ca-app-pub-4402708884038037/9732991146`
  - `interstitial`: `ca-app-pub-4402708884038037/8162705869`
  - `rewardedGacha`: `ca-app-pub-4402708884038037/7909378821`
  - `rewardedFatigue`: `ca-app-pub-4402708884038037/1122654798`
  - `rewardedFatigueAdTenSummon`: `ca-app-pub-4402708884038037/4329455374` as a reserved config slot.
  - Android App ID: `ca-app-pub-4402708884038037~1307706218`.
- Changed ad resolution so `useTestAds=true` always resolves to official Google test unit IDs, even when live IDs are configured.
- Ran `npx cap sync android` after `npm run build`; Android web assets now include the applied live IDs.
- Verification:
  - `npm run typecheck`
  - `npm test -- --run tests/ads.test.ts`
  - `npm run build`
  - `npx cap sync android`
  - `android/gradlew.bat assembleDebug` with `JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot`
- Note:
  - The default local `JAVA_HOME` points to JDK 17, which fails Android compile with `invalid source release: 21`. Use JDK 21 for Android builds.

## 2026-05-07 - mandatory opening and title start flow

- Added a dedicated title/logo scene after the opening cutscene.
- Changed boot flow so the opening cutscene always plays first, regardless of the saved `seenCutscenes` state.
- Preserved a fixed entry order: opening animation/video -> title/logo prompt -> Enter starts the village.
- Updated the town manual check script so automated verification presses through the opening and title sequence instead of assuming direct village entry.
- Verification:
  - `npm run typecheck`
  - `npm run test`
  - `npm run test:town`
  - `npm run build`
  - Direct Playwright startup captures saved under `output/startup-flow-direct-2026-05-07/`.
- Remaining known console warnings are the already-tracked missing weapon item thumbnail/detail PNGs.

## 2026-05-07 - item and fallback image prompt consolidation

- Added `docs/art/IMAGE_PROMPTS.md` as the current single prompt source for missing shop item images, old fallback-icon replacements, UI support backgrounds, and near-term shop feature expansion assets.
- Added `docs/art/MISSING_IMAGE_PROMPTS_ONLY_2026-05-07.md` for the strict missing-only list, excluding optional remake/future-feature prompts.
- Rechecked runtime image paths and separated currently missing files from optional regeneration/future feature prompts.
- Current confirmed missing runtime PNGs:
  - `weapon_tome`, `weapon_record_book`, `weapon_pistol`, `weapon_daggers`, `weapon_scimitar` thumbnail/detail pairs.
  - `party_background.png`, `character_detail_modal.png`, `equipment_inventory_panel.png`, `equipment_workshop_background.png`.

## 2026-05-06 - town shop cash menu cleanup

- Removed the loose brown dirt/farm patch rendering from the village road network; shop approach lanes now reuse stone road tiles instead of mismatched dirt tiles.
- Added lower wall corner caps so the left/right wall runs visually close into the south wall priority layer.
- Removed starter/fatigue cash products from normal shop lists and hid the old cash-product hint in shop inventory.
- Added a dedicated `cash_shop` scene opened from the village menu under `유료 결제`; it lists the starter pack and fatigue pack with existing paid-product artwork and purchase details.
- Removed the upper-right menu button/panel from town shop interiors; interaction remains through the merchant/exit markers.
- Verification:
  - `npm run typecheck`
  - `npm run test`
  - `npm run test:town`
  - `npm run build`
  - develop-web-game client ran at `output/web-client-2026-05-06-town-cash-followup/` but still only captured boot state in this repo.
  - Direct Playwright captures saved under `output/town-cash-direct-2026-05-06b/`, `output/town-cash-direct-2026-05-06c/`, and `output/town-cash-direct-2026-05-06d/`.
- Remaining known art warnings: weapon tome/record book/pistol/daggers/scimitar item thumbnails/details are still missing PNGs, so Phaser logs failed image loads for those existing placeholder asset paths.

## 2026-05-05 - mandatory event talk marker scope

- Restricted NPC `[!]` markers to mandatory talk-driven story progression instead of all nearby NPCs.
- Removed `[!]` creation from ambient NPCs and hid the generic nearby-interaction `[!]` for normal NPC/story NPC conversations.
- Kept the required story marker for Bram before starter companion recruitment, and raised its depth so it stays visible above world art.
- Disabled palace NPC `[!]` markers because the first audience is auto-triggered, not a required manual talk prompt.
- Verification:
  - `npm run typecheck`
  - `npm run test`
  - `npm run test:town`
  - `npm run build`
  - develop-web-game Playwright client ran after marker changes; this repo's default client still captures only booting state.
  - direct Playwright captures under `output/marker-scope-2026-05-05-depth-update-final/` confirm normal NPC markers are hidden and the Bram-required marker remains available.

## 2026-05-04 - town shop missing art import

- Imported the new images from `image/TOWN_SHOP_MISSING_ART_READY_TO_COPY_PROMPTS_2026-05-04/` and split them into runtime PNGs.
- Removed the baked checker backgrounds while cropping wall pieces, shop entrance markers, five static counter merchants, currency icons, furniture icons, and cash product icons.
- Registered new wall, shop marker, merchant counter, currency, and cash product assets in the runtime art maps.
- Updated village entrances to render the new shop markers and added modular wall pieces around the town boundary.
- Updated shop interiors so all five shop types use static merchant-counter artwork instead of procedural placeholder counters.
- Updated shop UI resource icons and starter/fatigue paid product thumbnails/details to use the new images.
- Verification:
  - `npm run typecheck`
  - `npm run test`
  - `npm run test:town`
  - `npm run build`
  - direct Playwright captures under `output/shop-art-direct-check-clean-wait/`

## 2026-05-04 - dialogue, party roster, and fountain cleanup

- Rewrote stiff Korean dialogue/localization lines around the first companion flow and town NPC chatter so the text reads more naturally in Korean mode.
- Reduced the dialogue portrait panel width and shifted body text left so landscape browser captures leave more room for dialogue text.
- Reworked the party screen so roster/current-party cards use high-quality dialogue portrait face frames instead of small dot sprites.
- Added a candidate detail modal: selecting a roster entry now opens details first, and `Party Assign` confirms placement from that modal.
- Fixed portrait face extraction by registering cropped texture frames; this avoids Phaser scaling the crop against the full 512px source image.
- Removed contaminated fountain ripple/spout runtime effects from preload/rendering so baked English guide text no longer appears over the fountain.
- Verification:
  - `npm run typecheck`
  - `npm run test`
  - `npm run test:town`
  - `npm run build`
  - direct Playwright captures under `output/party-detail-face-check-final6/`, `output/party-assign-flow-check/`, and `output/dialogue-town-final-check/`
  - develop-web-game client ran with explicit script path; it still captured only the booting state for this repo, so scene-specific Playwright checks were used for visual/state verification.

## 2026-05-04 - village exterior runtime-art rebuild

- Rebuilt the Lumen Village exterior render path around the approved runtime tile/building/effect images.
- Removed active atlas/procedural fallback usage for exterior ground, roads, walls, fountain, shop facades, props, entrance effects, and town NPCs.
- Added a strict missing-art policy: if a shop, gate, or NPC image is missing, the scene skips the visual and does not expose a fake substitute.
- Added `docs/art/TOWN_REBUILD_ASSET_AUDIT_2026-05-04.md` to track applied images, missing images, and blocked review-needed inputs.
- Verified with `npm run typecheck`, `npm run test`, `npm run build`, the web game Playwright client, and direct village screenshots under `output/town-rebuild-2026-05-04/`.

## 2026-05-03 - Korean localization coverage audit

- Audited Korean language-pack application across village, palace, world map, stage select, battle, shop, gacha, and housing screens.
- Patched remaining Korean-mode English leaks in palace dialogue/name data, village signs, route board labels, stage/world status text, battle HUD/actions, and shop short currency labels.
- Added browser text extraction screenshots under `output/localization-review-2026-05-03/` and expanded Korean localization coverage tests.

## 2026-04-13 - town runtime base refresh

- Rewired town runtime art to use approved world source tiles instead of fallback-only atlas tiles.
- Applied outdoor ground / road / plaza tile rendering and interior floor tile rendering.
- Rebuilt runtime town asset registry and town preview captures.

## 2026-04-14 - world map and dialogue asset planning

- Added world map / dialogue portrait asset target documents.
- Added initial ready-to-copy prompt bundles for world map and UI support images.

## 2026-04-15 - dialogue portrait runtime import

- Imported usable dialogue portrait images and connected them to runtime dialogue overlay usage.
- Added review docs for dialogue portrait acceptance / rejection.

## 2026-04-16 - portrait mismatch audit and remake planning

- Audited dialogue portraits against their matching dot characters.
- Added remake prompt bundles for portrait mismatches and rejected portrait replacements.

## 2026-04-17 - palace scene and world/town image application

- Added palace scene and palace flow into the town progression.
- Applied usable world map, palace, and town runtime assets from reviewed image batches.
- Added unified prompt bundle for remake and expansion assets.

## 2026-04-18 - visual cleanup and UI prep

- Reworked town gate / wall direction toward simpler runtime-friendly structure.
- Added visual cleanup and additional request prompt bundles for missing wall, UI, result, and palace assets.

## 2026-04-19 - image import passes and runtime hookup

- Imported reviewed palace / wall / button / battle assets from `image/`.
- Applied usable gate, wall, plaza, palace exterior, and battle UI assets.
- Added review docs for each import pass.

## 2026-04-20 - current-image-first polish

- Re-polished `Party`, `Equipment`, `Battle`, `Palace`, and result-related layouts using existing assets first.
- Added `REQUIRED_NEW_ART_READY_TO_COPY_PROMPTS_2026-04-20.md` for the truly remaining hard art blockers.

## 2026-04-21 - hero runtime cleanup and stage interaction fixes

- Cleaned hero runtime strips: removed bright residue, reduced white fringe, and strengthened outline readability.
- Fixed stage-select interaction so stage cards became select-only instead of immediate enter triggers.

## 2026-04-22 - selected character cleanup and original-source rebuild pivot

- Applied the same edge cleanup / outline darkening pass to selected non-hero characters:
  - `bram`, `ria`, `theo`, `kiera`, `helma`, `marin`, `serena`, `fin`, `iris`
- Switched these weak subjects back to original source sheets for rebuild:
  - `sera`, `luna`, `dorgan`, `wolf`, `erin`, `nazir`, `laila`, `hakan`, `seraphin`, `micaela`
- Added palace NPC remake prompt bundle and runtime fallback cleanup for palace dialogue / gacha / village return.

## 2026-04-23 - palace runtime remap and battle stabilization

- Remapped palace NPC runtime subjects away from generic town placeholders.
- Forced palace dialogue to use palace runtime art until proper dedicated portraits arrive.
- Cleaned shop text, re-centered runtime button labels, and stabilized battle rendering with temporary hero fallback for broken characters.

## 2026-04-24 - consolidated additional art prompt bundle

- Added one consolidated prompt file for the remaining truly-needed new art generation work.
- New file:
  - `docs/art/ADDITIONAL_ART_READY_TO_COPY_PROMPTS_2026-04-24.md`
- Scope included:
  - Lumen Village square south wall + south gate tile set
  - Palace core runtime NPC remake sheet
  - Palace dialogue portrait remake set
  - Optional king throne event portrait
- Decision:
  - excluded items that can be solved by code/layout cleanup alone
  - excluded original-source recut tasks because those are editing/re-extraction work, not new image generation

## 2026-04-24 - image batch pass 7

- Reviewed the newly added 4-file `image` batch directly.
- Applied the new south wall / south gate tile source as the preferred environment art source.
- Applied palace dialogue portraits from the new batch:
  - `king_aldren`
  - `queen_regent_celestine`
  - `captain_rowan`
  - `archivist_mirel`
- Prepared `king_aldren_throne.png` as an event portrait for future use.
- Confirmed the main remaining gap: this batch still does **not** contain real palace runtime dot NPC sprites.

## 2026-04-25 - merchant transparency cleanup

- Rechecked runtime town merchant sprites after the user reported background transparency artifacts.
- Confirmed the merchant source sheets were checkerboard preview sheets rather than true transparent PNGs.
- Changed `scripts/generate-town-runtime-assets.py` so light-background merchant/NPC crops use checkerboard removal + neutral edge cleanup instead of the previous generic extraction path.
- Regenerated town runtime NPC assets and verified the obvious merchant background boxes no longer remain in runtime use.

## 2026-04-25 - shop / battle / village return rebalance

- Rebuilt `src/game/data/shop.ts` with clean Korean offer strings and explicit icon/effect metadata.
- Reworked `src/game/scenes/ShopScene.ts` so the shop list shows icon + item name + effect only, while the lower section shows `내 가방 / 상세` entries and the selected item detail.
- Tightened runtime button label vertical centering in `src/game/ui/widgets.ts`.
- Reduced battle sprite display size in `src/game/scenes/BattleScene.ts`.
- Rebalanced `src/game/core/battle.ts` for longer fights by raising encounter HP, slightly reducing enemy pressure, and stretching spawn timing.
- Moved `world_gate_return` spawn in `src/game/data/town.ts` to the south entrance so world-map return no longer lands near the fountain.
- Verified with:
  - `npm run typecheck`
  - `npm run build`
  - `node scripts/run-town-manual-checks.mjs`
  - `node scripts/capture-store-screenshots.mjs`
  - `node --experimental-default-type=module C:\\Users\\hhy01\\.codex\\skills\\develop-web-game\\scripts\\web_game_playwright_client.js ...`

## 2026-04-25 - palace runtime dot-only prompt bundle

- Added a separate prompt bundle for palace `runtime dot NPC` remakes only.
- Kept current palace dialogue portraits out of this new bundle because the user wants to preserve the current portrait direction.
- New file:
  - `docs/art/PALACE_RUNTIME_DOT_REMAKE_READY_TO_COPY_PROMPTS_2026-04-25.md`
- Runtime NPC targets included:
  - `king.png`
  - `queen.png`
  - `guard.png`
  - `scholar.png`

## 2026-04-25 - shop text overlap cleanup

- Reworked `src/game/scenes/ShopScene.ts` so the top summary area is split into:
  - context/resources block
  - selected item line
  - compact status line
  - separate cash-pack price hint line
- Reduced small-text stroke thickness and removed multi-line wrapping from offer/bag row labels.
- Added single-line width fitting with ellipsis so long equipment names or status messages do not spill into adjacent rows.
- Verification:
  - `npm run typecheck`
  - `npm run build`
  - `node --experimental-default-type=module C:\\Users\\hhy01\\.codex\\skills\\develop-web-game\\scripts\\web_game_playwright_client.js --url http://127.0.0.1:4173 --actions-file output\\shop-layout-actions.json --iterations 1 --pause-ms 150 --screenshot-dir output\\web-game-shop-layout-check`
  - Playwright forced `shop` scene capture written to:
    - `output/shop-layout-check/armor-shop.png`
    - `output/shop-layout-check/armor-shop-state.json`
- Layout spot-check from live Phaser text bounds in the armor shop scene:
  - top texts no longer overlap
  - offer rows render as one name line + one summary line
  - bag rows render as one name line + one summary line

## 2026-04-25 - shop-by-shop review and prompt bundle

- Captured all five Lumen Village shops in both:
  - `town-interior`
  - `shop`
- Review captures written to:
  - `output/shop-review-2026-04-25/*.png`
  - `output/shop-review-2026-04-25/*-state.json`
- Main review conclusion:
  - all five interiors still read too much like the same empty room template
  - the bigger gap is `interior identity / back-counter dressing / prop density`, not core navigation
  - shared shop UI is usable after the text-overlap cleanup, but still needs final accent art
- Added review document:
  - `docs/ui/SHOP_INTERIOR_VISUAL_REVIEW_2026-04-25.md`
- Added ready-to-copy prompt bundle:
  - `docs/art/SHOP_INTERIOR_REFRESH_READY_TO_COPY_PROMPTS_2026-04-25.md`
- Important handoff note:
  - `armor_shop` and `forge_shop` still need explicit merchant differentiation in art/runtime routing
  - best next step is one image batch for:
    - shared interior modules
    - five shop-specific prop sets
    - armor merchant dot
    - forge blacksmith dot
    - shop sign/category/icon set

## 2026-04-25 - shop UI rework prompt bundle

- Added a dedicated prompt bundle for the next real shop UI redesign instead of another small visual patch.
- New file:
  - `docs/art/SHOP_UI_REWORK_READY_TO_COPY_PROMPTS_2026-04-25.md`
- Main prompt scope:
  - pixel-style movement-screen shop backgrounds that match the hero runtime character
  - calm purchase-screen backgrounds with no baked border or frame
  - separate purchase frame / panel sheets
  - compact header assets for a shorter top area
  - scroll-list row and scrollbar assets
  - inventory-grid slot, detail-stage, and sell-plate assets
  - small thumbnail item sheets
  - large detail-item showcase sheets
- Key decision:
  - keep purchase backgrounds and UI borders as separate assets because combined frame-background images are causing alignment and realism problems in the current armor shop flow

## 2026-04-25 - pre-art shop scene structural rework

- Rebuilt `src/game/scenes/ShopScene.ts` around the new pre-art structure instead of the old 2-row/3-row paging layout.
- New shop-scene structure:
  - compact top header
  - scrollable shop list with 5-row capacity
  - image-first bag grid
  - detail modal for shop offers
  - detail modal for bag items
  - sell action inside bag-item detail
- Added item-image prep slots so generated art can plug in later:
  - new file `src/game/data/shopArt.ts`
  - `ShopOfferDefinition.visual` added in `src/game/data/shop.ts`
- Cleaned and rewrote current shop offer strings in `src/game/data/shop.ts` while attaching placeholder visual refs.
- Added `sellShopInventoryEntry()` in `src/game/core/shop.ts` for weapon/armor sale handling.
- Verified:
  - `npm run typecheck`
  - `npm run build`
  - `node --experimental-default-type=module C:\\Users\\hhy01\\.codex\\skills\\develop-web-game\\scripts\\web_game_playwright_client.js --url http://127.0.0.1:4173 --actions-file output\\shop-layout-actions.json --iterations 1 --pause-ms 150 --screenshot-dir output\\web-game-shop-ui-rework-final`
  - Playwright capture / state checks:
    - `output/shop-ui-rework-check-final/offer-detail.png`
    - `output/shop-ui-rework-check-final/bag-detail.png`
    - `output/shop-ui-rework-check-final/offer-detail.json`
    - `output/shop-ui-rework-check-final/bag-detail.json`
- Confirmed from `render_game_to_text`:
  - offer detail modal opens from offer thumbnail click
  - bag detail modal opens from bag grid click
  - bag wheel scroll changes `bagScrollRow`
- Important remaining gaps:
  - `armor_shop` still only has 2 actual offer entries, so the new 5-row list capacity is ready but not yet filled by content
  - equipment names are still mixed-language because the base equipment dataset remains English-heavy
  - current large-detail preview is still fallback-icon based until the new thumbnail/detail art batch is imported

## 2026-04-26 - curated shop refresh asset import and runtime hookup

- Reviewed the new `image/` shop batch against runtime use instead of bulk-applying every sheet.
- Added import pipeline:
  - `scripts/import_shop_refresh_assets_2026_04_26.py`
- Exported quality-approved runtime assets into:
  - `public/assets/world/town/shop-refresh/backgrounds/*`
  - `public/assets/world/town/shop-refresh/interiors/*`
  - `public/assets/world/town/shop-refresh/ui/*`
  - `public/assets/world/town/shop-refresh/icons/*`
  - `public/assets/world/town/shop-refresh/items/*`
  - `public/assets/world/town/shop-refresh/merchants/*`
- Added runtime asset registry:
  - `src/game/data/shopRuntimeArt.ts`
- Hooked approved art into runtime:
  - purchase-screen calm backgrounds per shop
  - shop interior backgrounds per shop
  - separate shop UI frame / header / list row / bag slot / detail panel art
  - armor / forge merchant counter art
  - curated thumbnail + large-detail item art mappings in `src/game/data/shopArt.ts`
- Quality-control decision:
  - held back `image/14-consumable-large-detail-showcase-set.png` instead of forcing it in because it lowered consistency against the approved item/detail set

## 2026-04-26 - shop scene restart safety fix

- Found a real runtime bug while validating the new art:
  - restarting the `shop` scene could reuse destroyed row / bag-slot references and crash during `setTexture`
- Fixed `src/game/scenes/ShopScene.ts` so shop runtime collections reset on `init/shutdown/destroy` and scroll input handlers are unbound before rebinding.
- This keeps shop re-entry stable when opening the same store repeatedly during QA or live play.

## 2026-04-26 - verification for shop refresh pass

- Verified:
  - `npm run typecheck`
  - `npm run build`
  - `npm run test`
  - `npm run test:town`
- Direct reviewed captures written to:
  - `output/shop-refresh-direct-capture/armor-shop-ui.png`
  - `output/shop-refresh-direct-capture/forge-shop-ui.png`
  - `output/shop-refresh-direct-capture/armor-interior.png`
- Visual result:
  - shop purchase screen now uses the reviewed calm background + separate frame stack instead of the old mismatched green void
  - armor / forge shops now read closer to their intended identity through curated icons, detail art, and merchant routing
  - bag slots and offer rows now use approved image-first treatment instead of fallback-only rectangles
- Known follow-up:
  - `armor_shop` and several other stores still need more real offer content to fully use the 5-row layout capacity
  - base equipment naming still mixes Korean UI with English item names
  - the generic `develop-web-game` client still produced a blank `output/web-game-post-shop-import/shot-0.png`; targeted Playwright debug capture was used as the reliable visual source for this pass

## 2026-04-26 - failed consumable detail remake prompt

- Added a dedicated remake-only prompt document for the single held asset:
  - `docs/art/SHOP_CONSUMABLE_DETAIL_REMAKE_READY_TO_COPY_PROMPTS_2026-04-26.md`
- Scope:
  - remake prompt for `image/14-consumable-large-detail-showcase-set.png` only
- Key direction:
  - stronger silhouette discipline
  - less fake packaging / less dramatic glow
  - closer match to the approved weapon / armor / forge / relic detail sets

## 2026-04-26 - additional usable shop asset application pass

- Applied more of the previously held-but-usable shop image batch after editing them into runtime-safe assets.
- Extended `scripts/import_shop_refresh_assets_2026_04_26.py` to export:
  - section header bar from `04-compact-header-currency-strip-and-tab-sheet.png`
  - floor decor props from `02~06` shop prop sheets
  - merchant interaction marker signs from `09-shop-sign-and-category-icon-set.png`
  - a soft interior top-shadow overlay from `10-indoor-lighting-and-shadow-overlay-set.png`
- Added new runtime keys / routing in `src/game/data/shopRuntimeArt.ts`.
- Applied those assets in runtime:
  - `src/game/scenes/ShopScene.ts`
    - section bars now frame `상점 목록` and `내 가방`
  - `src/game/scenes/TownInteriorScene.ts`
    - merchant interaction now shows shop-category sign markers instead of the old generic quote marker when possible
    - each shop interior now gets one edited floor decor prop placed into visible camera range
    - background interiors now get a subtle top shadow pass for extra depth
- Quality decision:
  - kept `01-shared-shop-interior-modular-kit.png` out of runtime for now because the current full interior backgrounds are already composition-heavy and forcing generic modular overlays on top would likely reduce clarity rather than improve it
- Verification:
  - `python scripts/import_shop_refresh_assets_2026_04_26.py`
  - `npm run typecheck`
  - `npm run build`
  - `npm run test`
  - `npm run test:town`
  - targeted Playwright captures:
    - `output/shop-usable-asset-pass/weapon_shop_interior.png`
    - `output/shop-usable-asset-pass/item_shop_interior.png`
    - `output/shop-usable-asset-pass/forge_shop_interior.png`
    - `output/shop-usable-asset-pass/relic_shop_interior.png`
    - `output/shop-usable-asset-pass/armor_shop_ui.png`
- Note:
  - the generic `develop-web-game` client still outputs a blank `shot-0.png` for this repo, so targeted scene-forced captures remain the reliable visual verification source

## 2026-04-26 - consumable detail remake applied

- Reviewed the new remake file:
  - `image/01-consumable-large-detail-showcase-set-remake.png`
- Decision:
  - approved for runtime use as the replacement for the previously held consumable large-detail art set
- Updated `scripts/import_shop_refresh_assets_2026_04_26.py` so consumables now use:
  - thumbnail images from `09-consumable-thumbnail-icon-sheet.png`
  - large detail images from `01-consumable-large-detail-showcase-set-remake.png`
- Replaced runtime large-detail outputs for:
  - `consumable_red_potion`
  - `consumable_blue_vial`
  - `consumable_blue_bottle`
  - `consumable_green_flask`
  - `consumable_purple_vial`
  - `consumable_amber_oil`
  - `consumable_food_pack`
  - `consumable_tool_box`
  - `consumable_smoke_bomb`
  - `consumable_charm`
- Also tightened the shop detail preview slot in `src/game/scenes/ShopScene.ts` by restoring a dark preview backplate under the detail art.
- Verification:
  - `python scripts/import_shop_refresh_assets_2026_04_26.py`
  - `npm run typecheck`
  - `npm run build`
  - `npm run test`
  - targeted Playwright captures:
    - `output/shop-consumable-remake-pass/item_shop_detail_small_final.png`
    - `output/shop-consumable-remake-pass/item_shop_detail_large_after.png`
  - generic web-game client rerun:
    - `output/web-game-consumable-pass2/shot-0.png`
- Remaining note:
  - the generic web-game client still does not produce a useful gameplay-visible screenshot for this repo, so direct scene-forced captures remain the trustworthy visual QA source

## 2026-04-26 - image staging cleanup

- Removed imported-and-applied shop staging files from `image/` after runtime hookup was confirmed.
- Deleted 21 files that are already reflected in `public/assets/world/town/shop-refresh/*`.
- Left only the still-unapplied or held files in `image/`:
  - `01-shared-shop-interior-modular-kit.png`
  - `07-weapon-thumbnail-icon-sheet.png`
  - `08-armor-thumbnail-icon-sheet.png`
  - `10-forge-material-thumbnail-icon-sheet.png`
  - `11-relic-thumbnail-icon-sheet.png`
  - `14-consumable-large-detail-showcase-set.png`

## 2026-04-26 - remaining usable thumbnail sheets applied and importer hardened

- Applied the last clearly-usable thumbnail sheets from `image/`:
  - `07-weapon-thumbnail-icon-sheet.png`
  - `08-armor-thumbnail-icon-sheet.png`
  - `10-forge-material-thumbnail-icon-sheet.png`
  - `11-relic-thumbnail-icon-sheet.png`
- Extended `scripts/import_shop_refresh_assets_2026_04_26.py` so it no longer breaks after staging cleanup:
  - when a source sheet in `image/` is gone, the importer now reuses the already-exported runtime assets in `public/assets/world/town/shop-refresh/*`
  - kept the remaining live sheets as active sources only where they still add quality
- Runtime visual corrections included:
  - weapon small thumbnails now use the dedicated weapon icon sheet instead of detail-derived crops
  - armor small thumbnails now use the dedicated armor icon sheet
  - `armor_hood` no longer shows the wrong gauntlet detail; it now uses the hood art from the remaining armor sheet
  - forge / relic detail ids were re-mapped to the correct exported large-detail outputs before regenerating matching thumbnails
  - weapon detail ids were also normalized so sword / spear / hammer / staff classes no longer point at obviously wrong categories
- Verification:
  - `python scripts/import_shop_refresh_assets_2026_04_26.py`
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - `npm run test:town`
  - targeted Playwright captures:
    - `output/shop-remaining-sheet-pass/weapon_shop.png`
    - `output/shop-remaining-sheet-pass/armor_shop.png`
    - `output/shop-remaining-sheet-pass/forge_shop.png`
    - `output/shop-remaining-sheet-pass/relic_shop.png`
  - generic `develop-web-game` client rerun:
    - `output/web-game/shot-0.png`
    - still blank / boot-only for this repo, so scene-forced captures remain the reliable QA artifact
- Remaining hold:
  - `01-shared-shop-interior-modular-kit.png`
    - still intentionally not applied because it would clutter the already-composed full interior backgrounds
  - `14-consumable-large-detail-showcase-set.png`
    - obsolete original source; runtime continues to use the approved remake output instead

## 2026-04-26 - shop ui polish pass for marker / detail modal / wall runtime

- Fixed the broken-looking merchant interaction marker path in `src/game/scenes/TownInteriorScene.ts`:
  - merchant overhead markers now use the clean shop header icon instead of the bad cropped sign asset
  - the marker is centered and pulsed with a simple ring instead of showing a broken cutout above the NPC
- Added a visible counter divider for shop interiors that do not already have built-in counter art:
  - `weapon_shop`
  - `item_shop`
  - `relic_shop`
- Tightened runtime button alignment in `src/game/ui/widgets.ts`:
  - shifted runtime frame labels / icons slightly upward
  - reduced the visual “button is sagging downward” effect seen in the bottom action row and detail modal buttons
- Reworked `src/game/scenes/ShopScene.ts` detail modal spacing:
  - moved title / meta text down so they sit inside the frame instead of hugging the top edge
  - tightened body text width to match the decorative panel margins better
  - nudged the confirm / close buttons up slightly
- Hardened consumable detail asset cleanup in `scripts/import_shop_refresh_assets_2026_04_26.py`:
  - added dark-edge background removal for exported consumable detail PNGs
  - re-exported the consumable detail images so the black fill behind bottle / vial renders does not show in the shop modal anymore
- Added an extra prompt document for missing supporting art:
  - `docs/art/SHOP_COUNTER_AND_SQUARE_WALL_ADDITIONAL_PROMPTS_2026-04-26.md`
  - includes a dedicated shop counter front kit prompt
  - includes a four-side square wall tile kit prompt for north / south / east / west village wall usage
- Extended `src/game/scenes/VillageLobbyScene.ts` to actually place wall runtime pieces on all four directions:
  - repeats top / bottom wall strips
  - repeats left / right vertical strips
  - places corner pieces at all four corners
- Verification:
  - `python scripts/import_shop_refresh_assets_2026_04_26.py`
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - `npm run test:town`
  - scene-forced Playwright captures:
    - `output/shop-ui-fix-pass-3/weapon-interior.png`
    - `output/shop-ui-fix-pass-3/weapon-shop-main.png`
    - `output/shop-ui-fix-pass-3/weapon-shop-offer-detail.png`
    - `output/shop-ui-fix-pass-3/weapon-shop-starter-detail.png`
    - `output/shop-ui-fix-pass-3/village-wall-overview.png`
  - generic `develop-web-game` client rerun:
    - had to be executed with `node --experimental-default-type=module`
    - this repo still mostly yields non-useful boot-only `shot-0.png` captures through the generic client, so scene-forced captures remain the reliable visual QA artifact

## 2026-04-26 - equipment / summon / housing / palace / fountain polish pass

- Reworked `src/game/scenes/ShopScene.ts` detail modal spacing again:
  - moved preview block lower
  - increased title/meta readability
  - shortened action/offer status copy
  - lowered modal button text inside the frame
- Reworked `src/game/scenes/EquipmentScene.ts` toward a proper loadout-room layout:
  - uses dialogue portrait style hero busts instead of dot sprites
  - dark framed panels and styled equipment cards
  - cleaned header overlap by shortening loadout labels and dropping the extra weapon-type line
- Rebuilt `src/game/scenes/GachaScene.ts`:
  - banner selection is now list-style instead of paging-arrows UI
  - 1x / 10x summon opens a confirm modal instead of executing immediately
  - added cleaner summon messaging and result-card layout
- Rebuilt `src/game/scenes/HousingScene.ts` into `거점 꾸미기`:
  - removed broken cropped prop renders from the preview
  - switched to clean fallback icons until proper furniture art arrives
  - added a large selected-item preview + clearer slot cards
- Fixed palace throne occupant mapping in `src/game/scenes/PalaceScene.ts`:
  - king now resolves to the palace king runtime art instead of a wrong generic fallback
- Tweaked `src/game/data/town.ts` blockers around the fountain / central south lane:
  - verified downward movement from the fountain-right position now succeeds
- Added portrait/art planning docs:
  - `docs/art/CHARACTER_SHOWCASE_PORTRAIT_REUSE_AUDIT_2026-04-26.md`
  - `docs/art/EQUIPMENT_SUMMON_HOUSING_REWORK_READY_TO_COPY_PROMPTS_2026-04-26.md`
- Verification:
  - `npm run typecheck`
  - `npm run build`
  - `npm run test`
  - `npm run test:town`
  - generic `develop-web-game` client rerun with the bundled playwright client
  - scene-forced Playwright captures:
    - `output/ui-polish-pass-2026-04-26/shop-armor-bag-detail.png`
    - `output/ui-polish-pass-2026-04-26/shop-armor-offer-detail.png`
    - `output/ui-polish-pass-2026-04-26/equipment-main.png`
    - `output/ui-polish-pass-2026-04-26/gacha-main.png`
    - `output/ui-polish-pass-2026-04-26/gacha-confirm.png`
    - `output/ui-polish-pass-2026-04-26/housing-main.png`
    - `output/ui-polish-pass-2026-04-26/palace-main.png`
    - `output/ui-polish-pass-2026-04-26/village-fountain.png`
  - movement check:
    - `output/ui-polish-pass-2026-04-26/village-fountain-move.json`
    - before `{ x: 700, y: 392 }`
    - after `{ x: 700, y: 464 }`

## 2026-04-26 - sera idle / walk runtime audit

- Audited `sera` runtime clips before making any fixes.
- Findings:
  - `public/assets/runtime/characters/sera/walk.png` is already top-clipped in the exported runtime strip.
  - `public/assets/runtime/characters/sera/idle.png` only preserves 2 effective visual states across the 6-frame loop.
  - Package-panel extraction for `sera` is unstable:
    - raw extracted `idle` frames fragment into partial body / head-only crops on several slots
    - raw extracted `walk` frame 4 collapses into a torso fragment instead of a full-body frame
    - raw extracted `town_idle` collapses into a head-only crop
  - `assets/source/character-animation-master-sheets/approved/03-sera.png` is not Sera art.
  - the actual Sera approved master art is currently sitting in `assets/source/character-animation-master-sheets/approved/04-luna.png`.
- Likely root causes:
  - `scripts/generate-runtime-character-clips.py` gives `sera` package-panel full extraction priority before the approved-master fallback path.
  - the current package-panel source-box extraction accepts non-empty but implausible fragments, so broken crops survive and later get resampled / stabilized into bad runtime strips.
  - early subject-to-sheet mapping is inconsistent:
    - `bram` currently points at `03-sera.png`
    - `sera` currently points at `04-luna.png`
- Recommended fix direction:
  - stop using package-panel full extraction for `sera`
  - remap `sera` to the correct approved master sheet
  - rebuild `idle / walk / town_idle` from approved-master manual boxes or numbered-row extraction
  - tighten the package-panel fallback gate so fragmentary frames fail plausibility checks instead of being accepted
- Dedicated QA write-up:
  - `docs/qa/SERA_RUNTIME_IDLE_WALK_AUDIT_2026-04-26.md`
- Artifacts:
  - `output/sera-animation-review/sera_idle_contact.png`
  - `output/sera-animation-review/sera_walk_contact.png`
  - `output/sera-animation-review/viewer-idle.png`
  - `output/sera-animation-review/viewer-walk.png`
  - `output/sera-animation-review/extracted_idle_raw_frames.png`
  - `output/sera-animation-review/debug_walk_4.png`

## 2026-04-26 - in-game 15s story video plan and prompt pass

- Drafted a story-side insertion plan for pre-rendered in-game videos:
  - `docs/story/INGAME_CUTSCENE_VIDEO_INSERT_PLAN_2026-04-26.md`
- Drafted ready-to-copy 15-second video prompts:
  - `docs/art/INGAME_15S_VIDEO_READY_TO_COPY_PROMPTS_2026-04-26.md`
- Decisions:
  - full story master plan recommends `8` videos total
  - current 1.0 production priority recommends `4` videos first
  - videos are reserved for major arc turns only, not recruit joins or routine UI/gameplay beats
  - fixed naming used across the prompts:
    - `Lumen Village`
    - `Lumen Palace`
    - `Greenhaven Plains`
    - `Ironrich Mountains`
    - `Bluemist Coast`
    - `Frostbell Highlands`
    - `Sunscar Desert`
    - `Lumina Sanctuary`
    - `Black Gate`
- Prompt structure includes:
  - recurring cast locks for Kain / Bram / Sera / Luna / palace NPCs
  - shot-by-shot 15s timing
  - negative constraints to reduce off-style generations
- Follow-up:
  - rewrote the prompt doc so each video prompt is fully standalone and copy-ready
  - removed the need to reference a separate common-prompt block
  - strengthened every prompt to explicitly force a unified 2D cel-animation look inspired by `Farland Tactics 1/2` mood
  - added hard negatives against 3D CGI, Unreal-style rendering, plastic materials, and realistic lighting
  - added silent-cinematic direction: no spoken dialogue, no narration, only ambient background music and situation-matched sound effects
- Verification:
  - doc-only pass, no runtime tests executed

## 2026-04-26 - housing visual pass, result next-stage CTA, and manual battle control

- Reworked `housing` from a placeholder icon test layout into a staged room preview:
  - added generated runtime art via `scripts/generate_housing_runtime_assets_2026_04_26.py`
  - added `src/game/data/housingRuntimeArt.ts`
  - wired new housing runtime textures through `BootScene`
  - rebuilt [src/game/scenes/HousingScene.ts](src/game/scenes/HousingScene.ts) around:
    - full housing backdrop
    - room preview stage with left / center / right placed furniture
    - dedicated transparent furniture art for:
      - `wood_crate`
      - `training_dummy`
      - `small_plant`
      - `knight_banner`
      - `hero_sword_rack`
      - `lumen_lamp`
- Result screen flow updated:
  - added global next-stage lookup in `src/game/data/world.ts`
  - [src/game/scenes/ResultScene.ts](src/game/scenes/ResultScene.ts) now shows:
    - clear: `다음 스테이지 / 스테이지 / 돌아가기`
    - fail: `재도전 / 스테이지 / 돌아가기`
  - clear primary CTA now attempts immediate entry into the next stage and falls back to stage list if blocked
- Battle flow updated for hybrid manual/auto control:
  - `src/game/core/battle.ts`
    - added leader manual movement hook
    - added leader command skill charge + cast path
    - party/enemy units now track `homeY`
    - melee attacks now require practical vertical alignment
    - party and enemies can follow targets on both X and Y axes
    - leader AI movement is disabled while auto is off, but attack resolution still happens if manually positioned into range
  - `src/game/scenes/BattleScene.ts`
    - added joystick + arrow-key movement for the leader
    - added manual `베기` skill on `S`
    - kept resonance/leader skill on `A`
    - manual input automatically drops out of auto mode
    - `AUTO` remains toggleable
- Verification:
  - `npm run typecheck`
  - `npm run build`
  - `npm run test`
  - `npm run test:town`
  - `npm run capture:store`
  - custom Playwright verification for:
    - clear result CTA capture: `output/battle-manual-pass/result-clear-next-stage.png`
    - manual battle control capture: `output/battle-manual-pass/battle-manual-control.png`
    - manual state diff: `output/battle-manual-pass/battle-manual-state.json`
- Manual control verification summary:
  - before manual input: leader `hero.y = 260.7`, `autoPlayer = true`
  - after down input + manual skill: leader `hero.y = 366.8`, `autoPlayer = false`
  - enemy melee target also shifted vertically (`enemy_1.y = 276.6 -> 334.4`)
- Current caveat:
  - housing art is now scene-specific and readable, but it is still generated in-engine support art rather than a final production-painted asset pack

## 2026-04-27 - video and image batch application

- Applied the new `video/` batch as real in-game cutscenes:
  - added `src/game/data/cutscenes.ts`
  - added `src/game/scenes/CutsceneScene.ts`
  - wired opening playback from `BootScene`
  - wired first-clear stage cutscenes from `BattleScene`
  - added persistent cutscene-seen state to `SaveSnapshot.story.seenCutsceneIds`
- Added a runtime import pipeline for the new `image/` and `video/` staging batch:
  - `scripts/import_video_and_ui_assets_2026_04_27.py`
- Exported and applied new screen art into runtime:
  - `public/assets/ui/screens/*`
  - `public/assets/ui/housing/*`
  - `public/assets/cutscenes/*`
  - replaced `public/assets/world/palace/npcs/king.png` with the newly supplied king art crop
- Runtime hookups:
  - `EquipmentScene`
    - uses new image-derived main frame, portrait panel, weapon/armor panels, and detail panel
  - `GachaScene`
    - uses new dark ritual backdrop, feature panel, confirm panel, and banner panel art
  - `HousingScene`
    - now uses the new room backdrop and extracted furniture objects from the new image batch
  - `PalaceScene`
    - king fallback art now uses the newly supplied king image
- Verification:
  - `python scripts/import_video_and_ui_assets_2026_04_27.py`
  - `npm run typecheck`
  - `npm run build`
  - `npm run test`
  - `npm run test:town`
  - `npm run capture:store`
  - bundled Playwright client:
    - `output/web-game-video-image-pass/shot-0.png`
    - note: this repo still renders a non-useful blank frame through the generic client
  - visual captures reviewed:
    - `output/store-screenshots/store_05_equipment.png`
    - `output/store-screenshots/store_08_gacha.png`
    - `output/store-screenshots/store_09_housing.png`
    - `output/video-ui-apply-pass/palace.png`
    - `output/video-ui-apply-pass/cutscene-opening.png`
- Important caveat:
  - headless browser capture still does not show a decoded video frame for the opening cutscene
  - `render_game_to_text` confirms the cutscene scene is entered correctly, but `playbackStarted` stays `false` in headless Playwright
  - the cutscene scene now degrades to:
    - muted autoplay attempt
    - tap-to-enable-sound prompt
    - skip support
  - real-browser playback should be spot-checked on the user's live session because headless video decode/autoplay is not a trustworthy QA source here

## 2026-04-27 - sera idle / walk / town_idle runtime rebuild

- Rebuilt the clipped `sera` runtime clips from the source-refresh master sheet instead of the fragile approved-master routing.
- Script change:
  - `scripts/generate-runtime-character-clips.py`
  - removed `sera` from `FORCE_APPROVED_MASTER_SOURCE_SUBJECT_IDS`
  - added explicit `LEGACY_REFRESH_CLIP_SOURCE_BOXES` for:
    - `sera / idle`
    - `sera / walk`
    - `sera / town_idle`
- Regenerated runtime character strips:
  - `python scripts/generate-runtime-character-clips.py`
- Verified new runtime outputs:
  - `public/assets/runtime/characters/sera/idle.png`
  - `public/assets/runtime/characters/sera/walk.png`
  - `public/assets/runtime/characters/sera/town_idle.png`
- Browser verification:
  - launched local Vite dev server on `127.0.0.1:4176`
  - ran bundled Playwright web client with a minimal frame-step burst
  - forced `animation-viewer` to `character / sera / idle`, `walk`, `town_idle`
  - reviewed captures:
    - `output/sera-animation-rebuild-verify/viewer-idle-canvas.png`
    - `output/sera-animation-rebuild-verify/viewer-walk-canvas.png`
    - `output/sera-animation-rebuild-verify/viewer-town_idle-canvas.png`
- Verification summary:
  - previous `head-only / top-clipped` output is gone for the three audited clips
  - viewer now shows full `sera` sprite frames for idle, walk, and town_idle
- Automated checks:
  - `npm run typecheck`
  - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`

## 2026-04-29 - luna runtime repair from original source boxes

- Repaired `luna` by abandoning the generic row/component extraction path and rebuilding the runtime strips from original-source manual boxes.
- Root change in `scripts/generate-runtime-character-clips.py`:
  - expanded `MANUAL_SOURCE_BOX_CLIP_SPECS['luna']` to cover the full animation set
  - added `build_variable_width_source_boxes()`
  - added `remove_luna_checkerboard_background()`
  - added `clear_luna_source_border_scraps_rgba()`
  - added `extract_luna_frame_from_source_box()`
  - removed `luna` from conflicting generic routing sets:
    - `FORCE_ORIGINAL_ISOLATED_GRID_SUBJECT_IDS`
    - `NUMBERED_ROW_SOURCE_BOX_SUBJECT_IDS`
    - `FORCE_UNIFORM_SINGLE_ROW_BAND_SUBJECT_IDS`
  - forced `luna` manual-box clips away from the generic `raw_alpha + outlier repair` path
  - added trimmed-extents support to `fit_strip_frames(..., extent_quantile=...)`
  - used `extent_quantile=0.8` for Luna so wide VFX / prone frames do not shrink the whole clip to unreadable size
- Why this was needed:
  - the baked checkerboard background was still eroding Luna's hood / hair / robe edges
  - even after source-box repair, large effect and prone frames were shrinking the whole runtime strip because `fit_strip_frames()` used the maximum extent across the clip
  - Luna was also still being hijacked by the generic isolated-grid route until the routing conflict was removed
- Visual verification artifacts:
  - final runtime contact: `output/luna-repair-pass-2026-04-29/luna_runtime_contact.png`
  - final magenta-alpha contact: `output/luna-repair-pass-2026-04-29/luna_runtime_contact_magenta.png`
  - direct-path comparison:
    - `output/luna-direct-path-debug/heal_cast_direct.png`
    - `output/luna-direct-path-debug/buff_cast_direct.png`
    - `output/luna-direct-path-debug/victory_direct.png`
    - `output/luna-direct-path-debug/down_or_death_direct.png`
  - browser animation-viewer spot checks:
    - `output/luna-viewer-browser-check/idle.png`
    - `output/luna-viewer-browser-check/walk.png`
    - `output/luna-viewer-browser-check/heal_cast.png`
    - `output/luna-viewer-browser-check/victory.png`
    - `output/luna-viewer-browser-check/down_or_death.png`
- Verification notes:
  - the generic web-game client still captured a blank green frame in `output/web-game-luna-verify/shot-0.png`
  - Luna viewer verification therefore used a direct Playwright script that started `animation-viewer` through `window.__heroSwordDebug`
- Automated checks:
  - `python scripts/generate-runtime-character-clips.py`
  - `npm run typecheck`
  - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`

## 2026-04-28 - sera walk horizontal crop repair

- User follow-up identified that `sera` `walk` was still horizontally wrong even after the full-height row repair.
- Root cause:
  - the new `sera walk` manual source boxes were present, but `extract_single_layout_subject()` hit the generic `manual_source_boxes` path first
  - that path used `extract_frame_from_source_box_raw_alpha()` and bypassed the intended legacy-targeted manual path
  - result: `sera walk` kept using the wrong crop mode, so left/right framing still looked off
- Fix in `scripts/generate-runtime-character-clips.py`:
  - added `should_defer_manual_source_boxes_to_legacy_targeting(subject_id, clip_id)`
  - special-cased `sera / walk` so the generic manual-source-box branch does not run first
  - `sera walk` now goes through the legacy manual box path that uses targeted raw-alpha extraction with clip-specific boxes
- Current `sera walk` manual boxes:
  - `build_manual_source_boxes((234, 347, 460, 573, 686, 799, 912, 1025), 198, 285, 116)`
- Regenerated runtime strips:
  - `python scripts/generate-runtime-character-clips.py`
- Verification artifacts:
  - runtime strip after legacy-targeted repair: `output/sera-walk-final-audit/walk_runtime_strip_after_legacy_targeted.png`
  - source row snapshot: `output/sera-current-walk-row.png`
  - browser viewer capture:
    - `output/sera-walk-final-audit/viewer-sera-walk.png`
    - `output/sera-walk-final-audit/viewer-sera-walk-canvas.png`
    - `output/sera-walk-final-audit/viewer-sera-walk-state.json`
  - bundled Playwright client run:
    - `output/sera-walk-final-audit/web-game-client/`
- Automated checks:
  - `npm run typecheck`
  - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`

## 2026-04-28 - sera walk per-frame box rebuild

- Re-audited `sera walk` frame-by-frame from the runtime strip and confirmed frames `1` and `2` were still clipped on the forward/right side.
- Abandoned the previous uniform-width box approach for `sera walk`.
- Built and compared multiple new candidate source-box sets from the original `03-sera.png` walk row:
  - `output/sera-walk-candidates/cand_a_contact_x6.png`
  - `output/sera-walk-candidates/cand_b_contact_x6.png`
  - `output/sera-walk-candidates/cand_c_contact_x6.png`
- Chosen fix:
  - replaced `build_manual_source_boxes(...)` with explicit per-frame boxes for `sera / walk`
  - final boxes:
    - `(184, 198, 316, 285)`
    - `(296, 198, 426, 285)`
    - `(408, 198, 538, 285)`
    - `(520, 198, 646, 285)`
    - `(632, 198, 758, 285)`
    - `(744, 198, 870, 285)`
    - `(856, 198, 982, 285)`
    - `(968, 198, 1095, 285)`
- Final verification artifacts:
  - frame-by-frame enlarged audit:
    - `output/sera-walk-frame-audit-final/walk_frames_contact_x6.png`
    - `output/sera-walk-frame-audit-final/frame_1_x6.png`
    - `output/sera-walk-frame-audit-final/frame_2_x6.png`
    - `output/sera-walk-frame-audit-final/frame_3_x6.png`
    - `output/sera-walk-frame-audit-final/frame_4_x6.png`
  - browser viewer capture:
    - `output/sera-walk-frame-audit-final/viewer-sera-walk.png`
    - `output/sera-walk-frame-audit-final/viewer-sera-walk-canvas.png`
    - `output/sera-walk-frame-audit-final/viewer-sera-walk-state.json`
  - bundled Playwright client run:
    - `output/sera-walk-frame-audit-final/web-game-client/`
- Outcome:
  - `sera walk` no longer has the early forward-side clipping seen in frames `1` and `2`
  - fix now uses explicit per-frame boxes from the original source row instead of one repeated box width
- Automated checks:
  - `npm run typecheck`
  - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`

## 2026-04-29 - luna runtime animation audit

- Audited `luna` clip-by-clip under the assumption that one extraction method will not solve the full set.
- Generated audit artifacts:
  - `output/luna-animation-audit/luna_runtime_source_master.png`
  - `output/luna-animation-audit/luna_source_rows_x2.png`
  - `output/luna-animation-audit/luna_route_summary.json`
  - `output/luna-animation-audit/luna_runtime_bbox_summary.json`
  - per-clip runtime/source contacts under `output/luna-animation-audit/`
- Current state summary:
  - relatively stable / usable: `idle`, `walk`, `run`, `dash_or_dodge`, `town_idle`, `talk`
  - partially usable but should be rebuilt from source boxes: `attack_basic_01`, `attack_basic_02`
  - clearly broken: `heal_cast`, `buff_cast`, `pray_idle`, `hit_react`, `victory`, `down_or_death`
- Key audit conclusion:
  - `luna` must be split into multiple repair families:
    - stable loop rows
    - region direct-grid rows
    - projectile attack rows
    - effect-dominant magic rows
    - prone / transition rows
  - `victory` is currently contaminated by death-like poses
  - `down_or_death` currently collapses to near-empty baseline fragments
- Documentation:
  - added `docs/qa/LUNA_RUNTIME_ANIMATION_AUDIT_2026-04-29.md`

## 2026-04-29 - luna alpha reassessment

- Rechecked the "relatively stable" `luna` clips after user feedback that transparency was still invading the character body.
- Important correction:
  - the previous audit was accurate about the most broken clips
  - but it understated the quality problem in `idle`, `walk`, `run`, `dash_or_dodge`, `town_idle`, and `talk`
- New finding:
  - the issue is not soft semi-transparency
  - the source master has the checkerboard baked into RGB, so runtime alpha is created heuristically later
  - Luna's bright hood / hair / robe colors are close enough to the checkerboard that the mask generation eats real character pixels
  - pose-readable clips are still `alpha-damaged`, even if they are not catastrophically broken
- Evidence:
  - `output/luna-alpha-audit/*.png`
  - `output/luna-alpha-audit-source-compare/*.png`
- Added follow-up doc:
  - `docs/qa/LUNA_ALPHA_REASSESSMENT_2026-04-29.md`

## 2026-04-27 - full sera runtime stabilization

- Expanded the previous `sera` rebuild from three audited clips to the full runtime set.
- Updated `scripts/generate-runtime-character-clips.py` so `LEGACY_REFRESH_CLIP_SOURCE_BOXES['sera']` now defines source-refresh row boxes for:
  - `idle`
  - `walk`
  - `run`
  - `attack_basic_01`
  - `attack_basic_02`
  - `cast_start`
  - `cast_loop`
  - `cast_release`
  - `hit_react`
  - `dash_or_dodge`
  - `town_idle`
  - `talk`
  - `victory`
  - `down_or_death`
- Regenerated runtime character strips:
  - `python scripts/generate-runtime-character-clips.py`
- Built a visual runtime contact sheet for the whole Sera set:
  - `output/sera-animation-stable-pass/sera_runtime_all_contact.png`
- Browser verification:
  - local Vite server on `127.0.0.1:4177`
  - bundled Playwright web client step burst
  - animation viewer spot-checks reviewed for:
    - `output/sera-animation-stable-pass/viewer-run-canvas.png`
    - `output/sera-animation-stable-pass/viewer-cast_loop-canvas.png`
    - `output/sera-animation-stable-pass/viewer-dash_or_dodge-canvas.png`
    - `output/sera-animation-stable-pass/viewer-victory-canvas.png`
- Verification summary:
  - `sera` no longer depends on unstable automatic row inference for its base runtime set
  - the full character strip set now rebuilds from fixed original-source row boxes
  - previous `head-only / top-clipped` failure mode is removed for the rebuilt set
- Automated checks:
  - `npm run typecheck`
  - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`

## 2026-04-28 - sera full runtime re-audit

- Re-audited the full current `sera` runtime strip set after the previous stabilization pass.
- Generated and reviewed:
  - `output/sera-audit-2026-04-28/sera_runtime_contact_current.png`
  - `output/sera-audit-2026-04-28/sera_raw_extracted_contact.png`
  - browser viewer spot-checks:
    - `output/sera-audit-2026-04-28/viewer-idle-canvas.png`
    - `output/sera-audit-2026-04-28/viewer-walk-canvas.png`
    - `output/sera-audit-2026-04-28/viewer-cast_release-canvas.png`
    - `output/sera-audit-2026-04-28/viewer-hit_react-canvas.png`
    - `output/sera-audit-2026-04-28/viewer-victory-canvas.png`
- Important finding:
  - the current `sera` clips are still visibly upper-body-cropped / head-top-trimmed across the whole set
  - the failure is already present in the raw extraction stage, before `fit_strip_frames()` and before the final runtime strip write
- Root cause clarification:
  - the problem is not mainly the final 64x64 fit stage
  - the problem is the use of `extract_frames_from_approved_master_box()` for `sera` row boxes
  - that helper re-detects a dense character band inside the supplied row box and cuts the top sparse hair rows away
  - because `sera` has thin / sparse upper hair silhouettes, the row-activity threshold and dense-band scoring pick a band that starts too low
- Code path involved:
  - `extract_frames_from_approved_master_box()` lines around row threshold / dense band scoring
  - `extract_single_layout_subject()` legacy-refresh branch that feeds `sera` row boxes through that helper
- Conclusion for next fix pass:
  - `sera` needs per-frame raw/manual source boxes or a different extraction path that does not re-crop the row by dense-band heuristics
  - fixed row boxes alone are not sufficient when still routed through `extract_frames_from_approved_master_box()`

## 2026-04-28 - sera runtime full repair from original source rows

- Replaced the previous failing `sera` legacy-refresh extraction route with a new subject-specific full-height row extraction path.
- Root fix in `scripts/generate-runtime-character-clips.py`:
  - added `FULL_HEIGHT_LEGACY_REFRESH_SOURCE_BOX_SUBJECT_CLIPS['sera']`
  - added `extract_frames_from_full_height_source_box()`
  - routed `sera` row-box clips through full-height extraction instead of `extract_frames_from_approved_master_box()`
- Why this was needed:
  - previous `extract_frames_from_approved_master_box()` re-detected a dense vertical band inside each row box and cut off sparse upper-hair pixels for `sera`
  - new path keeps the original row height and only re-detects frame centers on X, then crops per-frame with the full row Y range preserved
- `sera` clips now repaired through the new path:
  - `idle`
  - `walk`
  - `run`
  - `attack_basic_01`
  - `attack_basic_02`
  - `cast_start`
  - `cast_release`
  - `hit_react`
  - `dash_or_dodge`
  - `town_idle`
  - `talk`
  - `victory`
  - `down_or_death`
- `cast_loop` remains on its existing manual region path because that strip was already the better result for the book-only loop.
- Regenerated runtime character strips:
  - `python scripts/generate-runtime-character-clips.py`
- Visual verification artifacts:
  - runtime contact after fix: `output/sera-fix-pass-2026-04-28/sera_runtime_contact_after_fix.png`
  - browser viewer spot-checks:
    - `output/sera-fix-pass-2026-04-28/viewer-idle-canvas.png`
    - `output/sera-fix-pass-2026-04-28/viewer-walk-canvas.png`
    - `output/sera-fix-pass-2026-04-28/viewer-run-canvas.png`
    - `output/sera-fix-pass-2026-04-28/viewer-cast_release-canvas.png`
    - `output/sera-fix-pass-2026-04-28/viewer-hit_react-canvas.png`
    - `output/sera-fix-pass-2026-04-28/viewer-victory-canvas.png`
- Outcome:
  - `sera` is no longer rendered as upper-body-only / head-top-trimmed in the repaired base animation set
  - the fix uses original source rows and bypasses the failing dense-band vertical re-crop behavior
- Automated checks:
  - `npm run typecheck`
  - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`

## 2026-04-29 - luna dash/heal issue diagnosis

- Rechecked `luna` after user feedback focused on `dash_or_dodge` and `heal_cast` final frame.
- Findings:
  - `dash_or_dodge` source row only contains 4 real key poses, but runtime clip is still emitted as 6 frames.
  - current `MANUAL_SOURCE_BOX_CLIP_SPECS['luna']['dash_or_dodge']` therefore resamples 4 extracted frames into a 6-frame runtime strip.
  - the same Luna repair path also still applies `reanchor_frames_to_upper_body()` to `dash_or_dodge`, which is a poor fit for a low horizontal dash pose.
  - `heal_cast` final source box is mispositioned: current wide box starts on the far-right magic circle and misses Luna's body almost entirely.
  - `heal_cast` also has a frame-count mismatch in the manual source spec: 7 source boxes feeding an 8-frame runtime clip.
- Evidence:
  - `output/luna-issue-audit-2026-04-29/dash_row_with_boxes.png`
  - `output/luna-issue-audit-2026-04-29/heal_row_with_box.png`
  - `output/luna-issue-audit-2026-04-29/heal_box_7.png`
  - `output/luna-issue-audit-2026-04-29/dash_or_dodge_runtime_x6.png`
  - `output/luna-issue-audit-2026-04-29/heal_cast_runtime_x6.png`

## 2026-04-29 - luna dash/heal runtime repair

- Repaired `luna` `dash_or_dodge` and `heal_cast` after targeted issue audit.
- `dash_or_dodge` fix:
  - confirmed the source row only has 4 real dash body poses centered near `279 / 398 / 535 / 682`
  - replaced the broken far-right empty source boxes with an explicit 6-frame hold sequence based on those real pose centers
  - stopped using the generic all-alpha crop for Luna dash and added `extract_luna_primary_component_frame_from_source_box()` so detached dust fragments no longer win the frame extraction
  - kept dash on `visual_core + feet` anchoring instead of the generic upper-body anchor path
- `heal_cast` fix:
  - replaced the old 7-box source spec with an 8-box explicit source spec
  - moved the final wide source box left and widened it so the last frame now contains `Luna + magic circle` instead of effect-only crop
- Added Luna clip-specific helpers:
  - `extract_luna_frames_for_clip()`
  - `prepare_luna_manual_source_frames()`
  - `get_luna_manual_strip_extent_quantile()`
- Final verification artifacts:
  - `output/luna-fix-dash-heal-final-review/dash_or_dodge_runtime_x6.png`
  - `output/luna-fix-dash-heal-final-review/heal_cast_runtime_x6.png`
- Final runtime bbox spot-check:
  - `dash_or_dodge` frames 0-5 all non-empty after fix
  - `heal_cast` frames 6-7 now keep the character present in the final effect-heavy frames

## 2026-04-29 - requested animation diagnosis bundle

- Audited the newly requested runtime clips before any repair work:
  - `luna/heal_cast`
  - `ria/town_idle`
  - `dorgan/interact`, `idle`, `attack_basic_02`
  - `helma/dash_or_dodge`, `idle`
  - `serena/victory`, `down_or_death`
  - `fin/aim`, `shoot_loop`
  - `iris/attack_basic_01`, `attack_basic_03`, `victory`
  - `wolf/attack_basic_01`, `attack_basic_02`, `charge`, `dash_or_dodge`, `victory`, `down_or_death`
  - `erin/walk`, `run`, `summon_or_rune`, `dash_or_dodge`
  - `nazir/idle`, `attack_basic_03`
  - `laila/run`
  - `hakan/walk`, `run`, `heavy_attack`
  - `seraphin/run`, `attack_basic_02`, `pray_idle`, `down_or_death`
- Generated diagnosis artifacts under `output/requested-animation-audit-2026-04-29/`:
  - `summary.json`
  - `runtime_pages/page_1.png` through `page_6.png`
  - per-clip runtime contact sheets in `runtime_per_clip/`
  - source row-band crops in `source_per_clip/`
- Wrote the diagnosis doc:
  - `docs/qa/REQUESTED_ANIMATION_AUDIT_2026-04-29.md`
- Main conclusion:
  - these clips do not share one bug
  - the failures split into multiple families: stale `legacy_refresh_manual_source_boxes`, unsafe `legacy_refresh_fallback_row_box`, package panel/manual boxes pointing at label art, generic region/component extraction with no clip-specific safety margin, and a few clip-specific body-plus-effect cases
- Highest priority repair families from the audit:
  - full remap for `wolf`
  - package-derived remap for `serena`, `fin`, `iris`
  - fallback-row replacement for `erin`, `hakan`, `seraphin`, `dorgan`, `nazir`, `laila`
  - clip-specific follow-up for `luna/heal_cast`, `helma/dash_or_dodge`, `ria/town_idle`

## 2026-04-30 - targeted custom repair pass for requested clips

- Added a new targeted repair route in `scripts/generate-runtime-character-clips.py` for the user-requested bad clips.
- New approach:
  - do not reuse the same fallback/manual/package rule for every subject
  - route each bad clip through `CustomClipRepairSpec`
  - choose source by clip: `band`, `legacy_box`, `approved_box`, or `region_manual`
  - choose anchor by clip: `feet`, `upper_body`, or `visual_core`
  - optionally merge nearby effect/body fragments for casts and attack clips
  - optionally read from the actual approved master image for `approved_box` clips instead of the current legacy-refresh working image
- New helper functions added:
  - `has_targeted_custom_clip_repair()`
  - `resolve_targeted_custom_clip_source_box()`
  - `extract_targeted_custom_frame_from_search_rgba()`
  - `detect_targeted_custom_component_centers()`
  - `prepare_targeted_custom_frames()`
  - `extract_targeted_custom_clip_frames()`
- Integration points patched:
  - `extract_single_layout_subject()`
  - `extract_auto_paired_single_layout_subject()`
  - `extract_paired_layout_subject()`
- Regenerated runtime strips multiple times and audited visually with:
  - `output/requested-animation-repair-audit-2026-04-30/`
  - `output/requested-animation-repair-audit-2026-04-30-pass2/`
  - `output/requested-animation-repair-audit-2026-04-30-pass3/`
  - `output/requested-animation-repair-audit-2026-04-30-pass4/`
- Good or materially improved after the targeted pass:
  - `ria/town_idle`
  - `dorgan/interact`
  - `dorgan/idle`
  - `helma/idle`
  - `helma/dash_or_dodge`
  - `iris/attack_basic_03`
  - `iris/victory`
  - `wolf/dash_or_dodge`
  - `wolf/victory`
  - `wolf/down_or_death`
  - `erin/walk`
  - `erin/run`
  - `erin/summon_or_rune`
  - `nazir/idle`
  - `laila/run`
  - `seraphin/pray_idle`
  - `seraphin/down_or_death`
- Still visibly unresolved after this pass:
  - `luna/heal_cast`
  - `dorgan/attack_basic_02`
  - `serena/victory`
  - `serena/down_or_death`
  - `fin/aim`
  - `fin/shoot_loop`
  - `iris/attack_basic_01`
  - `wolf/attack_basic_01`
  - `wolf/attack_basic_02`
  - `wolf/charge`
  - `erin/dash_or_dodge`
  - `nazir/attack_basic_03`
  - `hakan/walk`
  - `hakan/run`
  - `hakan/heavy_attack`
  - `seraphin/run`
  - `seraphin/attack_basic_02`
- Remaining failure pattern after the targeted pass:
  - several clips still pick presentation/label areas before the actual character centers
  - some approved-box clips improved, which confirmed that `wrong source image` was part of the problem
  - the clips still failing now likely need either `trimmed row source boxes` or explicit per-frame boxes rather than row-wide center finding
- Verification:
  - `python -m py_compile scripts/generate-runtime-character-clips.py`
  - `python scripts/generate-runtime-character-clips.py`
  - `npm run typecheck`
  - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`

## 2026-05-02 23:18: cut-friendly monster prompt rules for easier slicing

- Replaced [docs/art/MONSTER_EXPANSION_READY_TO_COPY_PROMPTS_2026-05-02.md](docs/art/MONSTER_EXPANSION_READY_TO_COPY_PROMPTS_2026-05-02.md) with a cut-friendly version focused on clean post-generation slicing.
- Added explicit production rules:
  - `transparent PNG` primary output
  - flat chroma fallback guidance for models that cannot export transparency
  - fixed canvas size `3072 x 1792`
  - `5 equal vertical slots`
  - fixed outer margin `128px`
  - fixed inter-slot gap `64px`
  - minimum silhouette padding `64px`
  - no cross-slot FX, shadow spill, or overlap
- Rewrote all six continent monster prompt blocks so each prompt is self-contained and already includes the slicing rules directly inside the copy-ready code block.
- Added a `Single Monster Rescue Prompt` template for monsters that fail in the 5-slot sheet and need isolated regeneration on a `1024 x 1024` transparent canvas.
- Verification:
  - doc-only update, no runtime/code tests executed

## 2026-05-03 00:08: added remake prompts for current in-game monster roster

- Extended [docs/art/MONSTER_EXPANSION_READY_TO_COPY_PROMPTS_2026-05-02.md](docs/art/MONSTER_EXPANSION_READY_TO_COPY_PROMPTS_2026-05-02.md) with six additional `Existing Monster Remake Set` prompt blocks.
- Added cut-friendly remake prompts for the current 30 in-game monsters not covered by the earlier expansion sheets:
  - continent 01: `thorn_wolf`, `reed_shaman`, `fence_raider`, `blackhorn_chieftain`, `morgan`
  - continent 02: `ash_mine_worker`, `slag_hound`, `rune_forge_tender`, `bares`, `dravorn`
  - continent 03: `mist_raider`, `brine_marauder`, `coastal_horror`, `elrent`, `nereph`
  - continent 04: `frozen_legion_trooper`, `frost_hound`, `barrow_wraith`, `hrod`, `valtern`
  - continent 05: `dune_reaver`, `sand_tracker_beast`, `ruin_automaton`, `setra`, `kazer`
  - continent 06: `fallen_acolyte`, `fallen_holy_knight`, `black_moon_vanguard`, `cardinal_serdin`, `varkan`
- Reused the same slicing-friendly output rules inside each prompt block so current monsters can be regenerated with matching spacing, transparency, slot layout, and crop safety.
- Verification:
  - doc-only update, no runtime/code tests executed

## 2026-05-03 00:21: locked monster prompts away from realism and added FX companion prompts

- Re-reviewed the monster prompt doc because current generations were drifting toward realistic/film-creature output and away from the intended game style.
- Confirmed the old prompt wording was too soft:
  - it asked for `premium`, `painterly`, `grounded fantasy`
  - but did not strongly forbid `photorealistic`, `3D CGI`, `cinematic realism`, or `western dark fantasy realism`
  - and did not clearly separate `monster body sheet` from `battle FX sheet`
- Updated [docs/art/MONSTER_EXPANSION_READY_TO_COPY_PROMPTS_2026-05-02.md](docs/art/MONSTER_EXPANSION_READY_TO_COPY_PROMPTS_2026-05-02.md) with:
  - a new `스타일 고정 규칙` section
  - explicit style target: `파랜드 택틱스 1,2 느낌의 2D 판타지 전술 RPG 몬스터`
  - hard bans on realistic/3D/cinematic output directions
  - a new `몬스터 FX 분리 규칙` section
  - a new `Single Monster Effect Companion Prompt`
  - a new `Five Monster Effect Companion Sheet Prompt`
- Updated the ready-to-copy monster prompt blocks so they now explicitly ask for:
  - `hand-painted 2D anime fantasy`
  - `classic Farland Tactics 1 and 2 inspired tactical RPG monster look`
  - `sprite-friendly silhouette`
  - `large attack effects excluded from the body sheet`
- Verification:
  - doc-only update, no runtime/code tests executed

## 2026-05-03 00:36: boss prompt structure revised for larger and more imposing bosses

- Re-reviewed the monster prompt structure because bosses generated from the shared `5-slot` sheets were not reading as boss-tier enough.
- Confirmed the structural issue:
  - when mid-bosses and final bosses share the same `5 equal slots` as grunts/elites, they tend to lose scale and authority
  - they may still be cleanly cut, but they do not feel sufficiently large or dominant
- Updated [docs/art/MONSTER_EXPANSION_READY_TO_COPY_PROMPTS_2026-05-02.md](docs/art/MONSTER_EXPANSION_READY_TO_COPY_PROMPTS_2026-05-02.md) with:
  - a new `보스 전용 구성 규칙` section
  - explicit boss scale guidance for mid-boss vs final boss
  - a new `07-C. Dual Boss Sheet Prompt`
  - a new `07-D. Single Final Boss Hero Sheet Prompt`
  - continent remake section notes telling future generations to split boss creation out of the 5-slot sheets when quality matters
- Boss generation now has dedicated cut-friendly layout guidance:
  - `3072 x 2048` for dual boss sheets
  - `1536 x 2048` for single final boss sheets
  - larger outer margins and slot padding
  - no overflow, no shared aura/smoke, no large battle FX in the body sheet
- Verification:
  - doc-only update, no runtime/code tests executed

## 2026-05-03 00:58: converted monster prompts from sheet-based layout to single-monster prompts

- Reworked [docs/art/MONSTER_EXPANSION_READY_TO_COPY_PROMPTS_2026-05-02.md](docs/art/MONSTER_EXPANSION_READY_TO_COPY_PROMPTS_2026-05-02.md) from multi-monster sheet prompts into `one prompt = one monster image` format.
- Removed the old `5-slot per sheet` generation approach for the main body prompts because it still created unnecessary post-cutting work.
- Added maximum edit-safety rules directly into the document:
  - `one image = one monster only`
  - transparent PNG as primary output
  - chroma fallback only when transparency is unsupported
  - no background, no floor, no fog blanket, no scenery
  - large empty crop-safe transparent padding
  - no overflow of horns, tails, weapons, capes, haloes, banners
  - no duplicate subject, no detached extra body parts, no extra monster
- Split canvas standards by role:
  - normal monsters: `1536 x 1536`
  - bosses: `1792 x 2304`
- Replaced grouped continent sheets with `60 standalone ready-to-copy monster prompts`, one for every current monster definition.
- Kept separate single-image FX helper prompts at the end:
  - `Single Monster Effect Companion Prompt`
  - `Single Boss Effect Companion Prompt`
- Verification:
  - doc-only update, no runtime/code tests executed

## 2026-05-03 01:20: created full master portrait prompt set for all playable characters

- Added [docs/art/CHARACTER_MASTER_PORTRAIT_READY_TO_COPY_PROMPTS_2026-05-03.md](docs/art/CHARACTER_MASTER_PORTRAIT_READY_TO_COPY_PROMPTS_2026-05-03.md).
- Built a full replacement prompt set for all current playable characters used in dialogue and gacha flows.
- Structure:
  - `21` individual character master portrait prompts
  - `3` separate gacha rarity backplate prompts
  - total `24` prompts
- Chosen production direction:
  - `one image = one character`
  - transparent master portrait reused for both dialogue and gacha
  - separate rarity backplates for gacha instead of making two different character illustrations per unit
- Locked style direction:
  - `classic Farland Tactics 1 and 2 inspired 2D fantasy tactical RPG portrait`
  - `hand-painted 2D anime fantasy`
  - hard bans on photoreal, 3D CGI, cinematic realism, and western dark fantasy realism
- Locked crop and edit safety:
  - character masters: `2048 x 2560`
  - head-to-mid-thigh composition
  - large transparent safety margins on all sides
  - no scenery, no floor, no text, no duplicate subjects, no large FX
- Verification:
  - doc-only update, no runtime/code tests executed

## 2026-05-02 22:40: stage volume expansion to 24-per-continent, story dialogue flow, monster roster expansion

- Expanded the campaign from `6 x 10 = 60` stages to `6 x 24 = 144` stages.
- Added new stage seed source file:
  - `src/game/data/stageSeeds.ts`
  - `STAGES_PER_CONTINENT = 24`
  - all six continents now have 24 named stages with updated story beats
- Updated runtime world/state flow:
  - `src/game/data/world.ts`
  - `src/game/core/state.ts`
  - continent unlock now uses the real final stage of each continent instead of hardcoded `_10`
  - final camp unlock now happens after `stage_06_24`
- Added selected stage dialogue flow data:
  - `src/game/data/stageStoryEvents.ts`
  - per continent story beats now fire on selected `pre_stage` / `post_clear` points
  - `BattleScene` now shows first-entry pre-stage dialogue via `DialogueOverlay`
  - `ResultScene` now chains post-clear story dialogue before recruitment dialogue when applicable
- Extended save story state:
  - `src/game/types.ts`
  - `src/game/services/save.ts`
  - `seenStageStoryEventIds` added and normalized
- Retargeted recruitment and cutscene milestones to the expanded structure:
  - `src/game/data/stageRecruitEvents.ts`
  - `src/game/data/cutscenes.ts`
- Added monster expansion catalog:
  - `src/game/data/monsters.ts`
  - total roster now `60` monster definitions
  - includes slime and kobold families per continent
  - battle encounter names now come from the monster catalog rather than generic `Scout / Raider / Archer`
  - runtime visuals still reuse existing enemy subjects as placeholders until new art lands
- Updated battle runtime to respect monster subject overrides:
  - `src/game/core/battle.ts`
  - `src/game/scenes/BattleScene.ts`
- Updated stage select UI for 24-stage lists:
  - `src/game/scenes/StageSelectScene.ts`
  - keeps 2 columns but scrolls rows around the selected stage
  - selected stage detail now shows `storyBeat`
- Prevented noisy preload failures for missing new stage backgrounds:
  - `src/game/scenes/BootScene.ts`
  - only current available stage background asset set (`order <= 10`) is preloaded
  - later stages cleanly fall back to generic battle backdrops instead of throwing asset console errors
- Updated docs:
  - `docs/story/STAGE_PROGRESSION.md`
  - `docs/story/STORY_MASTER.md`
  - `docs/story/WORLD_STRUCTURE.md`
  - `docs/story/STAGE_DIALOGUE_FLOW_2026-05-02.md`
  - `docs/story/STAGE_RECRUIT_EVENTS.md`
  - `docs/game/MONSTER_ROSTER_EXPANSION_2026-05-02.md`
  - `docs/art/MONSTER_EXPANSION_READY_TO_COPY_PROMPTS_2026-05-02.md`
  - `docs/ui/UI_FLOW.md`
  - `docs/game/CORE_LOOP.md`
  - `docs/DECISIONS.md`
- Updated tests for the new campaign size:
  - `tests/worldData.test.ts`
  - `tests/state.test.ts`
  - `tests/battle.test.ts`
- Verification:
  - `npm run typecheck`
  - `npm run test -- tests/state.test.ts tests/battle.test.ts`
  - `npm run test` -> `51 passed`
  - `npm run build`
- QA note:
  - the `develop-web-game` Playwright client still only captures a blank `booting` canvas in this repo/headless path
  - output: `output/web-game-stage-expansion/shot-0.png`
  - `npm run capture:store` also times out waiting for post-boot scene activation in this environment
  - code/tests/build passed, but real scene-level screenshot QA for the new 24-stage select flow still needs either headed capture or the existing scene-forced harness to be updated for the new boot path

## 2026-05-02 - Seraphin pray_idle 머리 상단 잘림 보정

- Re-checked `seraphin/pray_idle` after the previous pass because the hair top still looked horizontally cut.
- Root cause was not runtime placement; the explicit source boxes themselves started too low at `y=832`, so the head top was already clipped in the source crop.
- Compared the current source crops vs. a raised-top variant and confirmed that moving the source boxes upward fixed the head silhouette before runtime fitting:
  - audit: `output/seraphin-pray-top-audit-2026-05-02/`
- Updated `EXPLICIT_FULLSHEET_FRAME_SEQUENCE_SPECS['seraphin']['pray_idle']` to lift all source boxes from `y=832..904` to `y=824..904`.
- Final QA bundle:
  - `output/seraphin-pray-final-qa-2026-05-02/`
- Final visual result:
  - `public/assets/runtime/characters/seraphin/pray_idle.png`
  - top hair silhouette restored without left/right bleed.
- Verification:
  - `python -m py_compile scripts/generate-runtime-character-clips.py`
  - `python scripts/generate-runtime-character-clips.py`

## 2026-05-02 - Iris/Wolf/Seraphin 좌우 침범 재진단 및 전용 재추출

- Re-audited the remaining left/right intrusion reports for:
  - `iris/victory`
  - `wolf/attack_basic_02`
  - `seraphin/pray_idle`
- Root cause split:
  - `iris/victory`: the current runtime still used a `6-frame slot + replacement` path even though the source row needed explicit hold timing; middle victory poses were being contaminated by adjacent sword/effect pieces.
  - `wolf/attack_basic_02`: the `source-refresh` row fused the early attack poses into one wide connected mass, so box tweaks kept producing left/right spill; the cleanest recoverable source was the approved package sheet attack-2 panel instead.
  - `seraphin/pray_idle`: the previous source boxes were simply reading the wrong x range, so the first slot still included the title card edge and later slots were shifted.
- Added a new final override path in `scripts/generate-runtime-character-clips.py`:
  - `EXPLICIT_FULLSHEET_FRAME_SEQUENCE_SPECS`
  - `FINAL_EXPLICIT_FULLSHEET_FRAME_SEQUENCE_OVERRIDES`
  - `write_explicit_fullsheet_frame_sequence_override(...)`
- Added new one-off extraction helpers for this pass:
  - `extract_owned_components_exactly_from_source_box(...)`
  - `extract_frames_from_row_x_ownership(...)`
  - direct exact package-frame extraction through `extract_frame_from_package_source_box(..., expand_source_box=False)`
- Final chosen clip-specific strategies:
  - `iris/victory`: source-refresh full-sheet exact sub-boxes + explicit 8-frame output order `0,1,2,3,4,5,5,5`
  - `wolf/attack_basic_02`: switched off the merged source-refresh row and rebuilt from the approved package sheet attack-2 panel with exact frame boxes
  - `seraphin/pray_idle`: source-refresh full-sheet exact sub-boxes aligned to the real five visible pray poses and a held final frame
- QA bundles for the final pass:
  - `output/post-fix-three-qa-2026-05-02-pass8/`
  - `output/new-source-guides-2026-05-02/`
  - `output/wolf-package-attack2-guide-2026-05-02.png`
- Final visual check:
  - `iris/victory`: middle sword/effect spill removed; each frame now reads as one full pose.
  - `wolf/attack_basic_02`: switched to approved package source; the final slash frame stays inside the frame without neighboring label/panel bleed.
  - `seraphin/pray_idle`: no title-card intrusion and no half-frame carryover after frame 3.
- Verification:
  - `python -m py_compile scripts/generate-runtime-character-clips.py`
  - `python scripts/generate-runtime-character-clips.py`
  - `npm run typecheck`
  - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`

- 2026-05-02: Re-diagnosed lingering left/right crop complaints for `iris/victory`, `wolf/attack_basic_02`, `laila/run`, `seraphin/pray_idle`.
  - Root cause split:
    - `iris` / `seraphin`: source row component picking was still selecting partial silhouettes; a few runtime frames needed direct curated substitution to guarantee one full character per frame.
    - `wolf` / `laila`: the clean fit-strip result existed, but the final generated runtime file was still ending up on the older path, so the safe fit result needed a final explicit override write.
  - Added `DIRECT_CURATED_SLOT_LOCKED_STRIP_OPTIONS` and `FINAL_DIRECT_CURATED_SLOT_LOCKED_OVERRIDES` in `scripts/generate-runtime-character-clips.py`.
  - Added `write_direct_curated_slot_locked_override(...)` and applied it after the normal generation pass so these four clips get a guaranteed final runtime overwrite.
  - Final runtime review:
    - `public/assets/runtime/characters/iris/victory.png`
    - `public/assets/runtime/characters/wolf/attack_basic_02.png`
    - `public/assets/runtime/characters/laila/run.png`
    - `public/assets/runtime/characters/seraphin/pray_idle.png`
  - QA snapshot bundle:
    - `output/final-four-qa-2026-05-02/`
  - Runtime alpha bbox spot-check after final overwrite:
    - `iris/victory`: all 8 frames stay inside `(13..51 / 14..49, y 3..61)` with no border touch
    - `wolf/attack_basic_02`: all 8 frames stay inside `(12..52, y 3..61)` with no border touch
    - `laila/run`: all 8 frames stay inside `(10..53, y 3..61)` with no border touch
    - `seraphin/pray_idle`: all 6 frames stay inside `(11..51 / 11..49, y 3..61)` with no border touch
  - Verification:
    - `python -m py_compile scripts/generate-runtime-character-clips.py`
    - `python scripts/generate-runtime-character-clips.py`
    - `npm run typecheck`
    - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`

- 2026-05-02: Global first-pass runtime edge-fringe cleanup + outline polish for all character subjects.
  - Goal: remove leftover light/neutral background pixels around character silhouettes on white backgrounds, then darken the remaining boundary so each sprite reads with a cleaner outline.
  - Added per-subject cleanup tuning in `scripts/generate-runtime-character-clips.py`:
    - `EDGE_FRINGE_CLEANUP_PROFILES`
    - `OUTLINE_SHADE_PROFILES`
  - Replaced the old mostly-speck-only selected cleanup path with:
    - `compute_frame_boundary_neighbor_stats(...)`
    - `cleanup_character_edge_fringe_frame(...)`
    - subject-specific boundary shading in `darken_selected_runtime_outline_frame(...)`
  - Expanded outline cleanup coverage to all actual runtime subjects instead of a small hand-picked subset.
  - Also updated the direct curated override writer so the curated clips still pass through the same bright-residue cleanup + outline pass before final save.
  - First-pass audit result:
    - large reductions in suspicious bright/neutral boundary pixels after regeneration
    - examples:
      - `dorgan`: `2571 -> 43`
      - `hakan`: `3182 -> 36`
      - `laila`: `3037 -> 22`
      - `wolf`: `3074 -> 45`
      - `seraphin`: `3795 -> 75`
      - `luna`: `4545 -> 221` (still the noisiest light-silhouette subject)
  - QA artifacts:
    - per-subject white-background overviews: `output/runtime-white-bg-qa-2026-05-02/`
    - numeric summary: `output/runtime-white-bg-qa-2026-05-02/summary.json`
  - Current follow-up candidates after this first pass are mostly geometry-heavy or effect-heavy clips, not broad white fringe across every subject:
    - `luna/buff_cast`, `luna/victory`, `luna/run`
    - `seraphin/run`, `seraphin/attack_basic_02`
    - `serena/heal_cast`
    - `theo/aim`
    - `ria/attack_basic_02`
  - Verification:
    - `python -m py_compile scripts/generate-runtime-character-clips.py`
    - `python scripts/generate-runtime-character-clips.py`
    - `npm run typecheck`
    - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`

## 2026-05-01 residual clip repair pass

- User flagged remaining failures in:
  - `iris/victory`
  - `wolf/attack_basic_02`
  - `laila/run`
  - `seraphin/pray_idle`
- Re-audited each clip against runtime strips and source rows instead of reusing the prior generic route.
- Findings:
  - `iris/victory`: source row transitional poses still produced partial-body frames after normal component filtering; issue was not top/bottom crop only, it was bad intermediate frame extraction.
  - `wolf/attack_basic_02`: body was mostly intact, but late frames kept carrying non-primary scraps / edge-connected residue.
  - `laila/run`: mostly good after prior pass; issue was small slot contamination from neighboring poses.
  - `seraphin/pray_idle`: prayer ray burst and neighboring silhouette were splitting the middle frames.
- Added another clip-specific layer in `scripts/generate-runtime-character-clips.py`:
  - new `alpha_bbox` manual extraction mode for clips where component filtering was throwing away valid body pixels
  - narrowed non-overlap manual source boxes for `iris/victory`, `wolf/attack_basic_02`, `laila/run`, `seraphin/pray_idle`
  - per-clip mode changes:
    - `iris/victory` -> `alpha_bbox`
    - `wolf/attack_basic_02` -> `center` with tight merge
    - `laila/run` -> `raw` with non-overlap slots
    - `seraphin/pray_idle` -> `center` with tight merge
  - added `POST_STRIP_NONPRIMARY_SCRAP_CLEANUP_SPECS` for tiny non-primary top scraps
  - added `POST_STRIP_FRAME_REPLACEMENTS` so clips with irreducibly bad transitional source frames can swap in neighboring clean keyframes:
    - `iris/victory`
    - `wolf/attack_basic_02`
    - `seraphin/pray_idle`
- Final direct visual check after replacements:
  - `iris/victory`: all runtime frames now show full-body character silhouettes instead of the earlier broken partial-body frames
  - `wolf/attack_basic_02`: late-frame stray scraps removed by frame replacement
  - `laila/run`: clean full-body run frames
  - `seraphin/pray_idle`: broken middle prayer frames replaced with stable full-body keyframes
- Verification:
  - `python -m py_compile scripts/generate-runtime-character-clips.py`
  - `python scripts/generate-runtime-character-clips.py`
  - `npm run typecheck`
  - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`

## 2026-05-01 slot-locked rebuild pass

- User asked to stop reusing previous methods and re-diagnose from scratch for:
  - `iris/victory`
  - `wolf/attack_basic_02`
  - `laila/run`
  - `seraphin/pray_idle`
- Re-audited at frame level and confirmed the actual failure types were different:
  - `iris/victory`: slot contained body plus detached left scraps from neighboring sword / transition details
  - `wolf/attack_basic_02`: body stayed intact but late frames kept non-primary remnants
  - `laila/run`: run was mostly valid, but some frames still carried tiny neighbor scraps
  - `seraphin/pray_idle`: prayer row contained body plus adjacent silhouette/effect pieces inside the same visual slot
- Implemented a completely new extraction path in `scripts/generate-runtime-character-clips.py`:
  - new `SlotLockedRowRegionSpec`
  - new `SLOT_LOCKED_ROW_REGION_SPECS`
  - new `extract_frames_from_slot_locked_row_region(...)`
  - new `extract_frames_from_slot_locked_row_region_centered(...)`
  - these clips now bypass the prior `manual / center / exact row` repair paths and instead use:
    - original row region
    - manually locked non-overlapping slot bands
    - per-slot alpha bbox extraction
    - optional per-slot centered component selection only for clips that had neighbor contamination inside a slot
- Added clip-specific QA cleanup only after the new slot-locked path:
  - `POST_STRIP_PRUNE_SMALL_NONPRIMARY_SPECS` for removing tiny detached non-primary remnants
- Final QA checks for the four requested clips:
  - every runtime frame has exactly `1 connected component`
  - no runtime frame touches `left / right / top / bottom` borders
- Final QA metrics confirmed with a direct script on:
  - `public/assets/runtime/characters/iris/victory.png`
  - `public/assets/runtime/characters/wolf/attack_basic_02.png`
  - `public/assets/runtime/characters/laila/run.png`
  - `public/assets/runtime/characters/seraphin/pray_idle.png`
- Verification:
  - `python -m py_compile scripts/generate-runtime-character-clips.py`
  - `python scripts/generate-runtime-character-clips.py`
  - `npm run typecheck`
  - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`

## 2026-05-01 Requested animation repair pass

- User requested a fresh pass for these clips with clip-specific methods instead of one generic rule:
  - `serena/victory`, `serena/down_or_death`
  - `iris/attack_basic_01`, `iris/attack_basic_03`, `iris/victory`
  - `wolf/attack_basic_01`, `wolf/attack_basic_02`, `wolf/charge`
  - `erin/walk`, `erin/run`, `erin/summon_or_rune`, `erin/dash_or_dodge`
  - `nazir/idle`, `nazir/attack_basic_03`
  - `laila/run`
  - `hakan/walk`, `hakan/run`, `hakan/heavy_attack`
  - `seraphin/run`, `seraphin/pray_idle`, `seraphin/down_or_death`
- Reworked `scripts/generate-runtime-character-clips.py` so requested clips can use per-clip extraction modes instead of falling through the old shared path:
  - `raw`
  - `trimmed_raw`
  - `center`
  - `region_direct_grid`
  - `region_isolated_grid`
- Added `MANUAL_SOURCE_BOX_EXTRACT_MODES` and `MANUAL_SOURCE_BOX_EXTRACT_OPTIONS` for clip-specific routing.
- Added `EXACT_ORIGINAL_ROW_REGION_SPECS` and `EXACT_ORIGINAL_ROW_REGION_SOURCE_COUNTS` for clips where the row had touching poses and needed valley-based separation from the original row region:
  - `iris/attack_basic_01`
  - `wolf/attack_basic_01`
  - `wolf/attack_basic_02`
  - `wolf/charge`
  - `erin/summon_or_rune`
  - `erin/dash_or_dodge`
  - `hakan/run`
  - `hakan/heavy_attack`
  - `seraphin/run`
  - `seraphin/pray_idle`
  - `seraphin/down_or_death`
- Tightened explicit source boxes for `serena`, `iris`, `wolf`, `erin`, `hakan`, `seraphin`.
- Added `cleanup_runtime_side_slivers_strip(...)` plus `POST_STRIP_SIDE_SLIVER_CLEANUP_SPECS` for clips that still carried thin edge-connected leftovers after extraction.
- Final visual spot check results after the exact-row pass:
  - good / usable now: `serena/victory`, `serena/down_or_death`, `iris/attack_basic_03`, `iris/victory`, `wolf/attack_basic_01`, `wolf/attack_basic_02`, `wolf/charge`, `erin/walk`, `erin/run`, `erin/summon_or_rune`, `erin/dash_or_dodge`, `nazir/idle`, `nazir/attack_basic_03`, `laila/run`, `hakan/walk`, `hakan/run`, `hakan/heavy_attack`, `seraphin/run`, `seraphin/pray_idle`, `seraphin/down_or_death`
  - improved the most but still worth future polish if there is time: `iris/attack_basic_01`
- Visual verification files checked directly from runtime output:
  - `public/assets/runtime/characters/serena/*.png`
  - `public/assets/runtime/characters/iris/*.png`
  - `public/assets/runtime/characters/wolf/*.png`
  - `public/assets/runtime/characters/erin/*.png`
  - `public/assets/runtime/characters/nazir/*.png`
  - `public/assets/runtime/characters/laila/*.png`
  - `public/assets/runtime/characters/hakan/*.png`
  - `public/assets/runtime/characters/seraphin/*.png`
- Verification:
  - `python -m py_compile scripts/generate-runtime-character-clips.py`
  - `python scripts/generate-runtime-character-clips.py`
  - `npm run typecheck`
  - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`
- 2026-05-01: switched the requested multi-character clips off the shared `exact original row` path and onto explicit original-source per-frame boxes in `scripts/generate-runtime-character-clips.py`.
- Added a new `CENTER_TARGETED_MANUAL_SOURCE_BOX_SUBJECT_CLIPS` path so manual source boxes can choose the primary subject nearest the intended frame center instead of trusting the old generic component pick.
- Removed `EXACT_ORIGINAL_ROW_REGION_SPECS` / grid-mode overrides for the current requested set so the new manual clip path actually executes.
- Generated fresh visual QA bundles after the remap:
  - `output/character-manual-pass-2026-05-01/requested_clips_overview.png`
  - `output/character-manual-pass-2026-05-01-pass2/requested_clips_overview.png`
  - `output/per-clip-component-audit-2026-05-01/`
  - `output/slot-box-proposals-2026-05-01/`
- Current status after this pass:
  - structural/code side is stable: regeneration, manifest update, `typecheck`, and animation asset tests all pass.
  - visual side is only partially improved: several requested clips are still not acceptable because the original source-refresh rows contain overlapping neighboring poses, so explicit boxes alone are still selecting slivers or adjacent fragments.
  - the clearest remaining failures after this pass are still visible in:
    - `helma/idle`
    - `helma/dash_or_dodge`
    - `serena/victory`
    - `wolf/down_or_death`
    - plus a broader set in the pass2 overview that still need a stronger per-frame isolation approach.
- Next recommended repair direction:
  - stop treating these overlap-heavy rows as independent crops.
  - build clip-specific frame-isolation from the full row with manual seeds/ownership zones or move the worst overlap cases to cleaner approved/package originals if the original refresh row cannot represent one full subject per frame.
- 2026-05-01: Helma-only repair pass.
- Root cause re-evaluated from raw source rows:
  - `helma/idle` source-refresh row only contains 5 real poses, not 6 distinct extractable frames.
  - `helma/dash_or_dodge` source-refresh row only contains 3 real poses, not 5 distinct extractable frames.
  - previous failures came from trying to slice empty/interstitial book-space as if it were its own frame.
- Replaced Helma manual boxes with true pose-count boxes:
  - `idle`: 5 explicit pose boxes, then runtime resample/hold to 6 frames.
  - `dash_or_dodge`: 3 explicit pose boxes, then runtime resample/hold to 5 frames.
- This pass intentionally stopped using Helma’s old evenly spaced box assumptions.
- Visual verification after regeneration:
  - `output/helma-final-check-2026-05-01/idle_magenta.png`
  - `output/helma-final-check-2026-05-01/dash_or_dodge_magenta.png`
  - `output/helma-final-check-2026-05-01/idle_0.png`
  - `output/helma-final-check-2026-05-01/idle_5.png`
  - `output/helma-final-check-2026-05-01/dash_or_dodge_0.png`
  - `output/helma-final-check-2026-05-01/dash_or_dodge_4.png`
- Helma result status:
  - `idle`: complete subject per frame, no left-side sliver/book fragment, no visible head/feet clipping in checked frames.
  - `dash_or_dodge`: complete subject per frame, no left/right invasion, no visible head/feet clipping in checked frames.
- Verification:
  - `python -m py_compile scripts/generate-runtime-character-clips.py`
  - `python scripts/generate-runtime-character-clips.py`
  - `npm run typecheck`
  - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`

## 2026-05-01 - Dorgan interact bottom contamination fix

- Re-audited `dorgan/interact` frame-by-frame and confirmed the main failure was not edge clipping but source-box over-capture:
  - each frame included the correct main body,
  - a horizontal separator line,
  - and the next-row upper fragment under the character.
- Evidence bundles:
  - `output/dorgan-interact-audit-2026-05-01/`
  - `output/dorgan-interact-source-crops-2026-05-01/`
- Changed `scripts/generate-runtime-character-clips.py` so `dorgan/interact` stops using the too-tall legacy vertical window and instead trims the manual source boxes at the bottom:
  - old Y range: `1010..1115`
  - new Y range: `1010..1076`
- This is intentionally a clip-specific rule, not a reused generic cleanup pass. The goal was to eliminate next-row contamination at the source instead of trying to repair it after extraction.
- Rebuilt runtime character strips and re-audited:
  - `output/dorgan-interact-audit-2026-05-01-pass2/interact_contact_magenta_x4.png`
  - `output/dorgan-interact-audit-2026-05-01-pass2/frame_0_magenta_x6.png`
- Result:
  - bottom contamination strip is removed,
  - one character remains per frame,
  - no new left/right or top/bottom clipping introduced in the repaired runtime strip.
- Verification:
  - `python -m py_compile scripts/generate-runtime-character-clips.py`
  - `python scripts/generate-runtime-character-clips.py`
  - `npm run typecheck`
  - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`

## 2026-05-01 - Dorgan interact head crop correction

- Rechecked the repaired `dorgan/interact` frames visually after the bottom-contamination fix and found a second issue:
  - the lower-row contamination was gone,
  - but the head top was still flattened because the source boxes started too low.
- Confirmed this was a source-box problem, not a runtime fit/anchor problem:
  - current runtime review: `output/dorgan-interact-audit-2026-05-01-pass2/interact_contact_magenta_x4.png`
  - source crop review showed the hair tips already clipped before runtime packing.
- Tested taller source crops manually and found that moving the top edge from `1010` to `1008` restores the full head silhouette without reintroducing the row-above strip.
- Replaced the generic `build_variable_width_source_boxes(...)` entry for `dorgan/interact` with explicit per-frame boxes:
  - `(219, 1008, 327, 1076)`
  - `(337, 1008, 447, 1076)`
  - `(449, 1008, 557, 1076)`
  - `(559, 1008, 669, 1076)`
  - `(667, 1008, 775, 1076)`
  - `(772, 1008, 872, 1076)`
- This is now a frame-specific source-box definition instead of a reused width-builder rule.
- Final review artifacts:
  - `output/dorgan-interact-audit-2026-05-01-pass3/interact_contact_magenta_x4.png`
  - `output/dorgan-interact-audit-2026-05-01-pass3/frame_0_magenta_x6.png`
  - `output/dorgan-interact-source-crops-2026-05-01-pass3/frame_0_source_x4.png`
  - `output/dorgan-interact-source-crops-2026-05-01-pass3/frame_5_source_x4.png`
- Final state:
  - one character per frame,
  - no lower contamination,
  - head silhouette restored,
  - no new top/bottom or left/right clipping observed in the reviewed runtime frames.
- Verification:
  - `python -m py_compile scripts/generate-runtime-character-clips.py`
  - `python scripts/generate-runtime-character-clips.py`
  - `npm run typecheck`
  - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`

## 2026-04-30 23:22: Dorgan idle / interact / attack_basic_02 source-box rebuild

- Reopened the Dorgan source-refresh sheet and confirmed the previous repair path was still wrong for `idle`, `interact`, and `attack_basic_02`.
- `idle` and `interact` were still inheriting generic band/component behavior, while `attack_basic_02` still depended on the old legacy/custom path that kept horizontal row strips and presentation residue in play.
- Removed Dorgan from `TARGETED_CUSTOM_CLIP_REPAIR_SPECS` so these three clips no longer fall back to the old targeted/custom repair route.
- Added explicit source-refresh manual boxes for:
  - `dorgan/idle`
  - `dorgan/interact`
  - kept `dorgan/attack_basic_02` on per-frame source boxes
- Added a Dorgan-only manual extraction path in `scripts/generate-runtime-character-clips.py`:
  - strips out wide horizontal guide artifacts first
  - keeps the primary character silhouette instead of the generic merged band
  - preserves original alpha inside the character body instead of letting generic cleanup punch through the sprite
- Re-ran runtime clip generation and reviewed the rebuilt strips:
  - `output/dorgan-final-review-2026-04-30/idle_magenta_x4.png`
  - `output/dorgan-final-review-2026-04-30/interact_magenta_x4.png`
  - `output/dorgan-final-review-2026-04-30/attack_basic_02_magenta_x4.png`
- Result after this pass:
  - `idle`: restored as a full-body strip instead of the previous partial/generic result
  - `interact`: restored with one character per frame and no left label contamination
  - `attack_basic_02`: no longer collapses into lower-row debris; rebuilt from source boxes with the Dorgan-specific cleanup path
- Verification:
  - `python -m py_compile scripts/generate-runtime-character-clips.py`
  - `python scripts/generate-runtime-character-clips.py`
  - `npm run typecheck`
  - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`

## 2026-05-01 01:22: clip-by-clip rebuild pass for requested runtime failures

- Reworked the requested bad clips to stop relying on the old `targeted_custom` path wherever per-frame source boxes or per-frame package boxes were available.
- Added explicit skip-routing for the requested clips so they no longer get pre-empted by the generic row-band heuristics:
  - `dorgan/interact`
  - `helma/idle`, `helma/dash_or_dodge`
  - `serena/victory`, `serena/down_or_death`
  - `fin/aim`, `fin/shoot_loop`
  - `iris/attack_basic_01`, `iris/attack_basic_03`, `iris/victory`
  - `wolf/attack_basic_01`, `wolf/attack_basic_02`, `wolf/charge`, `wolf/dash_or_dodge`, `wolf/victory`, `wolf/down_or_death`
  - `erin/walk`, `erin/run`, `erin/summon_or_rune`, `erin/dash_or_dodge`
  - `nazir/idle`, `nazir/attack_basic_03`
  - `laila/run`
  - `hakan/walk`, `hakan/run`, `hakan/heavy_attack`
  - `seraphin/run`, `seraphin/attack_basic_02`, `seraphin/pray_idle`, `seraphin/down_or_death`
- Added source/manual box definitions for clips that previously had no true per-frame boxes:
  - `helma/idle`
  - `helma/dash_or_dodge`
  - `fin/aim`
  - `hakan/run`
  - `hakan/heavy_attack`
  - `laila/run`
- Added package/manual box definitions for clips that needed explicit frame boxes instead of package-panel heuristics:
  - `erin/walk`
  - `erin/run`
  - `seraphin/pray_idle`
  - redefined `iris/attack_basic_03`
- Added `approved_master` overrides for clips whose new manual source boxes were based on approved-sheet coordinates:
  - `laila/run`
  - `hakan/run`
  - `hakan/heavy_attack`
- Added two new direct extraction routes in `scripts/generate-runtime-character-clips.py`:
  - `extract_subject_manual_source_box_frames(...)` for preserving full characters from explicit source boxes
  - `extract_subject_package_manual_frames(...)` for preserving full characters from explicit package boxes
- Added clip-level post-fit margin scaling (`0.92`) for the requested clips so they stop filling the 64x64 runtime canvas too aggressively and looking clipped at the edges.
- Results after this pass:
  - improved clearly: `dorgan/interact`, `helma/idle`, `helma/dash_or_dodge`, `serena/victory`, `serena/down_or_death`, `fin/aim`, `fin/shoot_loop`, `wolf/* requested`, `erin/* requested`, `nazir/idle`, `laila/run`, `hakan/run`, `hakan/heavy_attack`, `seraphin/run`, `seraphin/attack_basic_02`, `seraphin/pray_idle`, `seraphin/down_or_death`
  - still visually questionable and likely needing another exact-box pass: `iris/attack_basic_03`, `iris/victory`
- Review bundles:
  - `output/requested-runtime-review-2026-04-30/`
  - `output/requested-runtime-review-2026-04-30-pass2/`
  - `output/focused-runtime-review-2026-04-30-pass4/`
  - `output/focused-runtime-review-2026-04-30-pass5/`
- Verification:
  - `python -m py_compile scripts/generate-runtime-character-clips.py`
  - `python scripts/generate-runtime-character-clips.py`
  - `npm run typecheck`
  - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`
- `2026-05-03 01:44`: softened monster prompt tone in `docs/art/MONSTER_EXPANSION_READY_TO_COPY_PROMPTS_2026-05-02.md` by adding `cute but dangerous`, anti-grotesque bans, and game-friendly corruption wording directly into every monster and boss prompt block.
- `2026-05-03 02:02`: created `docs/art/MONSTER_RUNTIME_ANIMATION_READY_TO_COPY_PROMPTS_2026-05-03.md` with one-monster-per-image runtime animation sheet prompts for all monsters, including cut-friendly equal-grid rules, transparent gutters, large margins, pattern-specific row plans, and larger 4x5 boss sheet layouts.

## 2026-05-03 10:58: town expansion, starter companion gate, palace/interior tile pass

- Expanded `Lumen Village` into a larger exploration space in `src/game/data/town.ts`:
  - town bounds widened to `1536 x 1184`
  - plaza, fountain, palace gate, world gate, spawn points, blockers, patrol routes, and building placements rebalanced for a multi-lane village instead of the previous compact layout
  - added more ambient NPC patrol definitions and a separate story-NPC roster
- Added story-flag backed village progression in:
  - `src/game/data/storyFlags.ts`
  - `src/game/types.ts`
  - `src/game/services/save.ts`
  - `src/game/core/state.ts`
- New village story gate:
  - the player now starts with only `hero`
  - `Bram` is recruited through village dialogue before the first sortie
  - stage entry is blocked until the starter companion is recruited
  - `starter_companion_locked` now surfaces a dedicated user-facing reason in `StageSelectScene`
- Reworked `VillageLobbyScene` to support:
  - larger town roads and walls
  - ambient NPC patrols plus stationary story NPC interactions
  - first-arrival village event flow
  - Bram recruit event at the village square
  - follow-up archive / harbor / supply / mayor event beats so town progression is not only stage combat
  - route gate lock before the recruit event completes
- Rebuilt palace data and scene:
  - `src/game/data/palace.ts`
  - `src/game/scenes/PalaceScene.ts`
  - palace hall expanded into a larger tile-based audience chamber
  - first audience story beat is now tracked with a story flag
  - more palace NPCs were added for world-state dialogue
- Forced town interiors to use tile-based runtime flooring / wall composition in `src/game/scenes/TownInteriorScene.ts` instead of relying on painted full-screen backplates.
- Replaced oversized painted exterior building art in `VillageLobbyScene` with procedural tile-based town buildings:
  - each shop now uses tiled walls, tiled roofs, windows, door frames, signboards, and lanterns
  - this keeps the exterior town rendering in the same family as the dot-style player and the tile-based ground
- Updated dialogue portrait routing in `src/game/ui/dialogueOverlay.ts` so the new town/palace NPCs use runtime-style portrait sources.
- Updated tests that assumed the player could sortie immediately:
  - `tests/state.test.ts`
  - `tests/party.test.ts`
  - `tests/equipment.test.ts`
  - `tests/battle.test.ts`
- Updated `scripts/run-town-manual-checks.mjs`:
  - armor shop auto-enter verification adapted to the new door placement
  - village overview capture moved near the central plaza/fountain
  - palace capture now advances the arrival dialogue and recenters for a clearer hall screenshot
- QA artifacts reviewed:
  - `output/town-dev-preview/manual-checks/village-overview.png`
  - `output/town-dev-preview/manual-checks/npc-flow.png`
  - `output/town-dev-preview/manual-checks/palace-flow.png`
- Web-game Playwright client rerun with the skill client:
  - `output/web-game/state-0.json`
  - `output/web-game/shot-0.png`
  - still reports `booting` and captures a blank canvas in this repo's generic entry path, so the town-specific Playwright script remains the reliable visual QA route
- Verification:
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - `npm run test:town`
- Remaining polish notes:
  - the widened town logic and events are in place, but exterior art density can still be tuned further building-by-building
  - the manual town screenshots are now more useful, but they are still narrow vertical captures rather than true whole-map overviews

## 2026-05-03 11:15: village and palace tile/decor prompt bundle

- Added `docs/art/TOWN_AND_PALACE_TILE_DECOR_READY_TO_COPY_PROMPTS_2026-05-03.md`.
- The new bundle separates runtime environment generation into focused groups instead of one broad town-rework batch:
  - village outdoor ground
  - village roads and plaza
  - village dirt and edge transitions
  - village trees and large greenery
  - village small nature decor
  - village utility props
  - village fence / wall / border tiles
  - village facade modules
  - shared village house interior tiles
  - palace floor
  - palace carpet
  - palace wall / column / arch tiles
  - palace throne dais modules
  - palace interior decor props
  - palace side-room / archive tiles
  - shared door / stair / transition modules
- Each prompt now hardcodes cut-friendly output rules:
  - transparent PNG
  - square tile cells or fixed prop slots
  - transparent gutter
  - transparent outer margin
  - one tile or one prop per cell / slot
  - no shadows or silhouettes crossing boundaries
- Added two additional strict-overhead runtime prompt groups:
  - `top-down tower tiles`
  - `top-down indoor perimeter wall tiles`
- These two were intentionally written as `true straight top-down` assets with no angled view, because they are better assembled as tilemap geometry than as perspective scenery.

## 2026-05-03 11:42: expanded NPC runtime and portrait prompt bundle

- Added `docs/art/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03.md`.
- Replaced the older mixed NPC prompt direction with a cleaner production split:
  - `runtime dot NPC sheets`
  - `high-resolution NPC portraits`
- Covered the enlarged population plan:
  - current NPCs: `25`
  - expansion NPCs: `11`
  - total NPC roster covered: `36`
- Total prompt count in the new bundle:
  - runtime dot prompts: `36`
  - portrait prompts: `36`
  - total prompts: `72`
- Runtime dot prompts use cut-friendly fixed-sheet rules:
  - one NPC per image
  - transparent PNG
  - `1792 x 1792`
  - exact `4 x 4` grid
  - fixed `384 x 384` frame cells
  - transparent gutter and outer margin
  - no background, no floor shadow, no silhouette spill between cells
- Portrait prompts use dialogue / gacha-ready single-character rules:
  - one NPC per image
  - transparent PNG
  - `2048 x 2560`
  - large safe margin
  - no scene background or UI frame

## 2026-05-03 13:45: imported prompt-batch character portraits and monster runtime sheets

- Reviewed new asset folders under `image/`:
  - `CHARACTER_MASTER_PORTRAIT_READY_TO_COPY_PROMPTS_2026-05-03`
  - `MONSTER_RUNTIME_ANIMATION_READY_TO_COPY_PROMPTS_2026-05-03`
- Findings before import:
  - character portraits were visually strong but delivered as baked-background RGB files, so they needed background removal before use in dialogue/gacha
  - gacha rarity backplates were also RGB and needed cleanup before they could sit behind portraits cleanly
  - monster runtime sheets were usable as source, but they needed per-cell background removal and runtime strip rebuilding before battle use
- Added a dedicated importer:
  - `scripts/import_prompt_asset_batches_2026_05_03.py`
- Character portrait import:
  - regenerated all `21` playable dialogue/showcase portraits into `public/assets/dialogue/characters`
  - selected stronger variants for duplicated sources:
    - `fin -> 12-fin-2.png`
    - `erin -> 15-erin-2.png`
  - generated cleaned gacha rarity backplates into `public/assets/ui/gacha`
- Gacha UI integration:
  - added rarity backplate asset keys to `src/game/data/screenRuntimeArt.ts`
  - applied the imported backplates to character cards in `src/game/scenes/GachaScene.ts`
- Monster runtime import:
  - rebuilt runtime enemy strips for all `60` monster sheets from the prompt batch
  - switched stage encounter runtime subjects to use the concrete monster id per encounter in `src/game/data/monsters.ts`
  - updated `public/assets/runtime/animation-manifest.json` with `60` enemy subjects from the new import
  - adjusted `src/game/scenes/BattleScene.ts` to prefer pattern-based enemy clips for the newly unique monster subjects while preserving boss-specific behavior
- Review artifacts:
  - `output/prompt-asset-import-2026-05-03/portraits_review.png`
  - `output/prompt-asset-import-2026-05-03/gacha_backplates_review.png`
  - `output/prompt-asset-import-2026-05-03/monster_idle_review.png`
  - `output/prompt-asset-import-2026-05-03/gacha_reveal_after_import.png`
  - `output/prompt-asset-import-2026-05-03/battle_continent01_after_import.png`
- Verification:
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - `npm run capture:store`
- Notes:
  - the shared `capture:store` gacha step still stops on the confirm modal, so an additional one-off Playwright capture was used to confirm the actual reveal cards with the new backplates
  - the new monster runtime path is now unique-per-monster in battle, but the animation viewer catalog still reflects the older curated enemy subject list rather than all 60 monster ids

## 2026-05-03 13:52: cleaned imported source images from image folder

- Deleted the prompt-batch source files that were actually imported into runtime assets.
- Removed:
  - `24` used character/gacha source images from `image/CHARACTER_MASTER_PORTRAIT_READY_TO_COPY_PROMPTS_2026-05-03`
  - all `60` used monster runtime source sheets from `image/MONSTER_RUNTIME_ANIMATION_READY_TO_COPY_PROMPTS_2026-05-03`
- Left untouched on purpose:
  - `image/CHARACTER_MASTER_PORTRAIT_READY_TO_COPY_PROMPTS_2026-05-03/12-fin-1.png`
  - `image/CHARACTER_MASTER_PORTRAIT_READY_TO_COPY_PROMPTS_2026-05-03/15-erin-1.png`
  - older pre-existing root `image/*.png` hold files from earlier passes

## 2026-05-03 14:41: mapped mismatched monster/tile source images and applied reviewed assets

- Reviewed the new image batches directly and found filename/content mismatches before import.
- Confirmed mismatches:
  - `image/MONSTER_EXPANSION_READY_TO_COPY_PROMPTS_2026-05-02/01-village-grass-and-meadow-ground-tile-sheet.png`
    - was actually a duplicate of `07-tusk-boarling.png`
    - treated as a bad duplicate and excluded from tile/monster mapping
  - `image/TOWN_AND_PALACE_TILE_DECOR_READY_TO_COPY_PROMPTS_2026-05-03/01-orin-runtime-dot-sheet.png`
    - was actually a duplicate of `14-palace-lighting-banner-and-interior-decor-prop-sheet.png`
    - treated as a bad duplicate and excluded from tile mapping
- Canonical variant picks:
  - `04-reed-shaman-2.png` selected over `04-reed-shaman-1.png`
  - `52-fallen-acolyte-2.png` selected over `52-fallen-acolyte-1.png`
- Added importer:
  - `scripts/import_mapped_environment_and_monster_art_2026_05_03.py`
- Applied outputs:
  - regenerated `59` monster illustration assets into `public/assets/illustrations/monsters`
  - generated `src/game/data/monsterIllustrationAssets.ts`
  - preloaded monster illustration assets in `src/game/scenes/BootScene.ts`
  - applied new palace decor/tile outputs through `src/game/data/palaceRuntimeArt.ts`
  - placed the imported decor into `src/game/scenes/PalaceScene.ts`
  - added featured monster preview support to `src/game/scenes/ResultScene.ts`
- Known missing source images:
  - `meadow_slime` illustration source missing from the monster batch
  - `01-village-grass-and-meadow-ground-tile-sheet.png` true grass sheet missing from the town tile batch
- Review artifacts:
  - `output/image-mapping-review/MONSTER_EXPANSION_READY_TO_COPY_PROMPTS_2026-05-02_contact.png`
  - `output/image-mapping-review/TOWN_AND_PALACE_TILE_DECOR_READY_TO_COPY_PROMPTS_2026-05-03_contact.png`
  - `output/mapped-environment-and-monster-art-2026-05-03/monster_illustration_review.png`
  - `output/mapped-environment-and-monster-art-2026-05-03/environment_runtime_review.png`
  - `output/mapped-asset-qa-live/village.png`
  - `output/mapped-asset-qa-live/palace.png`
  - `output/mapped-asset-qa-live/result.png`
- Verification:
  - `python scripts/import_mapped_environment_and_monster_art_2026_05_03.py`
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`

## 2026-05-03 17:06: imported expanded NPC prompt assets, fixed runtime sheet slicing, and applied mapped NPC art

- Reviewed the new `image/NPC_RUNTIME_AND_PORTRAIT_EXPANDED_READY_TO_COPY_PROMPTS_2026-05-03` batch directly before import.
- Confirmed source mismatches / gaps:
  - `01-orin-runtime-dot-sheet.png` missing from the runtime batch, so existing `weapon_merchant` runtime clips were kept
  - `06-mayor-haru-portrait-1.png` selected as the canonical Mayor Haru portrait
  - `22-captain-rowan-runtime-dot-sheet-2.png` selected as the canonical Captain Rowan runtime sheet
- Added importer:
  - `scripts/import_npc_prompt_assets_2026_05_03.py`
- Applied portrait mappings:
  - generated `36` NPC portrait sources plus aliases into `public/assets/dialogue/npcs`
  - updated `src/game/data/dialoguePortraitAssets.ts` with new NPC portrait keys and aliases
- Applied runtime NPC mappings:
  - regenerated `39` runtime NPC subject folders into `public/assets/runtime/npcs`
  - updated `public/assets/runtime/animation-manifest.json`
  - updated runtime subject routing in:
    - `src/game/ui/dialogueOverlay.ts`
    - `src/game/data/town.ts`
    - `src/game/data/palace.ts`
    - `src/game/scenes/TownInteriorScene.ts`
- Found and fixed a real import bug after first pass:
  - the generated runtime dot sheets were not true fixed-grid sheets
  - some sheets were `1254x1254` 4x4 layouts, others were `1024x1024` 4x3 layouts
  - the first importer used a hard-coded margin/gutter/cell rule, which left white boxes and mis-cut frames in live scenes
  - replaced that with source-driven slot inference: background removal -> component detection -> row/column clustering -> slot crop -> runtime fit
- Review artifacts:
  - `output/npc-image-mapping-review-2026-05-03/portraits_contact.png`
  - `output/npc-image-mapping-review-2026-05-03/runtime_contact.png`
  - `output/npc-prompt-import-2026-05-03/npc_portraits_review.png`
  - `output/npc-prompt-import-2026-05-03/npc_runtime_review.png`
  - `output/town-dev-preview/manual-checks/npc-flow.png`
  - `output/town-dev-preview/manual-checks/palace-flow.png`
  - `output/town-dev-preview/manual-checks/shop-flow.png`
- QA result:
  - live town/palace/shop screenshots no longer show the previous white runtime boxes
  - dialogue now uses the new high-res NPC portraits instead of forcing runtime sprites
  - the generic `develop-web-game` Playwright client still only captures the repository's `booting` blank state on `4173`, so town QA remains the reliable scene-level verification path
- Verification:
  - `python -m py_compile scripts/import_npc_prompt_assets_2026_05_03.py`
  - `python scripts/import_npc_prompt_assets_2026_05_03.py`
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - `npm run test:town`

## 2026-05-03 17:18: added dedicated top-down building prompt set for town and palace expansion

- Added building-specific prompt sections to `docs/art/TOWN_AND_PALACE_TILE_DECOR_READY_TO_COPY_PROMPTS_2026-05-03.md`
- New sections added:
  - `19. Top-Down Village Roof Tile Sheet`
  - `20. Top-Down Village Exterior Wall And Foundation Tile Sheet`
  - `21. Top-Down Building Door, Window, Sign, And Chimney Module Sheet`
  - `22. Top-Down Eave Shadow And Building Footprint Overlay Sheet`
  - `23. Top-Down Shop Prefab Building Sheet`
  - `24. Top-Down Palace Wing And Royal Building Prefab Sheet`
- Reason:
  - current town buildings are still an interim mix of top-down tiles and large exterior chunks
  - dedicated building roof/wall/module/prefab art is needed to stop the town from looking cut off or mismatched
- Notes:
  - prompts are biased toward easy runtime cutting
  - each block explicitly requires transparent background, fixed slot or tile logic, and no spill across cells or slots
- Verification:
  - doc-only update, no runtime test required

## 2026-05-03 18:36: rebalanced town/palace tile layout and regenerated higher-resolution npc runtime sheets

- Goal:
  - address user feedback that the village floor looked patchy, buildings still felt mismatched, and palace interior plus NPCs looked too small or blurry
- Scene/layout changes:
  - patched `src/game/scenes/VillageLobbyScene.ts`
  - simplified outdoor grass/road/dirt tile variation so the village reads as a coherent map instead of a patchwork mix
  - tightened procedural building shapes into flatter top-down roof blocks with cleaner wall bands and removed the front-facing gable feel
  - increased village hero and NPC display heights and kept integer display sizing
  - patched `src/game/scenes/PalaceScene.ts`
  - replaced the old heavy dark palace overlays with a more tile-led floor/border layout using indoor stone/brick runtime tiles
  - rebuilt the audience hall runner and throne dais as top-down tile regions instead of mostly painted rectangles
  - increased palace hero and palace NPC display sizes
- Runtime quality changes:
  - patched `src/style.css` to enforce `image-rendering: pixelated` / `crisp-edges`
  - patched `scripts/import_npc_prompt_assets_2026_05_03.py` to regenerate runtime NPC strips at `64x64` with a tighter margin for better in-scene clarity
  - reran the NPC importer and refreshed `public/assets/runtime/npcs/*` plus the runtime manifest
- QA harness changes:
  - patched `scripts/run-town-manual-checks.mjs`
  - town manual checks now skip the opening cutscene automatically before verifying the village/palace scenes
- Added prompt follow-up:
  - extended `docs/art/TOWN_AND_PALACE_TILE_DECOR_READY_TO_COPY_PROMPTS_2026-05-03.md`
  - new sections:
    - `25. Top-Down Royal Audience Hall Floor And Wall Tile Sheet`
    - `26. Top-Down Palace Carpet Runner Tile Sheet`
- Review artifacts:
  - `output/npc-prompt-import-2026-05-03/npc_runtime_review.png`
  - `output/town-dev-preview/manual-checks/village-overview.png`
  - `output/town-dev-preview/manual-checks/shop-flow.png`
  - `output/town-dev-preview/manual-checks/palace-flow.png`
  - `output/town-dev-preview/manual-checks/npc-flow.png`
- Verification:
  - `python scripts/import_npc_prompt_assets_2026_05_03.py`
  - `npm run typecheck`
  - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`
  - `npm run test`
  - `npm run build`
  - `npm run test:town`
- Notes:
  - the generic `develop-web-game` Playwright client still reports the repository's long-lived `booting` state on `4173`, so scene QA continues to rely on the dedicated `test:town` capture path

## 2026-05-03 18:44: wrote session handoff document for restart continuity

- Added:
  - `docs/HANDOFF_STATUS_2026-05-03.md`
- Purpose:
  - give the next session a single restart document with current state, completed work, pending issues, next priorities, QA artifacts, commands, and key file references
- Verification:
  - doc-only update, no runtime test required

## 2026-05-03 19:10: prepared strict 2-head NPC runtime dot remake prompts

- Added:
  - `docs/art/NPC_2HEAD_RUNTIME_DOT_REMAKE_READY_TO_COPY_PROMPTS_2026-05-03.md`
- Purpose:
  - remake all current NPC runtime dot sheets because the latest NPC dot outputs read closer to 3~4-head proportions, while the game runtime target is strict 2-head SD/chibi.
- Prompt changes:
  - repeated strict 2-head proportion rules in every NPC runtime prompt
  - locked the character target to a large head, short torso, short legs, compact adult-role silhouette
  - rejected 2.5-head / 3-head / 4-head / long-legged / realistic / painterly / 3D outputs
  - corrected the grid math for `1792 x 1792`: `384px` cells, `32px` gutters, `80px` outer margin
- Scope:
  - runtime dot sheets only
  - no dialogue portrait remake in this pass
  - `36` canonical source sheet prompts, covering merchant aliases through importer mapping
- Follow-up:
  - if `01-orin-runtime-dot-sheet.png` is generated this time, update `scripts/import_npc_prompt_assets_2026_05_03.py` so `weapon_merchant` / `orin` consumes the new Orin sheet instead of keeping old runtime clips
- Verification:
  - doc-only update, no runtime test required

## 2026-05-03 19:36: upgraded playable character runtime sheets to 128px source frames

- Goal:
  - apply option 2 from the character breakage analysis: stop using tiny `64x64` runtime frames for playable/main characters, and preserve the source art better before in-game scaling.
- Runtime changes:
  - patched `scripts/generate-runtime-character-clips.py`
  - changed playable character runtime `FRAME_SIZE` from `64` to `128`
  - switched runtime resizing from nearest-neighbor to `Image.Resampling.LANCZOS`
  - regenerated all `21` character subjects under `public/assets/runtime/characters/*`
  - refreshed `public/assets/runtime/animation-manifest.json` so character clips now advertise `frameWidth: 128`, `frameHeight: 128`
- Rendering changes:
  - patched `src/game/data/runtimeAnimationAssets.ts`
  - applies Phaser linear texture filtering only to runtime `character` textures so 128px character frames downsample more cleanly in the village/combat scenes
- QA tooling changes:
  - patched `scripts/export-character-frame-review.py` to read `frameWidth` / `frameHeight` from the manifest instead of assuming `64`
  - patched `scripts/audit-runtime-character-clips.py` so absolute alpha/edge/jitter thresholds scale with 128px frames
- Review artifacts:
  - `output/qa/runtime-character-quality-report.json`
  - `output/qa/runtime-character-quality-report.md`
  - `output/qa/character-frame-review/luna/attack_basic_02-all-frames.png`
  - `output/qa/character-frame-review/luna/down_or_death-all-frames.png`
  - `output/qa/character-frame-review/fin/shoot_loop-all-frames.png`
  - `output/town-dev-preview/manual-checks/village-overview.png`
  - `output/town-dev-preview/manual-checks/npc-flow.png`
- Verification:
  - `python scripts/generate-runtime-character-clips.py`
  - `python -m py_compile scripts/generate-runtime-character-clips.py scripts/export-character-frame-review.py scripts/audit-runtime-character-clips.py`
  - `python scripts/audit-runtime-character-clips.py`
  - `python scripts/export-character-frame-review.py --subject luna --subject fin`
  - `npm run typecheck`
  - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`
  - `npm run test`
  - `npm run build`
  - `npm run test:town`
- QA notes:
  - town capture confirms the main character now renders with less broken linework while keeping the SD/chibi proportion.
  - runtime audit result after threshold scaling: `21` character subjects, `1` pass, `18` caution, `2` fail.
  - remaining fail subjects are `luna` and `fin`, caused by a few action-effect/downed-pose frames touching cell edges or retaining internal transparent holes; idle/town view quality is not the same failure mode.
  - the generic `develop-web-game` client still captures `booting` for this repo unless a project-specific boot scene start is injected, so visual QA remains tied to `npm run test:town`.

## 2026-05-03 20:47: normalized hero walk size against town idle

- Goal:
  - fix user-reported issue where the main character looked larger while moving than while standing idle.
- Cause:
  - the display code used the same `128x128` runtime frame size for `town_idle` and `walk`, but the visible alpha bounds differed.
  - before the fix, `hero/town_idle` averaged about `81.5px` visible height while `hero/walk` averaged about `89.9px`, so walking appeared roughly 10% taller.
- Changes:
  - patched `scripts/generate-runtime-character-clips.py`
  - added `--subject` CLI filtering so a single character can be regenerated without refreshing all character subjects
  - added a hero-specific post-fit scale override: `hero/walk = 0.91`
  - regenerated only `hero` runtime clips and merged the updated hero manifest entry back into `public/assets/runtime/animation-manifest.json`
- Result:
  - after regeneration, strong-visible alpha bounds are effectively matched:
    - `town_idle`: about `81.5px` visible height
    - `walk`: about `81.9px` visible height at alpha threshold `> 8`
  - hero `walk`, `run`, and `town_idle` all pass the runtime character audit.
- Review artifacts:
  - `output/qa/character-frame-review/hero/town_idle-all-frames.png`
  - `output/qa/character-frame-review/hero/walk-all-frames.png`
  - `output/town-dev-preview/manual-checks/village-overview.png`
  - `output/town-dev-preview/manual-checks/npc-flow.png`
- Verification:
  - `python -m py_compile scripts/generate-runtime-character-clips.py`
  - `python scripts/generate-runtime-character-clips.py --subject hero`
  - `python scripts/export-character-frame-review.py --subject hero`
  - `python scripts/audit-runtime-character-clips.py`
  - `npm run typecheck`
  - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`
  - `npm run test`
  - `npm run build`
  - `TOWN_CHECK_PORT=4184 npm run test:town`
- Notes:
  - `npm run test:town` failed once on `4178` and once on `4183` due local dev-server startup/navigation timeouts, then passed on `4184`.
  - generic `develop-web-game` client was rerun against the local dev server and still captured `{"mode":"booting","activeScenes":[]}`, matching the known repo-specific limitation.

## 2026-05-03 21:22: improved shop text clarity and detail modal readability

- Goal:
  - address user feedback that shop/detail text looked broken or blurry in the browser.
- Cause:
  - Phaser `render.pixelArt: true` forced the whole `360x640` canvas to upscale with `image-rendering: pixelated`, so Phaser text was pixel-scaled along with sprite art.
  - CSS also explicitly set the canvas to `pixelated` / `crisp-edges`.
  - shop UI/detail images were high-resolution painterly assets but were being downscaled with `NEAREST`, making frames and item art rough.
  - detail modal body/status/button text was too small and tightly stacked for Korean/English mixed text.
- Changes:
  - patched `src/game/config.ts`
    - `render.antialias: true`
    - `render.pixelArt: false`
  - patched `src/style.css`
    - canvas `image-rendering` now uses `auto`
  - patched `src/game/scenes/BootScene.ts`
    - keeps the master gameplay atlas on `NEAREST`
    - switches runtime shop UI images and runtime button frame images to `LINEAR`
  - patched `src/game/scenes/ShopScene.ts`
    - runtime-loaded shop item detail/thumbnail textures now use `LINEAR`
    - detail overlay reduced from `0.76` to `0.6`
    - detail meta/body/status font sizes raised
    - detail description/status/button positions adjusted to prevent overlap
  - patched `src/game/ui/widgets.ts`
    - runtime button label font size raised and shadow blur removed
- Review artifacts:
  - `output/shop-text-clarity-check/armor-detail-canvas-final.png`
  - `output/shop-text-clarity-check/canvas-metrics-final.json`
  - `output/town-dev-preview/manual-checks/village-overview.png`
- Verification:
  - `npm run typecheck`
  - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts`
  - `npm run test`
  - `npm run build`
  - `TOWN_CHECK_PORT=4189 npm run test:town`
- Result:
  - Playwright capture reports the live canvas as `imageRendering: auto`, `cssWidth: 480`, `cssHeight: 960`, `canvasWidth: 360`, `canvasHeight: 640`.
  - shop detail text is smoother and no longer pixel-upscaled by the browser.
  - detail description/status/buttons no longer overlap in the Bramble Guard Mail modal.
- Notes:
  - a first attempt using Phaser Text `setResolution(2)` made the text larger under Canvas renderer and caused overlap, so that approach was removed.
  - generic `develop-web-game` client remains unreliable for this repo unless the project-specific boot/debug flow is injected; direct Playwright capture and `test:town` were used as the visual source of truth.

## 2026-05-03 21:58: Korean language pack coverage pass

- Goal:
  - fix user-reported issue where Korean language mode still showed English in first village dialogue and other runtime surfaces.
- Cause:
  - `DialogueOverlay` rendered `speaker.name` and `line.text` directly, so story/recruit/town dialogue data bypassed `t()`.
  - shop, party, and equipment screens were also rendering raw character/equipment data names in several places.
  - the opening cutscene shell had hardcoded English labels (`Story Cutscene`, `Skip`, `Now playing`).
- Changes:
  - patched `src/game/ui/dialogueOverlay.ts` to localize speaker names, dialogue text, and prompt copy.
  - patched `src/game/scenes/CutsceneScene.ts`, `VillageLobbyScene.ts`, `ResultScene.ts`, `BattleScene.ts`, `PartyScene.ts`, `EquipmentScene.ts`, and `ShopScene.ts` so visible names/item labels/status text go through Korean localization.
  - expanded `src/game/services/i18n.ts` with Korean mappings for character names, town NPCs, shop/interior copy, cutscene labels, equipment names, stat labels, and stage recruitment dialogue.
  - added `tests/koreanLocalizationCoverage.test.ts` to fail when visible English data used by town, party, shop, cutscenes, or recruit dialogue lacks Korean coverage.
- Review artifacts:
  - `output/localization-check-client-hero-cutscene-ko/shot-7.png`
  - `output/localization-check-client-hero-village-ko/shot-11.png`
  - `output/localization-directed/equipment-ko.png`
  - `output/localization-directed/shop-ko.png`
- Verification:
  - `npm run typecheck`
  - `npm run test -- koreanLocalizationCoverage`
  - `npm run test`
  - `npm run build`
  - `npm run test:town`
- Notes:
  - first generic web-game client run hit another local Vite app on port `4195`; verified Hero Sword on strict port `4307`.
  - the shop runtime row/bag frame art still shows green diagonal guide-like lines in debug capture; that appears asset-related, not language-pack related.

## 2026-05-04 06:40: NPC 2-head runtime sprites and party/dialogue portrait pass

- Goal:
  - apply the newly added 2-head NPC dot sheets.
  - enlarge dialogue portraits so faces read more clearly.
  - make the party screen use high-quality character portraits instead of runtime dot sprites, and add roster scrolling.
- Changes:
  - patched `scripts/import_npc_prompt_assets_2026_05_03.py` so NPC runtime import prefers `image/NPC_2HEAD_RUNTIME_DOT_REMAKE_READY_TO_COPY_PROMPTS_2026-05-03` and now includes Orin/weapon merchant.
  - re-imported NPC runtime sheets into `public/assets/runtime/npcs` and regenerated `public/assets/runtime/animation-manifest.json`.
  - patched `src/game/ui/dialogueOverlay.ts` with a larger portrait panel, masked cover scaling, and larger portrait targets.
  - patched `src/game/scenes/PartyScene.ts` so party/focus/roster entries use high-quality showcase portraits and the roster has scroll state, wheel input, and a scrollbar.
- Review artifacts:
  - `output/npc-prompt-import-2026-05-03/npc_runtime_review.png`
  - `output/party-dialogue-visual-check/party-initial.png`
  - `output/party-dialogue-visual-check/party-scrolled.png`
  - `output/party-dialogue-visual-check/village-npc-dialogue.png`
  - `output/web-game-party-dialogue-check/shot-1.png`
- Verification so far:
  - `npm run typecheck`
  - `npm run test -- tests/runtimeAnimationAssets.test.ts tests/animationCatalog.test.ts tests/koreanLocalizationCoverage.test.ts`
  - `npm run test`
  - `npm run build`
  - `node --experimental-default-type=module $WEB_GAME_CLIENT --url http://127.0.0.1:4307 --actions-file $WEB_GAME_ACTIONS --iterations 2 --pause-ms 300 --screenshot-dir output/web-game-party-dialogue-check`
  - direct Playwright scene capture for party roster scroll and NPC dialogue portrait
  - `TOWN_CHECK_PORT=4310 npm run test:town`
- Notes:
  - generic `develop-web-game` client still captures only `{"mode":"booting","activeScenes":[]}` for this repo, so direct project-debug Playwright captures were used for the actual visual decision.

## 2026-05-04 07:25: cutscene video centered on game canvas

- Goal:
  - fix the story cutscene video appearing centered on the browser window instead of centered inside the Hero Sword game canvas.
- Cause:
  - `CutsceneScene` mounted the `<video>` overlay as `position: fixed; inset: 0` and centered it against the whole viewport.
  - when the game canvas was displayed on the right side of a wide browser window, the video stayed near the browser center and looked shifted left from the game frame.
- Changes:
  - patched `src/game/scenes/CutsceneScene.ts`
    - video overlay now reads `this.game.canvas.getBoundingClientRect()`.
    - overlay is positioned over the canvas safe area, not the full browser viewport.
    - wrapper size is calculated at 9:16 inside the available safe area and relaid out on resize/orientation change.
- Review artifacts:
  - `output/cutscene-layout-check/page-cutscene-centered.png`
  - `output/cutscene-layout-check/canvas-cutscene-centered.png`
  - `output/cutscene-layout-check/metrics.json`
  - `output/web-game-cutscene-layout-check/shot-0.png`
- Verification:
  - `npm run typecheck`
  - `npm run build`
  - `node --experimental-default-type=module $WEB_GAME_CLIENT --url http://127.0.0.1:4307 --actions-file $WEB_GAME_ACTIONS --iterations 1 --pause-ms 300 --screenshot-dir output/web-game-cutscene-layout-check`
  - direct Playwright cutscene capture against `http://127.0.0.1:4307`
  - `npm run test`
- Notes:
  - direct capture metrics showed `centerDeltaX: 0` and `insideCanvas: true`.
  - headless Chromium captured the MP4 frame as black, but the DOM/video rectangle was correctly centered and contained inside the canvas.

## 2026-05-04 10:55: town wall/shop entrance cleanup and armor shop list restructure

- Goal:
  - remove the poor wall runtime images and incorrect shop entrance effect instead of continuing to patch them in place.
  - make shop interiors use fixed counter-merchant art only, with no animated NPC fallback.
  - clean the armor shop list so row taps open details, while purchase actions live in detail panels.
- Changes:
  - deleted the current wall and shop entrance effect PNGs from `public/assets/world/town/landmarks` and `public/assets/world/town/effects`.
  - removed wall runtime keys and shop entrance effect rendering from `src/game/data/townRuntimeArt.ts` and `src/game/scenes/VillageLobbyScene.ts`.
  - added `docs/art/TOWN_SHOP_MISSING_ART_READY_TO_COPY_PROMPTS_2026-05-04.md` for replacement wall kit, entrance marker, static counter merchants, and missing inventory icons.
  - changed `TownInteriorScene` so merchants render only approved static counter images; missing counter art stays empty.
  - removed the low-quality house-shaped shop-interior side icons and switched the remaining markers to shop header icon assets.
  - changed `ShopScene` so starter/fatigue cash products appear in the shop list with clear `현금` prices.
  - removed list-row buy buttons, removed restore/recovery action, removed furniture/house placeholder entries from the shop bag, and split header resources into clearer lines.
  - fixed `DialogueOverlay` so standalone portrait PNGs no longer receive an atlas frame id, removing the `dialogue:npc:elder-haru` missing-frame warning.
- Review artifacts:
  - `output/town-shop-cleanup-2026-05-04/village-armor-shop-no-wall-or-entry-effect.png`
  - `output/town-shop-cleanup-2026-05-04/armor-interior-static-counter.png`
  - `output/town-shop-cleanup-2026-05-04/armor-shop-list-clean-after-dialogue-frame-fix.png`
  - `output/town-shop-cleanup-2026-05-04/shop-errors-after-dialogue-frame-fix.json`
- Verification:
  - `npm run typecheck`
  - `npm run test`
  - `npm run test:town`
  - `npm run build`
  - direct Playwright captures for village, armor shop interior, and armor shop list
  - generic `develop-web-game` client rerun; it reached the opening cutscene after a longer wait, but targeted scene captures remain the reliable source for this repo.
- Notes:
  - `weapon_shop`, `item_shop`, and `relic_shop` counter-merchant images are intentionally not loaded until proper static counter art is produced.
  - new wall/entrance art should be generated from the prompt doc before re-enabling those visuals.

## 2026-05-04 13:36: shop, party, equipment, and summon UI cleanup pass

- Goal:
  - restore shop-interior NPC visibility without reusing broken side placeholders.
  - keep equipped/unsellable items out of shop bag lists.
  - clean clipped/broken character and item visuals across party, equipment, shop detail, and summon screens.
- Changes:
  - patched `src/game/scenes/TownInteriorScene.ts`
    - removed the broken side images beside counter NPCs.
    - restored fixed behind-counter merchant display using approved static art when present, otherwise first-frame runtime NPC fallback.
  - patched `src/game/scenes/ShopScene.ts`
    - removed the clipped shop header weapon icon.
    - replaced text resource labels in the header with compact temporary icon+value rows.
    - hid fully equipped/unsellable weapon and armor entries from shop bag lists.
    - simplified item detail preview so the item image no longer sits on a broken decorative stage.
  - patched `src/game/scenes/VillageLobbyScene.ts`
    - Bram is removed from the village once he has joined the party.
  - patched `src/game/ui/collectionArt.ts`
    - widened face portrait crop bounds so party cards and detail cards do not cut off faces as aggressively.
  - patched `src/game/scenes/PartyScene.ts`
    - removed the bottom detail action and replaced it with an equipment-room shortcut for the selected party member.
    - character detail now shows role, level, battle power, attack, defense, HP, weapon, armor, and role intro.
  - patched `src/game/scenes/EquipmentScene.ts`
    - disabled broken runtime frame/panel images and used cleaner procedural panels.
    - made list taps select only; equipping now uses the explicit equip button.
    - tightened lower info text to avoid button overlap.
  - patched `src/game/scenes/GachaScene.ts`
    - disabled broken banner/feature panel art.
    - changed featured summon character cards to larger face-cropped portraits.
  - updated `docs/art/TOWN_SHOP_MISSING_ART_READY_TO_COPY_PROMPTS_2026-05-04.md`
    - added prompts for compact currency icons and starter/fatigue cash product icons.
- Review artifacts:
  - `output/ui-fix-check-2026-05-04-final/weapon-interior.png`
  - `output/ui-fix-check-2026-05-04-final/weapon-shop-list.png`
  - `output/ui-fix-check-2026-05-04-final/weapon-shop-detail.png`
  - `output/ui-fix-check-2026-05-04-final/village-after-bram-unlocked.png`
  - `output/ui-fix-check-2026-05-04-final3/party-list.png`
  - `output/ui-fix-check-2026-05-04-final3/party-detail.png`
  - `output/ui-fix-check-2026-05-04-final3/equipment-from-party.png`
  - `output/ui-fix-check-2026-05-04-final5/gacha.png`
  - `output/web-game-ui-fix-check-2026-05-04/shot-7.png`
- Verification:
  - `npm run typecheck`
  - `npm run test`
  - `npm run test:town`
  - `npm run build`
  - direct Playwright captures for shop interior, weapon shop list/detail, Bram-unlocked village, party list/detail, equipment room, and summon altar
  - `node --experimental-default-type=module C:\Users\hhy01\.codex\skills\develop-web-game\scripts\web_game_playwright_client.js --url http://127.0.0.1:4316 --screenshot-dir output\web-game-ui-fix-check-2026-05-04 --iterations 8 --pause-ms 700 --actions-file C:\Users\hhy01\.codex\skills\develop-web-game\references\action_payloads.json`
- Notes:
  - direct scene captures were run after Boot loading so dialogue portraits and runtime textures were present.
  - currency and cash-product icons still need generated final PNGs; the runtime uses small existing atlas placeholders until those files are produced.

## 2026-05-04 14:25: village, stage select, battle feedback, and result layout pass

- Goal:
  - move shops away from the palace gate so the gate and approach road read as the focal point.
  - make the town feel less like a square grid by introducing park/farm zones with existing approved tiles.
  - fix stage-select text overlap and make locked/enterable stage states clearer.
  - add visible hit feedback and make early-stage enemy damage more noticeable.
  - simplify the result screen around rewards and party EXP instead of monster preview and party HP.
- Changes:
  - patched `src/game/data/town.ts`
    - moved north-side shops down into side districts and updated return spawns/collision blockers.
  - patched `src/game/scenes/VillageLobbyScene.ts`
    - shifted props away from the palace entry and added farm/park ground patches using existing dirt/grass tile assets.
  - patched `src/game/scenes/StageSelectScene.ts`
    - changed the route list from cramped two-column cards to a wider single-column scroll list.
    - added a visible right-side scroll rail/thumb and page-scroll arrow controls.
    - separated locked/enterable colors, marker tint, and status text.
    - shortened the header detail copy to prevent Korean text overlap.
  - patched `src/game/core/battle.ts`
    - increased enemy attack formula so stage 1 damage is visible without changing the stage structure.
  - patched `src/game/scenes/BattleScene.ts`
    - added hit flash, impact ring, and short red-orange strike lines when party members take damage.
  - patched `src/game/scenes/ResultScene.ts`
    - removed the monster preview and party HP line.
    - added gold, clear time, damage dealt, unlock text, and per-party-member EXP gain.
    - moved stars, message, and buttons back inside the result panels.
    - renamed the stage button to `스테이지 목록` and the village button to `마을`.
  - added `docs/art/VILLAGE_STAGE_BATTLE_RESULT_PROMPTS_2026-05-04.md`
    - prompts for village detail tiles, palace gate dot-tile exterior, ambient birds/animals, stage status icons, battle hit effects, and result reward icons.
- Verification:
  - `npm run typecheck`
  - `npm run test`
  - `npm run test:town`
  - `npm run build`
  - direct Playwright captures:
    - `output/layout-check-2026-05-04-stage-battle-result/village-palace-gate-crop-fixed-correct-spawn.png`
    - `output/layout-check-2026-05-04-stage-battle-result/stage-select-scroll-list.png`
    - `output/layout-check-2026-05-04-stage-battle-result/battle-hit-feedback-window.png`
    - `output/layout-check-2026-05-04-stage-battle-result/result-reward-exp-layout.png`
  - generic `develop-web-game` client rerun with longer boot wait:
    - `output/web-game-layout-check-2026-05-04-long/shot-24.png`
- Notes:
  - ambient birds/animals and polished stage status icons are intentionally prompt-only until final assets are produced.
  - current farm/park treatment uses existing approved runtime tiles, not unrelated placeholder images.
  - `scripts/run-town-manual-checks.mjs` was updated because the armor-shop verification coordinate had to follow the new shop layout.

## 2026-05-04 20:55: party and equipment face portrait crop fix

- Goal:
  - ensure equipment-room character portraits use the same face-only crop policy as the party screen.
  - reduce top/bottom portrait drift so roster and party slot faces sit closer to the visual center.
- Changes:
  - patched `src/game/ui/collectionArt.ts`
    - added shared portrait focus detection based on the opaque upper face band.
    - centered face crops by detected focus instead of anchoring at the top of the portrait bounds.
    - tightened the shared face crop so portraits read as face-focused instead of full-body/showcase images.
  - patched `src/game/scenes/EquipmentScene.ts`
    - replaced the equipment-room showcase/full-body portrait call with the shared face portrait call.
- Verification:
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - generic `develop-web-game` Playwright client:
    - `output/web-game-portrait-crop-check-2026-05-04-final`
  - direct Playwright captures:
    - `output/portrait-crop-fix-2026-05-04-final/party-face-crops.png`
    - `output/portrait-crop-fix-2026-05-04-final/party-face-crops-after-scroll.png`
    - `output/portrait-crop-fix-2026-05-04-final/equipment-face-only.png`
    - `output/portrait-crop-fix-2026-05-04-final/equipment-next-face-only.png`
- Notes:
  - final direct capture reported no page errors and no failed requests.

## 2026-05-04 21:49: village left wall continuity fix

- Goal:
  - make the left and right town wall sides read as continuous castle walls instead of separated vertical wall chunks.
- Changes:
  - patched `src/game/scenes/VillageLobbyScene.ts`
    - replaced two separated vertical wall segments per side with an overlapped vertical wall run.
    - added short connector caps at the top and bottom of the vertical wall runs so corner/tower transitions do not leave visual gaps.
- Verification:
  - `npm run typecheck`
  - `npm run test:town`
  - `npm run test`
  - `npm run build`
  - generic `develop-web-game` Playwright client:
    - `output/web-game-wall-continuity-2026-05-04`
  - direct Playwright captures:
    - `output/village-wall-continuity-2026-05-04/armor-shop-left-wall.png`
    - `output/village-wall-continuity-2026-05-04/upper-left-wall.png`
- Notes:
  - final direct capture reported no page errors and no failed requests.

## 2026-05-04 22:27: village bottom wall priority fix

- Goal:
  - make the lower horizontal wall visually own the corner join, with the vertical wall cut cleanly where it meets the lower wall.
- Changes:
  - patched `src/game/scenes/VillageLobbyScene.ts`
    - changed vertical wall runs to crop the final segment at the lower wall join height instead of drawing through it.
    - removed the lower vertical corner caps so the bottom wall and tower cover the connection naturally.
- Verification:
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - `npm run test:town`
  - generic `develop-web-game` Playwright client:
    - `output/web-game-wall-priority-2026-05-04`
  - direct Playwright captures:
    - `output/village-wall-priority-2026-05-04b/bottom-left-wall-priority.png`
    - `output/village-wall-priority-2026-05-04b/upper-left-wall-continuity.png`
- Notes:
  - direct capture reported no page errors and no failed requests.

## 2026-05-05 08:55: wall join, shop placement, portrait crop, palace placeholder cleanup

- Goal:
  - close the lower-left town wall without letting the vertical wall visually punch through the bottom wall.
  - keep the relic shop away from the wall entrance area.
  - make party/equipment/detail portraits consistently face-centered.
  - replace the palace audience hall's flat blue placeholder with a narrower decorated fallback until final art arrives.
- Changes:
  - patched `src/game/scenes/VillageLobbyScene.ts`
    - adjusted vertical wall run depth and length so the lower wall remains visually in front while the join stays filled.
    - moved nearby props after relocating the relic shop.
  - patched `src/game/data/town.ts`
    - moved `relic_shop` spawn/body/door/blocker away from the lower wall entrance zone.
  - patched `src/game/ui/collectionArt.ts`
    - relaxed the shared face crop to include more headroom and reduce portrait drift.
  - patched `src/game/scenes/PartyScene.ts`
    - lowered slot portraits slightly and tightened the detail modal layout.
  - patched `src/game/scenes/PalaceScene.ts`
    - narrowed the placeholder royal carpet and added simple gold/crest ornaments.
  - patched `docs/art/VILLAGE_STAGE_BATTLE_RESULT_PROMPTS_2026-05-04.md`
    - added prompts for a dot-style palace exterior replacement and palace carpet/crest kit.
- Verification:
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - `npm run test:town`
  - generic `develop-web-game` Playwright client:
    - `output/web-game-2026-05-05-post-patch-client`
  - direct Playwright captures:
    - `output/manual-scene-check-2026-05-05-final-wall/wall-corner.png`
    - `output/manual-scene-check-2026-05-05-final/party.png`
    - `output/manual-scene-check-2026-05-05-final/party-detail.png`
    - `output/manual-scene-check-2026-05-05-final/equipment.png`
    - `output/manual-scene-check-2026-05-05-final/palace.png`
- Notes:
  - palace exterior and palace carpet/crest final images are prompt-only until the replacement art is produced.

## 2026-05-05 09:30: interaction markers, summon reveal, battle control pass

- Goal:
  - add visible `[!]` guidance above talkable NPCs and important story targets.
  - add a rotating card draw effect before gacha results reveal.
  - make battle controls clearer with cooldown badges, top-right retreat, hidden manual controls during auto, and enemies facing left.
  - add a card-style join effect when story/recruitment characters enter the roster.
- Changes:
  - patched `src/game/ui/virtualJoystick.ts` with a visibility toggle that resets input when hidden.
  - patched `src/game/scenes/VillageLobbyScene.ts` with town NPC `[!]` markers and Bram join-card feedback.
  - patched `src/game/scenes/PalaceScene.ts` with palace NPC `[!]` markers.
  - patched `src/game/scenes/GachaScene.ts` with a pre-result rotating card draw layer.
  - patched `src/game/scenes/BattleScene.ts` with cooldown labels, top-right retreat placement, auto-mode control hiding, enemy left-facing render, and reduced bottom-control text overlap.
  - patched `src/game/scenes/ResultScene.ts` with recruitment join-card feedback.
- Verification:
  - `npm run typecheck`
  - `npm run test`
  - `npm run test:town`
  - `npm run build`
  - generic `develop-web-game` Playwright client:
    - `output/web-game`
  - direct Playwright captures:
    - `output/final-feature-check-2026-05-05/01-village-npc-marker-loaded.png`
    - `output/final-feature-check-2026-05-05/02-gacha-card-spin-loaded.png`
    - `output/final-feature-check-2026-05-05/03-gacha-result-loaded.png`
    - `output/final-feature-check-2026-05-05/04-battle-auto-hidden-loaded.png`
    - `output/final-feature-check-2026-05-05/05-battle-manual-controls-loaded.png`

## 2026-05-06 02:12: party, equipment, gacha, options UI polish

- Goal:
  - center character faces consistently in party, detail, equipment, and gacha cards.
  - make party selection use current-slot then roster candidate replacement, with party-member detail and removal.
  - move equipment equip/unequip actions into item detail popups.
  - remove the tiled equipment room backdrop until final UI art is available.
  - clean up the options language selector layout.
- Changes:
  - patched `src/game/ui/collectionArt.ts`
    - tightened shared face crop around facial features and stabilized crop position.
  - patched `src/game/core/party.ts`
    - added party member removal and stopped auto-refilling removed party slots.
  - patched `src/game/services/save.ts`
    - normalized party ids without forcing every owned hero into the current party.
  - patched `src/game/scenes/PartyScene.ts`
    - filtered roster to exclude current party members.
    - added party-member detail modal with `파티 제외`.
    - kept roster detail action as slot replacement via `파티 편성`.
    - replaced roster rarity text stars with atlas star images.
  - patched `src/game/scenes/EquipmentScene.ts`
    - removed visible bottom equip/unequip buttons.
    - added item detail popup with contextual `장착`/`해제`.
    - replaced tiled background with a dark armory panel fallback.
    - localized item detail class/source labels.
  - patched `src/game/scenes/GachaScene.ts`
    - enlarged card glow/backplate and used stable face crops.
  - patched `src/game/scenes/OptionsScene.ts`
    - replaced the awkward language DOM select with in-canvas language buttons.
  - added `docs/art/UI_SCREEN_BACKGROUND_PROMPTS_2026-05-05.md`
    - prompt-only backlog for final high-quality party/detail/equipment/gacha/options UI backgrounds.
- Verification:
  - `npm run typecheck`
  - `npm run test`
  - `npm run test:town`
  - `npm run build`
  - generic `develop-web-game` Playwright client:
    - `output/ui-polish-2026-05-05-web-client-final`
  - direct Playwright captures:
    - `output/ui-polish-check-2026-05-05-after-crop-bg/01-party-base.png`
    - `output/ui-polish-check-2026-05-05-after-crop-bg/02-party-current-detail.png`
    - `output/ui-polish-check-2026-05-05-after-crop-bg/03-party-roster-detail.png`
    - `output/ui-polish-check-2026-05-05-after-crop-bg/04-equipment-base.png`
    - `output/ui-polish-check-2026-05-05-after-crop-bg/05-equipment-item-detail.png`
    - `output/ui-polish-check-2026-05-05-after-crop-bg/06-gacha-base.png`
    - `output/ui-polish-check-2026-05-05-after-crop-bg/07-gacha-spin.png`
    - `output/ui-polish-check-2026-05-05-after-crop-bg/08-options.png`
- Notes:
  - direct capture reported no console errors in `output/ui-polish-check-2026-05-05-after-crop-bg/errors.json`.
  - high-quality UI background art is still prompt-only; the game uses dark coded fallback panels until those assets are produced.

## 2026-05-06 14:25: party detail, equipment room, gacha layout follow-up

- Goal:
  - keep all party/equipment/gacha character cards on face-centered portraits.
  - stop character detail text and portraits from escaping the modal frame.
  - make party roster and equipment inventory wording clearer for mobile UX.
  - separate gacha featured-card effects from banner/result labels.
  - audit remaining fallback item art.
- Changes:
  - patched `src/game/ui/collectionArt.ts`
    - adjusted per-character face crop overrides for the current portrait set.
  - patched `src/game/scenes/PartyScene.ts`
    - replaced the beige detail sheet with a larger dark framed modal.
    - changed rarity text stars to star images in the detail modal.
    - widened the roster scrollbar touch target and changed confusing `여유` copy to `보유`.
  - patched `src/game/scenes/EquipmentScene.ts`
    - enabled the high-quality equipment panel images when available.
    - kept the bottom `장비함` entry point and inventory popup.
    - changed equipment list/inventory labels from `여유` to `장착 가능`, `장착 중`, or `보유 없음`.
  - patched `src/game/scenes/GachaScene.ts`
    - enabled gacha panel images when available.
    - reduced featured portrait size and shifted cards so the backplate glow remains visible and no longer crowds the result header.
  - patched `src/game/data/shopArt.ts` and `src/game/data/shopRuntimeArt.ts`
    - added scimitar item art routing and runtime asset keys.
  - patched `docs/art/UI_SCREEN_BACKGROUND_PROMPTS_2026-05-05.md`
    - added a runtime missing-asset audit for unresolved weapon icon/detail PNGs.
- Verification:
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - `npm run test:town`
  - generic `develop-web-game` Playwright client:
    - `output/web-client-2026-05-06-ui-followup-final`
  - direct Playwright captures:
    - `output/ui-followup-2026-05-06/party.png`
    - `output/ui-followup-2026-05-06/party-detail.png`
    - `output/ui-followup-2026-05-06/equipment.png`
    - `output/ui-followup-2026-05-06/equipment-inventory.png`
    - `output/ui-followup-2026-05-06/gacha.png`
    - `output/ui-followup-2026-05-06/gacha-confirm.png`
- Notes:
  - direct capture still reports missing item PNGs for tome, record book, pistol, daggers, and scimitar; the prompts are documented and the coded fallback remains until those files are produced.
  - the generic web-game client still captures the booting state only; direct scene captures are the reliable UI verification artifacts for this pass.

## 2026-05-08 08:40: missing image batch applied

- Goal:
  - apply the newly generated images from `image/MISSING_IMAGE_PROMPTS_ONLY_2026-05-07`.
  - replace prompt-only party/detail/equipment screen art and missing weapon item art.
- Changes:
  - copied and resized screen art into `public/assets/ui/screens/`:
    - `party_background.png`
    - `character_detail_modal.png`
    - `equipment_inventory_panel.png`
    - `equipment_workshop_background.png`
  - copied and resized weapon art into `public/assets/world/town/shop-refresh/items/`:
    - `weapon_tome_thumb.png` / `weapon_tome_detail.png`
    - `weapon_record_book_thumb.png` / `weapon_record_book_detail.png`
    - `weapon_pistol_thumb.png` / `weapon_pistol_detail.png`
    - `weapon_daggers_thumb.png` / `weapon_daggers_detail.png`
    - `weapon_scimitar_thumb.png` / `weapon_scimitar_detail.png`
  - patched `src/game/data/screenRuntimeArt.ts`
    - registered runtime keys and paths for the new party/detail/equipment screen images.
  - patched `src/game/scenes/BootScene.ts`
    - loaded the new screen images with linear filtering while preserving nearest filtering for pixel-style screen art.
  - patched `src/game/scenes/PartyScene.ts`
    - uses `party_background` for the party screen and `character_detail_modal` for the character detail modal when available.
  - patched `src/game/scenes/EquipmentScene.ts`
    - uses `equipment_workshop_background` for the equipment room and `equipment_inventory_panel` for the inventory popup when available.
- Verification:
  - `npm run typecheck`
  - `npm run test`
  - `npm run test:town`
  - `npm run build`
  - direct Playwright capture:
    - `output/asset-apply-check-2026-05-08/screens/party.png`
    - `output/asset-apply-check-2026-05-08/screens/party-detail-click.png`
    - `output/asset-apply-check-2026-05-08/screens/equipment.png`
    - `output/asset-apply-check-2026-05-08/screens/equipment-inventory.png`
    - `output/asset-apply-check-2026-05-08/screens/weapon-shop.png`
    - `output/asset-apply-check-2026-05-08/screens/browser-errors.json`
  - generic `develop-web-game` Playwright client:
    - `output/asset-apply-check-2026-05-08/web-client/shot-0.png`
    - `output/asset-apply-check-2026-05-08/web-client/state-0.json`
- Notes:
  - direct capture reported no console errors, failed requests, or bad responses.
  - separate weapon detail PNGs were not provided, so the matching generated weapon art was resized into both thumb and detail targets.
  - the generic web-game client still captures the booting state only; direct scene captures remain the reliable UI verification artifacts.

## 2026-05-08 shop progression stock expansion

- Goal:
  - add shop-specific weapons, armor, and support items scaled by early, mid, and later stage progress.
- Changes:
  - patched `src/game/data/equipment.ts`
    - added shop-source weapon and armor definitions across weapon, armor, forge, and relic categories.
  - patched `src/game/data/shop.ts`
    - added equipment-backed shop offers with stage unlock gates and per-shop stock.
    - kept item shop stock as immediate fatigue recovery consumables.
  - patched `src/game/core/shop.ts`
    - purchases now grant weapon/armor inventory copies and reject locked offers.
  - patched `src/game/scenes/ShopScene.ts`
    - shop lists now use the current save snapshot so later stock appears only after progression.
  - patched `src/game/data/shopArt.ts`
    - routed the new equipment offers to the generated item thumbnail/detail art.
  - patched `src/game/services/i18n.ts`
    - added Korean labels for the new equipment names.
  - patched `docs/game/EQUIPMENT_RULES.md`
    - documented the shop equipment supply rules and current item-shop scope.
  - patched `tests/shopOffers.test.ts`
    - covered purchase grants, stage-locked stock visibility, and shop-source equipment mapping.
- Verification:
  - `npm run typecheck`
  - `npm run test -- shopOffers`
  - earlier full pass in this implementation batch:
    - `npm run test`
    - `npm run test:town`
    - `npm run build`
  - direct Playwright capture:
    - `output/shop-stock-direct-2026-05-08/weapon_shop.png`
    - `output/shop-stock-direct-2026-05-08/armor_shop.png`
    - `output/shop-stock-direct-2026-05-08/item_shop.png`
    - `output/shop-stock-direct-2026-05-08/forge_shop.png`
    - `output/shop-stock-direct-2026-05-08/relic_shop.png`
    - `output/shop-stock-direct-2026-05-08/errors.json`
- Notes:
  - direct shop capture now reports no console errors, failed requests, or bad responses.
  - enhancement, durability repair, and stored consumable inventory are still separate unfinished systems; current shop purchases cover equipment copies, fatigue recovery, and furniture unlocks.

## 2026-05-09 opening title logo image apply

- Goal:
  - apply the new opening/title image placed in the `image` folder to the always-shown title screen.
- File handling:
  - `PATCH`: `src/game/data/screenRuntimeArt.ts` - registered a runtime title logo image key.
  - `PATCH`: `src/game/scenes/BootScene.ts` - loaded the title logo with linear filtering.
  - `PATCH`: `src/game/scenes/TitleScene.ts` - replaced the fallback atlas sword with the generated title sword logo when available.
  - `ADD_NEW`: `public/assets/ui/screens/title_hero_sword_logo.png` - cropped the generated source sheet to the gold-ring hero sword and removed the gray background.
- Verification:
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - develop-web-game client smoke run:
    - `output/title-logo-check-2026-05-09/web-client-long/shot-0.png`
    - `output/title-logo-check-2026-05-09/web-client-long/state-0.json`
  - direct Playwright title capture:
    - `output/title-logo-check-2026-05-09/direct-final-large/title.png`
    - `output/title-logo-check-2026-05-09/direct-final-large/state.json`
    - `output/title-logo-check-2026-05-09/direct-final-large/errors.json`
- Notes:
  - direct capture confirmed `hasTitleLogo: true`, active scene `title`, and no console errors, failed requests, or bad responses.
  - the generic web-game client still captures the booting state in this project setup, so direct scene capture remains the reliable visual verification.

## 2026-05-09 release wording and palace presentation cleanup

- Goal:
  - replace test-like opening/title copy, fix the village menu overflow, move the initial spawn to the plaza, and clean up broken palace warp/interior visuals.
- File handling:
  - `PATCH`: `src/game/services/i18n.ts` - changed cutscene/title wording to release-style Korean/English copy and added `ui.cash_shop`.
  - `KEEP`: `src/game/scenes/TitleScene.ts` - existing title flow already reads localized release copy.
  - `KEEP`: `src/game/scenes/CutsceneScene.ts` - existing cutscene flow already reads localized release copy.
  - `PATCH`: `src/game/scenes/VillageLobbyScene.ts` - widened the menu panel, kept `유료 결제` inside the frame, moved palace exterior rendering to the full original image, and replaced broken multi-frame gate effects with a single portal effect.
  - `PATCH`: `src/game/data/town.ts` - moved the starter spawn into the central plaza and adjusted palace return spawn.
  - `PATCH`: `src/game/data/palace.ts` - moved the palace gate interaction point to match the grand exterior placement.
  - `PATCH`: `src/game/scenes/PalaceScene.ts` - switched palace interior to the generated royal audience hall backdrop and sanitized palace exit text.
  - `PATCH`: `src/game/scenes/BootScene.ts` - loads palace full-scene images with linear filtering.
  - `PATCH`: `src/game/ui/collectionArt.ts` - guarded portrait image analysis against missing canvas/image sources.
- Verification:
  - `npm run typecheck`
  - `npm run test`
  - `npm run test:town`
  - `npm run build`
  - direct Playwright capture:
    - `output/current-ui-fix-2026-05-09/direct-after-fix2/01b-cutscene-late.png`
    - `output/current-ui-fix-2026-05-09/direct-after-fix2/02-title.png`
    - `output/current-ui-fix-2026-05-09/direct-after-fix2/03-village-start.png`
    - `output/current-ui-fix-2026-05-09/direct-after-fix2/04-village-menu.png`
    - `output/current-ui-fix-2026-05-09/direct-after-fix2/05-palace-gate.png`
    - `output/current-ui-fix-2026-05-09/direct-after-fix2/06-palace.png`
    - `output/current-ui-fix-2026-05-09/direct-after-fix2/report.json`
- Notes:
  - direct capture reported no console errors or failed requests.
  - the four-split warp issue was caused by using a sprite sheet as a normal static image; palace/world gate effects now use the single clean portal image.
  - the generic web-game client remains unreliable for this project after boot, so direct Playwright captures are the visual source of truth.

## 2026-05-10 gate, palace, shop price, and touch UX follow-up

- Goal:
  - repair the broken town gate image, stop using the palace as a single pasted building image, keep palace travel limited to the gate warp, remove "골드" text from shop-list prices, and shift visible UX copy toward touch controls.
- File handling:
  - `PATCH`: `src/game/scenes/VillageLobbyScene.ts` - rebuilt the bottom wall as one continuous segment, restored the world gate arch from a repaired asset, and replaced the full palace exterior image with a wall/gate placeholder until tile-style palace art is generated.
  - `PATCH`: `src/game/scenes/GachaScene.ts` - prepared summon-card draw animation to use a generated card-back texture when available while keeping a procedural fallback.
  - `PATCH`: `src/game/data/screenRuntimeArt.ts` - reserved the summon card-back runtime key.
  - `PATCH`: `src/game/services/i18n.ts` - changed visible keyboard-style prompts to touch-first wording while retaining keyboard fallbacks for testing.
  - `ADD_NEW`: `scripts/repair-town-gate-asset-2026-05-10.py` - cropped and cleaned the original gate kit into a usable gate arch asset.
  - `ADD_NEW`: `public/assets/world/town/landmarks/gate_arch.png` - repaired gate arch runtime asset.
  - `ADD_NEW`: `docs/art/IMAGE_PROMPTS_ADDED_GATE_PALACE_TOUCH_REWORK_2026-05-10.md` - six remaining prompt-only assets for palace tiles, gate repair, warp marker, summon card back, and battle command dock background.
- Verification:
  - `npm run typecheck`
  - `npm run test`
  - `npm run test:town`
  - `npm run build`
  - direct Playwright capture:
    - `output/gate-palace-touch-final-check-2026-05-10/01-village-palace-gate.png`
    - `output/gate-palace-touch-final-check-2026-05-10/02-village-world-gate.png`
    - `output/gate-palace-touch-final-check-2026-05-10/03-armor-shop.png`
    - `output/gate-palace-touch-final-check-2026-05-10/04-weapon-shop.png`
    - `output/gate-palace-touch-final-check-2026-05-10/05-gacha.png`
    - `output/town-dev-preview/manual-checks/gate-flow.png`
    - `output/town-dev-preview/manual-checks/palace-flow.png`
- Notes:
  - the palace full-image placement was intentionally removed again because the requested direction is tile-style palace construction.
  - new prompt assets are not wired as final PNGs until the generated images are supplied; fallback visuals remain where needed.
  - one video request abort appeared only when the direct capture skipped the opening scene during loading.

## 2026-05-10 generated gate/palace assets and mobile touch rework

- Goal:
  - continue the pending gate/palace/touch request with the generated images from `image/IMAGE_PROMPTS_ADDED_GATE_PALACE_TOUCH_REWORK_2026-05-10`.
  - finish the mobile-only input pass, palace carpet tiling, Bram visibility, wall sizing, cash-shop price containment, gacha centering, and paid 10-pull entry.
- File handling:
  - `ADD_NEW`: `scripts/import_gate_palace_touch_rework_2026_05_10.py` - imports/crops the supplied image batch into runtime asset paths.
  - `ADD_NEW`: runtime images under `public/assets/world/town/*`, `public/assets/world/palace/tiles/*`, `public/assets/ui/gacha/summon_card_back.png`, and `public/assets/ui/battle/battle_command_dock_background.png`.
  - `PATCH`: `src/game/data/*RuntimeArt.ts`, `src/game/scenes/BootScene.ts` - registered and loaded the new runtime keys.
  - `PATCH`: `src/game/scenes/PalaceScene.ts` - tiled the center carpet, removed the palace return button, and kept touch/dialogue advancement.
  - `PATCH`: `src/game/scenes/VillageLobbyScene.ts`, `src/game/scenes/TownInteriorScene.ts`, `src/game/data/town.ts` - moved Bram, reduced horizontal wall spans, added contact-based entry, and replaced keyboard prompts with touch prompts.
  - `PATCH`: `src/game/config.ts`, `src/game/scenes/*`, `scripts/*`, `tests/playwright_smoke_actions.json` - disabled Phaser keyboard input and removed scene/script keyboard control paths.
  - `PATCH`: `src/game/scenes/CashShopScene.ts` - added price backing and fit price labels inside the row frame.
  - `PATCH`: `src/game/core/summon.ts`, `src/game/scenes/GachaScene.ts`, `src/config/runtime.ts`, `src/platform/store.ts`, `tests/summon.test.ts` - added paid 10-pull purchase flow and no-gem paid summon regression coverage.
  - `PATCH`: `src/game/scenes/BattleScene.ts` - applied the generated battle command dock background and kept touch interaction.
  - `PATCH`: `src/game/services/i18n.ts`, `TODO.md`, `docs/DECISIONS.md`, `docs/RISK_REGISTER.md` - updated touch wording, task state, and input decision/risk notes.
- Verification:
  - `npm run typecheck`
  - `npm test -- --run`
  - `npm run build`
  - `npm run test:town`
  - `npm run test:smoke`
  - `npm run test:town`
  - `npm run capture:store`
  - direct Playwright visual captures:
    - `output/final-touch-checks/village-bram-touch.png`
    - `output/final-touch-checks/palace-carpet-no-return.png`
    - `output/final-touch-checks/cash-shop-prices.png`
    - `output/final-touch-checks/gacha-buttons-centered.png`
    - `output/final-touch-checks/battle-touch-dock.png`
- Notes:
  - `rg` now finds no active scene/script keyboard input path; only `keyboard: false` and legacy translation keys remain.
  - `test:smoke` still runs the generic develop-web-game client, but that client continues to capture the boot scene in this project setup. Direct Playwright captures are the reliable visual QA artifacts.
  - External Google Play/RevenueCat setup for `hs_paid_ten_summon_01` is still a release-ops task; code uses sample/config values only.

## 2026-05-11 mobile joystick and center start follow-up

- Goal:
  - fix the reported lower-left touch joystick not moving the character and ensure starting from title lands at the village center instead of a shop/return point.
- File handling:
  - `PATCH`: `src/game/ui/virtualJoystick.ts` - changed the interactive circle hit areas to local joystick coordinates so the visible base/thumb receive touch and drag input.
  - `PATCH`: `src/game/scenes/TitleScene.ts`, `src/game/scenes/VillageLobbyScene.ts` - title start now explicitly uses `starter_square`; default village start also resolves to `starter_square` and clears stale return state for explicit scene data.
  - `PATCH`: `src/game/scenes/TownInteriorScene.ts`, `src/game/scenes/PalaceScene.ts`, `src/game/scenes/WorldMapScene.ts` - return paths now pass explicit village spawn data instead of relying on a lingering registry return.
  - `PATCH`: `src/game/scenes/CutsceneScene.ts` - guarded async video play callbacks after shutdown to prevent direct-capture `drawImage` pageerrors when tests skip the opening cutscene.
  - `PATCH`: `TODO.md` - marked the joystick / center-start follow-up as complete.
- Verification:
  - `npm run typecheck`
  - `npm test -- --run`
  - `npm run test:town`
  - develop-web-game client attempted with `node --experimental-default-type=module`; it still captured boot-only state as previously noted.
  - direct Playwright touch checks:
    - `output/touch-start-joystick-direct/01-village-start.png`
    - `output/touch-start-joystick-direct/02-village-after-joystick-drag.png`
    - `output/touch-start-joystick-direct/03-weapon-shop-start.png`
    - `output/touch-start-joystick-direct/04-weapon-shop-after-joystick-drag.png`
    - `output/touch-start-joystick-direct/05-title-starts-village-center.png`
    - `output/touch-start-joystick-direct/report.json`
- Results:
  - Village start: `(828, 724)`.
  - Village joystick drag moved x by `177.3`.
  - Weapon shop joystick drag moved x by `165`.
  - Title start ignored a stale `weapon_shop` return and landed at `(828, 724)`.
  - Browser console was clean on the final direct Playwright run.

## 2026-05-11 palace, gacha item, and battle visual follow-up

- Goal:
  - address the latest screenshot feedback: remake prompt for palace carpet, center Laila/Micaela faces, replace gacha weapon default icons, stop palace entry from triggering near the fountain, reduce horizontal wall height, harmonize the battle background, and freeze defeated monsters.
- File handling:
  - `PATCH`: `src/game/data/palace.ts` - moved palace contact point upward to the actual gate approach.
  - `PATCH`: `src/game/scenes/VillageLobbyScene.ts` - reduced horizontal wall segment display height, hid non-shop event markers, narrowed palace/world-gate active radius, and made shop/gate/palace tap interactions no-op so only contact auto-entry transitions scenes.
  - `PATCH`: `src/game/ui/collectionArt.ts` - shifted Laila and Micaela face focus lower in the source crop so eyes/nose/mouth sit closer to the center of gacha cards.
  - `PATCH`: `src/game/scenes/GachaScene.ts` - gacha weapon results now use existing shop thumbnail textures instead of default atlas icons when exact item art is missing.
  - `PATCH`: `src/game/scenes/BattleScene.ts` - dimmed painted battle backgrounds, added a pixel battlefield overlay, and froze defeated enemies on the final `down_or_death` frame.
  - `ADD_NEW`: `docs/art/IMAGE_PROMPTS_ADDED_PALACE_GACHA_BATTLE_FIXES_2026-05-11.md` - one combined prompt file for the palace carpet remake, 10 dedicated gacha weapon item icons, and the Greenhaven battle background replacement.
  - `PATCH`: `TODO.md` - recorded completed task state.
- Verification:
  - `npm run typecheck`
  - `npm test -- --run`
  - `npm run build`
  - `npm run test:town`
  - direct Playwright visual captures:
    - `output/palace-gacha-battle-fixes-2026-05-11/01-village-fountain-no-palace-marker.png`
    - `output/palace-gacha-battle-fixes-2026-05-11/02-village-wall-height-palace-gate.png`
    - `output/palace-gacha-battle-fixes-2026-05-11/03-gacha-featured-face-centering.png`
    - `output/palace-gacha-battle-fixes-2026-05-11/04-gacha-weapon-icons-applied.png`
    - `output/palace-gacha-battle-fixes-2026-05-11/05-battle-background-harmonized.png`
    - `output/palace-gacha-battle-fixes-2026-05-11/06-battle-enemy-defeated-freeze.png`
    - `output/palace-gacha-battle-fixes-2026-05-11/report.json`
- Results:
  - Fountain test at `(768, 488)` has `activeInteraction: null`; tapping the screen keeps the active scene as `village`.
  - Gacha weapon result textures resolve to `shop:item-thumb:*` keys instead of default atlas icons.
  - Defeated enemy frame/position stayed identical after `1200ms`.
  - Browser console was clean on the direct Playwright run.

## 2026-05-11 follow-up planning documents

- Goal:
  - record the new requested follow-up scope without implementing it yet.
- File handling:
  - `ADD_NEW`: `docs/ui/GACHA_RESULT_STAGE_UX_FOLLOWUP_2026-05-11.md` - gacha rate, duplicate/transcendence UX, battle result EXP focus, and stage select mobile cleanup request.
  - `ADD_NEW`: `docs/ui/WORLD_STORAGE_BATTLE_FOLLOWUP_2026-05-11.md` - generated image intake, square wall tile rework, storage menu, battle top panel, and return-spawn request.
  - `ADD_NEW`: `docs/art/IMAGE_PROMPTS_ADDED_WORLD_STORAGE_BATTLE_FOLLOWUP_2026-05-11.md` - square wall tile and optional battle top panel prompt bundle.
  - `PATCH`: `TODO.md` - added pending implementation tasks for both follow-up documents.
- Verification:
  - Confirmed `image/IMAGE_PROMPTS_ADDED_PALACE_GACHA_BATTLE_FIXES_2026-05-11` contains 12 generated image files.
- Results:
  - No runtime code was changed in this planning pass.
- 2026-05-11: 문서화된 `GACHA_RESULT_STAGE_UX_FOLLOWUP` 및 `WORLD_STORAGE_BATTLE_FOLLOWUP` 기준으로 1차 구현을 진행했다. 적용 내용: 생성 이미지 12개 런타임 인입, 가챠 무기 전용 이미지 로딩, 뽑기 확률 하향/10회 보장 완화, 픽업 등급 표시, 중복/초월/영웅석 전환 문구와 10회 요약 추가, 라일라/미카엘라 얼굴 포커스 보정, 캐릭터 EXP 저장/전투 보상 지급/결과 화면 EXP 중심 개편, 스테이지 선택 마우스 휠 제거 및 터치 드래그 이동, 성곽 정사각형 타일 반복 구조 도입, 창고 메뉴와 소비 아이템 보관/사용 처리 추가, 전투 상단 텍스트 넘침 보정, 전투 적 사망 프레임 회전 고정. 신규 프롬프트 문서는 `docs/art/IMAGE_PROMPTS_ADDED_IMPLEMENTATION_FOLLOWUP_2026-05-11.md`로 추가했다. 검증: `npm run typecheck`, `npm test -- --run`, `npm run build`, `npm run test:town`, `npm run test:smoke`, Playwright 직접 캡처(`output/implementation-followup-2026-05-11/`) 완료.
- 2026-05-12: 소환의 제단에 하루 1회 `광고10회` 소환을 추가했다. 설계상 광고 10회는 5성이 나오지 않고 4성 5%/3성 95%, 10회 고등급 보장 없음, 픽업 확률 하향으로 보석/유료 10회보다 낮은 보상표를 사용한다. 저장 데이터에는 `profile.lastAdTenSummonDate`를 추가하고 기존 세이브는 정규화에서 `null`로 보정한다. `src/platform/ads.ts`는 보상형 광고를 피로도/가챠 보상에 공용으로 쓰도록 분리했고, `docs/release_ops/ADS_SETUP.md`와 `TODO.md`를 갱신했다. 1차 검증: `npm run typecheck`, `npm test -- --run tests/summon.test.ts tests/ads.test.ts` 통과.
- 2026-05-12: 광고 10회 소환 최종 검증을 완료했다. Playwright 캡처는 `output/ad-gacha-daily-2026-05-12/`에 저장했고, 결과는 최초 가능 `true`, 광고 확인 모드 `adTen`, 소환 후 결과 10개, 최대 3성, `profile.lastAdTenSummonDate=2026-05-12`, 재시도 차단, 콘솔 오류 없음으로 확인했다. 10장 결과 카드의 좁은 영역에서 이름/보상 설명이 겹치던 부분은 카드 이름 1줄 표시로 정리했다. 최종 검증: `npm run typecheck`, `npm test -- --run tests/summon.test.ts tests/ads.test.ts`, `npm test -- --run`, `npm run build` 통과.

## 2026-05-14 image folder asset application

- Goal:
  - apply the latest root `image/` PNG batch and repair baked checkerboard backgrounds where transparency was missing.
- File handling:
  - `PATCH`: `public/assets/world/town/tiles/town_outer_wall_horizontal_tile.png` and `town_outer_wall_vertical_tile.png` - applied the new square top-down castle wall tile source.
  - `PATCH`: `public/assets/world/palace/tiles/palace_center_carpet_segment.png` - cropped away the baked checkerboard source padding and kept a tight carpet segment for palace tiling.
  - `PATCH`: `public/assets/ui/battle/top_hud_frame.png` and `battle_top_status_panel.png` - removed baked checkerboard pixels and saved transparent battle top HUD art.
  - `PATCH`: `src/game/data/stageSelectRuntimeArt.ts`, `src/game/scenes/StageSelectScene.ts` - registered and used generated route marker images in the route list.
  - `ADD_NEW`: `src/game/data/storageItemRuntimeArt.ts` - registered storage item image keys for generated consumable icons.
  - `PATCH`: `src/game/scenes/BootScene.ts`, `src/game/scenes/StorageScene.ts` - loaded storage item images and used them before fallback icons.
  - `PATCH`: `src/game/scenes/BattleScene.ts` - added an opaque battle-scene base layer so translucent battle art no longer shows stale pixels from the previous scene.
- Verification:
  - `npm run typecheck`
  - `npm test -- --run`
  - `npm run build`
  - `npm run test:town`
  - develop-web-game client run saved under `output/image-apply-2026-05-14/web-client/` but still captured only the boot surface.
  - direct Playwright visual captures saved under `output/image-apply-2026-05-14/direct-final/`.
- Results:
  - Runtime confirmed the new wall, carpet, stage marker, storage item, and battle top HUD textures all load.
  - Direct captures reported no console errors, page errors, bad responses, or failed requests.
## 2026-05-14 wall collision and stage-select cleanup

- Goal:
  - prevent the player from walking onto the new square castle wall tiles, fill the outer wall to all corners, place visible corner towers, replace the cave-like palace entrance, and clean up the broken stage-select route row art.
- File handling:
  - `PATCH`: `src/game/data/town.ts` - expanded static blockers for the outer walls and palace wall strip.
  - `PATCH`: `src/game/scenes/VillageLobbyScene.ts` - filled horizontal/vertical wall tiles to the map corners, moved corner towers onto those corners, rebuilt the palace gate as a smaller wall-attached royal doorway, and kept it behind foreground plaza art.
  - `PATCH`: `src/game/scenes/StageSelectScene.ts` - stopped stretching tall route-card art into short list rows; the route list now uses clean row fills plus marker icons.
  - `PATCH`: `scripts/run-town-manual-checks.mjs` - increased the initial Playwright navigation timeout to handle slower Vite cold starts after the larger asset set.
- Verification:
  - `npm run typecheck`
  - `npm test -- --run`
  - `npm run build`
  - `npm run test:town`
  - `npm run test:smoke`
  - develop-web-game client run saved under `output/wall-stage-fix-2026-05-14-final2/web-client/`.
  - direct Playwright captures saved under `output/wall-stage-fix-2026-05-14-final2/`.
- Results:
  - Collision report confirms top, side, palace, and bottom wall blocker checks all return blocked.
  - Stage-select route markers load and the route rows no longer show the corrupted stretched card image.
  - Direct browser capture reported no console errors, page errors, failed requests, or bad responses.
- Follow-up:
  - A dedicated transparent palace entrance sprite would look better than the current procedural doorway, but the current change removes the cave-like gate and keeps the interaction area readable.

## 2026-05-15 palace facade and world-gate grandeur pass

- Goal:
  - respond to the latest village screenshots by making the palace read as a grand upper-background landmark and making the lower world exit less cave-like with a visible portal.
- File handling:
  - `PATCH`: `src/game/scenes/VillageLobbyScene.ts` - uses the existing palace exterior as an upper facade, adds flanking gate towers at the world exit, and adds a procedural blue portal glow/particle effect so the exit point is visible.
  - `PATCH`: `src/game/data/townRuntimeArt.ts` - registers the generated world gate image as a sprite sheet key for optional portal animation.
  - `ADD_NEW`: `docs/art/IMAGE_PROMPTS_ADDED_PALACE_WORLD_GATE_GRANDEUR_2026-05-15.md` - dedicated prompts for a dot-art palace facade, grand world exit gate, and 4-frame portal sheet.
- Verification:
  - `npm run typecheck`
  - `npm test -- --run`
  - `npm run build`
  - develop-web-game client run saved under `output/palace-world-gate-grandeur-2026-05-15/web-client-final/`; it still captured the boot surface only, which is the known limitation for this project.
  - direct Playwright captures saved under `output/palace-world-gate-grandeur-2026-05-15/direct-final3/`.
- Results:
  - Direct capture confirms `palace:exterior` and `town:effect:world-gate-sheet` load in the active village scene.
  - Direct capture reports no console errors or page errors.
  - The current runtime view is improved immediately, but the prompt file should be used to generate a cleaner dedicated palace facade and a replacement grand exit-gate sprite.

## 2026-05-15 town palace layering and portal scale fix

- Goal:
  - fix the latest screenshots where the loop/portal effect looked oversized, the palace facade read as part of the walkable play space, and NPCs/actors could appear on top of the castle image.
- File handling:
  - `PATCH`: `src/game/data/palace.ts` - moved the village palace interaction point down to the foot of the palace approach instead of inside the facade.
  - `PATCH`: `src/game/data/town.ts` - moved the palace return spawn out of the fountain blocker, expanded the palace facade blocker, and relocated the palace-side guard patrol/story NPC positions onto the forecourt instead of the castle art.
  - `PATCH`: `src/game/scenes/VillageLobbyScene.ts` - pushed the palace facade into a background-layer role, reduced shop/palace/world gate loop marker sizes, and balanced the world gate portal depth/brightness so it remains visible inside the arch without covering the whole gate.
- Verification:
  - `npm run typecheck`
  - `npm test -- --run`
  - `npm test -- --run tests/townData.test.ts`
  - `npm run build`
  - `npm run test:town`
  - develop-web-game client run saved under `output/town-palace-layering-fix-2026-05-15/web-client-final2/`; it still captures the boot surface only.
  - direct Playwright captures saved under `output/town-palace-layering-fix-2026-05-15/direct-final3/`.
- Results:
  - Direct capture blocker checks pass: palace facade is blocked, palace forecourt/spawn are walkable, and the world gate portal area is walkable.
  - Browser capture reports no console errors or page errors.
- Follow-up:
  - For a higher-quality final result, replace the current reused palace painting with the dedicated dot-art facade prompt, then split the town into explicit visual layers: distant landmarks, collision tiles, interact markers, actors, and foreground occluders.

## 2026-05-16 palace return and storage touch follow-up

- Goal:
  - align the palace return/warp positions with the upper palace approach, keep battle-to-town returns at the world gate, enlarge Micaela card crop, and rebuild storage for mobile touch use.
- File handling:
  - `PATCH`: `src/game/data/palace.ts` - moved the palace interaction point upward to the palace stair approach.
  - `PATCH`: `src/game/data/town.ts` - updated palace return spawn from the new interaction point and shortened the palace facade blocker so stairs remain walkable.
  - `PATCH`: `src/game/scenes/VillageLobbyScene.ts` - existing linked scene return tracking remains the source for returning to the exact menu entry position; palace visual/warp uses the updated gate constants.
  - `PATCH`: `src/game/scenes/ResultScene.ts` - result-to-town fallback and town button now return to `world_gate_return`.
  - `PATCH`: `src/game/ui/collectionArt.ts` - Micaela card crop is zoomed in to better match the other featured cards.
  - `REPLACE`: `src/game/scenes/StorageScene.ts` - replaced page buttons with a full vertical touch list, drag scrolling, and item detail popup with large art/description/use action.
- Verification:
  - `npm run typecheck`
  - `npm test -- --run`
  - `npm run build`
  - `npm run test:town`
  - `npm run test:smoke`
  - develop-web-game client run saved under `output/palace-storage-followup-2026-05-16/web-client-final/`; it still reports the known boot-surface limitation.
  - direct Playwright captures saved under `output/palace-storage-followup-2026-05-16/direct-final3/`.
- Results:
  - Storage list shows all entries without Previous/Next pagination.
  - Storage tap opens a detail popup with large image, description, and use guidance; drag scroll moves the list (`scrollOffset` reached 310 in direct verification).
  - Palace return spawn is `(768, 388)`, palace warp marker is `(768, 320)`, facade remains blocked, and stairs/return spawn are walkable.
  - Browser direct run reported no console errors or page errors.
- Follow-up:
  - The standard web-game client still only captures the boot surface in this repo; use direct Playwright scene starts for visual checks until the boot flow is made deterministic for the client.

## 2026-05-17 mobile APK size reduction

- Goal:
  - reduce the Android debug APK from roughly 500MB to below the user's 300MB target without changing gameplay logic.
- File handling:
  - `ADD_NEW`: `scripts/optimize-mobile-assets.py` - repeatable Pillow-based optimizer for mobile display assets.
  - `PATCH`: `public/assets/world/battle-backgrounds/*.png` - resized to mobile-safe 540x960 and palette-compressed.
  - `PATCH`: `public/assets/illustrations/monsters/*.png`, `public/assets/dialogue/**`, `public/assets/world/world-map/*.png`, `public/assets/world/palace/*.png`, `public/assets/ui/gacha/**`, `public/assets/ui/storage/items/*.png` - resized/quantized where they are used as single display images.
  - `KEEP`: runtime character/enemy clips, tile sheets, and sprite sheets with frame assumptions were not resized.
- Results:
  - `public/assets` PNG payload reduced from 403.57MB to 149.19MB.
  - `dist` payload after `npm run build` is 224.70MB.
  - Clean Android debug APK is now 234.35MB at `android/app/build/outputs/apk/debug/app-debug.apk`.
- Verification:
  - `npm run typecheck`
  - `npm test -- --run`
  - `npm run build`
  - `npx cap sync android`
  - `JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot` then `android/gradlew.bat clean assembleDebug`
  - `npm run test:smoke`
  - `npm run test:town`
  - Visually inspected optimized battle background, monster art, palace plate, gacha item transparency, and town/palace screenshots.
- Follow-up:
  - If a future store build needs even more reduction, the next biggest target is the 73.25MB `public/assets/cutscenes` MP4 group, but that needs a video encoder pass and visual QA.

## 2026-05-17 Android launcher icon application

- Goal:
  - replace the default Capacitor Android launcher icon with the Hero Sword store-ready icon so the installed app shows the correct image on the phone home screen/app drawer.
- File handling:
  - `ADD_NEW`: `scripts/generate-android-launcher-icons.py` - regenerates Android mdpi/hdpi/xhdpi/xxhdpi/xxxhdpi launcher, round, and adaptive foreground PNGs from the approved store icon.
  - `PATCH`: `android/app/src/main/res/mipmap-*/ic_launcher*.png` - replaced default Capacitor icons with Hero Sword sword/logo art.
  - `PATCH`: `android/app/src/main/res/values/ic_launcher_background.xml` - changed adaptive icon background to dark navy.
  - `KEEP`: `android/app/src/main/AndroidManifest.xml` already points to `@mipmap/ic_launcher` and `@mipmap/ic_launcher_round`, so no manifest change was needed.
- Source:
  - `assets/source/store-ready-assets/approved/01-app-icon.png`.
- Verification:
  - visually inspected `mipmap-xxxhdpi/ic_launcher.png`, `ic_launcher_round.png`, and `ic_launcher_foreground.png`.
  - `JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot` then `android/gradlew.bat assembleDebug`.
  - Debug APK rebuilt at 235.07MB.

## 2026-05-17 recruitment acquisition effect

- Goal:
  - make stage recruitment rewards feel explicit by showing a spinning character card acquisition effect after the recruitment dialogue finishes.
- File handling:
  - `ADD_NEW`: `src/game/core/recruitmentPresentation.ts` - pure timing/text spec for the recruitment card flight, reveal effect, acquisition title, and Korean roster-join particle.
  - `ADD_NEW`: `tests/recruitmentPresentation.test.ts` - TDD coverage for offscreen card entry, spin amount, rarity-scaled particles, acquisition title, and `이/가` join message.
  - `PATCH`: `src/game/scenes/ResultScene.ts` - replaced the simple join overlay with a spinning card flight, reveal ring, particle burst, title/subtitle, and debug effect phase.
  - `PATCH`: `PLAN.md`, `TODO.md`, `docs/DECISIONS.md`, `docs/ui/UI_FLOW.md`, `docs/story/STAGE_RECRUIT_EVENTS.md` - documented the dialogue -> card acquisition flow.
- Verification:
  - expected failing test first: `npm test -- --run tests/recruitmentPresentation.test.ts` failed before the spec module existed.
  - expected failing test for Korean particle: `npm test -- --run tests/recruitmentPresentation.test.ts` failed before `getRecruitmentJoinedRosterMessage` existed.
  - `npm test -- --run tests/recruitmentPresentation.test.ts`
  - `npm run typecheck`
  - `npm test -- --run`
  - `npm run build`
  - `npm run test:smoke`
  - direct Playwright capture saved under `output/recruitment-effect-2026-05-17/`; `state-reveal.json` shows `recruitmentEffect.active = true`, `characterId = ria`, `phase = reveal`, and `diagnostics.json` is empty.

## 2026-05-17 equipment level gate and shop comparison

- Goal:
  - enforce the displayed equipment level requirement and show shop equipment value against the currently equipped item.
- File handling:
  - `PATCH`: `src/game/core/equipment.ts` - equip and equipable-list checks now require matching class and sufficient character level.
  - `PATCH`: `src/game/core/shop.ts` - added pure shop equipment comparison against matching owned characters' current loadout.
  - `PATCH`: `src/game/scenes/ShopScene.ts` - offer rows and detail popup now show `전투력 +/-` and `Lv.n 필요` where relevant.
  - `PATCH`: `tests/equipment.test.ts`, `tests/shopOffers.test.ts` - TDD coverage for level gating and shop current-loadout comparison.
  - `PATCH`: `PLAN.md`, `TODO.md`, `docs/DECISIONS.md`, `docs/game/EQUIPMENT_RULES.md`, `docs/ui/UI_FLOW.md` - documented the runtime behavior.
- Verification:
  - expected failing test first: `npm test -- --run tests/equipment.test.ts tests/shopOffers.test.ts` failed because high-level equipment was equippable and shop comparison did not exist.
  - `npm test -- --run tests/equipment.test.ts tests/shopOffers.test.ts`
  - `npm run typecheck`
  - `npm test -- --run`
  - `npm run build`
  - `npm run test:smoke`
  - direct Playwright capture saved under `output/shop-equipment-comparison-2026-05-17/`; `state-detail.json` shows `currentPower = 263`, `candidatePower = 314`, `delta = 51`, `currentLevel = 1`, `requiredLevel = 3`, `levelLocked = true`, and `diagnostics.json` is empty.

## 2026-05-17 Android release AAB build

- Goal:
  - create an Android App Bundle artifact for test upload preparation.
- File handling:
  - `KEEP`: Android release signing config is still not configured; no keystore was found in the repository.
  - `ADD_NEW`: generated build artifact at `android/app/build/outputs/bundle/release/app-release.aab`.
- Verification:
  - `npm run build`
  - `npx cap sync android`
  - `JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot` then `android/gradlew.bat -p android bundleRelease`
  - `jarsigner -verify android/app/build/outputs/bundle/release/app-release.aab` reports `jar is unsigned`.
- Follow-up:
  - A Play Console uploadable AAB needs a real upload key / signing config before final upload.

## 2026-05-17 privacy policy page

- Goal:
  - create a public HTML privacy policy page for Google Play Console registration.
- File handling:
  - `ADD_NEW`: `privacy-policy.html` - root-level GitHub Pages privacy policy page for `https://hhy0111.github.io/hero-sword/privacy-policy.html`.
  - `PATCH`: `docs/privacy-policy.html` - matched the same privacy policy content for GitHub Pages `/docs` source mode.
  - `PATCH`: `docs/release_ops/STORE_PREP.md` - marked the privacy policy URL page file as prepared.
- Notes:
  - The page discloses local save data, AdMob advertising data, Google Play / RevenueCat purchase data, GitHub Pages hosting logs, retention/deletion, security, and contact information.
  - Final Play Console Data safety answers must stay consistent with this page.

## 2026-05-18 release ops follow-up

- Goal:
  - continue actionable TODO items from `TODO.md`, `PLAN.md`, and release_ops documents without marking external console/hardware work as complete.
- File handling:
  - `ADD_NEW`: `.nojekyll` - keeps GitHub Pages from applying Jekyll processing to the static privacy page.
  - `ADD_NEW`: `src/platform/externalLinks.ts` - HTTPS-only external link helper for policy links.
  - `ADD_NEW`: `tests/externalLinks.test.ts` - TDD coverage for safe external policy URL opening.
  - `PATCH`: `src/game/scenes/OptionsScene.ts` - adds a 개인정보처리방침 button and exposes `open_privacy_policy` in debug actions.
  - `ADD_NEW`: `docs/release_ops/PLAY_CONSOLE_DATA_SAFETY_ANSWERS.md` - fixed current Data safety inputs for AdMob, Google Play Billing, and RevenueCat.
  - `ADD_NEW`: `assets/source/store-ready-assets/play-upload/hero-sword-app-icon-512.png` - Play Console-sized app icon.
  - `ADD_NEW`: `assets/source/store-ready-assets/play-upload/hero-sword-feature-graphic-1024x500.jpg` - Play Console-sized feature graphic.
  - `PATCH`: `TODO.md`, `PLAN.md`, and release_ops documents - separated completed local work from remaining external checks.
- Verification:
  - expected failing test first: `npm test -- --run tests/externalLinks.test.ts` failed because `src/platform/externalLinks.ts` did not exist.
  - `npm test -- --run tests/externalLinks.test.ts` passed.
  - `npm run typecheck` passed.
  - `npm test` passed 18 files / 78 tests.
  - `npm run build` passed.
  - `npm run test:smoke` completed with exit code 0.
  - Play upload images checked: app icon `512x512`, feature graphic `1024x500`.
  - `npm run build:android` passed and synced web assets into Android.
  - First `android\gradlew.bat -p android bundleRelease` failed because the shell was using JDK 17 (`invalid source release: 21`).
  - Retried with `JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot`; `android\gradlew.bat -p android bundleRelease` passed.
  - Generated AAB: `android/app/build/outputs/bundle/release/app-release.aab`, `243,143,220` bytes.
  - `jarsigner -verify -verbose -certs android/app/build/outputs/bundle/release/app-release.aab` reports `jar is unsigned`.
- Remaining blockers:
  - GitHub Pages must be enabled from the GitHub web UI because `gh` CLI is not installed in this environment.
  - signed AAB still needs a release/upload key.
  - Android real-device ad/IAP flows still need device verification.
