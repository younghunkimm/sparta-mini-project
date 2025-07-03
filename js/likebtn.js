// likebtn.js

import { db } from "../js/firebase-config.js"; 

// Firebase SDK 가져오기
import {
    doc, getDoc, updateDoc, increment, setDoc
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


// 좋아요 수 불러오기
export async function fetchCount(targetKey = "LIKECOUNT") {
    const likeDocRef = doc(db, "LIKE", targetKey);
    const docSnap = await getDoc(likeDocRef);

    if (!docSnap.exists()) {
        await setDoc(likeDocRef, { count: 0 });
        document.getElementById("count").textContent = 0;
        document.getElementById("heart").textContent = "♡";
        return;
    }

    const count = docSnap.data().count ?? 0;
    document.getElementById("count").textContent = count;
    document.getElementById("heart").textContent = count >= 1 ? "❤" : "♡";
}

// 좋아요 +1
export async function updateLike(targetKey = "LIKECOUNT") {
    const likeDocRef = doc(db, "LIKE", targetKey);
    await updateDoc(likeDocRef, {
        count: increment(1)
    });

    fetchCount(targetKey);
}