// Firebase SDK 라이브러리 가져오기
import { db } from "../js/firebase-config.js"; 

import {
    collection,
    doc,
    addDoc,
    getDoc,
    updateDoc,
    increment,
    query,
    where,
    orderBy,
    getDocs,
    setDoc,
    serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";



/**
 * Firestore에 댓글을 등록하는 함수입니다.
 *
 * @function registerComment
 * @param {string} commentText - 등록할 댓글의 텍스트입니다.
 * 
 * - `collection`: Firestore에서 컬렉션을 참조하는 함수
 * 
 * - `doc`: Firestore에서 문서 참조를 만드는 함수
 *          이 때, doc() 에 ID를 지정하지 않으면 Firestore가 자동으로 ID를 생성합니다.
 * 
 * - `setDoc(경로, 객체)`: 참조하는 문서에 데이터를 저장
 *                       해당 경로에 문서가 없으면 새로 생성하고, 있으면 덮어쓰기
 */
export async function registerComment(targetId, commentText) {
    const target = targetId === "main" ? "main" : "posts";
    const newDocRef = doc(collection(db, "comments", target, `${target}-comments`)); // 자동 ID 생성
    const newId = newDocRef.id; // 생성된 문서 ID

    const docData = {
        id: newId, // 문서 안에 ID 포함
        ...(targetId === "main" ? {} : { targetId }), // main이 아닌 경우에만 targetId 포함
        comment: commentText,
        createdAt: serverTimestamp()
    };

    await setDoc(newDocRef, docData); // ID 포함해서 저장
}


// 댓글 가져오기
export async function loadComments(targetId, callback) {
    const target = targetId === "main" ? "main" : "posts";
    const conditions = [];

    // orderBy 추가
    conditions.push(orderBy("createdAt", "asc"));

    // targetId 가 main이 아닌 경우에만 조건 추가
    if (targetId !== "main") {
        conditions.push(where("targetId", "==", targetId));
    }


    const q = query(
        collection(db, "comments", target, `${target}-comments`),
        ...conditions
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
        callback(doc.data());
    });
}


// Input Enter Event
$('#commentInput').keypress(function (e) {
    if (e.which === 13) { // 13은 Enter 키 코드
        e.preventDefault();
        $('#commentButton').click();
    }
});

// 좋아요 수 불러오기
export async function fetchCount(commentTarget, commentId) {
    const commentDocRef = doc(db, "comments", commentTarget, `${commentTarget}-comments`, commentId);
    const docSnap = await getDoc(commentDocRef);

    if (!docSnap.exists()) {
        console.log("No such comment!");
        $(`#commentList li[data-id='${commentId}']`).find('.count').text(0);
        $(`#commentList li[data-id='${commentId}']`).find('.heart').text("♡");
        return;
    }

    const count = docSnap.data().like ?? 0;
    $(`#commentList li[data-id='${commentId}']`).find('.count').text(count);
    $(`#commentList li[data-id='${commentId}']`).find('.heart').text(count >= 1 ? "❤" : "♡");
}

// 버튼 클릭시 좋아요 증가
export async function updateLike(commentTarget, commentId) {
    const commentDocRef = doc(db, "comments", commentTarget, `${commentTarget}-comments`, commentId);
    await updateDoc(commentDocRef, {
        like: increment(1)
    });
    fetchCount(commentTarget, commentId);
}

// 이벤트
$(document).on("click", ".commentLikeBtn", async function () {
    const $this = $(this);
    const commentId = $this.closest('li').data("id");
    const commentTarget = $this.closest('li').data("target");

    await updateLike(commentTarget, commentId);
});