import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";

export default function About() {
  const { url } = usePage();
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b px-10 backdrop-blur bg-background/60 dark:bg-gray-900/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="text-lg font-bold mr-24">Amharic Screenplay Writing Tool</span>
            <nav className="hidden md:flex gap-8 text-sm">
              <Link
                href="/"
                className={`transition-colors hover:text-primary ${
                  url === "/" ? "text-primary font-semibold" : "text-muted-foreground dark:text-gray-400"
                }`}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`transition-colors hover:text-primary ${
                  url === "/about" ? "text-primary font-semibold" : "text-muted-foreground dark:text-gray-400"
                }`}
              >
                About
              </Link>
              <Link
                href="/services"
                className={`transition-colors hover:text-primary ${
                  url === "/services" ? "text-primary font-semibold" : "text-muted-foreground dark:text-gray-400"
                }`}
              >
                Services
              </Link>
              <Link
                href="/contact"
                className={`transition-colors hover:text-primary ${
                  url === "/contact" ? "text-primary font-semibold" : "text-muted-foreground dark:text-gray-400"
                }`}
              >
                Contact Us
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main About Content */}
      <main className="flex-1 w-full px-10 py-16">
        <div className="container max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
          <p className="text-lg text-muted-foreground dark:text-gray-300 text-center max-w-3xl mx-auto mb-12">
            The Amharic Screenplay Writing Tool is a modern, intuitive platform tailored for Ethiopian storytellers.
            Our mission is to empower writers with the tools they need to draft, collaborate, and produce scripts in their native language.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="p-6 rounded-xl border bg-background dark:bg-gray-800 shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
              <p className="text-muted-foreground dark:text-gray-300">
                We envision a creative ecosystem where Ethiopian screenwriters have access to
                world-class digital tools that respect and support Amharic culture and storytelling formats.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-background dark:bg-gray-800 shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">Why We Built This</h2>
              <p className="text-muted-foreground dark:text-gray-300">
                The lack of tools for writing and formatting Amharic screenplays has limited creativity.
                Our tool addresses this gap with native Amharic support and production features.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-background dark:bg-gray-800 shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">Our Features</h2>
              <p className="text-muted-foreground dark:text-gray-300">
                From character extraction to production scheduling and collaboration, our tool provides everything
                you need to go from idea to final script — in one place.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-background dark:bg-gray-800 shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">Who We Serve</h2>
              <p className="text-muted-foreground dark:text-gray-300">
                Independent writers, film schools, production studios, and anyone passionate about storytelling in Amharic.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 px-10 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            &copy; {new Date().getFullYear()} Amharic Screenplay Writing Tool. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}