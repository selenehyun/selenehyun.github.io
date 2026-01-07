# CLAUDE.md

이 파일은 Claude가 이 프로젝트에서 작업할 때 참고할 컨텍스트를 제공합니다.

## 자기 업데이트 지침

Claude는 다음 상황에서 이 CLAUDE.md 파일을 직접 업데이트해야 합니다:

1. **새로운 컴포넌트 추가**: 주요 컴포넌트를 생성했을 때 목록에 추가
2. **새로운 composable 추가**: 커스텀 훅을 생성했을 때 설명 추가
3. **Firebase 컬렉션 변경**: 새 컬렉션이나 필드 구조 변경 시 문서화
4. **환경 변수 추가**: 새로운 환경 변수가 필요할 때 목록 업데이트
5. **주요 패턴 발견**: 프로젝트에서 반복되는 중요한 패턴 발견 시 기록
6. **버그 수정 경험**: 동일한 문제 재발 방지를 위한 주의사항 추가

---

## 프로젝트 개요

VitePress + Vue 3 기반의 모바일 청첩장 웹사이트입니다. Firebase를 백엔드로 사용하며, RSVP 시스템, 방명록, 사진 이벤트 등의 기능을 제공합니다.

**도메인**: https://wedding.pet

## 기술 스택

- **프레임워크**: VitePress 1.6 + Vue 3 (Composition API)
- **스타일링**: Tailwind CSS 3.4 + tailwindcss-animate
- **UI 컴포넌트**: shadcn/ui (reka-ui 기반), vaul-vue (Drawer)
- **애니메이션**: @vueuse/motion
- **유틸리티**: @vueuse/core
- **아이콘**: lucide-vue-next
- **백엔드**: Firebase (Firestore, Storage)
- **외부 SDK**: Kakao JavaScript SDK (공유, 지도)

## 주요 명령어

```bash
npm run docs:dev      # 개발 서버 시작
npm run docs:build    # 프로덕션 빌드
npm run docs:preview  # 빌드 결과 미리보기
```

## 프로젝트 구조

```
docs/
├── .vitepress/
│   ├── config.mts              # VitePress 설정
│   └── theme/
│       ├── index.ts            # 테마 진입점 (MotionPlugin 등록)
│       ├── WeddingLayout.vue   # 메인 레이아웃 (라우팅)
│       ├── style.css           # Tailwind + 커스텀 스타일
│       ├── components/         # Vue 컴포넌트
│       │   ├── rsvp/           # RSVP 단계별 컴포넌트
│       │   └── ui/             # shadcn/ui 기본 컴포넌트
│       ├── composables/        # Vue 커스텀 훅
│       └── lib/
│           ├── firebase.ts     # Firebase 초기화
│           └── utils.ts        # 유틸리티 (cn 함수 등)
├── index.md                    # 메인 페이지
├── rsvp.md                     # RSVP 페이지
├── guestbook.md                # 방명록 페이지
└── photo-event.md              # 사진 이벤트 페이지
```

## 주요 컴포넌트

### 섹션 컴포넌트 (메인 페이지)
- `CoverSection.vue` - 표지 (패럴렉스, FloatingPetals)
- `GreetingSection.vue` - 인사말
- `GallerySection.vue` - 갤러리 (Lightbox)
- `InfoSection.vue` - 신랑신부 정보, D-Day 카운터
- `CeremonySection.vue` - 식순
- `LocationSection.vue` - 장소 정보 (카카오 지도)
- `ContactSection.vue` - 연락처
- `AccountSection.vue` - 계좌 정보
- `ShareSection.vue` - 카카오톡 공유

### RSVP 컴포넌트 (rsvp/)
- `StepSide.vue` → `StepAttending.vue` → `StepCount.vue`/`StepMessage.vue` → `StepInfo.vue` → `StepComplete.vue`

### 특수 컴포넌트
- `InteractiveDogs.vue` - 마우스/터치 반응 강아지 (아리 & 쫑)
- `FloatingPetals.vue` - 떨어지는 꽃잎 애니메이션
- `ScrollProgress.vue` - 우측 스크롤 진행률
- `AttendanceSheet.vue` - RSVP 안내 Bottom Sheet

## Composables (커스텀 훅)

| 훅 | 용도 |
|---|---|
| `useRSVP.ts` | RSVP 폼 상태, Firestore 연동 |
| `useGuestbook.ts` | 방명록 실시간 구독 |
| `usePhotoUpload.ts` | 사진 업로드 (Firebase Storage) |
| `useAttendanceSheet.ts` | Bottom Sheet 상태 관리 |
| `useParentMode.ts` | URL 파라미터 기반 부모님 모드 |
| `useCalendar.ts` | 캘린더 앱 연동 (Google, Apple, Naver 등) |

## Firebase 컬렉션

- `rsvp` - 참석 응답 데이터
- `guestbook` - 방명록 메시지
- `photo-submissions` - 사진 이벤트 제출

## 환경 변수

`.env` 파일에 다음 변수들이 필요합니다:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_KAKAO_JS_KEY=
```

## 스타일링 가이드

### 웨딩 테마 색상

```javascript
colors: {
  wedding: {
    primary: '#d4a574',      // 금색 (메인)
    secondary: '#8b7355',    // 갈색
    bg: '#faf8f5',           // 크림 배경
    text: '#4a4a4a',         // 본문 텍스트
    'text-light': '#7a7a7a', // 보조 텍스트
    border: '#e8e4df',       // 테두리
    accent: '#c9a87c',       // 강조
  }
}
```

### 폰트

- 본문: `Noto Serif KR` (serif)
- 영문 제목: `Cormorant Garamond`

### 애니메이션 패턴

```vue
<!-- @vueuse/motion 사용 -->
<div
  v-motion
  :initial="{ opacity: 0, y: 20 }"
  :enter="{ opacity: 1, y: 0, transition: { delay: 100, duration: 600 } }"
>
```

## URL 파라미터

- `?from=groom-parent` - 신랑 측 부모님 공유 링크
- `?from=bride-parent` - 신부 측 부모님 공유 링크

이 파라미터는 RSVP와 카카오톡 공유 시 사용됩니다.

## 개발 시 주의사항

1. **모바일 우선**: 대부분의 방문자가 모바일이므로 모바일 UX를 우선 고려
2. **성능**: 이미지 최적화, 불필요한 리렌더링 방지
3. **터치 지원**: 인터랙티브 요소는 터치 이벤트도 처리
4. **@vueuse/core 활용**: `useMouse`, `useElementBounding`, `useElementVisibility` 등 활용
5. **Firebase 보안**: Firestore 규칙 확인 후 필드 추가/수정

## 알려진 이슈 및 해결책

### useMouse 좌표 문제
`useMouse()`는 기본적으로 `type: 'page'` (문서 전체 기준)를 사용합니다. `position: fixed` 요소와 함께 사용할 때는 `type: 'client'`로 변경해야 뷰포트 기준 좌표와 일치합니다.

```typescript
// 올바른 사용법
const { x, y } = useMouse({ type: 'client', touch: true })
```

## 캐릭터 정보 (InteractiveDogs)

- **아리**: 하얀 털 + 등에 토스트색 갈색, 귀 안쪽 핑크, 키 크고 다리 긺
- **쫑**: 갈색 털 + 턱~가슴 하얀색, 아리보다 작고 다리 짧음
