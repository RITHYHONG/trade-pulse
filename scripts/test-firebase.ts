import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, limit } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
    try {
        const postsRef = collection(db, "posts");
        const q = query(
            postsRef,
            where("slug", "==", "prediction-markets-iran-war-bets-ethical-market-impact"),
            where("isDraft", "==", false),
            limit(1)
        );
        const snap = await getDocs(q);
        if (snap.empty) {
            console.log("No doc found!");
        } else {
            console.log(snap.docs[0].data());
        }
    } catch (e) {
        console.error(e);
    }
}

test();
