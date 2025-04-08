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
export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col px-10">
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">
              Amharic Screenplay Writing Tool
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://github.com/AASTUSoftwareEngineeringDepartment/AmharicScreenwrittingApp"
                target="_blank"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
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
                  <Link href="/dashboard">
                    <Button size="lg">Try Now</Button>
                  </Link>
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
              <Card>
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
              </Card>
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
      <footer className="w-full border-t py-6 md:py-0">
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