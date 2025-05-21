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
import { Sun, Moon } from "lucide-react";

export default function Services() {
  const { url } = usePage();
  
  return (
    <div className="flex min-h-screen flex-col bg-background dark:bg-background-dark transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b px-10 backdrop-blur bg-background/60 dark:bg-background-dark/60 transition-colors duration-300">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="text-lg font-bold mr-24 text-foreground dark:text-foreground-dark">Amharic Screenplay Writing Tool</span>
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
            <div className="flex items-center gap-2">
 
        <Link href="/dashboard">
            <Button variant="outline" size="sm">Login</Button>
        </Link>
        <Link href="/signup">
            <Button size="sm">Register</Button>
        </Link>
        </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-10 py-16 bg-muted dark:bg-muted-dark transition-colors duration-300">
        <div className="container max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6 text-foreground dark:text-foreground-dark">Our Services</h1>
          <p className="text-muted-foreground dark:text-muted-foreground-dark text-lg mb-12 max-w-3xl mx-auto">
            Our platform is tailored for Ethiopian screenwriters, offering powerful tools to write, collaborate, format, and manage screenplays in Amharic.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-left">
            {/* Cards */}
            <Card>
              <CardHeader className="pb-2">
                <Users className="h-6 w-6 mb-2 text-primary" />
                <CardTitle>Collaboration</CardTitle>
                <CardDescription>Write together in real-time.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                  Invite co-writers, share comments, track edits, and manage revisions seamlessly in a collaborative environment.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <FileText className="h-6 w-6 mb-2 text-primary" />
                <CardTitle>Script Templates</CardTitle>
                <CardDescription>Start fast with industry-based formats.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                  Templates designed for Ethiopian storytelling, drama structures, and cinematic formatting.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <Code className="h-6 w-6 mb-2 text-primary" />
                <CardTitle>Professional Formatting</CardTitle>
                <CardDescription>Auto-format your screenplays correctly.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                  Automatically handle scene headers, dialogue blocks, actions, and transitions according to screenwriting norms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <BookOpen className="h-6 w-6 mb-2 text-primary" />
                <CardTitle>Import/Export Options</CardTitle>
                <CardDescription>Work with different file types easily.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                  Export to PDF or Word, and import content from other editors to continue your script without formatting issues.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CalendarSearch className="h-6 w-6 mb-2 text-primary" />
                <CardTitle>Production Tools</CardTitle>
                <CardDescription>Keep your production on schedule.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                  Manage your production timeline with scheduling tools for casting, shooting dates, and location planning.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <Users className="h-6 w-6 mb-2 text-primary" />
                <CardTitle>Character Management</CardTitle>
                <CardDescription>Track every character in your script.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                  Extract characters automatically and use the character list to track dialogue, relationships, and roles.
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
            &copy; {new Date().getFullYear()} Amharic Screenplay Writing Tool. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}