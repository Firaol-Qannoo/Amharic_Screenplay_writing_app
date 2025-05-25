import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { url } = usePage(); 
  const { t } = useTranslation();

  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/contact-msg");
  };

  return (
    <div className="flex min-h-screen flex-col ">
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

      <main className="flex-1 w-full px-10 py-16">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">{t("contact.title")}</h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 text-lg">
            {t("contact.description")}
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="text"
                placeholder={t("contact.form.name")}
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder={t("contact.form.email")}
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                required
              />
            </div>
            <Input
              type="text"
              placeholder={t("contact.form.subject")}
              value={data.subject}
              onChange={(e) => setData("subject", e.target.value)}
              required
            />
            <Textarea
              placeholder={t("contact.form.message")}
              rows={5}
              value={data.message}
              onChange={(e) => setData("message", e.target.value)}
              required
            />
            <Button type="submit" size="lg" className="w-full md:w-auto" disabled={processing}>
              {t("contact.form.submit")}
            </Button>
          </form>
        </div>
      </main>

      <footer className="w-full border-t py-6 px-10">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {t("app_title")}. {t("footer.rights")}
          </p>
        </div>
      </footer>
    </div>
  );
}