# 모바일 청첩장 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 김현기 · 김다솜 결혼식을 위한 모바일 청첩장 정적 웹페이지를 만든다. 커버부터 계좌번호까지 9개 섹션, 샘플 사진 15장/영상 3개 플레이스홀더, GitHub Pages 배포.

**Architecture:** 빌드 스텝 없는 순수 HTML/CSS/JS 한 페이지. 섹션마다 `index.html`에 `<section>`을 추가하고, 공용 스타일은 `css/tokens.css`(디자인 토큰) + `css/style.css`(레이아웃), 인터랙션은 `js/dday.js`(순수 함수) + `js/main.js`(DOM 바인딩)로 분리한다. 클래식 `<script>` 태그만 사용해 `file://`로 직접 열어도 동작하게 한다.

**Tech Stack:** HTML5, CSS3 (Custom Properties, Grid/Flexbox), Vanilla JS (ES5 문법, 모듈 없음). 번들러·프레임워크 없음. Google Fonts(Nanum Myeongjo)만 외부 의존성.

**Spec:** `docs/superpowers/specs/2026-08-15-wedding-invitation-design.md`

## Global Constraints

- 팔레트: `--color-bg-top:#132318`, `--color-bg-bottom:#0B1710`, `--color-ink:#EDE9DD`, `--color-ink-bright:#FFFFFF`, `--color-muted:#B7C7B9`, `--color-accent:#C79A6B`
- 디스플레이 폰트: `'Nanum Myeongjo','Noto Serif KR',serif` / 본문 폰트: `-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif`
- 사이트는 하나의 고정된 다크 에버그린 톤만 쓴다 — `prefers-color-scheme` 분기 없음
- 신랑·신부: 김현기 · 김다솜 / 일시: 2026. 12. 13. (일) 오후 6시 / 장소: 삼성금융연수원
- RSVP 기능 없음. 사진 15장·영상 3개·지도·계좌번호는 이번 구현에서 전부 샘플/플레이스홀더 콘텐츠
- Node.js가 로컬에 없으므로 npm 기반 테스트 러너 사용 불가 — 순수 함수는 브라우저에서 직접 여는 정적 HTML 테스트로 검증, 나머지는 Claude_Browser로 수동 확인
- `git commit`은 이미 설정된 `user.name "som"` / `user.email "berrystar0@gmail.com"`으로 진행 (Task 1에서 이미 완료됨, 재설정 불필요)

---

### Task 1: 프로젝트 스캐폴드 + 디자인 토큰

**Files:**
- Create: `index.html`
- Create: `css/tokens.css`
- Create: `css/style.css`

**Interfaces:**
- Produces: CSS 커스텀 프로퍼티 `--color-bg-top`, `--color-bg-bottom`, `--color-ink`, `--color-ink-bright`, `--color-muted`, `--color-accent`, `--font-display`, `--font-body` (모든 후속 태스크가 이 토큰을 사용). `.section` 공통 레이아웃 클래스(최대폭 480px, 좌우 padding). `<!-- SECTION: x --> ` 형태의 삽입 지점 주석 9개.

- [ ] **Step 1: `css/tokens.css` 작성**

```css
:root{
  --color-bg-top:#132318;
  --color-bg-bottom:#0B1710;
  --color-ink:#EDE9DD;
  --color-ink-bright:#FFFFFF;
  --color-muted:#B7C7B9;
  --color-accent:#C79A6B;
  --font-display:'Nanum Myeongjo','Noto Serif KR',serif;
  --font-body:-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;
}
```

- [ ] **Step 2: `css/style.css` 기본 골격 작성**

```css
*{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{
  margin:0;
  min-height:100vh;
  background:linear-gradient(180deg,var(--color-bg-top) 0%,var(--color-bg-bottom) 100%);
  background-attachment:fixed;
  color:var(--color-ink);
  font-family:var(--font-body);
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}
.section{
  max-width:480px;
  margin:0 auto;
  padding:88px 28px;
}
.eyebrow{
  font-size:11px;
  letter-spacing:0.32em;
  font-weight:600;
  text-transform:uppercase;
  color:var(--color-accent);
  text-align:center;
  margin:0 0 20px;
}
.rule{
  width:28px;height:1px;
  background:var(--color-accent);
  margin:20px auto;
  border:none;
}
button{
  font-family:inherit;
  cursor:pointer;
}
@media (prefers-reduced-motion: reduce){
  html{scroll-behavior:auto;}
}
```

- [ ] **Step 3: `index.html` 골격 작성**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>김현기 · 김다솜 결혼합니다</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<main>
<!-- SECTION: cover -->
<!-- SECTION: invitation -->
<!-- SECTION: calendar -->
<!-- SECTION: gallery -->
<!-- SECTION: video -->
<!-- SECTION: location -->
<!-- SECTION: info -->
<!-- SECTION: account -->
<!-- SECTION: footer -->
</main>
<!-- OVERLAYS -->
<script src="js/dday.js"></script>
<script src="js/main.js"></script>
</body>
</html>
```

`js/dday.js`, `js/main.js`는 아직 없으므로 이 시점에는 콘솔에 404가 뜨는 게 정상이다 (Task 4에서 생성).

- [ ] **Step 4: 브라우저로 확인**

Claude_Browser의 `navigate`로 `file:///C:/Users/white/SomWorkspace/WeddingInvi/index.html`을 연다.
Expected: 다크 에버그린 그라디언트 배경이 보이고, 콘솔에 `js/dday.js`, `js/main.js` 404 에러만 있고 다른 에러는 없어야 한다.

- [ ] **Step 5: 커밋**

```bash
git add index.html css/tokens.css css/style.css
git commit -m "feat: add project scaffold and design tokens"
```

---

### Task 2: 커버(인트로) 섹션

**Files:**
- Modify: `index.html` (`<!-- SECTION: cover -->` 주석을 아래 마크업으로 교체)
- Modify: `css/style.css` (커버 스타일 추가)

