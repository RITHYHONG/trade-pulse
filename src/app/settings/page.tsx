"use client";
import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import {
  Loader2,
  User,
  Save,
  ArrowLeft,
  Shield,
  Bell,
  Palette,
  Globe,
  Key,
  Smartphone,
  Eye,
  EyeOff,
  Camera,
  CheckCircle,
  AlertCircle,
  Moon,
  Sun,
  Monitor,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/use-auth';
import Link from 'next/link';
import { z } from 'zod';
import { toast } from 'sonner';
import { 
  getUserProfile, 
  updateUserProfile, 
  updateFirebaseProfile,
  updateUserPassword, 
  updateUserPreferences,
  uploadProfileImage,
  updateProfileImage,
  deleteProfileImage,
  UserProfile 
} from '../../lib/firestore-service';
import { getCurrentUser } from '../../lib/auth';

// Validation schemas
const profileSchema = z.object({
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be less than 50 characters'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  bio: z
    .string()
    .max(200, 'Bio must be less than 200 characters')
    .optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [preferences, setPreferences] = useState<UserProfile['preferences']>({
    theme: 'dark',
    language: 'en',
    timezone: 'utc',
    currency: 'usd',
    notifications: {
      email: true,
      tradeAlerts: true,
      weeklyUpdates: false,
      securityAlerts: true,
    },
    compactMode: false,
    animations: true,
  });
  const [isUpdatingPreferences, setIsUpdatingPreferences] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      email: user?.email || '',
      bio: '',
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Load user profile from Firestore
  React.useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          setIsLoadingProfile(true);
          
          // Add retry logic for permission errors
          let profile = null;
          let retries = 3;
          
          while (retries > 0 && !profile) {
            try {
              profile = await getUserProfile(user.uid);
              break;
            } catch (error) {
              console.log(`Profile load attempt ${4 - retries} failed:`, error);
              retries--;
              
              if (retries > 0) {
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 2000));
              }
            }
          }
          
          setUserProfile(profile);
          
          // Update preferences
          if (profile?.preferences) {
            setPreferences(profile.preferences);
          }
          
          // Update form with loaded data
          profileForm.reset({
            displayName: profile?.displayName || user.displayName || '',
            email: profile?.email || user.email || '',
            bio: profile?.bio || '',
          });
        } catch (error) {
          console.error('Error loading user profile after retries:', error);
          // Fallback to Firebase Auth data
          profileForm.reset({
            displayName: user.displayName || '',
            email: user.email || '',
            bio: '',
          });
          
          // Show a helpful message to the user
          toast.error('Unable to load profile data. Using basic information from your account.');
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    // Add a delay to ensure auth is fully initialized
    const timer = setTimeout(loadUserProfile, 1000);
    return () => clearTimeout(timer);
  }, [user, profileForm]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      setIsUpdatingProfile(true);
      
      // Get the Firebase user to update displayName in Firebase Auth
      const firebaseUser = getCurrentUser();
      if (firebaseUser) {
        await updateFirebaseProfile(firebaseUser, data.displayName);
      }
      
      // Update user profile in Firestore
      await updateUserProfile(user.uid, {
        displayName: data.displayName,
        email: data.email,
        bio: data.bio,
      });

      // Update local state
      setUserProfile(prev => prev ? {
        ...prev,
        displayName: data.displayName,
        email: data.email,
        bio: data.bio,
      } : null);

      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    if (!user) return;

    try {
      setIsUpdatingPassword(true);
      
      // Get the Firebase user to update password
      const firebaseUser = getCurrentUser();
      if (!firebaseUser) {
        throw new Error('User not found. Please sign in again.');
      }
      
      // Update password in Firebase Auth
      await updateUserPassword(firebaseUser, data.currentPassword, data.newPassword);
      
      toast.success('Password updated successfully!');
      passwordForm.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Handle preference updates
  const updatePreference = async (key: string, value: string | boolean) => {
    if (!user || isUpdatingPreferences) return;

    try {
      setIsUpdatingPreferences(true);
      const newPreferences = { ...preferences };
      
      // Handle nested preferences (like notifications)
      if (key.includes('.')) {
        const [parentKey, childKey] = key.split('.');
        if (parentKey === 'notifications' && newPreferences.notifications) {
          newPreferences.notifications = {
            ...newPreferences.notifications,
            [childKey]: value as boolean,
          };
        }
      } else {
        // Direct preference update
        if (key === 'theme') newPreferences.theme = value as 'light' | 'dark' | 'system';
        else if (key === 'language') newPreferences.language = value as string;
        else if (key === 'timezone') newPreferences.timezone = value as string;
        else if (key === 'currency') newPreferences.currency = value as string;
        else if (key === 'compactMode') newPreferences.compactMode = value as boolean;
        else if (key === 'animations') newPreferences.animations = value as boolean;
      }

      setPreferences(newPreferences);
      await updateUserPreferences(user.uid, newPreferences);
      toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} updated successfully!`);
    } catch (error) {
      toast.error('Failed to update preference');
      console.error('Error updating preference:', error);
    } finally {
      setIsUpdatingPreferences(false);
    }
  };

  // Handle profile image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploadingImage(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload image and get URL
      const photoURL = await uploadProfileImage(user.uid, file);
      
      // Update profile with new image URL
      await updateProfileImage(user.uid, photoURL);
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, photoURL } : null);
      
      toast.success('Profile picture updated successfully!');
      setImagePreview(null);
    } catch (error) {
      setImagePreview(null);
      toast.error(error instanceof Error ? error.message : 'Failed to upload profile picture');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle profile image removal
  const handleRemoveImage = async () => {
    if (!user || !userProfile?.photoURL) return;

    try {
      setIsUploadingImage(true);
      
      // Delete from storage
      await deleteProfileImage(userProfile.photoURL);
      
      // Update profile to remove image URL
      await updateProfileImage(user.uid, '');
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, photoURL: '' } : null);
      
      toast.success('Profile picture removed successfully!');
    } catch (error) {
      console.error('Error removing profile picture:', error);
      toast.error('Failed to remove profile picture');
    } finally {
      setIsUploadingImage(false);
    }
  };

  if (loading || isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-slate-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Card className="w-full max-w-md bg-slate-900/50 border-slate-800/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-amber-500" />
              <p className="text-slate-300 mb-4">Please sign in to access your settings.</p>
              <Link href="/auth/login">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8 h-full">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800/50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              Account Active
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-8">
                <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <nav className="space-y-2">
                    <Button
                      variant="ghost"
                      onClick={() => setActiveTab('profile')}
                      className={`w-full justify-start gap-3 ${
                        activeTab === 'profile'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setActiveTab('security')}
                      className={`w-full justify-start gap-3 ${
                        activeTab === 'security'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      Security
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setActiveTab('notifications')}
                      className={`w-full justify-start gap-3 ${
                        activeTab === 'notifications'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                      Notifications
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setActiveTab('preferences')}
                      className={`w-full justify-start gap-3 ${
                        activeTab === 'preferences'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      <Palette className="w-4 h-4" />
                      Preferences
                    </Button>
                  </nav>
                </CardContent>
              </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Profile Header */}
                  <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <div className="relative group">
                          <Avatar className="w-20 h-20">
                            {(imagePreview || userProfile?.photoURL || user.photoURL) && (
                              <AvatarImage 
                                src={imagePreview || userProfile?.photoURL || user.photoURL || ''} 
                                alt="Profile picture"
                              />
                            )}
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
                              {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          
                          {/* Image Upload Controls - Hidden by default, revealed on hover */}
                          <div className="absolute -bottom-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <input
                              type="file"
                              id="profile-image-upload"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={isUploadingImage}
                              aria-label="Upload profile picture"
                              title="Upload profile picture"
                            />
                            <Button
                              size="sm"
                              variant="secondary"
                              className="rounded-full w-8 h-8 p-0 bg-slate-800 hover:bg-slate-700 border border-slate-700 shadow-lg"
                              onClick={() => document.getElementById('profile-image-upload')?.click()}
                              disabled={isUploadingImage}
                              title="Upload new profile picture"
                            >
                              {isUploadingImage ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Camera className="w-4 h-4" />
                              )}
                            </Button>
                            
                            {(userProfile?.photoURL || user.photoURL) && (
                              <Button
                                size="sm"
                                variant="secondary"
                                className="rounded-full w-8 h-8 p-0 bg-red-800 hover:bg-red-700 border border-red-700 shadow-lg"
                                onClick={handleRemoveImage}
                                disabled={isUploadingImage}
                                title="Remove profile picture"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          
                          {/* Loading overlay */}
                          {isUploadingImage && (
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                              <Loader2 className="w-6 h-6 animate-spin text-white" />
                            </div>
                          )}
                          
                          {/* Hover indicator - subtle overlay to show interactivity */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-full transition-colors duration-200 pointer-events-none" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-white">
                            {userProfile?.displayName || user.displayName || 'User'}
                          </h2>
                          <p className="text-slate-400">{userProfile?.email || user.email}</p>
                          {/* {userProfile?.bio && (
                            <p className="text-slate-300 text-sm mt-1">{userProfile.bio}</p>
                          )} */}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="bg-green-500/10 text-green-400">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                           
                          </div>
                                                    
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Profile Form */}
                  <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Personal Information
                      </CardTitle>
                      <CardDescription>
                        Update your personal details and profile information.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                              id="displayName"
                              {...profileForm.register('displayName')}
                              className="bg-slate-800/50 border-slate-700/50 focus:border-blue-500/50"
                              placeholder="Your display name"
                            />
                            {profileForm.formState.errors.displayName && (
                              <p className="text-sm text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {profileForm.formState.errors.displayName.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              {...profileForm.register('email')}
                              className="bg-slate-800/50 border-slate-700/50 focus:border-blue-500/50"
                              placeholder="your.email@example.com"
                            />
                            {profileForm.formState.errors.email && (
                              <p className="text-sm text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {profileForm.formState.errors.email.message}
                              </p>
                            )}
                            <p className="text-xs text-slate-500">
                              Email changes require verification.
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <textarea
                            id="bio"
                            {...profileForm.register('bio')}
                            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-md focus:border-blue-500/50 focus:outline-none resize-none"
                            rows={3}
                            placeholder="Tell us about yourself..."
                          />
                          {profileForm.formState.errors.bio && (
                            <p className="text-sm text-red-400 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {profileForm.formState.errors.bio.message}
                            </p>
                          )}
                        </div>

                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            disabled={isUpdatingProfile || !profileForm.formState.isDirty}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {isUpdatingProfile ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  {/* Password Change */}
                  <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        Change Password
                      </CardTitle>
                      <CardDescription>
                        Update your password to keep your account secure.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showCurrentPassword ? 'text' : 'password'}
                              {...passwordForm.register('currentPassword')}
                              className="bg-slate-800/50 border-slate-700/50 focus:border-blue-500/50 pr-10"
                              placeholder="Enter current password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="w-4 h-4 text-slate-400" />
                              ) : (
                                <Eye className="w-4 h-4 text-slate-400" />
                              )}
                            </Button>
                          </div>
                          {passwordForm.formState.errors.currentPassword && (
                            <p className="text-sm text-red-400 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {passwordForm.formState.errors.currentPassword.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showNewPassword ? 'text' : 'password'}
                              {...passwordForm.register('newPassword')}
                              className="bg-slate-800/50 border-slate-700/50 focus:border-blue-500/50 pr-10"
                              placeholder="Enter new password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? (
                                <EyeOff className="w-4 h-4 text-slate-400" />
                              ) : (
                                <Eye className="w-4 h-4 text-slate-400" />
                              )}
                            </Button>
                          </div>
                          {passwordForm.formState.errors.newPassword && (
                            <p className="text-sm text-red-400 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {passwordForm.formState.errors.newPassword.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            {...passwordForm.register('confirmPassword')}
                            className="bg-slate-800/50 border-slate-700/50 focus:border-blue-500/50"
                            placeholder="Confirm new password"
                          />
                          {passwordForm.formState.errors.confirmPassword && (
                            <p className="text-sm text-red-400 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {passwordForm.formState.errors.confirmPassword.message}
                            </p>
                          )}
                        </div>

                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            disabled={isUpdatingPassword}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {isUpdatingPassword ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <Key className="w-4 h-4 mr-2" />
                                Update Password
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Two-Factor Authentication */}
                  <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5" />
                        Two-Factor Authentication
                      </CardTitle>
                      <CardDescription>
                        Add an extra layer of security to your account.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">SMS Authentication</p>
                          <p className="text-sm text-slate-400">Receive codes via SMS</p>
                        </div>
                        <Button variant="outline" className="border-slate-700 hover:bg-slate-800/50">
                          Enable
                        </Button>
                      </div>
                      <Separator className="my-4 bg-slate-800/50" />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">Authenticator App</p>
                          <p className="text-sm text-slate-400">Use an authenticator app</p>
                        </div>
                        <Button variant="outline" className="border-slate-700 hover:bg-slate-800/50">
                          Set Up
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Active Sessions */}
                  <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Active Sessions</CardTitle>
                      <CardDescription>
                        Manage your active sessions across devices.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="font-medium text-white">Current Session</p>
                              <p className="text-sm text-slate-400">Chrome on Windows • Active now</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-green-500/10 text-green-400">
                            Current
                          </Badge>
                        </div>
                        <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800/50">
                          View All Sessions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Notification Preferences
                      </CardTitle>
                      <CardDescription>
                        Choose how you want to be notified about important updates.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">Email Notifications</p>
                          <p className="text-sm text-slate-400">Receive updates via email</p>
                        </div>
                        <Switch 
                          checked={preferences?.notifications?.email ?? true}
                          onCheckedChange={(checked) => updatePreference('notifications.email', checked)}
                        />
                      </div>
                      <Separator className="bg-slate-800/50" />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">Trade Alerts</p>
                          <p className="text-sm text-slate-400">Get notified about market movements</p>
                        </div>
                        <Switch 
                          checked={preferences?.notifications?.tradeAlerts ?? true}
                          onCheckedChange={(checked) => updatePreference('notifications.tradeAlerts', checked)}
                        />
                      </div>
                      <Separator className="bg-slate-800/50" />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">Weekly Summary</p>
                          <p className="text-sm text-slate-400">Receive weekly market summaries</p>
                        </div>
                        <Switch 
                          checked={preferences?.notifications?.weeklyUpdates ?? false}
                          onCheckedChange={(checked) => updatePreference('notifications.weeklyUpdates', checked)}
                        />
                      </div>
                      <Separator className="bg-slate-800/50" />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">Security Alerts</p>
                          <p className="text-sm text-slate-400">Important security notifications</p>
                        </div>
                        <Switch 
                          checked={preferences?.notifications?.securityAlerts ?? true}
                          onCheckedChange={(checked) => updatePreference('notifications.securityAlerts', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Appearance
                      </CardTitle>
                      <CardDescription>
                        Customize the look and feel of your dashboard.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Theme</Label>
                        <Select 
                          value={preferences?.theme ?? 'dark'} 
                          onValueChange={(value) => updatePreference('theme', value)}
                        >
                          <SelectTrigger className="bg-slate-800/50 border-slate-700/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">
                              <div className="flex items-center gap-2">
                                <Sun className="w-4 h-4" />
                                Light
                              </div>
                            </SelectItem>
                            <SelectItem value="dark">
                              <div className="flex items-center gap-2">
                                <Moon className="w-4 h-4" />
                                Dark
                              </div>
                            </SelectItem>
                            <SelectItem value="system">
                              <div className="flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                System
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Language</Label>
                        <Select 
                          value={preferences?.language ?? 'en'} 
                          onValueChange={(value) => updatePreference('language', value)}
                        >
                          <SelectTrigger className="bg-slate-800/50 border-slate-700/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">Compact Mode</p>
                          <p className="text-sm text-slate-400">Use smaller spacing and components</p>
                        </div>
                        <Switch 
                          checked={preferences?.compactMode ?? false}
                          onCheckedChange={(checked) => updatePreference('compactMode', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">Animations</p>
                          <p className="text-sm text-slate-400">Enable smooth transitions and animations</p>
                        </div>
                        <Switch 
                          checked={preferences?.animations ?? true}
                          onCheckedChange={(checked) => updatePreference('animations', checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Regional Settings
                      </CardTitle>
                      <CardDescription>
                        Configure your location and regional preferences.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Timezone</Label>
                        <Select 
                          value={preferences?.timezone ?? 'utc'} 
                          onValueChange={(value) => updatePreference('timezone', value)}
                        >
                          <SelectTrigger className="bg-slate-800/50 border-slate-700/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="utc">UTC</SelectItem>
                            <SelectItem value="est">Eastern Time</SelectItem>
                            <SelectItem value="pst">Pacific Time</SelectItem>
                            <SelectItem value="gmt">GMT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select 
                          value={preferences?.currency ?? 'usd'} 
                          onValueChange={(value) => updatePreference('currency', value)}
                        >
                          <SelectTrigger className="bg-slate-800/50 border-slate-700/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">USD ($)</SelectItem>
                            <SelectItem value="eur">EUR (€)</SelectItem>
                            <SelectItem value="gbp">GBP (£)</SelectItem>
                            <SelectItem value="jpy">JPY (¥)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata: Metadata = generateMetadata({
  title: 'Settings',
  description: 'Manage your Trader Pulse account settings, preferences, and profile information.',
  path: '/settings',
});