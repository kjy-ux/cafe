# ☕ 카페 앱 - 프로젝트 청사진

## 📁 폴더 구조 (완전 코로케이션)

```
cafe-app/
│
├── index.html                        # 메인 (고객)
├── index.css                         # 메인 페이지 스타일
└── index.js                          # 메인 페이지 로직
│
├── 👤 고객 - 메뉴
│   └── menus/
│       ├── list.html                 # 메뉴 목록
│       ├── list.css
│       ├── list.js
│       ├── detail.html               # 메뉴 상세
│       ├── detail.css
│       └── detail.js
│
├── 👤 고객 - 마이페이지
│   └── my/
│       ├── index.html                # 마이페이지 메인
│       ├── index.css
│       └── index.js
│
├── 👤 고객 - 장바구니
│   └── basket/
│       ├── list.html                 # 장바구니
│       ├── list.css
│       └── list.js
│
├── 👤 고객 - 주문 내역
│   └── orders/
│       ├── list.html                 # 주문 내역 목록
│       ├── list.css
│       ├── list.js
│       ├── detail.html               # 주문 상세
│       ├── detail.css
│       └── detail.js                   
│
├── 🔴 관리자/사장
│   └── admin/
│       ├── index.html                # 대시보드
│       ├── index.css
│       ├── index.js
│       │
│       ├── menus/
│       │   ├── list.html             # 메뉴 목록
│       │   ├── list.css
│       │   ├── list.js
│       │   ├── detail.html           # 메뉴 상세
│       │   ├── detail.css
│       │   ├── detail.js
│       │   ├── create.html           # 메뉴 추가
│       │   ├── create.css
│       │   ├── create.js
│       │   ├── edit.html             # 메뉴 수정
│       │   ├── edit.css
│       │   └── edit.js
│       │
│       └── orders/
│           ├── list.html             # 주문 목록
│           ├── list.css
│           ├── list.js
│           ├── detail.html           # 주문 상세
│           ├── detail.css
│           └── detail.js
│
├── 📦 공유 자원
│   ├── css/
│   │   └── variables.css             # CSS 변수 (전역)
│   └── js/
│       ├── data.js                   # 메뉴/카테고리 데이터
│       └── utils.js                  # 공통 유틸리티
```

## 👥 역할별 기능

| 역할 | 경로 | 주요 기능 |
|------|------|-----------|
| **고객** | `/`, `/menus/`, `/my/`, `/basket/`, `/orders/` | 메인, 메뉴 조회, 마이페이지, 장바구니, 주문 내역 |
| **관리자/사장** | `/admin/`, `/admin/menus/`, `/admin/orders/` | 대시보드, 메뉴 CRUD, 주문 관리 |

## 🎨 디자인

- **테마**: 라이트 + 따뜻한 브라운/크림 톤
- **분위기**: 미니멀 + 모던
- **카드 스타일**: Glass morphism
- **레이아웃**: 반응형 (모바일/데스크톱)

## 📐 코로케이션 원칙

- **HTML과 동일한 디렉토리에 css, js 파일을 평탄하게 배치** (별도 하위 폴더 없음)
- **파일명은 HTML 파일명과 동일하게 매칭** (`index.html` → `index.css`, `index.js`)
- 전역 공통 자원만 `/css/`, `/js/` 폴더에 분리
- 역할별 독립 폴더로 관심사를 분리

## 🔤 표준 `<head>` 스니펫 (모든 페이지 공통)

발표용 완성도를 위해 웹폰트(Noto Sans KR)를 실제로 로드합니다. 새 HTML을 만들 때마다 아래를 `<head>`에 포함 (경로 깊이에 맞게 `../../` 조정):

```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>☕</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{경로}/css/variables.css">
```

---

## ✅ 구현 TODO

### 1단계: 공유 자원

- [x] `css/variables.css` — 전역 CSS 변수, 리셋
  - [x] `--color-danger` 추가 (관리자 삭제 버튼 등 위험 액션 색상)
  - [x] `--transition-fast` / `--transition-base` 추가 (호버·인터랙션 타이밍 통일)
  - [x] 토스트 알림 컴포넌트 스타일 추가 (`.toast-container`, `.toast`, `.toast--show`, `.toast--error`)
