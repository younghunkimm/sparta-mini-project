import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  getDocs,
  doc,
  setDoc,
  getDoc,
  orderBy,
  query,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytes,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXLowFr8AzZ4j4o91jtKGCYrrSgvlnwYc",
  authDomain: "food-fighter-be5cf.firebaseapp.com",
  projectId: "food-fighter-be5cf",
  storageBucket: "food-fighter-be5cf.firebasestorage.app",
  messagingSenderId: "408895238916",
  appId: "1:408895238916:web:767adba1bfd56aeada5651",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

$(document).ready(async function () {
  console.log("준비");
  // 모달 열기
  $("#openModal").click(function () {
    console.log("POST 모달 열기");
    $("#postModal").css("display", "flex");

    initializeSlider();
  });

  // 닫기 버튼 클릭 시 모달 닫기
  $(".close").click(function () {
    $("#postModal").css("display", "none");
  });
});

$(document).ready(async function () {
  console.log("준비");
  // 모달 열기
  $("#openUploadModal").click(function () {
    console.log("UPLOAD 모달 열기");
    $("#uploadModal").css("display", "flex");
  });

  // 닫기 버튼 클릭 시 모달 닫기
  $(".close").click(function () {
    $("#uploadModal").css("display", "none");
  });
});

// 포스팅 글 업로드 + 사진 n 장
async function uploadPost(title, content, author) {
  const files = $("#imageFiles")[0].files; // ✅ jQuery → DOM 변환
  const imageUrls = [];

  console.log(files);

  // 파일이 있다면 Firebase Storage에 업로드
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const storageRef = ref(storage, `posts/원세영/${Date.now()}_${file.name}`);

    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);

    imageUrls.push(url); // URL을 배열에 저장
  }

  try {
    const postId = "123456";
    const postRef = doc(db, "posts", author, "user_posts", postId);

    // const docRef = await addDoc(collection(db, "posts", author, "user_posts", postId), {
    await setDoc(postRef, {
      // 각각 담은 변수를 컬렉션 필드에 title, comment, image에 각각 넣어주세요.
      title: title,
      content: content,
      author: author,
      timestamp: new Date(),
      mainImageUrl: imageUrls[0],
      imageUrls: imageUrls,
    });

    alert("포스팅 추가!!");
    window.location.reload();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// 데이터 추가
$("#postingbtn").click(function () {
  let title = $("#title").val();
  let content = $("#content").val();
  let home = "원세영";

  uploadPost(title, content, home);
});

// 특정 작성자의 모든 게시글 가져오기 => 최신 순
//async function getPostsByAuthor(author) {
async function getPosts() {
  const q = query(
    collection(db, "posts", "원세영", "user_posts"),
    orderBy("timestamp", "desc")
  );

  const allPost = await getDocs(q);

  allPost.forEach((doc) => {
    let title = doc.data().title;
    let content = doc.data().content;
    let author = doc.data().author;
    //console.log(doc.id, "=>", doc.data());
    console.log(doc.id, "=>", author, " ", title, " ", content);
  });
}

//}

// 특정 게시글(postID) 하나만 가져오기
async function getPost(postId) {
  console.log("포스팅 가져오기");

  const docRef = doc(db, "posts", "원세영", "user_posts", postId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log("Post Data:", docSnap.data());

    // 1. 이미지 슬라이드 삽입
    const slidesContainer = $(".content");
    slidesContainer.empty(); // 기존 이미지 제거
    data.imageUrls.forEach((url) => {
      const slide = `<div class="slides">
                        <img src="${url}" alt="포스트 이미지">
                     </div>`;
      slidesContainer.append(slide);
    });

    // 3. 본문 텍스트
    $(".post-text").html(data.content.replace(/\n/g, "<br>"));

    // 5. 점(dot)도 다시 생성
    const dotsContainer = $("#dotsContainer");
    dotsContainer.empty();
    for (let i = 0; i < data.imageUrls.length; i++) {
      const activeClass = i === 0 ? "active" : "";
      dotsContainer.append(
        `<span class="dot ${activeClass}" onclick="goToSlide(${i})"></span>`
      );
    }
  } else {
    console.log("No such document!");
  }
}

// 이미지
function initializeSlider(postId) {

  getPost(postId).then(() => {
    // 슬라이드 초기화
    let currentIndex = 0; // 현재 슬라이드 인덱스
    const slideWidth = $(".content-wrapper").width();

    function updateSlide(index) {
      $(".content").css("transform", `translateX(-${index * slideWidth}px)`); // 슬라이드 이동
      $(".dot").removeClass("active"); // 모든 점에서 active 제거
      $(".dot").eq(index).addClass("active"); // 현재 슬라이드의 점만 활성화
    }

    const totalSlides = $(".slides").length; // 전체 슬라이드 개수
    const contentWidth = totalSlides * 100;

    $(".content").css("width", "${contentWidth}%");
    $(".content").css("transform", "translateX(-100px)");
    console.log(currentIndex, " ", totalSlides, " ", slideWidth);

    // 오른쪽 버튼
    $(".right").click(function () {
      console.log("오른쪽");
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlide(currentIndex);
    });

    // 왼쪽 버튼
    $(".left").click(function () {
      console.log("왼쪽");
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlide(currentIndex);
    });

    // 점클릭 시 해당 슬라이드로 이동
    $(".dot").click(function () {
      currentIndex = $(this).index();
      updateSlide(currentIndex);
    });

    // 초기 슬라이드 설정
    updateSlide(currentIndex);
  });
}