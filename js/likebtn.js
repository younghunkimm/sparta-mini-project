// likebtn.js

import { db } from "../js/firebase-config.js"; 

// Firebase SDK 가져오기
import {
    doc, getDoc, setDoc, updateDoc, increment, onSnapshot
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

export async function subscribeCount(targetKey = "LIKECOUNT") {
    const likeDocRef = doc(db, "LIKE", targetKey);

    const docSnap = await getDoc(likeDocRef);
    if (!docSnap.exists()) {
        await setDoc(likeDocRef, { count: 0 });
    }

    onSnapshot(likeDocRef, (docSnap) => {
        const count = docSnap.data().count ?? 0;
        document.getElementById("count").textContent = count;
        document.getElementById("heart").textContent = count >= 1 ? "❤" : "♡";
    });
}

export async function updateLike(targetKey = "LIKECOUNT") {
    const likeDocRef = doc(db, "LIKE", targetKey);
    const docSnap = await getDoc(likeDocRef);

    if (!docSnap.exists()) {
        await setDoc(likeDocRef, { count: 1 });
        return;
    }

    await updateDoc(likeDocRef, {
        count: increment(1)
    });
}