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

export default function Services() {
  const { url } = usePage();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b px-10 backdrop-blur bg-background/60 dark:bg-gray-900/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="text-lg font-bold mr-24">{t("app_title")}</span>
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
