import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function About() {
  const { url } = usePage();
  const { t, i18n } = useTranslation();
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

      <main className="flex-1 w-full px-10 py-16">
        <div className="container max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">{t("about.title")}</h1>
          <p className="text-lg text-muted-foreground dark:text-gray-300 text-center max-w-3xl mx-auto mb-12">
            {t("about.description")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="p-6 rounded-xl border bg-background dark:bg-gray-800 shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">{t("about.vision_title")}</h2>
              <p className="text-muted-foreground dark:text-gray-300">{t("about.vision_body")}</p>
            </div>

            <div className="p-6 rounded-xl border bg-background dark:bg-gray-800 shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">{t("about.why_title")}</h2>
              <p className="text-muted-foreground dark:text-gray-300">{t("about.why_body")}</p>
            </div>

            <div className="p-6 rounded-xl border bg-background dark:bg-gray-800 shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">{t("about.features_title")}</h2>
              <p className="text-muted-foreground dark:text-gray-300">{t("about.features_body")}</p>
            </div>

            <div className="p-6 rounded-xl border bg-background dark:bg-gray-800 shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">{t("about.who_title")}</h2>
              <p className="text-muted-foreground dark:text-gray-300">{t("about.who_body")}</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full border-t py-6 px-10 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            &copy; {new Date().getFullYear()} {t("app_title")}. {t("footer.rights")}
          </p>
        </div>
      </footer>
    </div>
  );
}
