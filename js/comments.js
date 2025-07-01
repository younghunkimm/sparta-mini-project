// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
    getFirestore,
    collection,
    doc,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    setDoc,
    serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


// Firebase 구성 정보 설정
const firebaseConfig = {
    apiKey: "AIzaSyDkSPoHu7URW0Ipcsq8glFhF_KwezH-75M",
    authDomain: "sparta-1b688.firebaseapp.com",
    projectId: "sparta-1b688",
    storageBucket: "sparta-1b688.firebasestorage.app",
    messagingSenderId: "318584876979",
    appId: "1:318584876979:web:5a423ccefcc6cf3891e5c6",
    measurementId: "G-YSCBS9BEGL"
};


// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



// 파라미터 가져오기
// 현재는 임시로 파라미터로 처리
// 추후 개인 게시물의 키값으로 변경예정
function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
}

const key = getQueryParam('key');
const targetId = key || "main";

console.log("targetId: ", targetId);



// 댓글 등록
export async function registerComment(commentText) {
    const docData = {
        targetId,
        comment: commentText,
        createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, "comments"), docData);

    // 생성된 문서 ID
    const newId = docRef.id;

    // ID 필드 추가
    await setDoc(doc(db, "comments", newId), {
        id: newId,
        ...docData
    })
}


// 댓글 가져오기
export async function loadComments(callback) {
    const q = query(
        collection(db, "comments"),
        where("targetId", "==", targetId),
        orderBy("createdAt", "asc")
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