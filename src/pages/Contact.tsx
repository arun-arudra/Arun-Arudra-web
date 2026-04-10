import { Layout } from "../components/layout/Layout";
import { AnimatedSection } from "../components/AnimatedSection";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Mail, Send } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert(form);
      if (error) throw error;
      toast({ title: "Message sent!", description: "I'll get back to you shortly." });
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className="pt-24 pb-24 md:pt-32 md:pb-32 min-h-[80vh]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <AnimatedSection>
                <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">Contact</p>
                <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">Let's Create Something Great Together</h1>
                <p className="text-muted-foreground text-lg mb-8">
                  Have a project idea, a question, or just want to say hi? Fill out the form and I'll get back to you within 24 hours.
                </p>
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email me at</p>
                    <a href="mailto:hi@arunarudra.com" className="font-medium hover:text-primary transition-colors">hi@arunarudra.com</a>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            <AnimatedSection delay={0.2}>
              <form onSubmit={handleSubmit} className="p-8 md:p-10 rounded-2xl border border-border bg-card space-y-6">
                <div>
                  <label htmlFor="name" className="text-sm font-medium mb-2 block">Your Name</label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="rounded-xl h-12"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium mb-2 block">Email Address</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="rounded-xl h-12"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="text-sm font-medium mb-2 block">Your Message</label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="rounded-xl min-h-[140px]"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} size="lg" className="rounded-full w-full text-base">
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </Layout>
  );
}
