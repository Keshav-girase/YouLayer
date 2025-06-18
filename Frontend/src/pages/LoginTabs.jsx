/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { memo, useState } from 'react';

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
import toast from 'react-hot-toast'; // Uncomment if you want to use toast notifications
import { Helmet } from 'react-helmet-async';

const formSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

export default function LoginTabs() {
  const [role, setRole] = useState('creator');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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
      const endpoint = role === 'creator' ? 'auth/creator/login' : 'auth/manager/login';
      const response = await axios.post(endpoint, data);
      if (response.status === 200) {
        // console.log('Login successful:', response.data);
        toast.success(`Log in as ${role} successfully!`);
        localStorage.setItem('token', response.data.token);
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
      const errorMessage = error?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
      // console.error('Signup error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-4">
      <Helmet>
        <title>Sign In – YouLayer</title>
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
                <CardTitle>{tab === 'creator' ? 'Creator Login' : 'Manager Login'}</CardTitle>
                <CardDescription>
                  {tab === 'creator'
                    ? 'Access your creator account and manage your content.'
                    : 'Login to manage your creators and platform.'}
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-6 ">
                  <div>
                    <Label htmlFor="email" className="block mb-2">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="Enter your email"
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

                  <div className="flex items-center justify-center">
                    {error && <p className="text-sm text-destructive mt-1.5">{error}</p>}
                  </div>
                </CardContent>

                <LoginFooter isSubmitting={isSubmitting} />
              </form>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// Memoized child components
const TermsAndConditions = memo(() => (
  <p className="mt-6 text-sm text-muted-foreground">
    By logging in, you agree to our{' '}
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

const NoAccountYet = memo(() => (
  <p className="text-sm text-muted-foreground">
    Don’t have an account?{' '}
    <Link to="/signup" className="text-primary hover:underline">
      Sign up
    </Link>
  </p>
));

// eslint-disable-next-line react/prop-types
const SubmitButton = memo(({ isSubmitting }) => (
  <Button type="submit" className="w-full" disabled={isSubmitting}>
    {isSubmitting ? 'Logging in...' : 'Log In'}
  </Button>
));

// Main footer component
// eslint-disable-next-line react/display-name, react/prop-types
export const LoginFooter = memo(({ isSubmitting }) => {
  return (
    <CardFooter className="flex flex-col space-y-4">
      <SubmitButton isSubmitting={isSubmitting} />
      <NoAccountYet />
      <TermsAndConditions />
    </CardFooter>
  );
});
