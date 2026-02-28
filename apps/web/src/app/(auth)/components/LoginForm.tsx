"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Loader2, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { signInSchema, SignInFormData } from '../../../lib/validations';
import { useAuth } from '../../../hooks/use-auth';
import { toast } from 'sonner';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { signIn, signInWithGoogle, signInWithGoogleRedirect, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsSubmitting(true);
    try {
      await signIn(data.email, data.password);
      toast.success('Successfully signed in!');
      router.push(redirect);
    } catch {
      toast.error('Failed to sign in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      // Try popup first, fall back to redirect if CSP blocks it
      await signInWithGoogle();
      toast.success('Successfully signed in with Google!');
      router.push(redirect);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Content Security Policy')) {
        // CSP blocked popup, use redirect method
        try {
          toast.info('Redirecting to Google for sign in...');
          await signInWithGoogleRedirect();
          // Redirect will happen automatically
        } catch (redirectError) {
          const message = redirectError instanceof Error ? redirectError.message : 'Google sign in failed';
          toast.error(message);
        }
      } else {
        const message = error instanceof Error ? error.message : 'Google sign in failed';
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full border-slate-700/50 bg-slate-800/50 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto h-12 w-12 rounded-xl  flex items-center justify-center">
          <Lock className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold text-white">Welcome back</CardTitle>
        <CardDescription className="text-slate-300">
          Sign in to your Trade Pulse account to access your dashboard
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200 font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                className={`pl-10 h-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                  }`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-400 flex items-center space-x-1">
                <span>⚠</span>
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-200 font-medium">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                {...register('password')}
                className={`pl-10 pr-12 h-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-400 flex items-center space-x-1">
                <span>⚠</span>
                <span>{errors.password.message}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500/20"
                aria-label="Remember me"
              />
              <Label htmlFor="remember" className="text-sm text-slate-300">
                Remember me
              </Label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 h-12 font-semibold shadow-lg shadow-primary/25 transition-all duration-200 transform hover:scale-[1.02]"
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing you in...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-5 w-5" />
                Sign In
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-600" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-800 px-2 text-slate-400">or</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full h-12 border-slate-600 bg-slate-700/30 text-slate-200 hover:bg-slate-700/50 hover:text-white transition-all duration-200"
            disabled={isSubmitting || loading}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {isSubmitting || loading ? 'Signing in...' : 'Continue with Google'}
          </Button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-slate-400">
            Don&apos;t have an account?{' '}
            <Link
              href={`/signup?redirect=${encodeURIComponent(redirect)}`}
              className="font-semibold text-teal-400 hover:text-teal-300 transition-colors duration-200 "
            >
              Create one now
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}