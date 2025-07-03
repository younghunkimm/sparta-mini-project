//만든이 한정식a
// Firebase SDK 라이브러리 가져오기
import { db } from "../js/firebase-config.js";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
//페이지의 DOM 요소들이 모두 준비되었을 때 안의 코드를 실행
window.addEventListener("DOMContentLoaded", async () => {
  //팔로워 수 처리
  const followers_value = document.getElementById("followers");
  const btn = document.getElementById("following");
  const followerDocRef = doc(db, "followers", "followers_count"); //Firebase의 followers 컬렉션 안의 "followers_count" 문서를 가리킨다
  let followerCount = 500; //팔로워 수 초기값
  //firebase에서 현재 팔로워 수를 불러와서 currentCount에 저장하고 웹 화면에도 표시
  const followerSnap = await getDoc(followerDocRef);
  if (followerSnap.exists()) {
    const data = followerSnap.data();
    followerCount = data.followers ?? 500; // 필드가 없을 수도 있으니 ?? 연산자 사용
  } else {
    // 문서가 없으면 새로 생성 (최초 1회)
    await setDoc(followerDocRef, { followers: followerCount });
    console.log("팔로워 수 문서 새로 생성 완료");
  }
  followers_value.textContent = followerCount;
  btn.addEventListener("click", async () => {
    followerCount++;
    followers_value.textContent = followerCount;
    try {
      await setDoc(followerDocRef, { followers: followerCount }); //firebase에도 증가한 수를 저장(setDoc)
      console.log("저장 성공");
    } catch (e) {
      console.error("저장 실패:", e);
    }
  });

  // 게시물 불러오기 함수
  async function loadUserPosts(author) {
    const q = query(
      collection(db, "posts", author, "user_posts"),
      orderBy("timestamp", "desc")
    );
    const snapshot = await getDocs(q);
    let postCount = 0;
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const { mainImageUrl, content } = data;
      if (!mainImageUrl || !content) return;
      postCount++;
      const temp_html = `
      <div class="col">
        <div class="card h-100">
          <img src="${mainImageUrl}" class="card-img-top" alt="게시물 이미지">
          <div class="card-body">
            <p class="card-text">${content}</p>
          </div>
        </div>
      </div>`;
      $("#card").append(temp_html);
    });
    document.getElementById("posting_val").textContent = postCount;
  }
});

// 파라미터 가져오기
function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

export async function getProfile(name) {
  const querySnapshot = await getDocs(
    collection(db, "profiles", name, "user_profile")
  );

  const names = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const name = doc.data().name;
    const gitAddress = doc.data().gitAddress;
    const profileImage = doc.data().profileImage;
    const content = doc.data().content;

    console.log(name, " ", gitAddress, " ", profileImage);
    // 🔽 HTML에 반영
    $("#profile-name").text(name);
    $("#github-link").attr("href", gitAddress);
    $("#profile-image").attr("src", profileImage);
    $("#profile-content").text(content);
    if (data.name) {
      names.push(data.name); // ✅ name 필드만 추출
    }
  });

  console.log(names); // ["정서영", "김동현", ...]
}

$(document).ready(async function () {
  const name = getQueryParam("name");
  getProfile(name);
});

// 게시물 렌더링 및 카운트 보류
//     const posting_value = document.getElementById("posting_val");
//     const querySnapshot = await getDocs(collection(db, "miniprojects"));
//     let postCount = 0;
//     querySnapshot.forEach((docSnap) => {
//         const data = docSnap.data();
//         const { image, title, comment } = data;
//         //undefined 걸러내!!!!!
//         if (!image || !title || !comment) return;
//         postCount++;
//         let temp_html = `
//             <div class="col">
//                 <div class="card h-100">
//                     <img src="${image}" class="card-img-top" alt="...">
//                     <div class="card-body">
//                         <h5 class="card-title">${title}</h5>
//                         <p class="card-text">${comment}</p>
//                     </div>
//                 </div>
//             </div>`;
//         $('#card').append(temp_html);
//     });
//     posting_value.textContent = postCount;
// });
// // 게시물 등록
// $("#postingbtn").click(async function () {
//     let image = $('#image').val();
//     let title = $('#title').val();
//     let comment = $('#comment').val();
//     //필드 입력칸 유효성 검사
//     if (!image || !title || !comment) {
//         alert("모든 필드를 입력해주세요.");
//         return;
//     }
//     let postData = { image, title, comment };
//     await addDoc(collection(db, "miniprojects"), postData);
//     alert('저장 완료!');
//     window.location.reload(); // 등록 후 새로고침하면 게시물 수와 카드 자동 반영
// });
// // 업로드 폼 토글
// $("#savebtn").click(() => {
//     $('#postingbox').toggle();
// });
//메이페이지에서 사진 클릭했을시 각각의 상세페이지로 기능 보류
// const params = new URLSearchParams(window.location.search); // ?member=김동현 같은 쿼리스트링을 URLSearchParams가 꺼내줌
// const member = decodeURIComponent(params.get("member")); // 이름이 %EA%B9%으로 된걸 한글 인코딩 처리
// const members = {
//   "김동현": {
//     membername: "김 동 현",
//     intro: "안녕하세요 개발자를 꿈꾸는 김동현입니다.",
//     profileImg: "../images/caicedo.jpg",
//     git_adress: "https://github.com/hanjsnote"
//   },
//   "원세영": {
//     membername: "원 세 영",
//     intro: "안녕하세요 개발자를 꿈꾸는 원세영입니다.",
//     profileImg: "../images/captain.webp",
//     git_adress: "https://github.com/hanjsnote"
//   },
//   "김영훈": {
//     membername: "김 영 훈",
//     intro: "안녕하세요 개발자를 꿈꾸는 김영훈입니다.",
//     profileImg: "../images/cucurella.avif",
//     git_adress: "https://github.com/hanjsnote"
//   },
//   "정서영": {
//     membername: "정 서 영",
//     intro: "안녕하세요 개발자를 꿈꾸는 정서영입니다.",
//     profileImg: "../images/enzo.jpeg",
//     git_adress: "https://github.com/hanjsnote"
//   },
//   "한정식": {
//     membername: "한 정 식",
//     intro: "안녕하세요 개발자를 꿈꾸는 한정식입니다.",
//     profileImg: "../images/neto.webp",
//     git_adress: "https://www.naver.com"
//   }
// };
// // members에 있는 데이터로 introduction-basic의 HTML 요소를 동적으로 채움
// const data = members[member];
// if (data) {
//   console.log("멤버 데이터 불러옴:", data);
//   document.querySelector(".username").textContent = data.membername;
//   document.querySelector(".self_introduction").textContent = data.intro;
//   document.querySelector(".profile-image").src = data.profileImg;
//   document.querySelector(".git-button").href = data.git_adress;
// } else {
//   console.warn("해당 멤버를 찾을 수 없습니다:", member);
// }
