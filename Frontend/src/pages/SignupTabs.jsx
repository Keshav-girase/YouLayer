/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { memo } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z
    .string()
    .email('Invalid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must be at most 100 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must be at most 64 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password must include uppercase, lowercase, number, and special character'
    ),
});

export default function SignupTabs() {
  const [role, setRole] = useState('creator');
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async data => {
    try {
      const endpoint = role === 'creator' ? 'auth/creator/signup' : 'auth/manager/signup';
      const response = await axios.post(endpoint, data);

      if (response.status === 201) {
        localStorage.setItem('token', response.data.token);
        toast.success(`Successfully Signed up as ${role}!`);
        if (localStorage.getItem('redirectAfterLogin')) {
          const redirectPath = localStorage.getItem('redirectAfterLogin');
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath);
          return;
        }
        navigate(`/${role}/dashboard`);
        reset();
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(errorMessage);
      // console.error('Signup error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-4">
      <Helmet>
        <title>Get Started – YouLayer</title>
      </Helmet>
      <Tabs defaultValue="creator" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="creator" onClick={() => setRole('creator')}>
            Creator
          </TabsTrigger>
          <TabsTrigger value="manager" onClick={() => setRole('manager')}>
            Manager
          </TabsTrigger>
        </TabsList>

        {['creator', 'manager'].map(tab => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardHeader>
                <CardTitle>{tab === 'creator' ? 'Creator Signup' : 'Manager Signup'}</CardTitle>
                <CardDescription>
                  {tab === 'creator'
                    ? 'Create your creator account to start managing your content.'
                    : 'Register as a manager to oversee your creators and content.'}
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="block mb-2">
                      Name
                    </Label>
                    <Input id="name" {...register('name')} placeholder="Enter your name" />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1.5">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email" className="block mb-2">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="Enter your email, e.g. example@gmail.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1.5">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="password" className="block mb-2">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      {...register('password')}
                      placeholder="Enter your password"
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive mt-1.5">{errors.password.message}</p>
                    )}
                  </div>
                </CardContent>

                <SignupFooter />
              </form>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// 1. Extracted static components
const TermsAndConditions = memo(() => (
  <p className="mt-6 text-sm text-muted-foreground">
    By signing up, you agree to our{' '}
    <Link to="/terms" className="text-primary hover:underline">
      Terms of Service
    </Link>{' '}
    and{' '}
    <Link to="/privacy" className="text-primary hover:underline">
      Privacy Policy
    </Link>
    .
  </p>
));

const AlreadyHaveAccount = memo(() => (
  <p className="text-sm text-muted-foreground">
    Already have an account?{' '}
    <Link to="/login" className="text-primary hover:underline">
      Log in
    </Link>
  </p>
));

// eslint-disable-next-line react/prop-types
const SubmitButton = memo(({ isSubmitting }) => (
  <Button type="submit" className="w-full" disabled={isSubmitting}>
    {isSubmitting ? 'Signing up...' : 'Sign Up'}
  </Button>
));

// 2. Main Footer Component
// eslint-disable-next-line react/display-name, react/prop-types
export const SignupFooter = memo(({ isSubmitting }) => {
  return (
    <CardFooter className="flex flex-col space-y-4">
      <SubmitButton isSubmitting={isSubmitting} />
      <AlreadyHaveAccount />
      <TermsAndConditions />
    </CardFooter>
  );
});