**Interfaces:**
- Consumes: Task 1의 `--color-*`, `--font-*` 토큰
- Produces: `.snow` / `.flake` 클래스 (Task 4의 `main.js`가 `document.querySelectorAll('.snow')`로 찾아서 눈송이를 채운다 — 클래스명이 정확히 일치해야 함)

- [ ] **Step 1: `index.html`에서 `<!-- SECTION: cover -->`를 아래로 교체**

```html
<section id="cover" class="cover">
  <div class="snow" data-snow aria-hidden="true"></div>
  <div class="cover-inner">
    <p class="eyebrow">Save the date</p>
    <h1 class="cover-names">김현기<span class="cover-amp">·</span>김다솜</h1>
    <div class="rule"></div>
    <p class="cover-date">2026. 12. 13. (일) 오후 6시</p>
    <p class="cover-venue">삼성금융연수원</p>
  </div>
  <div class="scroll-cue" aria-hidden="true"><span></span></div>
</section>
```

- [ ] **Step 2: `css/style.css`에 커버 스타일 추가**

```css
.cover{
  position:relative;
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:hidden;
  padding:0;
}
.snow{
  position:absolute; inset:0;
  overflow:hidden;
  pointer-events:none;
}
.flake{
  position:absolute;
  top:-8%;
  width:3px;height:3px;
  border-radius:50%;
  background:rgba(237,233,221,0.7);
  animation:fall 11s linear infinite;
}
@keyframes fall{
  to{ transform:translateY(112vh); }
}
@media (prefers-reduced-motion: reduce){
  .flake{ animation:none; opacity:0.5; }
}
.cover-inner{
  position:relative;
  text-align:center;
  padding:0 32px;
}
.cover-names{
  font-family:var(--font-display);
  font-weight:700;
  font-size:clamp(30px,8vw,42px);
  color:var(--color-ink-bright);
  margin:0;
  letter-spacing:0.02em;
}
.cover-amp{
  display:inline-block;
  margin:0 14px;
  color:var(--color-accent);
  font-weight:400;
}
.cover-date{
  font-size:15px;
  color:var(--color-ink);
  margin:0 0 4px;
  letter-spacing:0.02em;
}
.cover-venue{
  font-size:13px;
  color:var(--color-muted);
  margin:0;
}
.scroll-cue{
  position:absolute;
  bottom:32px;
  left:50%;
  transform:translateX(-50%);
}
.scroll-cue span{
  display:block;
  width:1px;height:36px;
  background:linear-gradient(180deg,var(--color-accent),transparent);
  animation:scroll-cue 2.2s ease-in-out infinite;
}
@keyframes scroll-cue{
  0%,100%{ transform:scaleY(0.6); opacity:0.4; }
  50%{ transform:scaleY(1); opacity:1; }
}
@media (prefers-reduced-motion: reduce){
  .scroll-cue span{ animation:none; opacity:0.7; }
}
```

- [ ] **Step 3: 브라우저로 확인**

`navigate`로 `index.html` 새로고침. 화면 중앙에 "김현기 · 김다솜" 큰 제목, 날짜, 장소가 보여야 한다. (눈송이는 Task 4에서 JS가 붙기 전까지는 안 보이는 게 정상 — `.snow` 컨테이너만 존재)

- [ ] **Step 4: 커밋**

```bash
git add index.html css/style.css
git commit -m "feat: add cover section"
```

---

### Task 3: 초대의 글 섹션

**Files:**
- Modify: `index.html` (`<!-- SECTION: invitation -->` 교체)
- Modify: `css/style.css`

**Interfaces:**
- Consumes: `.section`, `.eyebrow`, `.rule` (Task 1)

- [ ] **Step 1: `index.html`에서 `<!-- SECTION: invitation -->`을 교체**

```html
<section id="invitation" class="section invitation">
  <p class="eyebrow">초대합니다</p>
  <p class="invitation-text">
    겨울, 상록수 숲처럼 늘 푸르게<br>
    서로를 지켜가겠습니다.<br><br>
    저희 두 사람이 사랑의 결실을 맺어<br>
    새로운 걸음을 내딛으려 합니다.<br>
    귀한 걸음 하시어 축복해 주시면<br>
    더없는 기쁨으로 간직하겠습니다.
  </p>
  <div class="rule"></div>
  <p class="invitation-parents">
    김OO · 이OO의 아들 <b>현기</b><br>
    박OO · 최OO의 딸 <b>다솜</b>
  </p>
</section>
```

- [ ] **Step 2: `css/style.css`에 스타일 추가**

```css
.invitation{
  text-align:center;
}
.invitation-text{
  font-size:15px;
  line-height:2;
  color:var(--color-ink);
  margin:0;
}
.invitation-parents{
  font-size:13.5px;
  line-height:1.9;
  color:var(--color-muted);
  margin:0;
}
.invitation-parents b{
  color:var(--color-ink-bright);
  font-weight:600;
}
```

- [ ] **Step 3: 브라우저로 확인**

새로고침 후 스크롤. 커버 아래에 초대문구가 중앙 정렬로 보여야 한다.

- [ ] **Step 4: 커밋**

```bash
git add index.html css/style.css
git commit -m "feat: add invitation message section"
```

---

### Task 4: D-Day 순수 함수 + 캘린더/D-Day 섹션

**Files:**
- Create: `js/dday.js`
- Create: `tests/dday.test.html`
- Create: `js/main.js`
- Modify: `index.html` (`<!-- SECTION: calendar -->` 교체)
- Modify: `css/style.css`

