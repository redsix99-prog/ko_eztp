# 관광 데이터 연계와 승인 게시 (관리자 안내)

## 구조

```
한국관광공사 API ──(매주 월요일 06:00 KST, GitHub Actions)──▶ scripts/sync.mjs
        └─▶ data/*.json 갱신 ──▶ Pull Request 생성 ("[승인 요청] 관광 데이터 동기화")
                                   └─▶ 관리자가 Merge ──▶ main 반영 ──▶ 자동 배포 (Cloudflare Pages)
```

- API가 바꾼 내용은 **절대 사이트에 바로 올라가지 않습니다.** Pull Request를 Merge해야만 반영됩니다.
- `data/attractions.json` 관광지 30건 (기본 정보는 직접 작성, API로 주소·전화·이미지·영문 개요를 덧붙임)
- `data/trends.json` 트렌드 글. `"status": "approved"`인 글만 사이트에 보입니다. 자동 생성 글은 `draft`로 들어옵니다.
- `data/stats.json` 공식 방문 통계 (최근 4주 외국인 방문자 수, 광역지자체별)
- 영어 홈페이지: `https://korea-easytrip.com/en/`

## 처음 한 번 설정

1. **인증키 발급**: 공공데이터포털(data.go.kr)에서 아래 두 API를 활용 신청합니다.
   - 한국관광공사_영문 관광정보 서비스
   - 한국관광공사_관광빅데이터 정보서비스 (지역별 방문자수)
   발급된 **일반 인증키(Decoding 또는 Encoding)** 하나를 둘 다에 씁니다.
2. **GitHub 비밀값 등록**: 저장소 → Settings → Secrets and variables → Actions → New repository secret
   - 이름 `TOURAPI_KEY`, 값은 인증키. (채팅이나 파일에 적지 마세요.)
3. **PR 생성 허용**: Settings → Actions → General → Workflow permissions →
   "Allow GitHub Actions to create and approve pull requests" 체크 → Save.
4. **응답 구조 확인(권장)**: Actions → "Sync tourism data" → Run workflow → `probe` 체크 후 실행.
   로그에 API 응답 일부가 출력됩니다. 필드 이름이 다르면 `scripts/sync.mjs`를 맞춰 고칩니다.
5. `probe`를 끄고 다시 실행하면 승인 요청 Pull Request가 생깁니다.

## 매주 하실 일 (승인)

1. 이메일/GitHub 알림으로 온 "[승인 요청] 관광 데이터 동기화" Pull Request를 엽니다.
2. **Files changed**에서 바뀐 내용을 확인합니다.
3. 자동 생성 트렌드 글(`"status": "draft"`)을 게시하려면 파일에서 `"approved"`로 고칩니다(Edit 버튼).
4. 문제가 없으면 **Merge pull request**, 게시하지 않으려면 **Close pull request**.
5. Merge하면 1~2분 뒤 사이트에 반영됩니다.

## 안전장치

- 배포 전에 `scripts/validate.mjs`가 데이터 형식을 검사하고, 틀리면 배포를 멈춥니다. (관광지 30건 미만, 중복 id, 잘못된 주소, HTML 기호 등)
- 사이트는 모든 문구를 텍스트로만 표시하므로 API 데이터에 HTML이 섞여도 실행되지 않습니다.
- 방문 통계는 API가 준 값을 그대로 합산해서 보여 줍니다. 값을 임의로 만들지 않습니다.

## 직접 데이터 수정

`data/*.json`을 GitHub에서 직접 수정해 커밋해도 됩니다(검사 통과 시 자동 배포).
