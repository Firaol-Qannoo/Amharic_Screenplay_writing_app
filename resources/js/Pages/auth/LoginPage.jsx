import { Link, router, usePage } from '@inertiajs/react'; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../utils/validation/login';
import { useEffect } from 'react';
import flasher from '@flasher/flasher';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation();
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

  const loginHandler = (data) => {
    router.post('/login', data);
  };

  return (
    <div className="flex min-h-screen w-screen bg-background text-foreground transition-colors duration-300">
      {/* Left Promotional Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white items-center justify-center p-12">
        <Link
          href="/"
          className="absolute top-4 left-4 text-white font-medium hover:text-gray-200 transition"
        >
          ← {t("login.back_home")}
        </Link>
        <div className="max-w-md space-y-6">
          <h2 className="text-3xl font-bold leading-tight">{t("login.welcome_title")}</h2>
          <p className="text-lg">{t("login.welcome_description")}</p>
          <img  loading="lazy" src="/images/login-illustration.gif" alt="Illustration" className="w-full h-auto mt-8 rounded-lg shadow-lg" />
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 transition-colors duration-300">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {t("login.sign_in")}
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t("login.or")}{" "}
              <Link href="/signup" className="font-medium text-primary hover:text-primary/90">
                {t("login.create_account")}
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(loginHandler)}>
            <div className="space-y-4 rounded-md py-8 px-8 shadow-sm bg-white dark:bg-gray-800">
              {/* Email */}
              <div className='flex flex-col gap-3'>
                <Label htmlFor="email-address" className="mb-2 block">{t("login.email")}</Label>
                <Input {...register("email")} id="email-address" type="email" placeholder={t("login.email")} />
                <p className="text-red-600 text-sm">{formState.errors.email?.message}</p>
              </div>

              {/* Password */}
              <div className='flex flex-col gap-3'>
                <Label htmlFor="password" className="mb-2 block">{t("login.password")}</Label>
                <Input {...register("password")} id="password" type="password" placeholder={t("login.password")} />
                <p className="text-red-600 text-sm">{formState.errors.password?.message}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="remember-me" />
                <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-900 dark:text-gray-300">
                  {t("login.remember_me")}
                </Label>
              </div>
              <Link href="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/90">
                {t("login.forgot_password")}
              </Link>
            </div>

            <Button type="submit" className="w-full">{t("login.sign_in_button")}</Button>
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