**Interfaces:**
- Produces: `window.daysUntil(targetISODate, fromDate)` — `targetISODate`는 `'YYYY-MM-DD'` 문자열, `fromDate`는 생략 시 `new Date()`. 자정 기준 날짜 차이를 정수로 반환 (미래면 양수, 과거면 음수, 당일이면 0). `js/main.js`가 이 함수를 호출해 `#dday-count`에 렌더링한다.
- Produces: `js/main.js`의 `initSnow()` 함수 — `document.querySelectorAll('.snow')`를 순회하며 각 컨테이너에 `.flake` div 22개를 생성 (Task 2의 `.snow`/`.flake` 클래스와 연결).

- [ ] **Step 1: `js/dday.js` 작성 (실패하는 테스트를 먼저 만들기 위해 함수 시그니처만 정의)**

```javascript
function daysUntil(targetISODate, fromDate) {
  throw new Error('not implemented');
}
window.daysUntil = daysUntil;
```

- [ ] **Step 2: `tests/dday.test.html` 작성**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>dday.js test</title>
</head>
<body>
<h1>daysUntil() tests</h1>
<ul id="results"></ul>
<script src="../js/dday.js"></script>
<script>
  function assertEqual(actual, expected, label) {
    var pass = actual === expected;
    var li = document.createElement('li');
    li.textContent = (pass ? 'PASS' : 'FAIL') + ' — ' + label + ' (expected ' + expected + ', got ' + actual + ')';
    li.style.color = pass ? 'green' : 'red';
    document.getElementById('results').appendChild(li);
    console.assert(pass, label, 'expected', expected, 'got', actual);
    return pass;
  }

  var allPass = true;
  allPass = assertEqual(daysUntil('2026-12-13', new Date(2026, 7, 15)), 120, '2026-08-15 -> 2026-12-13 is 120 days') && allPass;
  allPass = assertEqual(daysUntil('2026-12-13', new Date(2026, 11, 13)), 0, 'same day is 0') && allPass;
  allPass = assertEqual(daysUntil('2026-12-13', new Date(2026, 11, 14)), -1, 'day after is -1') && allPass;

  var summary = document.createElement('h2');
  summary.id = 'summary';
  summary.textContent = allPass ? 'ALL PASS' : 'SOME FAILED';
  summary.style.color = allPass ? 'green' : 'red';
  document.body.appendChild(summary);
</script>
</body>
</html>
```

- [ ] **Step 3: 테스트가 실패하는지 확인**

Claude_Browser `navigate`로 `file:///C:/Users/white/SomWorkspace/WeddingInvi/tests/dday.test.html`을 연다.
Expected: `daysUntil not implemented` 에러가 콘솔에 뜨고 페이지 실행이 첫 assert에서 멈춘다 (아직 구현 전이므로 정상).

- [ ] **Step 4: `js/dday.js`에 실제 구현 작성**

```javascript
function daysUntil(targetISODate, fromDate) {
  var from = fromDate || new Date();
  var parts = targetISODate.split('-').map(Number);
  var target = new Date(parts[0], parts[1] - 1, parts[2]);
  var fromMidnight = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  var msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((target - fromMidnight) / msPerDay);
}
window.daysUntil = daysUntil;
```

- [ ] **Step 5: 테스트 통과 확인**

`tests/dday.test.html`을 다시 로드(또는 새로고침).
Expected: 목록 3개 모두 `PASS`(초록색), 마지막에 `ALL PASS`가 초록색으로 표시.

- [ ] **Step 6: `js/main.js` 작성 (눈 효과 + D-Day 렌더링)**

```javascript
(function () {
  function initSnow() {
    var hosts = document.querySelectorAll('.snow');
    hosts.forEach(function (host) {
      var n = 24;
      for (var i = 0; i < n; i++) {
        var f = document.createElement('div');
        f.className = 'flake';
        f.style.left = (Math.random() * 100) + '%';
        f.style.animationDelay = (Math.random() * 11) + 's';
        f.style.animationDuration = (9 + Math.random() * 6) + 's';
        f.style.opacity = (0.4 + Math.random() * 0.5).toFixed(2);
        host.appendChild(f);
      }
    });
  }

  function renderDday() {
    var el = document.getElementById('dday-count');
    if (!el) return;
    var days = window.daysUntil('2026-12-13', new Date());
    if (days > 0) {
      el.textContent = 'D-' + days;
    } else if (days === 0) {
      el.textContent = 'D-DAY';
    } else {
      el.textContent = 'D+' + Math.abs(days);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initSnow();
    renderDday();
  });
})();
```

- [ ] **Step 7: `index.html`에서 `<!-- SECTION: calendar -->`를 교체**

```html
<section id="calendar" class="section calendar">
  <p class="eyebrow">Wedding Day</p>
  <p class="calendar-month">2026 . 12</p>
  <div class="calendar-grid">
    <span class="calendar-dow">일</span><span class="calendar-dow">월</span><span class="calendar-dow">화</span><span class="calendar-dow">수</span><span class="calendar-dow">목</span><span class="calendar-dow">금</span><span class="calendar-dow">토</span>
    <span></span><span></span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
    <span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span>
    <span class="is-wedding-day">13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span><span>19</span>
    <span>20</span><span>21</span><span>22</span><span>23</span><span>24</span><span>25</span><span>26</span>
    <span>27</span><span>28</span><span>29</span><span>30</span><span>31</span><span></span><span></span>
  </div>
  <p class="dday" id="dday-count"></p>
</section>
```

- [ ] **Step 8: `css/style.css`에 캘린더 스타일 추가**

```css
.calendar{
  text-align:center;
}
.calendar-month{
  font-family:var(--font-display);
  font-size:20px;
  color:var(--color-ink-bright);
  margin:0 0 20px;
  letter-spacing:0.06em;
}
.calendar-grid{
  display:grid;
  grid-template-columns:repeat(7,1fr);
  gap:10px 0;
  font-size:13px;
}
.calendar-dow{
  color:var(--color-muted);
  font-size:11px;
  padding-bottom:6px;
}
.calendar-grid span{
  color:var(--color-ink);
  padding:6px 0;
}
.calendar-grid .is-wedding-day{
  position:relative;
  color:var(--color-bg-bottom);
  font-weight:700;
}
.calendar-grid .is-wedding-day::before{
  content:'';
  position:absolute;
  inset:0 6px;
  margin:0 auto;
  width:28px;height:28px;
  background:var(--color-accent);
  border-radius:50%;
  z-index:-1;
  left:50%;
  transform:translateX(-50%);
}
.dday{
  font-family:var(--font-display);
  font-size:26px;
  color:var(--color-accent);
  margin:28px 0 0;
  letter-spacing:0.06em;
}
```

