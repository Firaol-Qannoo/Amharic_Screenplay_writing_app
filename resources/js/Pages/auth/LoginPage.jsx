import { Link, router, usePage } from '@inertiajs/react'; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../utils/validation/login';
import { useEffect, useState } from 'react';
import flasher from '@flasher/flasher';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const { handleSubmit, register, formState } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const handleGoogleLogin = () => {
    window.location.href = "/auth/google"; 
};

   const { messages } = usePage().props;
  
          useEffect(() => {
          if (messages) {
              flasher.render(messages);
          }
          }, [messages]);
                  
          // console.log(messages);

  const loginHandler = (data) => {
    router.post('/login', data);
  };

 return (
  <div className="flex min-h-screen w-screen bg-background text-foreground transition-colors duration-300">
    {/* Left Promotional Panel */}
    <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white items-center justify-center p-12">
     {/* Back to Home link */}
  <Link
    href="/"
    className="absolute top-4 left-4 text-white font-medium hover:text-gray-200 transition"
  >
    ← Back to Home
  </Link>
      <div className="max-w-md space-y-6">
        <h2 className="text-3xl font-bold leading-tight">Welcome to Amharic Screenplay Writing Tool 👋</h2>
        <p className="text-lg">Discover opportunities, manage scripts, and streamline your creative workflow — all in one place.</p>
        <img src="/images/login-illustration.gif" alt="Illustration" className="w-full h-auto mt-8 rounded-lg shadow-lg" />
      </div>
    </div>

    {/* Right Login Form Panel */}
    <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Sign in to your account</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Or{" "}
            <Link href="/signup" className="font-medium text-primary hover:text-primary/90">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(loginHandler)}>
          <div className="space-y-4 rounded-md py-8 px-8 shadow-sm bg-white dark:bg-gray-800">
            {/* Email */}
            <div>
            <Label htmlFor="email-address" className="mb-2 block">Email address</Label>
            <Input {...register("email")} id="email-address" type="email" placeholder="Email address" />
            <p className="text-red-600 text-sm">{formState.errors.email?.message}</p>
          </div>

          <div>
            <Label htmlFor="password" className="mb-2 block">Password</Label>
            <Input {...register("password")} id="password" type="password" placeholder="Password" />
            <p className="text-red-600 text-sm">{formState.errors.password?.message}</p>
          </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox id="remember-me" />
              <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-900 dark:text-gray-300">Remember me</Label>
            </div>
            <Link href="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/90">
              Forgot your password?
            </Link>
          </div>

          <Button type="submit" className="w-full">Sign in</Button>
        </form>

        <div className="text-center">
         <GoogleOAuthProvider clientId="304333585377-5llja3fa2fdhkkm02sgo5u4ng0je7su1.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log("Google Login Failed")}
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  </div>
);

}