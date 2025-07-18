# Return-Dream

내일배움캠프에서 진행한 첫 미니 팀 프로젝트 **Return Dream**을 소개합니다.   
본 프로젝트는 메인 페이지(댓글 기능 포함), 자기소개 페이지, 개별 포스팅 페이지로 구성되어 있으며, 총 3개의 주요 화면으로 이루어져 있습니다.   
   
프론트엔드는 HTML, CSS, Bootstrap을 활용해 디자인하였고,   
Firebase, JavaScript, jQuery를 이용해 데이터의 실시간 반영과 동적 관리를 구현하여 사용자와의 상호작용을 강화하였습니다.   
   
저는 이 프로젝트에서 댓글 기능 API 개발을 맡아 구현하였으며, 사용자 입력을 실시간으로 저장하고 반영하는 기능을 중심으로 작업을 진행했습니다.

## 📚 사용한 기술

#### Front-End
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![JavasSript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![JQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jQuery&logoColor=white)

#### DB
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)

## 💡 **구현 기능**

### 1️⃣ 메인 페이지

#### ✔️ 조회

- 팀원 조회
- 댓글 조회
- 댓글 하트 조회

#### ✔️ 추가

- 팀원 추가
    - 이름, 깃 주소, 프로필 이미지, 자기 소개
- 댓글 입력 시 댓글 추가
- 각 댓글 마다 하트UP 기능

### 2️⃣ **자기소개 페이지**

#### ✔️ 조회

- 개별 팀원 정보 조회
    - 이름, 깃 주소, 프로필 이미지, 자기 소개

#### ✔️ 추가

- 팔로워 UP 기능
- 팀원 하트 UP 기능
- 포스팅 업로드 기능
- 포스팅 내용, 이미지 n장

### 3️⃣ **포스팅 페이지**

#### ✔️ 조회

- 개별 포스팅 조회
    - 포스팅 내용, 이미지, 유저 이름, 유저 프로필
- 포스팅 댓글 조회

#### ✔️ 추가

- 포스팅 댓글 추가

## 🗃 DB 구조

#### 1️⃣ 댓글

```bash
comments
└── main                ← 문서 (예: 게시판 구분자 등)
    └── main-comments   ← 서브컬렉션
        └── [commentId] ← 댓글 데이터
└── posts
    └── main-comments
        └── [commentId] ← 댓글 데이터
```

#### 2️⃣ 좋아요

```bash
like
└── [likeId]
    └── count
```

#### 3️⃣ 포스팅

```bash
posts
└── [user_name]
    └── user_posts
        └── [postId]
```

#### 4️⃣ 팔로워

```bash
followers
└── followers_count
    └── followers
```

#### 4️⃣ 프로필

```bash
profiles
└── [user_name]
    └── user_profiles
        └── [postId]
```