`index.html`의 `<script>` 태그 순서(`js/dday.js` → `js/main.js`)는 Task 1에서 이미 걸어뒀으므로 수정할 필요 없다.

- [ ] **Step 9: 브라우저로 전체 페이지 확인**

`index.html`을 새로고침. Expected: 커버 섹션에 눈이 내리고, 캘린더 섹션에 12월 달력이 보이고 13일에 포인트 컬러 원이 표시되며, 그 아래 `D-120`이 표시된다 (오늘 날짜가 2026-08-15 기준).

- [ ] **Step 10: 커밋**

```bash
git add js/dday.js js/main.js tests/dday.test.html index.html css/style.css
git commit -m "feat: add dday calculator with tests, snow effect, and calendar section"
```

---

### Task 5: 갤러리 섹션 (사진 15장 + 라이트박스)

**Files:**
- Modify: `index.html` (`<!-- SECTION: gallery -->` 교체, `<!-- OVERLAYS -->` 자리에 라이트박스 마크업 추가)
- Modify: `css/style.css`
- Modify: `js/main.js` (`initLightbox()` 추가)

**Interfaces:**
- Produces: `.gallery-item` 버튼에 `data-index`, `data-label` 속성. 클릭 시 `#lightbox`(hidden 토글) + `#lightbox-content`에 확대 버전을 렌더링.
- Consumes: Task 4의 `main.js` IIFE 구조 — 같은 `DOMContentLoaded` 리스너 안에 `initLightbox()` 호출을 추가한다.

- [ ] **Step 1: `index.html`에서 `<!-- SECTION: gallery -->`를 교체**

15장을 3가지 톤(tile-a/b/c)으로 순환시켜 단조롭지 않게 만든다.

```html
<section id="gallery" class="section gallery">
  <p class="eyebrow">우리의 순간들</p>
  <div class="gallery-grid">
    <button class="gallery-item tile-a" data-index="1" data-label="사진 01">01</button>
    <button class="gallery-item tile-b" data-index="2" data-label="사진 02">02</button>
    <button class="gallery-item tile-c" data-index="3" data-label="사진 03">03</button>
    <button class="gallery-item tile-b" data-index="4" data-label="사진 04">04</button>
    <button class="gallery-item tile-a" data-index="5" data-label="사진 05">05</button>
    <button class="gallery-item tile-c" data-index="6" data-label="사진 06">06</button>
    <button class="gallery-item tile-a" data-index="7" data-label="사진 07">07</button>
    <button class="gallery-item tile-b" data-index="8" data-label="사진 08">08</button>
    <button class="gallery-item tile-c" data-index="9" data-label="사진 09">09</button>
    <button class="gallery-item tile-b" data-index="10" data-label="사진 10">10</button>
    <button class="gallery-item tile-a" data-index="11" data-label="사진 11">11</button>
    <button class="gallery-item tile-c" data-index="12" data-label="사진 12">12</button>
    <button class="gallery-item tile-a" data-index="13" data-label="사진 13">13</button>
    <button class="gallery-item tile-b" data-index="14" data-label="사진 14">14</button>
    <button class="gallery-item tile-c" data-index="15" data-label="사진 15">15</button>
  </div>
  <p class="gallery-note">* 샘플 이미지입니다. 실제 사진으로 교체될 예정입니다.</p>
</section>
```

- [ ] **Step 2: `index.html`의 `<!-- OVERLAYS -->`를 라이트박스 마크업으로 교체**

```html
<div class="lightbox" id="lightbox" hidden>
  <button class="lightbox-close" id="lightbox-close" aria-label="닫기">×</button>
  <div class="lightbox-content" id="lightbox-content"></div>
</div>
```

- [ ] **Step 3: `css/style.css`에 갤러리 + 라이트박스 스타일 추가**

```css
.gallery{ text-align:center; }
.gallery-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:8px;
}
.gallery-item{
  aspect-ratio:1/1;
  border:none;
  border-radius:6px;
  color:rgba(237,233,221,0.85);
  font-family:var(--font-display);
  font-size:15px;
  display:flex;
  align-items:center;
  justify-content:center;
}
.tile-a{ background:linear-gradient(135deg,#1B3325,#0F1D14); }
.tile-b{ background:linear-gradient(135deg,#2A3B2C,#132318); }
.tile-c{ background:linear-gradient(135deg,#3A2E20,#1B160F); }
.gallery-note{
  font-size:11.5px;
  color:var(--color-muted);
  margin:16px 0 0;
}
.lightbox{
  position:fixed; inset:0;
  background:rgba(6,10,7,0.92);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:100;
}
.lightbox[hidden]{ display:none; }
.lightbox-content{
  width:min(86vw,420px);
  aspect-ratio:1/1;
  border-radius:8px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-family:var(--font-display);
  font-size:20px;
  color:var(--color-ink-bright);
}
.lightbox-close{
  position:absolute;
  top:24px; right:24px;
  width:40px; height:40px;
  border-radius:50%;
  border:1px solid var(--color-muted);
  background:transparent;
  color:var(--color-ink);
  font-size:20px;
  line-height:1;
}
```

- [ ] **Step 4: `js/main.js`에 `initLightbox()` 추가 (기존 IIFE 안, `initSnow`/`renderDday` 옆에 함수 추가하고 `DOMContentLoaded` 리스너에 호출 추가)**