- [x] 파비콘 — `☕` 이모지, data URI (표준 head 스니펫에 포함, 별도 이미지 파일 불필요)
- [x] `--color-success` 추가, `:focus-visible` / `::selection` 전역 스타일 추가
- [x] `.page-container` 공유 클래스 추가 — 모든 페이지의 중앙 정렬 컨테이너 (`admin/menus/list.html`부터 적용, `admin-main` 대체)
- [x] 주문 상태 배지 시스템 — `.badge`, `.badge--pending/confirmed/preparing/ready/completed/cancelled` (variables.css) + `getStatusBadgeClass()` (utils.js). 고객 주문내역·관리자 주문관리 단계에서 사용 예정
- [x] `js/data.js` — 메뉴/카테고리 데이터
- [x] `js/utils.js` — 공통 유틸리티 (카트, 포맷 등)
  - [x] 메뉴 CRUD 함수 추가 (`getMenus`, `saveMenus`, `getMenuById`, `addMenu`, `updateMenu`, `deleteMenu`) — `MENU_ITEMS`를 시드로 `localStorage`에 저장, 관리자 메뉴 관리와 연동
  - [x] `addToCart`가 `MENU_ITEMS` 대신 `getMenuById`를 참조하도록 수정 (관리자 메뉴 변경사항과 정합성 유지)
  - [x] `showToast(message, type)` 추가 — `confirm()`은 유지하되 결과 알림은 토스트로 표시 (발표 시 네이티브 팝업 노출 방지)
  - [x] `escapeHtml(str)` 추가 — 사용자 입력(메뉴 이름·이미지 URL 등)을 `innerHTML`에 넣기 전 이스케이프, 마크업 깨짐/XSS 방지
  - [x] `hasBatchim(str)` / `josa(word, withBatchim, withoutBatchim)` 추가 — 한글 받침 유무에 따라 을/를 등 조사를 정확히 선택 (토스트 메시지 등에 사용)
  - [x] `getCartCount()` / `renderCartBadge()` 추가 — 헤더 "장바구니" 링크 옆 실시간 개수 배지 (`id="cartBadge"` 요소가 있는 모든 고객 페이지에서 사용)
- [x] `[hidden] { display: none !important; }` 전역 규칙 추가 — 컴포넌트 클래스가 `display` 지정 시 `hidden` 속성을 무력화하는 CSS 우선순위 문제 방지 (`.image-preview`, `.cart-badge`에서 2회 발견됐던 버그)

### 2단계: 관리자 - 메뉴 관리 시스템

- [x] `admin/menus/list.html` — 메뉴 목록
- [x] `admin/menus/list.css`
- [x] `admin/menus/list.js`
- [x] `admin/menus/detail.html` — 메뉴 상세
- [x] `admin/menus/detail.css`
- [x] `admin/menus/detail.js`
- [x] `admin/menus/create.html` — 메뉴 추가
- [x] `admin/menus/create.css`
- [x] `admin/menus/create.js`
  - [x] 이미지 URL 실시간 미리보기 추가 (`.image-preview`) — 로드 실패 시 안내 문구로 대체
- [x] `admin/menus/edit.html` — 메뉴 수정
- [x] `admin/menus/edit.css`
- [x] `admin/menus/edit.js`

### 3단계: 고객 - 메뉴 조회 시스템

- [x] `menus/list.html` — 메뉴 목록
- [x] `menus/list.css`
- [x] `menus/list.js`
- [x] `menus/detail.html` — 메뉴 상세
- [x] `menus/detail.css`
- [x] `menus/detail.js`
  - [x] 수량 스테퍼(`.qty-stepper`) 추가 — 장바구니 담을 개수 선택 (`basket/list`에서도 동일 패턴 필요할 예정)

### 4단계: 고객 - 장바구니 관리 시스템

- [x] `basket/list.html` — 장바구니
- [x] `basket/list.css`
- [x] `basket/list.js`
  - [x] 수량 스테퍼(`.qty-stepper`) 재사용 (menus/detail과 동일 패턴, 코로케이션 원칙상 파일별로 각자 정의)
  - [x] 모바일 헤더 내비게이션 줄바꿈 버그 수정 — `.site-nav a`에 `white-space: nowrap` 추가, 640px 이하에서 헤더를 세로로 쌓고 nav를 `space-between`으로 배치 (`menus/list.css`, `menus/detail.css`, `basket/list.css` 전부 반영)

### 5단계: 고객 - 주문 관리 시스템

- [x] `orders/list.html` — 주문 내역 목록
- [x] `orders/list.css`
- [x] `orders/list.js`
- [x] `orders/detail.html` — 주문 상세
- [x] `orders/detail.css`
- [x] `orders/detail.js`
  - [x] `.badge`/`getStatusBadgeClass()` (1단계에서 미리 만든 주문 상태 배지 시스템) 실사용 — 목록/상세 모두 적용

### 6단계: 고객 - 메인 페이지

- [x] `index.html`
- [x] `index.css`
- [x] `index.js`
  - [x] 히어로 섹션 + 카테고리별 대표 메뉴 4개 미리보기(`#featuredGrid`) + 푸터

### 7단계: 고객 - 마이페이지

- [x] `my/index.html`
- [x] `my/index.css`
- [x] `my/index.js`
  - [x] 로그인/회원 데이터가 청사진에 없어서, 실제 존재하는 주문 데이터 기반 대시보드로 구성 (총 주문/누적 결제액 요약 + 최근 주문 3건 + 바로가기)

### 8단계: 관리자 - 대시보드 & 주문 관리

- [x] `admin/index.html` — 대시보드
- [x] `admin/index.css`
- [x] `admin/index.js`
  - [x] 통계(전체 메뉴/전체 주문/대기중 주문/총 매출 — 취소 주문 제외) + 최근 주문 5건 + 바로가기
