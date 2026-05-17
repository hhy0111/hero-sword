# plugins and mcp candidates

## Android/배포 후보

| 후보 | 용도 | 상태 | 메모 |
| --- | --- | --- | --- |
| `Capacitor` | 웹 빌드 Android 패키징 | 후보 | 1차 후보, 광고/IAP 적합성 확인 필요 |
| AdMob 연동 플러그인 | 광고 | 후보 | 실 프로젝트 적용 전 maintenance 상태 확인 필요 |
| Google Play Billing 또는 중계 서비스 | IAP | 후보 | RevenueCat 포함 여부 [확인 필요] |

## MCP 후보

| 후보 | 자동화 대상 | 주사용 에이전트 | 상태 | 지금 필요 여부 |
| --- | --- | --- | --- | --- |
| docs consistency checker | 문서 링크/참조 누락 탐지 | `integration_agent` | 후보 | 예 |
| release checklist tracker | release_ops 체크리스트 상태 추적 | `release_ops_agent` | 후보 | 예 |
| asset review registry | 프롬프트 버전/검수 이력 관리 | `asset_agent` | 후보 | 중간 |