```javascript
  function initLightbox() {
    var items = document.querySelectorAll('.gallery-item');
    var lightbox = document.getElementById('lightbox');
    var content = document.getElementById('lightbox-content');
    var closeBtn = document.getElementById('lightbox-close');
    if (!lightbox || !content || !closeBtn) return;

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        content.textContent = item.getAttribute('data-label');
        content.className = 'lightbox-content ' + item.className.replace('gallery-item', '').trim();
        lightbox.hidden = false;
      });
    });

    function close() {
      lightbox.hidden = true;
    }
    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }
```

`DOMContentLoaded` 리스너를 아래처럼 갱신:

```javascript
  document.addEventListener('DOMContentLoaded', function () {
    initSnow();
    renderDday();
    initLightbox();
  });
```

- [ ] **Step 5: 브라우저로 확인**

`index.html` 새로고침 후 갤러리까지 스크롤. 3x5 그리드로 15개 타일이 보여야 하고, 하나를 클릭하면 라이트박스가 열리며 같은 톤으로 확대된 카드와 번호가 보여야 한다. × 버튼과 바깥 클릭, Esc 키로 닫히는지 확인.

- [ ] **Step 6: 커밋**

```bash
git add index.html css/style.css js/main.js
git commit -m "feat: add gallery section with lightbox"
```

---

### Task 6: 영상 섹션 (샘플 영상 3개)

**Files:**
- Modify: `index.html` (`<!-- SECTION: video -->` 교체)
- Modify: `css/style.css`
- Modify: `js/main.js` (`initVideoCards()` 추가)

**Interfaces:**
- Produces: `.video-card` 버튼 클릭 시 `#video-note`가 보여지고 클릭한 카드의 라벨이 안에 표시됨.

- [ ] **Step 1: `index.html`에서 `<!-- SECTION: video -->`를 교체**

```html
<section id="video" class="section video">
  <p class="eyebrow">영상으로 보기</p>
  <div class="video-grid">
    <button class="video-card" data-label="웨딩필름">
      <span class="play-icon">▶</span>
      <span class="video-card-label">웨딩필름</span>
    </button>
    <button class="video-card" data-label="프로포즈 영상">
      <span class="play-icon">▶</span>
      <span class="video-card-label">프로포즈 영상</span>
    </button>
    <button class="video-card" data-label="비하인드">
      <span class="play-icon">▶</span>
      <span class="video-card-label">비하인드</span>
    </button>
  </div>
  <p class="video-note" id="video-note" hidden></p>
</section>
```

- [ ] **Step 2: `css/style.css`에 영상 섹션 스타일 추가**

```css
.video{ text-align:center; }
.video-grid{
  display:flex;
  flex-direction:column;
  gap:12px;
}
.video-card{
  display:flex;
  align-items:center;
  gap:16px;
  padding:18px 20px;
  border-radius:8px;
  border:1px solid rgba(199,154,107,0.35);
  background:linear-gradient(135deg,rgba(199,154,107,0.08),transparent);
  color:var(--color-ink);
  text-align:left;
}
.play-icon{
  width:36px;height:36px;
  border-radius:50%;
  border:1px solid var(--color-accent);
  color:var(--color-accent);
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:13px;
  flex-shrink:0;
}
.video-card-label{
  font-family:var(--font-display);
  font-size:15px;
}
.video-note{
  margin-top:18px;
  font-size:12.5px;
  color:var(--color-muted);
}
```

- [ ] **Step 3: `js/main.js`에 `initVideoCards()` 추가**

```javascript
  function initVideoCards() {
    var cards = document.querySelectorAll('.video-card');
    var note = document.getElementById('video-note');
    if (!note) return;
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        note.textContent = '"' + card.getAttribute('data-label') + '" 샘플 영상입니다. 실제 영상 파일로 교체될 예정입니다.';
        note.hidden = false;
      });
    });
  }
```

`DOMContentLoaded` 리스너에 `initVideoCards();` 호출 추가.

- [ ] **Step 4: 브라우저로 확인**

영상 섹션까지 스크롤. 3개 카드가 세로로 보이고, 클릭하면 아래 안내 문구가 나타나며 클릭한 카드 이름이 포함되는지 확인.

- [ ] **Step 5: 커밋**

```bash
git add index.html css/style.css js/main.js
git commit -m "feat: add video placeholder section"
```

---

### Task 7: 오시는 길 섹션

**Files:**
- Modify: `index.html` (`<!-- SECTION: location -->` 교체)
- Modify: `css/style.css`
- Modify: `js/main.js` (`copyToClipboard()`, `initCopyButtons()` 추가)

**Interfaces:**
- Produces: `window` 스코프 밖에 있는 IIFE 내부 함수 `copyToClipboard(text)` — `navigator.clipboard.writeText`를 우선 시도하고 실패(또는 미지원, 예: `file://`에서 secure context 아님)하면 숨겨진 `<textarea>` + `document.execCommand('copy')`로 폴백한다. `.copy-btn[data-copy]` 클래스는 이후 계좌번호 섹션(Task 9)에서도 재사용한다.

- [ ] **Step 1: `index.html`에서 `<!-- SECTION: location -->`를 교체**

```html
<section id="location" class="section location">
  <p class="eyebrow">오시는 길</p>
  <div class="map-placeholder">
    <p>지도 영역</p>
    <p class="map-placeholder-sub">실제 지도(카카오맵) 연동 예정</p>
  </div>
  <p class="address">삼성금융연수원</p>
  <button class="copy-btn" data-copy="삼성금융연수원">주소 복사</button>
  <p class="copy-feedback" data-copy-feedback hidden>복사되었습니다</p>
  <div class="transit-info">
    <div class="info-row"><span class="info-label">지하철</span><span>분당선 죽전역 2번 출구, 도보 15분 (예시 안내)</span></div>
    <div class="info-row"><span class="info-label">버스</span><span>죽전역 정류장 하차 (예시 안내)</span></div>
    <div class="info-row"><span class="info-label">주차</span><span>연수원 내 주차장 이용 가능 (예시 안내)</span></div>
  </div>
</section>
```