- [x] `admin/orders/list.html` — 주문 목록
- [x] `admin/orders/list.css`
- [x] `admin/orders/list.js`
  - [x] 상태별 필터 탭 + 목록에서 바로 상태 변경 가능한 셀렉트(`updateOrderStatus`) 추가
- [x] `admin/orders/detail.html` — 주문 상세
- [x] `admin/orders/detail.css`
- [x] `admin/orders/detail.js`
  - [x] 상세 페이지에서도 상태 변경 가능, 고객 측 주문내역/마이페이지에 실시간 반영 확인
  - [x] 옵션 라벨(`order-detail__item-options`) 표시 추가

### 9단계: 실제 카페 앱 벤치마킹 — 추가 기능 (청사진 8단계 완료 후 반영)

스타벅스·투썸플레이스 등 실제 카페 앱 리서치를 바탕으로 4가지 기능 추가. 구조(폴더/코로케이션)는 그대로 유지하고 공유 자원과 각 페이지 로직만 확장.

- [x] **메뉴 옵션(커스터마이징)** — `js/data.js`에 `MENU_OPTIONS`(온도/사이즈/샷) + `CATEGORY_OPTIONS`(카테고리별 적용 옵션) 추가
  - [x] `js/utils.js`: `getDefaultOptions`, `getOptionsPriceDelta`, `formatOptionsLabel` 추가
  - [x] **장바구니 구조 변경**: cart item에 `lineId`(고유 식별자) + `options` 필드 추가, 옵션이 다르면 같은 메뉴라도 별도 줄로 관리. `addToCart(menuId, quantity, options)`, `updateCartQuantity(lineId, quantity)`, `removeFromCart(lineId)`로 시그니처 변경
  - [x] `menus/detail`: 옵션 선택 UI(라디오 그룹) + 실시간 가격 재계산 + 담기 버튼에 합계 표시
  - [x] `menus/list`: 빠른 "담기" 버튼은 카테고리 기본 옵션(HOT/Regular/샷 없음)으로 담김
  - [x] `basket/list`, `orders/list`, `orders/detail`, `admin/orders/detail`: 옵션 라벨 표시 반영
- [x] **재주문** — `js/utils.js`의 `reorder(order)` 공용 함수 추가 (메뉴 삭제된 경우 부분/실패 처리 포함)
  - [x] `orders/list`, `orders/detail`, `my/index`에 "다시 담기" 버튼 추가
  - [x] 주문 카드 구조 변경: `<a class="order-card">` → `<div class="order-card">` 안에 `.order-card__link`(상세 이동) + 별도 버튼으로 분리 (인터랙티브 요소 중첩 방지)
- [x] **메뉴 검색** — `menus/list`에 검색창(`#searchInput`) 추가, 카테고리 필터와 함께 적용
- [x] **즐겨찾기(찜하기)** — `js/utils.js`에 `getFavorites`/`isFavorite`/`toggleFavorite` 추가 (`cafe_favorites` localStorage)
  - [x] `menus/list`, `menus/detail`에 하트 토글 버튼 추가
  - [x] `my/index`에 "찜한 메뉴" 섹션 추가 (즐겨찾기 모아보기 + 해제 가능)

**회귀 테스트**: 전체 14개 페이지(쿼리 변형 포함 17케이스) 콘솔 에러 스윕, 내부 링크 무결성, 옵션별 가격 계산, lineId 기반 수량/삭제, 재주문 성공/부분실패/실패 케이스, 즐겨찾기 상태 유지·페이지 간 동기화, 모바일 반응형 — 전부 확인 완료.

### 10단계: 레이아웃 구조 개편 (폴더 구조·코로케이션은 변경 없음, 화면 구성만 변경)

- [x] **관리자 — 사이드바 레이아웃**: 상단 가로 헤더(`admin-header`/`admin-nav`) → 왼쪽 고정 사이드바(`admin-shell`/`admin-sidebar`/`admin-content`)로 전환. `admin/index`, `admin/menus/*`(4개), `admin/orders/*`(2개) 총 7개 페이지 전부 반영. 768px 이하에서는 사이드바가 상단 가로 바로 축소(브랜드 위 / 내비 아래 2줄 배치로 텍스트 줄바꿈 방지)
- [x] **고객 메뉴 목록 — 사이드바 필터**: 상단 가로 필터탭 → 왼쪽 sticky 사이드바(검색창 + 세로 카테고리 리스트) + 오른쪽 메뉴 그리드. 768px 이하에서는 기존처럼 상단 검색창 + 가로 필터 탭(알약 모양)으로 복귀
- [x] **장바구니 — 2단 레이아웃**: 세로 스택(목록 → 요약 바) → 왼쪽 아이템 목록 + 오른쪽 sticky 주문 요약 카드. 900px 이하에서는 1단 레이아웃 + 요약을 가로 바로, 640px 이하에서는 요약을 다시 세로 스택으로 전환

JS 로직·이벤트 핸들러는 변경 없음(마크업/CSS만 조정). 레이아웃 변경 후 전체 14개 페이지 재스윕, 관리자 CRUD, 주문 상태 변경 → 고객 화면 반영까지 재확인 완료.
