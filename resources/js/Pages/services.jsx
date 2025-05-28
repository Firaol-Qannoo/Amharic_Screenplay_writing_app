import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@inertiajs/react";
import {
  Users,
  FileText,
  Code,
  BookOpen,
  CalendarSearch
} from "lucide-react";
import { usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function Services() {
 
  const { i18n } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { auth } = usePage().props;
  const user = auth.user;


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
  const { url } = usePage();
  const { t } = useTranslation();
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
      {/* Main Content */}
      <main className="flex-1 w-full px-10 py-16 bg-muted dark:bg-muted-dark transition-colors duration-300">
        <div className="container max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6 text-foreground dark:text-foreground-dark">{t("services.title")}</h1>
          <p className="text-muted-foreground dark:text-muted-foreground-dark text-lg mb-12 max-w-3xl mx-auto">
            {t("services.description")}
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-left">
            {/* Cards */}
            <Card>
              <CardHeader className="pb-2">
                <Users className="h-6 w-6 mb-2 text-primary" />
                <CardTitle>{t("services.collaboration.title")}</CardTitle>
                <CardDescription>{t("services.collaboration.desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                  {t("services.collaboration.body")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <FileText className="h-6 w-6 mb-2 text-primary" />
                <CardTitle>{t("services.templates.title")}</CardTitle>
                <CardDescription>{t("services.templates.desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                  {t("services.templates.body")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <Code className="h-6 w-6 mb-2 text-primary" />
                <CardTitle>{t("services.formatting.title")}</CardTitle>
                <CardDescription>{t("services.formatting.desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                  {t("services.formatting.body")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <BookOpen className="h-6 w-6 mb-2 text-primary" />
                <CardTitle>{t("services.io.title")}</CardTitle>
                <CardDescription>{t("services.io.desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                  {t("services.io.body")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CalendarSearch className="h-6 w-6 mb-2 text-primary" />
                <CardTitle>{t("services.production.title")}</CardTitle>
                <CardDescription>{t("services.production.desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                  {t("services.production.body")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <Users className="h-6 w-6 mb-2 text-primary" />
                <CardTitle>{t("services.characters.title")}</CardTitle>
                <CardDescription>{t("services.characters.desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                  {t("services.characters.body")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 px-10 bg-background dark:bg-background-dark transition-colors duration-300">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
            &copy; {new Date().getFullYear()} {t("app_title")}. {t("footer.rights")}
          </p>
        </div>
      </footer>
    </div>
  );
}