- [ ] **Step 2: `css/style.css`에 오시는 길 스타일 추가**

```css
.location{ text-align:center; }
.map-placeholder{
  aspect-ratio:16/10;
  border-radius:8px;
  background:
    linear-gradient(135deg,rgba(199,154,107,0.12),transparent),
    linear-gradient(180deg,#152A1C,#0E1B12);
  border:1px solid rgba(199,154,107,0.2);
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:6px;
  color:var(--color-muted);
  font-size:13px;
  margin-bottom:20px;
}
.map-placeholder-sub{
  font-size:11px;
  color:rgba(183,199,185,0.6);
}
.address{
  font-family:var(--font-display);
  font-size:17px;
  color:var(--color-ink-bright);
  margin:0 0 12px;
}
.copy-btn{
  border:1px solid var(--color-accent);
  background:transparent;
  color:var(--color-accent);
  font-size:12.5px;
  padding:8px 18px;
  border-radius:999px;
}
.copy-feedback{
  font-size:11.5px;
  color:var(--color-accent);
  margin:10px 0 0;
}
.transit-info{
  margin-top:28px;
  text-align:left;
  display:flex;
  flex-direction:column;
  gap:14px;
}
.info-row{
  display:flex;
  gap:16px;
  font-size:13px;
  line-height:1.6;
}
.info-label{
  flex-shrink:0;
  width:44px;
  color:var(--color-accent);
  font-weight:600;
}
```

- [ ] **Step 3: `js/main.js`에 `copyToClipboard()`, `initCopyButtons()` 추가**

```javascript
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () {
        return legacyCopy(text);
      });
    }
    return Promise.resolve(legacyCopy(text));
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  function initCopyButtons() {
    var buttons = document.querySelectorAll('.copy-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy');
        copyToClipboard(text);
        var feedback = btn.parentElement.querySelector('[data-copy-feedback]');
        if (feedback) {
          feedback.hidden = false;
          setTimeout(function () { feedback.hidden = true; }, 1800);
        }
      });
    });
  }
```

`DOMContentLoaded` 리스너에 `initCopyButtons();` 호출 추가.

- [ ] **Step 4: 브라우저로 확인**

오시는 길 섹션까지 스크롤. 지도 자리표시자, 주소, 대중교통/주차 안내가 보여야 한다. "주소 복사" 버튼을 누르면 "복사되었습니다" 문구가 잠깐 나타났다 사라지는지 확인한다 (`read_console_messages`로 에러 없는지도 확인 — `file://`에서 `navigator.clipboard`가 막혀도 폴백으로 에러 없이 동작해야 한다).

- [ ] **Step 5: 커밋**

```bash
git add index.html css/style.css js/main.js
git commit -m "feat: add location section with clipboard copy"
```

---

### Task 8: 안내사항 아코디언 섹션

**Files:**
- Modify: `index.html` (`<!-- SECTION: info -->` 교체)
- Modify: `css/style.css`
- Modify: `js/main.js` (`initAccordion()` 추가)

**Interfaces:**
- Produces: `.info-item.is-open` 토글 — 클릭 시 `.info-answer`의 `max-height`가 늘어나며 펼쳐짐.

- [ ] **Step 1: `index.html`에서 `<!-- SECTION: info -->`를 교체**

```html
<section id="info" class="section info">
  <p class="eyebrow">안내사항</p>
  <div class="info-list">
    <div class="info-item">
      <button class="info-question">식사 안내</button>
      <div class="info-answer"><p>예식 후 같은 건물 3층 연회장에서 식사가 준비되어 있습니다.</p></div>
    </div>
    <div class="info-item">
      <button class="info-question">주차 안내</button>
      <div class="info-answer"><p>삼성금융연수원 내 주차장을 무료로 이용하실 수 있습니다. 만차 시 안내 요원의 안내를 따라주세요.</p></div>
    </div>
    <div class="info-item">
      <button class="info-question">화환 안내</button>
      <div class="info-answer"><p>화환은 정중히 사양합니다. 마음만으로도 충분히 감사드립니다.</p></div>
    </div>
    <div class="info-item">
      <button class="info-question">드레스 코드</button>
      <div class="info-answer"><p>편안한 복장으로 오시면 됩니다. 화이트 계열 의상은 피해주세요.</p></div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: `css/style.css`에 아코디언 스타일 추가**

```css
.info-list{
  display:flex;
  flex-direction:column;
  gap:1px;
  background:rgba(199,154,107,0.2);
}
.info-item{
  background:var(--color-bg-bottom);
}
.info-question{
  width:100%;
  text-align:left;
  background:transparent;
  border:none;
  color:var(--color-ink);
  font-size:14px;
  font-weight:600;
  padding:18px 4px;
  position:relative;
}
.info-question::after{
  content:'+';
  position:absolute;
  right:4px; top:16px;
  color:var(--color-accent);
  font-size:16px;
  transition:transform 0.2s ease;
}
.info-item.is-open .info-question::after{
  transform:rotate(45deg);
}
.info-answer{
  max-height:0;
  overflow:hidden;
  transition:max-height 0.25s ease;
}
.info-item.is-open .info-answer{
  max-height:200px;
}
.info-answer p{
  margin:0 4px 16px;
  font-size:13px;
  line-height:1.8;
  color:var(--color-muted);
}
```

- [ ] **Step 3: `js/main.js`에 `initAccordion()` 추가**

```javascript
  function initAccordion() {
    var items = document.querySelectorAll('.info-item');
    items.forEach(function (item) {
      var question = item.querySelector('.info-question');
      if (!question) return;
      question.addEventListener('click', function () {
        item.classList.toggle('is-open');
      });
    });
  }
