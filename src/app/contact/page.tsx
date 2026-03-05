"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-mono text-accent tracking-wider uppercase">
              Get In Touch
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
              Let&apos;s build something <span className="gradient-text">great</span>
            </h1>
            <p className="mt-6 text-muted text-lg max-w-xl mx-auto">
              Have a project in mind? Need an app built? Or just want to say
              hello? We&apos;d love to hear from you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="glass-card rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-accent-light" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <a
                      href="mailto:support@kojalytics.com"
                      className="text-muted hover:text-accent-light transition-colors text-sm mt-1 block"
                    >
                      support@kojalytics.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-accent-light" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-muted text-sm mt-1">
                      Germany
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-8">
                <h3 className="font-semibold mb-3">What to expect</h3>
                <ul className="space-y-3">
                  {[
                    "Response within 24 hours",
                    "Free initial consultation",
                    "Detailed project proposal",
                    "Transparent pricing",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-muted text-sm">
                      <ArrowRight className="w-4 h-4 text-accent-light shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <form
                action={`mailto:support@kojalytics.com`}
                method="POST"
                encType="text/plain"
                className="glass-card rounded-2xl p-8 space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors text-foreground placeholder:text-muted/50"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors text-foreground placeholder:text-muted/50"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <select
                    name="subject"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors text-foreground"
                  >
                    <option value="project">New Project</option>
                    <option value="support">App Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors text-foreground placeholder:text-muted/50 resize-none"
                    placeholder="Tell us about your project or question..."
                  />
                </div>

                <button type="submit" className="btn-gradient w-full text-base">
                  <span>Send Message</span>
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
