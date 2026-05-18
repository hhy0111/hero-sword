# SECRETS_POLICY.md

## 금지

- 광고 App ID 실제값 커밋
- 광고 Unit ID 실제값 커밋
- 결제 키, API Secret, 서명키 커밋
- 외부 서비스 Secret을 문서 예시값으로라도 입력

## 허용 형식

- `YOUR_VALUE_HERE_*`
- `TEST_*`
- `SAMPLE_*`

## 코드 연결 규칙

- 민감값은 `src/config/runtime.ts`에 placeholder만 둔다.
- 실제 운영값은 안전한 배포 파이프라인이나 로컬 비공개 설정에서 주입한다. [TODO]
- 문서에는 입력 위치만 기록한다.
- Android release 서명값은 로컬 전용 `android/keystore.properties`와 `android/keystores/`에만 둔다.
- `android/keystore.properties`, `android/keystores/`, `*.jks`, `*.keystore`는 git 제외 대상이다.

## 위반 예시

- `ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy`
- 실 Google Play 결제 공개키
- 실제 keystore 비밀번호
