import { db, storage } from "../js/firebase-config.js";

import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  getDocs,
  doc,
  getDoc,
  orderBy,
  query,
  collectionGroup,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

$("#openUploadModal").click(function () {
  console.log("UPLOAD 모달 열기");
  $("#uploadModal").css("display", "flex");
});

$(".close").click(function () {
  $("#uploadModal").css("display", "none");
});

async function uploadPost(name, gitAddress, content) {
  const file = $("#imageFiles")[0].files[0]; // ✅ jQuery → DOM 변환

  if (!file) {
    alert("이미지를 선택해주세요!");
    return;
  }

  try {
    // 파일이 있다면 Firebase Storage에 업로드
    const storageRef = ref(
      storage,
      `profiles/${name}/${Date.now()}_${file.name}`
    );
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);

    await addDoc(collection(db, "profiles", name, "user_profile"), {
      // 각각 담은 변수를 컬렉션 필드에 title, comment, image에 각각 넣어주세요.
      name: name,
      gitAddress: gitAddress,
      timestamp: new Date(),
      profileImage: url,
      content: content,
    });

    alert("팀원 추가!!");
    window.location.reload();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// 데이터 추가
$("#postingbtn").click(function () {
  let name = $("#name").val();
  let gitAddress = $("#git-address").val();
  let content = $("#content").val();
  // const name = getQueryParam("name");

  uploadPost(name, gitAddress, content);

  console.log(name, " ", gitAddress, " ", content);
});

// 특정 작성자의 모든 게시글 가져오기 => 최신 순
async function getPosts(name) {
  const querySnapshot = await getDocs(collectionGroup(db, "user_profile"));

  const profiles = [];
  querySnapshot.forEach((doc) => {
        let name = doc.data().name;
        let profileImage = doc.data().profileImage;
        console.log(doc.id, "=>", name, " : ", profileImage);
  });
}

$(document).ready(async function () {
  getPosts();
});
