import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // 1. Validate payload
    if (!payload.ticker || !payload.signal) {
      return Response.json({ status: 'error', message: 'Invalid payload' }, { status: 400 });
    }

    // 2. Save to Firestore 'alerts' collection
    const alertRef = await addDoc(collection(db, "alerts"), {
      ...payload,
      createdAt: serverTimestamp(),
      read: false,
      source: 'TradingView'
    });

    console.log(`Alert saved: ${alertRef.id} for ${payload.ticker}`);

    return Response.json({ status: 'ok', id: alertRef.id });
  } catch (error) {
    console.error("Webhook Error:", error);
    return Response.json({ status: 'error', message: 'Internal server error' }, { status: 500 });
  }
}