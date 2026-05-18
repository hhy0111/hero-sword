# ANDROID_JDK21_SETUP.md

## 목적

- Windows 개발 환경에서 Android 빌드용 `JDK 21` 설정 절차를 표준화한다.

## 전제

- Android Studio 설치
- Android SDK 경로 확인 완료
- `android/local.properties`에 SDK 경로 입력 완료

## 설정 절차

1. JDK 21 설치 경로를 확인한다.
2. 시스템 환경 변수 `JAVA_HOME`을 JDK 21 경로로 설정한다.
3. `Path`에 `%JAVA_HOME%\\bin`이 포함되어 있는지 확인한다.
4. 새 터미널을 열고 `java -version`으로 21 버전인지 확인한다.
5. 저장소 루트에서 `android\\gradlew.bat assembleDebug`를 실행한다.

## 현재 확인값

- JDK 21 설치 경로: `C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot`
- 현재 터미널 기본 `JAVA_HOME`: `C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot\`
- 임시 빌드 명령:

```powershell
$env:JAVA_HOME='C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
android\gradlew.bat -p android bundleRelease
```

위 임시 명령으로 `android/app/build/outputs/bundle/release/app-release.aab` 생성이 가능하다. `android/keystore.properties`와 `android/keystores/hero-sword-upload-key.jks`가 로컬에 있으면 release AAB는 signed 상태로 생성된다.

## 점검 포인트

- `java -version` 출력이 `21` 계열인가
- `android/local.properties`에 `sdk.dir=`가 존재하는가
- `assembleDebug` 결과로 `android/app/build/outputs/apk/debug/app-debug.apk`가 생성되는가

## 주의

- JDK 17 이하가 잡혀 있으면 Gradle/AGP 조합에 따라 빌드 오류가 날 수 있다.
- IDE 내장 JDK와 터미널 `JAVA_HOME`이 다를 수 있으므로 둘 다 확인한다.

## 연결 문서

- `./RELEASE_CHECKLIST.md`
- `./STORE_PREP.md`
