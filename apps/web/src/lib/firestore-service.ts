import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  DocumentReference,
  DocumentSnapshot,
  Timestamp,
  FieldValue,
} from "firebase/firestore";
import {
  User as FirebaseUser,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db, auth, storage } from "./firebase";
import { retryFirebase } from "./retry";
import { mapToAppError, logError } from "./error";
import { UserRole } from "./user-role-helper";

// User profile interface for Firestore
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  bio?: string;
  photoURL?: string;
  editorRequest?: {
    status: 'none' | 'pending' | 'approved' | 'denied';
    reason?: string;
    requestedAt?: Timestamp | Date;
    handledBy?: string;
    handledAt?: Timestamp | Date;
  };
  preferences?: {
    theme?: "light" | "dark" | "system";
    language?: string;
    timezone?: string;
    currency?: string;
    notifications?: {
      email?: boolean;
      tradeAlerts?: boolean;
      weeklyUpdates?: boolean;
      securityAlerts?: boolean;
    };
    compactMode?: boolean;
    animations?: boolean;
  };
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
}

// Get user profile from Firestore
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    console.log("Attempting to get user profile for uid:", uid);

    const result = await retryFirebase(async () => {
      // Directly fetch the user document by UID. Do not rely on auth.currentUser here
      // because callers (server API routes or clients) may pass a UID when the
      // Firebase auth client hasn't fully populated auth.currentUser yet.
      const userDocRef: DocumentReference = doc(db, "users", uid);
      const userDoc: DocumentSnapshot = await getDoc(userDocRef);
      return userDoc;
    });

    if (result.exists()) {
      console.log("User profile found:", result.data());
      return result.data() as UserProfile;
    }
    console.log("User profile does not exist");
    return null;
  } catch (error) {
    const appError = mapToAppError(error);
    logError(appError, { operation: "getUserProfile", uid });

    // Preserve permission-related error semantics so callers can detect auth issues.
    if (appError.code === "FIRESTORE_PERMISSION_DENIED") {
      console.error(
        "Firebase permission error - user may not be authenticated properly",
      );
      throw new Error("Authentication required to access profile");
    }

    // Re-throw a generic failure for other errors
    throw error instanceof Error
      ? error
      : new Error("Failed to get user profile");
  }
}

