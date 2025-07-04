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
  // const followerDocRef = doc(db, "followers", "followers_count"); //Firebase의 followers 컬렉션 안의 "followers_count" 문서를 가리킨다
  const targetUser = getQueryParam("name");
  const followerDocRef = doc(db, "followers", targetUser);  //멤버 개개인별로 팔로워 카운팅되게 수정
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