# CHARACTER_FRAME_SHEET_AUDIT_2026-04-05.md

## 목적

- 캐릭터 애니메이션 프레임 마스터 시트를 `런타임 슬라이싱 가능 / 불가` 기준으로 분리한다.
- `투명도`, `중심 흔들림`, `반쪽 프레임`, `파일명-실제 캐릭터 불일치`를 source-level QA 이슈로 기록한다.

## 자동 감사 기준

- 생성 스크립트: `python scripts/audit-character-frame-sheets.py`
- 산출물: `output/qa/character-frame-sheet-audit.json`
- 자동 수집 항목:
  - blur score
  - 감지된 row group 수
  - 감지된 label box 수
  - expected row 수 대비 구조 이상

## 수동 최종 판정

| 파일 | 기대 대상 | 실제 내용 | 판정 | 비고 |
| --- | --- | --- | --- | --- |
| `13-iris.png` | Iris | Iris | 보류 | row/frame 분리 불안정, 반쪽 프레임 발생 |
| `14-volf.png` | Wolf | Wolf | 보류 | row/frame 분리 불안정 |
| `15-erin.png` | Erin | blurred sheet, 제목도 불명확 | 불합격 | blur 심함, 런타임 원본으로 부적합 |
| `16-nazir.png` | Nazir | Erin | 불합격 | 파일명과 실제 캐릭터 불일치 |
| `17-laila.png` | Laila | Nazir | 불합격 | 파일명과 실제 캐릭터 불일치 |
| `18-hakan.png` | Hakan | Hakan | 보류 | 추가 row/frame 수동 검수 필요 |
| `19-seraphine.png` | Seraphine | Laila | 불합격 | 파일명과 실제 캐릭터 불일치 |
| `20-michaela.png` | Micaela | Seraphine | 불합격 | 파일명과 실제 캐릭터 불일치 |
| `21-lucian.png` | Lucian | Micaela | 불합격 | 파일명과 실제 캐릭터 불일치, 실제 Lucian 시트 누락 |

## 현재 조치

- `runtime character clips`는 임시 차단했다.
- 게임과 Animation Viewer의 캐릭터 재생은 안정적인 atlas fallback을 사용한다.
- `enemy` / `effect` 런타임 클립은 유지한다.

## 다음 조치

- 아래 순서로 source sheet를 교체한다.
  - `15-erin.png` 재생성
  - `16-nazir.png` ~ `21-lucian.png` 실제 내용과 파일명 재정렬
  - 실제 `Lucian` frame master sheet 추가
- 교체 후 `python scripts/audit-character-frame-sheets.py`
- 그 다음 `python scripts/generate-runtime-extended-clips.py`
- 마지막으로 Animation Viewer 수동 QA 재실행
