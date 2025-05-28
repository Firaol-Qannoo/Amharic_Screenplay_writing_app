import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  CalendarSearch,
  Code,
  FileText,
  Github,
  MessageSquare,
  Users,
} from "lucide-react";

import { Link } from '@inertiajs/react';
import { usePage } from "@inertiajs/react";
import { LayoutDashboard } from 'lucide-react';
import { useTranslation } from "react-i18next";

export default function Landing() {
  const { t } = useTranslation();
  const { url } = usePage(); 
  const { auth } = usePage().props;
  const user = auth.user;

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  function toggleDarkMode() {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  }

  return (
     <div className="flex min-h-screen  w-[100vw] flex-col ">
      <header className="sticky top-0 z-50 w-full pl-20 border-b backdrop-blur bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="text-lg font-bold mr-24">{t("app_title")}</span>
            <nav className="hidden md:flex gap-8 text-sm">
              <Link
                href="/"
                className={`transition-colors hover:text-primary ${url === '/' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
              >
                {t("nav.home")}
              </Link>
              <Link
                href="/about"
                className={`transition-colors hover:text-primary ${url === '/about' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
              >
                {t("nav.about")}
              </Link>
              <Link
                href="/services"
                className={`transition-colors hover:text-primary ${url === '/services' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
              >
                {t("nav.services")}
              </Link>
              <Link
                href="/contact"
                className={`transition-colors hover:text-primary ${url === '/contact' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
              >
                {t("nav.contact")}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Dark Mode"
              className="rounded-md border p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07 5.07l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7M12 7a5 5 0 100 10 5 5 0 000-10z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                  <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
              )}
            </button>

            {user ? (
              <a href="/dashboard" className="inline-flex items-center gap-2 btn btn-primary">
                <LayoutDashboard className="w-4 h-4" />
                {t("landing.dashboard")}
              </a>
            ) : (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">{t("landing.login")}</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">{t("landing.register")}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full px-10 py-12 md:py-10 lg:py-10 xl:py-20">
          <div className="container  px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    {t("landing.hero_title")}
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    {t("landing.hero_description")}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
                  <img  loading="lazy" src="/assets/editor.png" width={1280} height={720} alt="Screenplay Tool Interface" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-sm text-white/90">
                      {t("landing.hero_caption")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full px-20 py-12 md:py-24 lg:py-32">
          <div className=" w-full px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  {t("landing.features_label")}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  {t("landing.features_title")}
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t("landing.features_description")}
                </p>
              </div>
            </div>

            <div className="  grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 pt-8">
              

              <Card>
                <CardHeader className="pb-2">
                  <FileText className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>{t("landing.card2_title")}</CardTitle>
                  <CardDescription>{t("landing.card2_description")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t("landing.card2_content")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <Users className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>{t("landing.card3_title")}</CardTitle>
                  <CardDescription>{t("landing.card3_description")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t("landing.card3_content")}
                  </p>
                </CardContent>
              </Card>

               <Card>
                <CardHeader className="pb-2">
                  <Users className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>{t("landing.card4_title")}</CardTitle>
                  <CardDescription>{t("landing.card4_description")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t("landing.card4_content")}
                  </p>
                </CardContent>
              </Card>

               <Card>
                <CardHeader className="pb-2">
                  <Users className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>{t("landing.card5_title")}</CardTitle>
                  <CardDescription>{t("landing.card5_description")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t("landing.card5_content")}
                  </p>
                </CardContent>
              </Card>
                
                 <Card>
                <CardHeader className="pb-2">
                  <Users className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>{t("landing.card6_title")}</CardTitle>
                  <CardDescription>{t("landing.card6_description")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t("landing.card6_content")}
                  </p>
                </CardContent>
              </Card>

               <Card>
                <CardHeader className="pb-2">
                  <Users className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>{t("landing.card7_title")}</CardTitle>
                  <CardDescription>{t("landing.card7_description")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t("landing.card7_content")}
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-start justify-center space-y-4 px-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  {t("landing.cta_title")}
                </h2>
                <p className=" text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t("landing.cta_description")}
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button size="lg" variant="secondary">
                    {t("landing.cta_button")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full px-10 border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {t("app_title")}. {t("footer.rights")}
          </p>
        </div>
      </footer>
    </div>
  );
}
