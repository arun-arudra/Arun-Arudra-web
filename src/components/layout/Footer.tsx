import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, Github, ArrowRight, Send } from "lucide-react";
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
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: () => <span className="font-bold text-sm">𝕏</span>, href: "#", label: "X" },
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Linkedin, href: "#", label: "LinkedIn" },
  { Icon: Github, href: "#", label: "GitHub" },
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
    <footer
      id="footer"
      className="relative pt-16 pb-6 bg-[#0a0a0a] text-white dark:bg-black dark:text-white"
    >
      {/* Subtle animated gradient orb */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-6 relative">
        {/* CTA Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Newsletter */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="rounded-2xl border border-white/10 p-8 md:p-10 bg-white/[0.02] backdrop-blur-sm"
          >
            <h3 className="font-display text-2xl font-bold mb-3">Newsletter subscribe!</h3>
            <p className="text-white/70 mb-6">
              Enter your email to unlock an exclusive 10% discount on professional website development tailored to your business needs.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/15 text-white placeholder:text-white/40 flex-1"
                required
              />
              <Button type="submit" disabled={loading} className="rounded-full px-6 group">
                <Send className="h-4 w-4 mr-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                Subscribe
              </Button>
            </form>
          </motion.div>

          {/* CTA */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="rounded-2xl bg-primary p-8 md:p-10 text-primary-foreground relative overflow-hidden group"
          >
            <motion.div
              aria-hidden
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background: "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.15), transparent 50%)",
              }}
              onMouseMove={(e) => {
                const t = e.currentTarget as HTMLDivElement;
                const r = t.getBoundingClientRect();
                t.style.setProperty("--mx", `${e.clientX - r.left}px`);
                t.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
            />
            <h3 className="font-display text-2xl font-bold mb-3 relative">Have more questions?</h3>
            <p className="text-primary-foreground/80 mb-6 relative">
              Let's schedule a short call to discuss how we can work together and contribute to the success of your project or idea.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all relative"
            >
              Book a call now
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
          </motion.div>
        </div>

        {/* Links + Social */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-t border-white/10">
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative text-sm font-medium text-white/70 hover:text-primary transition-colors tracking-wider group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {socialLinks.map(({ Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-primary hover:bg-white/10 transition-colors"
              >
                <Icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 text-sm text-white/50">
          <p>Copyright © 2026 - ArunArudra</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
