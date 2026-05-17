# SAVE_LOAD.md

## 저장 원칙

- 로컬 저장 우선
- 오프라인에서 핵심 루프 동작 가능해야 함
- 저장 포맷은 버전 필드를 가진다
- 중요한 상태 전이 뒤에는 즉시 저장한다

## 현재 버전 정책

- 현재 기록 버전: `schemaVersion = 2`
- 로더 호환 범위: `1`, `2`
- 지원 외 버전: 초기 스냅샷으로 재생성
- 저장 키: `hero-sword-save-v1`
- 마이그레이션 위치: `src/game/services/save.ts`

## 현재 저장 스키마 초안

| 필드 | 설명 | 상태 |
| --- | --- | --- |
| `schemaVersion` | 저장 포맷 버전 | 구현됨 |
| `createdAt` | 최초 생성 시각 | 구현됨 |
| `updatedAt` | 마지막 갱신 시각 | 구현됨 |
| `profile.fatigue` | 현재 피로도 | 구현됨 |
| `profile.lastFatigueTickAt` | 마지막 피로도 회복 기준 시각 | 구현됨 |
| `profile.ownedProductIds` | 1회성 결제 보유 기록 | 구현됨 |
| `world.unlockedContinents` | 해금 대륙 | 구현됨 |
| `world.stageStars` | 스테이지별 난이도 성과 | 구현됨 |
| `roster.ownedCharacters` | 보유 캐릭터/중복 수량 | 구현됨 |
| `roster.selectedPartyIds` | 편성 중 파티 4인 | 구현됨 |
| `collection.weaponCopies` | 무기 사본 수량 | 구현됨 |
| `collection.armorCopies` | 방어구 사본 수량 | 구현됨 |
| `collection.equipmentLoadouts` | 캐릭터별 착용 장비 | 구현됨 |
| `housing.ownedFurnitureIds` | 보유 가구 | 구현됨 |
| `housing.slots` | 하우징 3슬롯 배치 상태 | 구현됨 |

## 저장 트리거

- 앱 시작 후 초기 로드
- 스테이지 입장 성공 직후
- 스테이지 결과 적용 직후
- 광고 보상 적용 직후
- 로컬 상점 구매 직후
- IAP 보상 적용 직후
- 파티 편성 변경 직후
- 장비 장착/해제 직후
- 하우징 슬롯 변경 직후

## 마이그레이션 정책

- `schemaVersion` 증가 시 `normalizeSnapshot`에서 하위 버전 호환 보정 함수를 먼저 추가한다.
- 현재 정책은 `직전 버전 1개`까지 호환 유지다.
- 신규 필드 추가는 기본값을 가진 상태로 정규화하고, 제거되는 필드는 로드시 버린다.
- 파괴적 구조 변경 시 `schemaVersion`을 올리고 QA에서 저장/복구 회귀를 별도 수행한다.
- 저장 데이터는 항상 로드 시 `schemaVersion 2` 형태로 재기록 가능해야 한다.

## QA 체크 포인트

- 구버전 `schemaVersion = 1` 저장값이 로드 즉시 `2` 형태로 정규화되는가
- 파티 4인 제한이 저장/복구 후에도 유지되는가
- 결제 보상과 하우징 배치가 재실행 후 유지되는가
- 지원하지 않는 버전 값이 들어와도 게임이 부팅 불가 상태에 빠지지 않는가
