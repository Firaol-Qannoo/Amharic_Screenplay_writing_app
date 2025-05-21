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


export default function Landing() {
  const { url } = usePage(); 

  // State to track theme mode: true = dark, false = light
    const [isDarkMode, setIsDarkMode] = useState(false);
  
    // On mount, check if user prefers dark mode or has a saved preference
    useEffect(() => {
      const savedTheme = localStorage.getItem("theme");
      if (
        savedTheme === "dark" ||
        (!savedTheme &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove("dark");
      }
    }, []);
  
    // Toggle dark mode and save preference
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
    <div className="flex min-h-screen flex-col ">
    <header className="sticky top-0 z-50 w-full border-b px-10 backdrop-blur bg-background/60">
  <div className="container flex h-16 items-center justify-between">
    <div className="flex items-center">
      <span className="text-lg font-bold mr-24">Amharic Screenplay Writing Tool</span>
      <nav className="hidden md:flex gap-8 text-sm">
  <Link
    href="/"
    className={`transition-colors hover:text-primary ${url === '/' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
  >
    Home
  </Link>
  <Link
    href="/about"
    className={`transition-colors hover:text-primary ${url === '/about' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
  >
    About
  </Link>
  <Link
    href="/services"
    className={`transition-colors hover:text-primary ${url === '/services' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
  >
    Services
  </Link>
  <Link
    href="/contact"
    className={`transition-colors hover:text-primary ${url === '/contact' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
  >
    Contact Us
  </Link>
</nav>
    </div>
    <div className="flex items-center gap-2">
            {/* Dark/Light Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Dark Mode"
              className="rounded-md border p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? (
                // Sun icon for light mode
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07 5.07l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7M12 7a5 5 0 100 10 5 5 0 000-10z"
                  />
                </svg>
              ) : (
                // Moon icon for dark mode
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-900"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  stroke="none"
                >
                  <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
              )}
            </button>

            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Register</Button>
            </Link>
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
                    Amharic Screenplay Writing Tool
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    A specialized tool designed for Ethiopian screenwriters to
                    create, format, and collaborate on scripts in Amharic.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  {/* <Link href="/dashboard">
                    <Button size="lg">Try Now</Button>
                  </Link> */}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
                  <img
                    src="/assets/editor.png"
                    width={1280}
                    height={720}
                    alt="Screenplay Tool Interface"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-sm text-white/90">
                      Bridging the gap in digital tools for Ethiopian screenplay
                      writers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Empowering Ethiopian Screenplay writers
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our tool provides comprehensive support for the Amharic
                  script, enabling Ethiopian writers to efficiently create,
                  format, and collaborate on screenplays.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 pt-8">
              {/* <Card>
                <CardHeader className="pb-2">
                  <p className="text-3xl">አ</p>
                  <CardTitle>Amharic Script Support</CardTitle>
                  <CardDescription>
                    Full support for Amharic script with proper text placing and
                    formatting.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Seamless input, editing, and display of Amharic text with
                    proper character encoding and font support.
                  </p>
                </CardContent>
              </Card> */}
              <Card>
                <CardHeader className="pb-2">
                  <Users className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>Collaboration Tools</CardTitle>
                  <CardDescription>
                    Work together with other writers and track changes
                    efficiently.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Comment on scripts, invite collaborators, track edit
                    history, and manage versions.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <FileText className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>Script Templates</CardTitle>
                  <CardDescription>
                    Pre-designed templates for Ethiopian storytelling types.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Choose from various templates tailored to different
                    storytelling styles and types common in Ethiopian cinema.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Code className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>Formatting Tools</CardTitle>
                  <CardDescription>
                    Professional screenplay formatting with industry standards.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Tools to manage content placement, scene numbering,
                    character dialogues, and other screenplay elements.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <BookOpen className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>Import/Export</CardTitle>
                  <CardDescription>
                    Seamless file conversion and compatibility.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Export scripts to custom extensions or common formats like
                    PDF, ensuring compatibility with other tools.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CalendarSearch className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>Production Scheduling</CardTitle>
                  <CardDescription>
                    Schedule main events with the help of an automatic tracking
                    system.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create a scheduling calendar to manage events and tasks with
                    the help of an auto-tracking system, enabling efficient
                    production management.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Users className="h-6 w-6 mb-2 text-primary" />
                  <CardTitle>Character List Extractor</CardTitle>
                  <CardDescription>
                    Easily track and manage all characters in your script.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This tool automatically extracts and organizes a list of all
                    characters appearing in your script, helping you maintain
                    consistency. Writers can use this list to establish
                    character relationships, track interactions, and manage
                    conflicts, ensuring a well-structured and engaging story.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to Transform Ethiopian Screenwriting?
                </h2>
                <p className="max-w-[600px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join us in bridging the gap in digital tools for
                  Amharic-speaking screenwriters.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button size="lg" variant="secondary">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full  px-10 border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Amharic Screenplay Writing Tool.
            All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}