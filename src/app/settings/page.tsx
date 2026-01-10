"use client";
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
  X,
  CreditCard,
  Settings2,
  Lock,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/use-auth';
import Link from 'next/link';
import { z } from 'zod';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
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
  const { setTheme } = useTheme();
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

  // Sync theme when preferences are loaded
  React.useEffect(() => {
    if (preferences.theme) {
      setTheme(preferences.theme);
    }
  }, [preferences.theme, setTheme]);

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
        if (key === 'theme') {
          newPreferences.theme = value as 'light' | 'dark' | 'system';
          setTheme(value as string);
        }
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Synchronizing data stream...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md bg-secondary/50 border-border backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground mb-4 font-medium">Please sign in to access your settings.</p>
              <Link href="/auth/login">
                <Button className="bg-foreground text-background hover:opacity-90 font-bold px-8 h-12 rounded-xl transition-all">
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 transition-colors duration-300">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-2">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group mb-4">
              <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Terminal
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              Settings<span className="text-primary">.</span>
            </h1>
            <p className="text-muted-foreground max-w-md font-medium">
              Manage your account, security, and market preferences for your trading ecosystem.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-full shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-xs font-bold text-foreground">Account Active</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar sticky top-12">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'notifications', label: 'Alerts', icon: Bell },
                { id: 'preferences', label: 'Interface', icon: Palette },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative group shrink-0 ${
                    activeTab === tab.id
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary/5 border border-primary/10 rounded-xl z-0"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <tab.icon className={`w-4 h-4 relative z-10 ${activeTab === tab.id ? 'text-primary' : ''}`} />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-12"
              >
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-12">
                    {/* Minimalist Profile Header */}
                    <section className="flex flex-col md:flex-row items-center gap-8 pb-12 border-b border-border">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-purple-600 rounded-full blur opacity-15 transition duration-500" />
                        <div className="relative">
                          <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                            {(imagePreview || userProfile?.photoURL || user.photoURL) && (
                              <AvatarImage 
                                src={imagePreview || userProfile?.photoURL || user.photoURL || ''} 
                                alt="Profile"
                                className="object-cover"
                              />
                            )}
                            <AvatarFallback className="bg-secondary text-muted-foreground text-2xl font-bold">
                              {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="absolute -bottom-1 -right-1 flex gap-1">
                            <input
                              type="file"
                              id="profile-image-upload"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            <button
                              onClick={() => document.getElementById('profile-image-upload')?.click()}
                              disabled={isUploadingImage}
                              className="p-2 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg transition-transform active:scale-90 disabled:opacity-50"
                            >
                              {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="text-center md:text-left space-y-1">
                        <h2 className="text-2xl font-bold text-foreground tracking-tight">
                          {userProfile?.displayName || user.displayName || 'Anonymous User'}
                        </h2>
                        <p className="text-muted-foreground font-semibold">{userProfile?.email || user.email}</p>
                        <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                          <span className="text-[10px] uppercase tracking-widest font-black text-primary bg-primary/10 px-2 py-0.5 rounded">Pro Tier</span>
                          <span className="text-[10px] uppercase tracking-widest font-black text-muted-foreground border border-border px-2 py-0.5 rounded">Verified Account</span>
                        </div>
                      </div>
                    </section>

                    {/* Information Form */}
                    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-widest text-muted-foreground font-black">Public Display Name</Label>
                          <Input
                            {...profileForm.register('displayName')}
                            placeholder="Enter your name"
                            className="bg-secondary border-border focus:border-primary/50 transition-colors h-12 text-foreground placeholder:text-muted-foreground/50 shadow-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-widest text-muted-foreground font-black">Contact Email</Label>
                          <Input
                            {...profileForm.register('email')}
                            placeholder="your@email.com"
                            className="bg-secondary border-border focus:border-primary/50 transition-colors h-12 text-foreground placeholder:text-muted-foreground/50 shadow-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-widest text-muted-foreground font-black">Biography</Label>
                        <textarea
                          {...profileForm.register('bio')}
                          placeholder="Write a short summary about yourself or your trading style..."
                          className="w-full min-h-[120px] bg-secondary border border-border rounded-md p-4 text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none text-foreground placeholder:text-muted-foreground/50 shadow-sm"
                        />
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button
                          onClick={profileForm.handleSubmit(onProfileSubmit)}
                          disabled={isUpdatingProfile || !profileForm.formState.isDirty}
                          className="bg-foreground text-background hover:opacity-90 transition-all font-bold px-8 h-12 rounded-xl"
                        >
                          {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                          Sync Changes
                        </Button>
                      </div>
                    </section>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-16">
                    <section className="space-y-8">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                          <Lock className="w-5 h-5 text-primary" /> Authority Control
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium">Update your access credentials to maintain system security.</p>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-widest text-muted-foreground font-black">Current Passkey</Label>
                          <div className="relative">
                            <Input
                              type={showCurrentPassword ? 'text' : 'password'}
                              {...passwordForm.register('currentPassword')}
                              className="bg-secondary border-border h-12 pr-12 focus:border-primary/50 text-foreground shadow-sm"
                            />
                            <button
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-widest text-muted-foreground font-black">New Passkey</Label>
                            <Input
                              type={showNewPassword ? 'text' : 'password'}
                              {...passwordForm.register('newPassword')}
                              className="bg-secondary border-border h-12 focus:border-primary/50 text-foreground shadow-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-widest text-muted-foreground font-black">Confirm New Passkey</Label>
                            <Input
                              type="password"
                              {...passwordForm.register('confirmPassword')}
                              className="bg-secondary border-border h-12 focus:border-primary/50 text-foreground shadow-sm"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end pt-4">
                          <Button
                            onClick={passwordForm.handleSubmit(onPasswordSubmit)}
                            disabled={isUpdatingPassword}
                            className="bg-primary text-white hover:bg-primary/90 transition-all font-bold px-8 h-12 rounded-xl border border-primary/20 shadow-lg"
                          >
                            {isUpdatingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Key className="w-4 h-4 mr-2" />}
                            Update Credentials
                          </Button>
                        </div>
                      </div>
                    </section>

                    <section className="p-8 bg-secondary border border-border rounded-[2rem] space-y-6 shadow-sm">
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="font-bold text-foreground">Multi-Factor Authentication</h4>
                          <p className="text-xs text-muted-foreground font-semibold tracking-tight">Add a hardware or software layer for enhanced protection.</p>
                        </div>
                        <Button variant="outline" className="border-border hover:bg-background rounded-xl px-6 font-bold shadow-sm">
                          Configure
                        </Button>
                      </div>
                    </section>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="space-y-8 max-w-3xl">
                    <div className="space-y-2 mb-8">
                       <h3 className="text-xl font-bold text-foreground tracking-tight">Signal Relay Preferences</h3>
                       <p className="text-sm text-muted-foreground font-medium">Configure how the system communicates critical market movements.</p>
                    </div>

                    {[
                      { id: 'notifications.email', title: 'Transmission via Email', desc: 'Summary of market movement and daily reports.', checked: preferences?.notifications?.email },
                      { id: 'notifications.tradeAlerts', title: 'Live Trade Signals', desc: 'Real-time execution alerts and high-volatility events.', checked: preferences?.notifications?.tradeAlerts },
                      { id: 'notifications.weeklyUpdates', title: 'Intelligence Summaries', desc: 'A curated weekly analysis of your portfolio performance.', checked: preferences?.notifications?.weeklyUpdates },
                      { id: 'notifications.securityAlerts', title: 'Protocol Security Alerts', desc: 'Critical alerts regarding account access and security.', checked: preferences?.notifications?.securityAlerts },
                    ].map((item, idx) => (
                      <div key={item.id} className="group">
                        <div className="flex items-center justify-between p-6 bg-secondary/50 border border-transparent hover:border-border hover:bg-secondary transition-all rounded-2xl">
                          <div className="space-y-1">
                            <h4 className="font-bold text-foreground transition-colors">{item.title}</h4>
                            <p className="text-xs text-muted-foreground font-semibold tracking-tight">{item.desc}</p>
                          </div>
                          <Switch 
                            checked={item.checked}
                            onCheckedChange={(checked) => updatePreference(item.id, checked)}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>
                        {idx !== 3 && <div className="h-px bg-border/50 mx-6" />}
                      </div>
                    ))}
                  </div>
                )}

                {/* Interface/Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div className="space-y-12 max-w-3xl">
                    <section className="space-y-8">
                      <div className="space-y-2">
                         <h3 className="text-xl font-bold text-foreground tracking-tight">Terminal Interface</h3>
                         <p className="text-sm text-muted-foreground font-medium">Customize the visual response and data presentation of your dashboard.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <Label className="text-xs uppercase tracking-widest text-muted-foreground font-black">Environment Theme</Label>
                            <Select 
                              value={preferences?.theme ?? 'dark'} 
                              onValueChange={(value) => updatePreference('theme', value)}
                            >
                              <SelectTrigger className="bg-secondary border-border h-12 rounded-xl focus:ring-primary/20 text-foreground shadow-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-border text-foreground">
                                <SelectItem value="light" className="focus:bg-secondary focus:text-foreground"><span className="flex items-center gap-2"><Sun className="w-4 h-4" /> Light Interface</span></SelectItem>
                                <SelectItem value="dark" className="focus:bg-secondary focus:text-foreground"><span className="flex items-center gap-2"><Moon className="w-4 h-4" /> Dark Terminal</span></SelectItem>
                                <SelectItem value="system" className="focus:bg-secondary focus:text-foreground"><span className="flex items-center gap-2"><Monitor className="w-4 h-4" /> System Match</span></SelectItem>
                              </SelectContent>
                            </Select>
                         </div>

                         <div className="space-y-3">
                            <Label className="text-xs uppercase tracking-widest text-muted-foreground font-black">Native Language</Label>
                            <Select 
                              value={preferences?.language ?? 'en'} 
                              onValueChange={(value) => updatePreference('language', value)}
                            >
                              <SelectTrigger className="bg-secondary border-border h-12 rounded-xl focus:ring-primary/20 text-foreground shadow-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-border text-foreground">
                                <SelectItem value="en">English (US)</SelectItem>
                                <SelectItem value="es">Español</SelectItem>
                                <SelectItem value="fr">Français</SelectItem>
                                <SelectItem value="de">Deutsch</SelectItem>
                              </SelectContent>
                            </Select>
                         </div>
                      </div>

                      <div className="space-y-6 pt-4">
                        <div className="flex items-center justify-between p-6 bg-secondary/50 border border-border/50 rounded-2xl">
                          <div className="space-y-1">
                            <h4 className="font-bold text-foreground">Compact Visualization</h4>
                            <p className="text-xs text-muted-foreground font-semibold">Reduce whitespace for maximum information density.</p>
                          </div>
                          <Switch 
                            checked={preferences?.compactMode ?? false}
                            onCheckedChange={(checked) => updatePreference('compactMode', checked)}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>

                        <div className="flex items-center justify-between p-6 bg-secondary/50 border border-border/50 rounded-2xl">
                          <div className="space-y-1">
                            <h4 className="font-bold text-foreground">Kinetic Animations</h4>
                            <p className="text-xs text-muted-foreground font-semibold">Enable smooth transitions and interface micro-responses.</p>
                          </div>
                          <Switch 
                            checked={preferences?.animations ?? true}
                            onCheckedChange={(checked) => updatePreference('animations', checked)}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>
                      </div>
                    </section>

                    <section className="space-y-8 pt-8 border-t border-border">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-foreground tracking-tight">Regional Protocol</h3>
                        <p className="text-sm text-muted-foreground font-medium">Configure timezones and liquidity units for accurate tracking.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <Label className="text-xs uppercase tracking-widest text-muted-foreground font-black">Base Timezone</Label>
                            <Select value={preferences?.timezone ?? 'utc'} onValueChange={(value) => updatePreference('timezone', value)}>
                              <SelectTrigger className="bg-secondary border-border h-12 rounded-xl text-foreground shadow-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-border text-foreground">
                                <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                                <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                                <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                                <SelectItem value="gmt">GMT (Greenwich Mean Time)</SelectItem>
                              </SelectContent>
                            </Select>
                         </div>
                         <div className="space-y-3">
                            <Label className="text-xs uppercase tracking-widest text-muted-foreground font-black">Base Currency</Label>
                            <Select value={preferences?.currency ?? 'usd'} onValueChange={(value) => updatePreference('currency', value)}>
                              <SelectTrigger className="bg-secondary border-border h-12 rounded-xl text-foreground shadow-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-border text-foreground">
                                <SelectItem value="usd">USD ($)</SelectItem>
                                <SelectItem value="eur">EUR (€)</SelectItem>
                                <SelectItem value="gbp">GBP (£)</SelectItem>
                                <SelectItem value="jpy">JPY (¥)</SelectItem>
                              </SelectContent>
                            </Select>
                         </div>
                      </div>
                    </section>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Footer Minimalist Legend */}
        <footer className="mt-24 pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-6">
             <div className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">System Ver 2.4.0</div>
             <div className="w-1 h-1 bg-border rounded-full" />
             <div className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Encrypted AES-256</div>
          </div>
          <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground text-center md:text-right">
            © 2026 Trade Pulse Neural Ecosystem. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
