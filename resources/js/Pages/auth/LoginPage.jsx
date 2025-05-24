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

  // const { errors } = usePage().props;

  // // State to control visibility of error popup
  // const [showError, setShowError] = useState(false);

  // Show error popup for 3 seconds after receiving errors
  // useEffect(() => {
  //   if (errors && Object.keys(errors).length > 0) { // Ensure errors exist before checking keys
  //     setShowError(true);
  //     setTimeout(() => {
  //       setShowError(false);
  //     }, 3000); // Hide after 3 seconds
  //   }
  // }, [errors]);

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
    <div className="relative">
      {/* Error message popup at the top center
      {showError && errors && Object.keys(errors).length > 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 p-4 bg-red-600 text-white rounded-lg shadow-lg">
          <p>{errors.email || errors.password}</p>
        </div>
      )} */}
      <div className="flex min-h-screen items-center w-[100vw] justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h1>
            <p className="mt-2 text-sm text-gray-600">
              Or{" "}
              <Link href="/signup" className="font-medium text-primary hover:text-primary/90">
                create a new account
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(loginHandler)}>
            <div className="space-y-4 rounded-md py-8 px-8 shadow-sm">
              <div>
                <Label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                  Email address
                </Label>
                <Input
                  {...register("email")}
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1"
                  placeholder="Email address"
                />
                <p className="text-red-600 self-start text-sm">
                  {formState.errors.email && formState.errors.email.message}
                </p>
              </div>
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  {...register("password")}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1"
                  placeholder="Password"
                />
                <p className="text-red-600 self-start text-sm">
                  {formState.errors.password && formState.errors.password.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="remember-me" />
                <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </Label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-primary hover:text-primary/90">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </div>        
          </form>
          <GoogleOAuthProvider clientId="304333585377-5llja3fa2fdhkkm02sgo5u4ng0je7su1.apps.googleusercontent.com">
                <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => console.log("Google Login Failed")}
                />
            </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
}
