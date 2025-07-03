import { db, storage } from "../js/firebase-config.js";

import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  getDocs,
  collectionGroup,
  doc,
  getDoc,
  orderBy,
  query,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

import {
    registerComment,
    loadComments,
    updateLike,
    fetchCount,
} from "./comments.js";

$(document).ready(async function () {
  const name = getQueryParam("name");
  getPosts(name);
});

$(document).ready(async function () {
  // console.log("준비");
  // // 모달 열기
  // $("#openModal").click(function () {
  //   console.log("POST 모달 열기");
  //   $("#postModal").css("display", "flex");

  //   // initializeSlider("123456");
  // });

  // 닫기 버튼 클릭 시 모달 닫기
  $(".close").click(function () {
    console.log("POST 모달 닫기");
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

// 데이터 추가
$("#postingbtn").click(function () {
  let content = $("#content").val();
  const name = getQueryParam("name");

  uploadPost(content, name);
});

// 파라미터 가져오기
function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

// 포스팅 글 업로드 + 사진 n 장
async function uploadPost(content, author) {
  const files = $("#imageFiles")[0].files; // ✅ jQuery → DOM 변환
  const imageUrls = [];

  console.log(files);

  try {
    // 파일이 있다면 Firebase Storage에 업로드
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storageRef = ref(
        storage,
        `posts/${author}/${Date.now()}_${file.name}`
      );
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);

      imageUrls.push(url); // URL을 배열에 저장
    }

    await addDoc(collection(db, "posts", author, "user_posts"), {
      // 각각 담은 변수를 컬렉션 필드에 title, comment, image에 각각 넣어주세요.
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

// 특정 작성자의 모든 게시글 가져오기 => 최신 순
async function getPosts(name) {
  const q = query(
    collection(db, "posts", name, "user_posts"),
    orderBy("timestamp", "desc")
  );

  const allPost = await getDocs(q);

  allPost.forEach((doc) => {
    let content = doc.data().content;
    let author = doc.data().author;

    let id = doc.id;
    let name = getQueryParam("name");
    let mainImageUrl = doc.data().mainImageUrl;

    const $postingList = $("#postingList");
    const tempHtml = `
        <div class="posting-image" data-id="${id}" data-name="${name}">
            <img src="${mainImageUrl}" alt="">
        </div>
    `;
    $postingList.append(tempHtml);
    // console.log(doc.data());
    //console.log(doc.id, "=>", doc.data());
    // console.log(doc.id, "=>", author, " ", content);
  });
}

$(document).on('click', '.posting-image', async function() {
    let $this = $(this);
    const $commentList = $("#commentList");

    const name = String($this.data().name);
    const id = String($this.data().id);

    await getPost(name, id);
  await initializeSlider(name, id);
  await getProfile(name);

    $commentList.empty(); // 댓글 목록 초기화
    loadComments(id, (row) => {
        const id = row.id || "";
        const target = row.targetId || "main";
        const comment = row.comment;
        const like = row.like ?? 0;

        const tempHtml = `<li data-id="${id}" data-target="${target}">
                    <p class="comment">${comment}</p>
                        <button type="button" class="commentLikeBtn rounded-circle btn btn-outline-dark">
                            <span class="heart">${like >= 1 ? "❤" : "♡"}</span>
                            <span class="count">${like}</span>
                        </button>
                </li>`;
        $commentList.append(tempHtml);
    })
});

async function getProfile(name) {
  const querySnapshot = await getDocs(
    collection(db, "profiles", name, "user_profile")
  );

  querySnapshot.forEach((doc) => {
    const name = doc.data().name;
    const profileImage = doc.data().profileImage;

    console.log("프로필 : ", name, " ", profileImage);
    // 🔽 HTML에 반영
    $("#posting-name").text(name);
    $("#posting-profile-image").attr("src", profileImage);
  });
}

// 특정 게시글(postID) 하나만 가져오기
async function getPost(name, postId) {
  console.log("포스팅 가져오기");

  const docRef = doc(db, "posts", name, "user_posts", postId);
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
    $("#postModal").css("display", "flex");
    
    // 5. 점(dot)도 다시 생성
    const dotsContainer = $("#dotsContainer");
    dotsContainer.empty();
    for (let i = 0; i < data.imageUrls.length; i++) {
      const activeClass = i === 0 ? "active" : "";
      dotsContainer.append(
        `<span class="dot ${activeClass}" onclick="goToSlide(${i})"></span>`
      );
    }

    $('#postModal').data('id', postId).show();
  } else {
    console.log("No such document!");
  }
}

// 이미지
async function initializeSlider(name, postId) {
  console.log("TEST", postId)
  getPost(name, postId).then(() => {
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
