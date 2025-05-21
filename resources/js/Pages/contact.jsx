import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";

export default function Contact() {
      const { url } = usePage(); 
  return (
    <div className="flex min-h-screen flex-col">
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
    <Link href="/dashboard">
        <Button variant="outline" size="sm">Login</Button>
      </Link>
      <Link href="/signup">
        <Button size="sm">Register</Button>
      </Link>
    </div>
  </div>
</header>

      {/* Contact Form Section */}
      <main className="flex-1 w-full px-10 py-16">
        <div className="container max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 text-lg">
            We'd love to hear from you. Whether you're a writer, director, educator, or enthusiast — drop us a message!
          </p>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input type="text" placeholder="Your Name" required />
              <Input type="email" placeholder="Your Email" required />
            </div>
            <Input type="text" placeholder="Subject" required />
            <Textarea placeholder="Your Message..." rows={5} required />
            <Button type="submit" size="lg" className="w-full md:w-auto">Send Message</Button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 px-10">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Amharic Screenplay Writing Tool. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