```

`DOMContentLoaded` 리스너에 `initAccordion();` 호출 추가.

- [ ] **Step 4: 브라우저로 확인**

안내사항 섹션까지 스크롤. 4개 질문이 접혀 있다가 클릭하면 답변이 펼쳐지고 `+`가 회전하는지, 다시 클릭하면 접히는지 확인.

- [ ] **Step 5: 커밋**

```bash
git add index.html css/style.css js/main.js
git commit -m "feat: add info accordion section"
```

---

### Task 9: 마음 전하실 곳(계좌번호) 섹션

**Files:**
- Modify: `index.html` (`<!-- SECTION: account -->` 교체)
- Modify: `css/style.css`
- Modify: `js/main.js` (`initAccountToggle()` 추가)

**Interfaces:**
- Consumes: Task 7의 `.copy-btn`, `copyToClipboard()`, `initCopyButtons()` (계좌번호 복사 버튼도 같은 `.copy-btn` 클래스를 쓰므로 별도 바인딩 불필요 — `initCopyButtons()`가 페이지 전체의 `.copy-btn`을 한 번에 훑는다)
- Produces: `#account-list`의 `hidden` 속성을 `#account-toggle-btn` 클릭으로 토글.

- [ ] **Step 1: `index.html`에서 `<!-- SECTION: account -->`를 교체**

```html
<section id="account" class="section account">
  <p class="eyebrow">마음 전하실 곳</p>
  <p class="account-lead">참석이 어려우신 분들을 위해<br>계좌번호를 안내드립니다.</p>
  <button class="account-toggle" id="account-toggle-btn">계좌번호 보기</button>
  <div class="account-list" id="account-list" hidden>
    <div class="account-group">
      <p class="account-group-title">신랑측</p>
      <div class="account-row">
        <div>
          <p class="account-name">신랑 김현기</p>
          <p class="account-number">000은행 000-0000-0000</p>
        </div>
        <button class="copy-btn" data-copy="000-0000-0000">복사</button>
      </div>
    </div>
    <div class="account-group">
      <p class="account-group-title">신부측</p>
      <div class="account-row">
        <div>
          <p class="account-name">신부 김다솜</p>
          <p class="account-number">000은행 000-0000-0000</p>
        </div>
        <button class="copy-btn" data-copy="000-0000-0000">복사</button>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: `css/style.css`에 계좌 섹션 스타일 추가**

```css
.account{ text-align:center; }
.account-lead{
  font-size:13.5px;
  line-height:1.8;
  color:var(--color-muted);
  margin:0 0 24px;
}
.account-toggle{
  border:1px solid var(--color-accent);
  background:transparent;
  color:var(--color-accent);
  font-size:13px;
  padding:10px 24px;
  border-radius:999px;
}
.account-list{
  margin-top:24px;
  text-align:left;
  display:flex;
  flex-direction:column;
  gap:20px;
}
.account-group-title{
  font-size:11px;
  letter-spacing:0.2em;
  color:var(--color-accent);
  text-transform:uppercase;
  margin:0 0 10px;
}
.account-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  padding:14px 16px;
  border:1px solid rgba(199,154,107,0.2);
  border-radius:8px;
}
.account-name{
  font-size:13.5px;
  color:var(--color-ink-bright);
  margin:0 0 4px;
}
.account-number{
  font-size:12.5px;
  color:var(--color-muted);
  margin:0;
  font-variant-numeric:tabular-nums;
}
```

- [ ] **Step 3: `js/main.js`에 `initAccountToggle()` 추가**

```javascript
  function initAccountToggle() {
    var btn = document.getElementById('account-toggle-btn');
    var list = document.getElementById('account-list');
    if (!btn || !list) return;
    btn.addEventListener('click', function () {
      var isHidden = list.hidden;
      list.hidden = !isHidden;
      btn.textContent = isHidden ? '계좌번호 닫기' : '계좌번호 보기';
    });
  }
```

`DOMContentLoaded` 리스너에 `initAccountToggle();` 호출 추가.

- [ ] **Step 4: 브라우저로 확인**

계좌 섹션까지 스크롤. "계좌번호 보기"를 누르면 신랑측/신부측 계좌가 펼쳐지고 버튼 문구가 "계좌번호 닫기"로 바뀌는지, 각 행의 "복사" 버튼이 Task 7과 동일하게 동작하는지 확인.

- [ ] **Step 5: 커밋**

```bash
git add index.html css/style.css js/main.js
git commit -m "feat: add account info section"
```

---

### Task 10: 마무리(푸터) 섹션

**Files:**
- Modify: `index.html` (`<!-- SECTION: footer -->` 교체)
- Modify: `css/style.css`

**Interfaces:**
- Produces: `#kakao-share-btn` — 클릭 핸들러는 이번 범위에 포함하지 않음(스타일만). 실제 카카오 SDK 연동은 스펙의 "범위 밖" 항목.

- [ ] **Step 1: `index.html`에서 `<!-- SECTION: footer -->`를 교체**

```html
<footer id="footer" class="section footer">
  <p class="footer-thanks">
    저희 두 사람의 새로운 시작을<br>
    함께해 주셔서 감사합니다.
  </p>
  <button class="share-btn" id="kakao-share-btn">카카오톡으로 공유하기</button>
  <p class="footer-copyright">김현기 · 김다솜</p>
</footer>
```

- [ ] **Step 2: `css/style.css`에 푸터 스타일 추가**

```css
.footer{
  text-align:center;
  padding-bottom:64px;
}
.footer-thanks{
  font-family:var(--font-display);
  font-size:16px;
  line-height:1.8;
  color:var(--color-ink-bright);
  margin:0 0 28px;
}
.share-btn{
  background:var(--color-accent);
  color:var(--color-bg-bottom);
  border:none;
  font-size:13px;
  font-weight:600;
  padding:12px 28px;
  border-radius:999px;
}
.footer-copyright{
  margin-top:40px;
  font-size:11px;
  letter-spacing:0.1em;
  color:var(--color-muted);
}
```

