"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      // TODO: Implement password reset logic with data.email
      console.log('Sending reset email to:', data.email);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setEmailSent(true);
      toast.success('Password reset email sent!');
    } catch {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Card className="w-full border-slate-700/50 bg-slate-800/50 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-white">Check your email</CardTitle>
          <CardDescription className="text-slate-300">
            We&apos;ve sent a password reset link to {getValues('email')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-slate-400 text-sm">
              Didn&apos;t receive the email? Check your spam folder or try again in a few minutes.
            </p>
            
            <Button 
              onClick={() => setEmailSent(false)}
              variant="outline"
              className="w-full h-12 border-slate-600 bg-slate-700/30 text-slate-200 hover:bg-slate-700/50 hover:text-white transition-all duration-200"
            >
              Try different email
            </Button>
          </div>

          <div className="text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to sign in</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-slate-700/50 bg-slate-800/50 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
          <Mail className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold text-white">Reset your password</CardTitle>
        <CardDescription className="text-slate-300">
          Enter your email address and we&apos;ll send you a link to reset your password
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
                className={`pl-10 h-12 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200 ${
                  errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
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

          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all duration-200 transform hover:scale-[1.02]" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending reset link...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-5 w-5" />
                Send Reset Link
              </>
            )}
          </Button>
        </form>

        <div className="text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to sign in</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}