"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Loader2, User, Mail, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/use-auth';
import Link from 'next/link';
import { z } from 'zod';

// Validation schema for user profile updates
const profileSchema = z.object({
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be less than 50 characters'),
  email: z
    .string()
    .email('Please enter a valid email address'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      email: user?.email || '',
    },
  });

  // Update form values when user data loads
  React.useEffect(() => {
    if (user) {
      reset({
        displayName: user.displayName || '',
        email: user.email || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async () => {
    if (!user) return;

    try {
      setIsUpdating(true);
      setUpdateError(null);

      // Here you would typically call an API to update the user profile
      // For now, we'll just show a success message
      // await updateUserProfile(user.uid, data);

      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Please sign in to access your settings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-slate-400">Manage your account information</p>
            </div>
          </div>

          {/* Profile Information Card */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and account details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {updateSuccess && (
                  <Alert className="border-green-800 bg-green-900/50">
                    <AlertDescription className="text-green-200">
                      Profile updated successfully!
                    </AlertDescription>
                  </Alert>
                )}

                {updateError && (
                  <Alert variant="destructive">
                    <AlertDescription>{updateError}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Display Name */}
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Display Name
                    </Label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Your display name"
                      className="bg-slate-800 border-slate-700"
                      {...register('displayName')}
                    />
                    {errors.displayName && (
                      <p className="text-sm text-red-400">{errors.displayName.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="bg-slate-800 border-slate-700"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-400">{errors.email.message}</p>
                    )}
                    <p className="text-xs text-slate-500">
                      Email changes require verification.
                    </p>
                  </div>
                </div>

                {/* Account Information (Read-only) */}
                <div className="space-y-4 pt-6 border-t border-slate-800">
                  <h3 className="text-lg font-semibold">Account Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-400">Account ID</Label>
                      <Input
                        value={user.uid}
                        readOnly
                        className="bg-slate-800 border-slate-700 text-slate-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-400">Email Verified</Label>
                      <Input
                        value="Yes"
                        readOnly
                        className="bg-slate-800 border-slate-700 text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-6">
                  <Button
                    type="submit"
                    disabled={isUpdating || !isDirty}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isUpdating ? (
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

          {/* Additional Settings Cards */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your account security settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
                  Change Password
                </Button>
                <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
                  Enable Two-Factor Authentication
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize your experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-slate-400">Receive updates about your account</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Theme</p>
                    <p className="text-sm text-slate-400">Choose your preferred theme</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800">
                    Light/Dark
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}