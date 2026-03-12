import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

export interface ContactSubmission {
  id?: string;
  contactType: 'support' | 'partnerships' | 'general' | 'press';
  name: string;
  email: string;
  subject: string;
  // Support specific
  urgency?: string;
  platform?: string;
  description?: string;
  attachments?: string[];
  // Partnerships specific
  company?: string;
  role?: string;
  useCase?: string;
  timeline?: string;
  // General inquiries specific
  inquiryType?: string;
  message?: string;
  // Press & media specific
  outlet?: string;
  deadline?: string;
  requestType?: string;
  details?: string;
  // Metadata
  submittedAt?: Date;
  status?: 'new' | 'in-progress' | 'resolved';
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Upload attachment to Firebase Storage
 * @param file - The file to upload
 * @param submissionId - The submission ID
 * @returns The download URL of the uploaded file
 */
export async function uploadAttachment(
  file: File,
  submissionId: string
): Promise<string> {
  try {
    const timestamp = Date.now();
    const filename = `${submissionId}_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storageRef = ref(storage, `contact-attachments/${filename}`);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading attachment:', error);
    throw new Error('Failed to upload attachment');
  }
}

/**
 * Submit a contact form
 * @param submission - The contact submission data
 * @returns The ID of the created submission
 */
export async function submitContactForm(submission: ContactSubmission): Promise<string> {
  try {
    const contactsRef = collection(db, 'contacts');
    const newContactRef = doc(contactsRef);
    const contactId = newContactRef.id;

    // Determine priority based on contact type and urgency
    let priority: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    if (submission.contactType === 'support') {
      switch (submission.urgency) {
        case 'Low - General question':
          priority = 'low';
          break;
        case 'Medium - Feature not working':
          priority = 'medium';
          break;
        case 'High - Cannot access platform':
          priority = 'high';
          break;
        case 'Critical - Platform down':
          priority = 'critical';
          break;
      }
    } else if (submission.contactType === 'press') {
      priority = 'high';
    }

    const contactData = {
      ...submission,
      id: contactId,
      submittedAt: serverTimestamp(),
      status: 'new',
      priority,
    };

    await setDoc(newContactRef, contactData);
    return contactId;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw new Error('Failed to submit contact form');
  }
}