# RE:TRACE 꽃 결과 사이트

RE:TRACE 관람객이 질문에 답변을 마친 뒤 QR을 찍으면 폰에서 열리는, **결과를 보여주고 보관하는 것만 하는** 전용 사이트입니다.

## 이 사이트가 하는 일

- 답변을 바탕으로 Claude API가 꽃 6종 중 하나를 골라 위로의 글을 써줍니다.
- `/r/[id]` 주소 하나가 결과 하나에 해당합니다. (예: `/r/3f9a1b2c4d5e6f70`)
- 결과는 Upstash Redis에 30일간 저장되고, 그 뒤 자동으로 사라집니다.
- 이름 등 개인 식별 정보는 전혀 받지 않습니다.

## 페이지 구성

| 경로 | 설명 |
|---|---|
| `/` | 안내 페이지 |
| `/r/[id]` | 결과 페이지 (QR을 찍으면 도착하는 곳) |
| `/archive` | 이 폰에 보관된 결과 목록 (localStorage) |
| `/test` | 원래 사이트와 연결되기 전까지 쓰는 테스트 입력 페이지 + QR 생성 |

## 꽃 이미지 넣는 법

`public/flowers/` 폴더에 `freesia.png`, `daisy.png`, `lotus.png`, `peony.png`, `lavender.png`, `sunflower.png` 파일을 넣으면 자동으로 사용됩니다. 파일이 없으면 꽃 이름이 적힌 은은한 원형 자리표시가 대신 보입니다.

꽃말이나 설명 문구를 고치고 싶으면 `lib/flowers.ts` 파일 하나만 수정하면 됩니다.

---

## 완성 후 순서대로 하면 되는 일

### 1. GitHub에 올리기

1. [github.com](https://github.com)에서 로그인한 뒤 우측 상단 `+` → `New repository` 클릭
2. 이름을 `retrace-flower-result` 정도로 짓고 `Create repository` (README, .gitignore는 체크하지 않기 — 이미 로컬에 있음)
3. 터미널에서:
   ```bash
   cd ~/Projects/retrace-flower-result
   git add .
   git commit -m "최초 커밋"
   git branch -M main
   git remote add origin https://github.com/[내 아이디]/retrace-flower-result.git
   git push -u origin main
   ```

### 2. Vercel에 배포하기

1. [vercel.com](https://vercel.com)에서 GitHub 계정으로 로그인
2. `Add New` → `Project` → 방금 만든 `retrace-flower-result` 저장소 선택 → `Import`
3. 프레임워크는 Next.js로 자동 인식됩니다. 설정 그대로 두고 일단 `Deploy` (환경변수는 아직 없어서 빌드는 되지만, Redis/Claude 기능은 다음 단계 전까지 작동하지 않습니다)

### 3. Upstash Redis 연결하기 (Vercel Marketplace)

1. 방금 만든 Vercel 프로젝트 화면에서 `Storage` 탭 클릭
2. `Create Database` → `Marketplace Database Providers`에서 **Upstash** 선택 → Redis 생성 (무료 플랜으로 충분)
3. 생성이 끝나면 자동으로 이 프로젝트에 연결되고, `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` 환경변수가 **자동으로** 추가됩니다. (직접 입력할 필요 없음)

### 4. Claude API 키 설정하기

1. [console.anthropic.com](https://console.anthropic.com)에서 API 키를 하나 발급받습니다.
2. Vercel 프로젝트 → `Settings` → `Environment Variables`로 이동
3. `ANTHROPIC_API_KEY` 라는 이름으로 키 값을 추가하고 Production/Preview/Development 모두 체크 후 저장
4. `Deployments` 탭에서 가장 최근 배포 옆 `...` → `Redeploy`를 눌러 환경변수를 반영합니다.

### 5. 로컬에서 테스트해보고 싶을 때

```bash
cd ~/Projects/retrace-flower-result
cp .env.example .env.local
```

`.env.local`을 열어 Vercel 대시보드의 Storage(Upstash) 탭에서 `.env.local` 받기로 Redis 값 두 개를 채우고, Anthropic 키도 채운 뒤:

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000/test`로 들어가 질문/답변을 입력하고 제출하면, 같은 화면에서 QR과 결과 주소가 나옵니다. 폰으로 QR을 찍어서 실제로 어떻게 보이는지 확인해보세요.

### 6. 배포된 사이트 확인하기

Vercel이 배포를 마치면 `https://[프로젝트이름].vercel.app` 같은 주소가 생깁니다. 그 주소 뒤에 `/test`를 붙여 들어가면 실제 운영 환경에서도 같은 방식으로 테스트할 수 있습니다.

---

## 나중에 할 일: 원래 RE:TRACE 사이트와 연결하기

지금은 `/test` 페이지로 답변을 직접 입력해서 테스트하지만, 실제로는 원래 RE:TRACE 사이트(관람객이 질문에 답하는 그 사이트)가 답변을 모은 뒤 이 사이트의 `/r/[id]`로 연결되는 QR을 보여줘야 합니다. 원래 사이트 쪽에서 아래 작업이 필요합니다. (이 작업은 원래 사이트의 코드를 건드려야 하는 일이라 지금 이 프로젝트에서는 하지 않았습니다.)

1. 관람객이 답변을 다 마친 시점에, 원래 사이트 서버(또는 클라이언트)에서 이 프로젝트의 `/api/save`로 요청을 보냅니다.

   ```
   POST https://[이 사이트 주소]/api/save
   Content-Type: application/json

   { "answers": [{ "question": "...", "answer": "..." }, ...] }
   ```

   응답으로 `{ "id": "..." }`를 받습니다.

2. 받은 `id`로 `https://[이 사이트 주소]/r/[id]` 주소를 만들고, 그 주소를 QR 코드로 만들어 화면에 보여줍니다. (이 프로젝트의 `qrcode.react` 라이브러리를 그대로 가져다 써도 되고, 원래 사이트에 맞는 다른 QR 라이브러리를 써도 됩니다.)

3. 관람객이 폰으로 QR을 찍으면 이 사이트의 결과 페이지가 열립니다.

두 사이트가 서로 다른 Vercel 프로젝트로 배포되어 있어도 괜찮습니다. `/api/save`는 CORS 설정 없이도 서버 간 요청(원래 사이트의 백엔드에서 보내는 요청)은 문제없이 동작합니다. 브라우저에서 직접 호출(클라이언트 → 다른 도메인)하는 경우에는 이 프로젝트의 `/api/save`에 CORS 허용 헤더를 추가해야 할 수 있습니다.
