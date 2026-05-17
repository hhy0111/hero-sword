# tests

- Latest additions:
  - `battle.test.ts` now checks mixed enemy patterns and live battle effects.
  - `party.test.ts` now checks the 4-member cap on normalized parties.
  - `state.test.ts` now checks showcase snapshot generation for capture flows.
  - `npm run capture:store` generates deterministic store screenshots under `output/store-screenshots`.

- `state.test.ts`: 피로도, 스테이지 진입, 난이도 해금의 최소 회귀 테스트
- `party.test.ts`: 파티 편성 중복 방지와 슬롯 교체 회귀 테스트
- `summon.test.ts`: 1회/10회 가챠, 10회 4성 이상 보장, 배너 픽업 회귀 테스트
- `metaSystems.test.ts`: 로컬 상점 구매와 하우징 슬롯 순환 회귀 테스트
- `state.test.ts`: 광고 fallback 피로도 지급 포함
- `playwright_smoke_actions.json`: 로비 이동 smoke 시나리오
- 향후 추가:
  - 저장 포맷 마이그레이션 테스트
  - 광고 보상 실패 fallback 테스트
  - UI 흐름 Playwright 시나리오

실행:

```bash
npm run test
npm run test:smoke
```
