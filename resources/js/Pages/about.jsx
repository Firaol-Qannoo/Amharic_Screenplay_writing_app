import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

export default function About() {
  const { url } = usePage();
  const { t, i18n } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col ">
      <header className="sticky top-0 z-50 w-full border-b px-10 backdrop-blur bg-background/60 dark:bg-gray-900/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="text-lg font-bold mr-24">
              {t("app_title")}
            </span>
            <nav className="hidden md:flex gap-8 text-sm">
              <Link
                href="/"
                className={`transition-colors hover:text-primary ${
                  url === "/" ? "text-primary font-semibold" : "text-muted-foreground dark:text-gray-400"
                }`}
              >
                {t("nav.home")}
              </Link>
              <Link
                href="/about"
                className={`transition-colors hover:text-primary ${
                  url === "/about" ? "text-primary font-semibold" : "text-muted-foreground dark:text-gray-400"
                }`}
              >
                {t("nav.about")}
              </Link>
              <Link
                href="/services"
                className={`transition-colors hover:text-primary ${
                  url === "/services" ? "text-primary font-semibold" : "text-muted-foreground dark:text-gray-400"
                }`}
              >
                {t("nav.services")}
              </Link>
              <Link
                href="/contact"
                className={`transition-colors hover:text-primary ${
                  url === "/contact" ? "text-primary font-semibold" : "text-muted-foreground dark:text-gray-400"
                }`}
              >
                {t("nav.contact")}
              </Link>
            </nav>
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
