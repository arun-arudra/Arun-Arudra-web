import { Link } from "react-router-dom";
import { useState } from "react";
import { Facebook, Instagram, Linkedin, Github, ArrowRight } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const footerLinks = [
  { label: "HOME", path: "/" },
  { label: "SERVICES", path: "/services" },
  { label: "PROJECTS", path: "/projects" },
  { label: "ABOUT", path: "/about" },
  { label: "NEWS", path: "/news" },
  { label: "CONTACT", path: "/contact" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: () => <span className="font-bold text-sm">𝕏</span>, href: "#", label: "X" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({ email });
      if (error) {
        if (error.code === "23505") {
          toast({ title: "Already subscribed!", description: "This email is already on our list." });
        } else {
          throw error;
        }
      } else {
        toast({ title: "Subscribed!", description: "Welcome to the ArunArudra newsletter." });
        setEmail("");
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <footer id="footer" className="bg-foreground text-background pt-16 pb-6 relative">
      <div className="container mx-auto px-6">
        {/* CTA Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Newsletter */}
          <div className="rounded-2xl border border-background/10 p-8 md:p-10">
            <h3 className="font-display text-2xl font-bold mb-3">Newsletter subscribe!</h3>
            <p className="text-background/70 mb-6">
              Enter your email to unlock an exclusive 10% discount on professional website development tailored to your business needs.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/10 border-background/20 text-background placeholder:text-background/40 flex-1"
                required
              />
              <Button type="submit" disabled={loading} className="rounded-full px-6">
                Subscribe
              </Button>
            </form>
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-primary p-8 md:p-10 text-primary-foreground">
            <h3 className="font-display text-2xl font-bold mb-3">Have more questions?</h3>
            <p className="text-primary-foreground/80 mb-6">
              Let's schedule a short call to discuss how we can work together and contribute to the success of your project or idea.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all"
            >
              Book a call now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Links + Social */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-t border-background/10">
          <nav className="flex flex-wrap items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-background/70 hover:text-primary transition-colors tracking-wider"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-9 h-9 rounded-full flex items-center justify-center text-background/70 hover:text-primary hover:bg-background/10 transition-all"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-background/10 text-sm text-background/50">
          <p>Copyright © 2026 - ArunArudra</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-background transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-background transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