- [ ] **Step 3: 브라우저로 확인**

페이지 맨 아래까지 스크롤. 감사 인사와 공유 버튼, copyright가 보이는지 확인. (버튼 클릭 시 아무 동작 없는 것이 정상 — 스타일만 구현)

- [ ] **Step 4: 커밋**

```bash
git add index.html css/style.css
git commit -m "feat: add footer section"
```

---

### Task 11: 전체 통합 점검 + README

**Files:**
- Create: `README.md`
- Modify: `css/style.css` (필요 시 섹션 간 여백/구분선 보정)

**Interfaces:**
- 이 태스크는 새 기능을 추가하지 않는다. 지금까지 만든 9개 섹션이 실제 모바일 화면에서 이어지는지 검증하고, 발견된 레이아웃 문제만 고친다.

- [ ] **Step 1: 모바일 뷰포트로 전체 스크롤 점검**

Claude_Browser `resize_window`를 `preset: "mobile"`로 설정한 뒤 `index.html`을 새로고침하고 맨 위부터 맨 아래까지 스크롤하며 `screenshot`을 여러 장 찍는다.
Expected: 어떤 섹션에서도 가로 스크롤(overflow-x)이 생기지 않아야 하고, 섹션 사이 여백이 고르게 이어져야 한다.

- [ ] **Step 2: 발견된 문제 수정**

`.section`류 클래스 padding/gap을 조정해 리듬을 맞춘다. (구체적 수정 내용은 Step 1에서 발견되는 실제 문제에 따라 달라지므로, 문제가 없으면 이 스텝은 스킵한다.)

- [ ] **Step 3: `README.md` 작성**

```markdown
# 김현기 · 김다솜 모바일 청첩장

2026. 12. 13. (일) 오후 6시, 삼성금융연수원

## 로컬에서 보기

`index.html`을 브라우저로 직접 열면 됩니다 (별도 서버/빌드 불필요).

## 샘플 콘텐츠 교체하기

- **사진**: `index.html`의 `#gallery` 안 `.gallery-item` 버튼을 실제 `<img>` 태그로 교체하세요.
- **영상**: `#video` 안 `.video-card`를 실제 `<video>` 태그 또는 유튜브 임베드로 교체하세요.
- **지도**: `#location` 안 `.map-placeholder`를 카카오맵/네이버지도 JS SDK 임베드로 교체하세요 (API 키 발급 필요).
- **계좌번호**: `#account` 안 `.account-row`의 은행명/계좌번호를 실제 정보로 교체하세요.

## 배포

GitHub Pages 사용: Settings → Pages → Branch: `main` / root.
```

- [ ] **Step 4: 커밋**

```bash
git add README.md css/style.css
git commit -m "docs: add README and finalize responsive spacing"
```

---

### Task 12: GitHub 리포지토리 생성 (private) 및 push

**Files:** 없음 (git/GitHub 조작만)

**Interfaces:** 없음 (마지막 태스크)

**결정 사항 (사용자 확인 완료):** 리포지토리 이름 `wedding-invitation`, 처음에는 **private**로 생성한다. GitHub 무료 개인 계정은 private 리포에서 GitHub Pages를 지원하지 않으므로, 실제 배포 시점에 public으로 전환한다 (아래 Task 13).

**중요:** 이 태스크는 원격 저장소를 만들고 코드를 push하는 작업이다 — private이라도 원격에 코드를 올리는 것은 되돌리기 번거로운 작업이므로, push 직전에 사용자에게 다시 한번 진행 여부를 확인한다.

- [ ] **Step 1: push 직전 최종 확인**

"`wedding-invitation` 이름으로 private 저장소를 만들고 지금까지 커밋한 내용을 push할게요, 진행할까요?"라고 확인받는다.

- [ ] **Step 2: (승인 후) GitHub 리포지토리 생성 및 push**

```bash
gh repo create wedding-invitation --private --source=. --remote=origin
git push -u origin master
```

- [ ] **Step 3: 확인**

```bash
gh repo view wedding-invitation --json visibility,url
```

Expected: `"visibility": "PRIVATE"`, push한 커밋들이 원격에 반영되어 있어야 한다.

---

### Task 13: Public 전환 + GitHub Pages 배포 (실제 공개 시점에 진행)

**Files:** 없음 (GitHub 설정 변경만)

**Interfaces:** 없음

**주의:** 이 태스크는 리포지토리를 공개로 전환하는, 되돌리기 어려운 작업이다 (한번 public이었던 히스토리는 fork 등으로 남을 수 있음). 실제 청첩장을 지인들에게 공유할 준비가 됐을 때만 실행하고, 실행 전 반드시 사용자에게 확인받는다. Task 12까지만 하고 이 태스크는 나중으로 미뤄도 된다.

- [ ] **Step 1: 사용자에게 public 전환 확인**

"이제 `wedding-invitation` 리포를 public으로 전환하고 GitHub Pages를 켤게요, 진행할까요?"라고 확인받는다.

- [ ] **Step 2: (승인 후) public 전환**

```bash
gh repo edit wedding-invitation --visibility public --accept-visibility-change-consequences
```

- [ ] **Step 3: GitHub Pages 활성화**

```bash
gh api repos/{owner}/wedding-invitation/pages -X POST -f "source[branch]=master" -f "source[path]=/"
```

(`{owner}`는 실제 GitHub 계정명으로 바꿔서 실행한다. 이미 Pages가 활성화되어 있다면 이 스텝은 건너뛴다.)

- [ ] **Step 4: 배포 확인**

Pages가 활성화되면 `https://<github-id>.github.io/wedding-invitation/` 형태의 URL이 생긴다 (반영까지 1~2분 소요될 수 있음). Claude_Browser로 접속해 실제 배포된 페이지가 로컬과 동일하게 보이는지 확인한다.
