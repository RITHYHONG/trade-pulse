import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Test Firestore connection
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const testDocRef = doc(db, 'test', 'connection');
    await setDoc(testDocRef, {
      timestamp: new Date(),
      message: 'Firestore connection test',
    });

    const testDoc = await getDoc(testDocRef);
    return testDoc.exists();
  } catch (error) {
    console.error('Firestore connection test failed:', error);
    return false;
  }
}