// Create or update user profile in Firestore
export async function saveUserProfile(
  uid: string,
  profileData: Partial<UserProfile>,
  isNewUser = false,
): Promise<void> {
  try {
    const userDocRef: DocumentReference = doc(db, "users", uid);

    if (isNewUser) {
      // Create new user document
      await setDoc(userDocRef, {
        uid,
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      // Update existing user document
      await updateDoc(userDocRef, {
        ...profileData,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw new Error("Failed to save user profile");
  }
}

// Update user profile (profile information only)
export async function updateUserProfile(
  uid: string,
  profileData: {
    displayName?: string;
    email?: string;
    bio?: string;
    photoURL?: string;
  },
): Promise<void> {
  try {
    // Only include defined fields in the update
    const updateData: Partial<UserProfile> = {};

    if (profileData.displayName !== undefined) {
      updateData.displayName = profileData.displayName;
    }
    if (profileData.email !== undefined) {
      updateData.email = profileData.email;
    }
    if (profileData.bio !== undefined) {
      updateData.bio = profileData.bio;
    }
    if (profileData.photoURL !== undefined) {
      updateData.photoURL = profileData.photoURL;
    }

    // Update Firestore profile
    await saveUserProfile(uid, updateData);

    // Clear profile cache
    if (typeof window !== "undefined") {
      localStorage.removeItem(`user_profile_${uid}`);
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update profile");
  }
}

// Update Firebase Auth profile only
export async function updateFirebaseProfile(
  user: FirebaseUser,
  displayName: string,
): Promise<void> {
  try {
    await updateProfile(user, { displayName });
  } catch (error) {
    console.error("Error updating Firebase profile:", error);
    throw new Error("Failed to update Firebase profile");
  }
}

// Update user password
export async function updateUserPassword(
  user: FirebaseUser,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  try {
    // Re-authenticate user before updating password
    if (user.email) {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);
    }

    // Update password
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error("Error updating password:", error);
    if (error instanceof Error) {
      if (error.message.includes("auth/wrong-password")) {
        throw new Error("Current password is incorrect");
      } else if (error.message.includes("auth/weak-password")) {
        throw new Error("New password is too weak");
      } else if (error.message.includes("auth/requires-recent-login")) {
        throw new Error(
          "Please sign out and sign in again before changing your password",
        );
      }
    }
    throw new Error("Failed to update password");
  }
}

// Update user preferences
export async function updateUserPreferences(
  uid: string,
  preferences: UserProfile["preferences"],
): Promise<void> {
  try {
    await saveUserProfile(uid, { preferences });
  } catch (error) {
    console.error("Error updating preferences:", error);
    throw new Error("Failed to update preferences");
  }
}

// Initialize user profile when they first sign up
export async function initializeUserProfile(user: FirebaseUser): Promise<void> {
  try {
    console.log("Initializing user profile for:", user.uid);
    console.log("User data from Firebase:", {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      providerId: user.providerId,
      providerData: user.providerData,
    });

    // Add a small delay to ensure authentication is fully processed
    // await new Promise(resolve => setTimeout(resolve, 1000));

    const existingProfile = await getUserProfile(user.uid);

    if (!existingProfile) {
      console.log("Creating new user profile");

      // For Google users, try to get more complete profile data
      let displayName = user.displayName || "";
      let photoURL = user.photoURL || "";

      // If user signed in with Google, get additional profile data
      const googleProvider = user.providerData.find(
        (provider) => provider.providerId === "google.com",
      );
      if (googleProvider) {
        console.log("Google provider data:", googleProvider);
        displayName = googleProvider.displayName || displayName;
        photoURL = googleProvider.photoURL || photoURL;
      }

      const initialProfile: Partial<UserProfile> = {
        uid: user.uid,
        displayName,
        email: user.email || "",
        photoURL,
        role: "user", // Default role for new users
        editorRequest: {
          status: 'none'
        },
        preferences: {
          theme: "dark",
          language: "en",
          timezone: "utc",
          currency: "usd",
          notifications: {
            email: true,
            tradeAlerts: true,
            weeklyUpdates: false,
            securityAlerts: true,
          },
          compactMode: false,
          animations: true,
        },
      };

      await saveUserProfile(user.uid, initialProfile, true);
      console.log(
        "User profile created successfully with data:",
        initialProfile,
      );
    } else {
      console.log("User profile already exists:", existingProfile);

      // Update existing profile with any new Google data
      const googleProvider = user.providerData.find(
        (provider) => provider.providerId === "google.com",
      );
      if (googleProvider) {
        const updateData: Partial<UserProfile> = {};

        // Update display name if it's empty or different
        if (!existingProfile.displayName && googleProvider.displayName) {
          updateData.displayName = googleProvider.displayName;
        }

        // Update photo URL if it's empty or different
        if (!existingProfile.photoURL && googleProvider.photoURL) {
          updateData.photoURL = googleProvider.photoURL;
        }

        if (Object.keys(updateData).length > 0) {
          console.log(
            "Updating existing profile with Google data:",
            updateData,
          );
          await saveUserProfile(user.uid, updateData, false);
        }
      }
    }
  } catch (error) {
    console.error("Error initializing user profile:", error);

    // If it's a permission error, it might be because the user just signed up
    // and the token hasn't propagated yet - this is normal
    if (error instanceof Error && error.message.includes("permission")) {
      console.log(
        "Permission error during initialization - this is normal for new users",
      );
    }

    // Don't throw error here as this is called during auth initialization
  }
}

// Image upload and management functions
export async function uploadProfileImage(
  userId: string,
  file: File,
): Promise<string> {
  try {
    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Please upload a JPEG, PNG, or WebP image.",
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error(
        "File size too large. Please upload an image smaller than 5MB.",
      );
    }

    // Validate user ID
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Use Firebase Storage
    console.log("Uploading image to Firebase Storage");

    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const timestamp = Date.now();
    const fileName = `${timestamp}_${cleanFileName}`;

    try {
      // Create a reference to the storage location
      const imageRef = ref(storage, `profile-images/${userId}/${fileName}`);

      console.log(
        "Uploading image to:",
        `profile-images/${userId}/${fileName}`,
      );

      // Upload the file with metadata
      const metadata = {
        contentType: file.type,
        customMetadata: {
          uploadedBy: userId,
          uploadedAt: new Date().toISOString(),
        },
      };

      const snapshot = await uploadBytes(imageRef, file, metadata);
      console.log("Image uploaded successfully:", snapshot.metadata.fullPath);

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("Download URL obtained:", downloadURL);

      return downloadURL;
    } catch (storageError) {
      console.error("Firebase Storage upload failed:", storageError);
      throw new Error("Failed to upload image to storage. Please try again.");
    }
  } catch (error) {
    console.error("Error uploading profile image:", error);

    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes("storage/unauthorized")) {
        throw new Error(
          "You do not have permission to upload images. Please try signing in again.",
        );
      } else if (error.message.includes("storage/canceled")) {
        throw new Error("Upload was canceled. Please try again.");
      } else if (error.message.includes("storage/quota-exceeded")) {
        throw new Error("Storage quota exceeded. Please contact support.");
      } else if (error.message.includes("network")) {
        throw new Error(
          "Network error. Please check your internet connection and try again.",
        );
      }
    }

    throw error;
  }
}

export async function updateProfileImage(
  userId: string,
  photoURL: string,
): Promise<void> {
  try {
    // Update in Firestore
    await updateUserProfile(userId, { photoURL });

    // Only update Firebase Auth if it's not a base64 image (base64 URLs are too long)
    const currentUser = auth.currentUser;
    if (
      currentUser &&
      currentUser.uid === userId &&
      !photoURL.startsWith("data:")
    ) {
      await updateProfile(currentUser, { photoURL });
    } else if (photoURL.startsWith("data:")) {
      console.log(
        "Base64 image detected, skipping Firebase Auth update due to URL length limit",
      );
      // For base64 images, we'll clear the Firebase Auth photoURL to avoid conflicts
      if (currentUser && currentUser.uid === userId) {
        await updateProfile(currentUser, { photoURL: "" });
      }
    }
  } catch (error) {
    console.error("Error updating profile image:", error);
    throw error;
  }
}

export async function deleteProfileImage(imageUrl: string): Promise<void> {
  try {
    // Check if it's a base64 image (no deletion needed)
    if (imageUrl.startsWith("data:")) {
      console.log("Base64 image detected, no storage deletion needed");
      return;
    }

    // Try to delete from Firebase Storage
    try {
      // Extract the path from the URL to create a reference
      const url = new URL(imageUrl);
      const pathStartIndex = url.pathname.indexOf("/profile-images/");
      if (pathStartIndex === -1) {
        console.warn("Invalid profile image URL format, skipping deletion");
        return;
      }

      const imagePath = url.pathname.substring(pathStartIndex + 1);
      const imageRef = ref(storage, imagePath);

      // Delete the file
      await deleteObject(imageRef);
      console.log("Image deleted from Firebase Storage:", imagePath);
    } catch (storageError) {
      console.warn(
        "Could not delete from Firebase Storage (may not be available):",
        storageError,
      );
      // Don't throw error for deletion failures to avoid blocking other operations
    }
  } catch (error) {
    console.error("Error deleting profile image:", error);
    // Don't throw error for deletion failures to avoid blocking other operations
  }
}
