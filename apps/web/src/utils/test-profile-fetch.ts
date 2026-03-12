// Test script to verify user profile fetching
import { getUserProfile } from '../lib/firestore-service';

// Test function to check if user profile fetching works
export async function testUserProfileFetching() {
  const testAuthorId = 'CUTTLNESuSSC2puACOy66bfrnYP2';
  
  console.log('Testing user profile fetching for ID:', testAuthorId);
  
  try {
    const profile = await getUserProfile(testAuthorId);
    console.log('Profile fetched successfully:', profile);
    
    if (profile) {
      console.log('Display Name:', profile.displayName);
      console.log('Photo URL:', profile.photoURL);
      console.log('Email:', profile.email);
      return profile;
    } else {
      console.log('No profile found for this user ID');
      return null;
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}

// You can call this function from the browser console to test:
// import { testUserProfileFetching } from './src/utils/test-profile-fetch';
// testUserProfileFetching();