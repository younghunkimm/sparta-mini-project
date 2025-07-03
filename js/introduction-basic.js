// Firebase SDK 라이브러리 가져오기                    
import { db } from "../js/firebase-config.js"; 
import {
    collection, addDoc, doc,
    getDoc, setDoc, getDocs
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


//페이지의 DOM 요소들이 모두 준비되었을 때 안의 코드를 실행
window.addEventListener("DOMContentLoaded", async () => { 
    //팔로워 수 처리
    const followers_value = document.getElementById("followers");
    const btn = document.getElementById("following");
    const followerDocRef = doc(db, "miniprojects", "followers_count"); //Firebase의 miniprojects 컬렉션 안의 "followers_count" 문서를 가리킨다

    let followerCount = 500;//팔로워 수 초기값
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


// 게시물 렌더링 및 카운트
    const posting_value = document.getElementById("posting_val");
    const querySnapshot = await getDocs(collection(db, "miniprojects"));
    let postCount = 0;

    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const { image, title, comment } = data;

        //undefined 걸러내!!!!!
        if (!image || !title || !comment) return;

        postCount++;

        let temp_html = `
            <div class="col">
                <div class="card h-100">
                    <img src="${image}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${comment}</p>
                    </div>
                </div>
            </div>`;
        $('#card').append(temp_html);
    });

    posting_value.textContent = postCount;
});


// 게시물 등록
$("#postingbtn").click(async function () {
    let image = $('#image').val();
    let title = $('#title').val();
    let comment = $('#comment').val();
    //필드 입력칸 유효성 검사
    if (!image || !title || !comment) {
        alert("모든 필드를 입력해주세요.");
        return;
    }

    let postData = { image, title, comment };
    await addDoc(collection(db, "miniprojects"), postData);

    alert('저장 완료!');
    window.location.reload(); // 등록 후 새로고침하면 게시물 수와 카드 자동 반영
});

// 업로드 폼 토글
$("#savebtn").click(() => {
    $('#postingbox').toggle();
});