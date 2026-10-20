"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileSpreadsheet,
  HardDrive,
  MessagesSquare,
  MonitorCog,
  Palette,
  Receipt,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const categories = [
  {
    icon: FileSpreadsheet,
    title: "Office & Productivity",
    description: "Word processing, spreadsheets, presentations and email for single users and whole teams.",
  },
  {
    icon: MonitorCog,
    title: "Operating Systems",
    description: "Desktop operating systems for new machines, upgrades and fleets of workstations.",
  },
  {
    icon: HardDrive,
    title: "Server & Infrastructure",
    description: "Server software and client access licensing for offices, practices and growing companies.",
  },
  {
    icon: Palette,
    title: "Creative & Specialist Tools",
    description: "Design, video, project-planning and diagramming software for specialist roles.",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell us what you need",
    description: "Number of users and devices, how you work today and what you want to achieve.",
  },
  {
    number: "02",
    title: "Get a tailored offer",
    description: "We recommend the editions and license types that fit — no more than you need.",
  },
  {
    number: "03",
    title: "Licensing & setup",
    description: "You receive your licenses with an invoice, and we help with installation and activation.",
  },
];

const reasons = [
  {
    icon: MessagesSquare,
    title: "Personal advice",
    description: "A real person looks at your situation instead of a checkout page guessing for you.",
  },
  {
    icon: BriefcaseBusiness,
    title: "The right license type",
    description: "Home, business or volume — we explain the differences before you buy.",
  },
  {
    icon: Receipt,
    title: "Clear offers & invoices",
    description: "Transparent pricing in writing and proper invoices for your bookkeeping.",
  },
  {
    icon: Wrench,
    title: "Help with setup",
    description: "Support with installation and activation, so your team can get to work.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function SoftwarePage() {
  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20 px-6">
        <section className="max-w-4xl mx-auto text-center mb-28">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-sm font-mono text-accent tracking-wider uppercase">Software Licensing</span>
            <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight">
              The right software, <span className="gradient-text">licensed properly</span>
            </h1>
            <p className="mt-6 text-muted text-lg max-w-2xl mx-auto">
              We supply office suites, operating systems and business software to companies and individuals. Tell us what
              you need — we&apos;ll recommend the right licenses and help you get set up.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="btn-gradient inline-flex">
                <span className="inline-flex items-center gap-2">Request a consultation <ArrowRight className="w-4 h-4" /></span>
              </Link>
              <a href="#how-it-works" className="text-muted hover:text-foreground transition-colors text-sm font-medium">
                How it works
              </a>
            </div>
          </motion.div>
        </section>

        <section className="max-w-7xl mx-auto mb-32">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="text-sm font-mono text-accent tracking-wider uppercase">What We Supply</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">Software for every workplace</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((c, i) => (
              <motion.div key={c.title} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }} className="glass-card rounded-2xl p-8 group">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <c.icon className="w-6 h-6 text-accent-light" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{c.title}</h3>
                <p className="text-muted leading-relaxed">{c.description}</p>
              </motion.div>
            ))}
          </div>
          <motion.p {...fadeUp} className="mt-10 text-center text-muted max-w-2xl mx-auto">
            Looking for a specific product or edition? Ask us — we&apos;ll tell you what&apos;s available and what fits your
            setup.
          </motion.p>
        </section>

        <section id="how-it-works" className="max-w-6xl mx-auto mb-32 scroll-mt-28">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="text-sm font-mono text-accent tracking-wider uppercase">How It Works</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">From request to running software</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div key={s.number} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }} className="glass-card rounded-2xl p-8">
                <span className="font-mono text-sm text-accent-light">{s.number}</span>
                <h3 className="mt-3 text-xl font-semibold mb-3">{s.title}</h3>
                <p className="text-muted leading-relaxed">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto mb-32">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="text-sm font-mono text-accent tracking-wider uppercase">Why Kojalytics</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">Advice first, then the license</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map((r, i) => (
              <motion.div key={r.title} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }} className="glass-card rounded-2xl p-8">
                <r.icon className="w-6 h-6 text-accent-light mb-5" />
                <h3 className="text-lg font-semibold mb-2">{r.title}</h3>
                <p className="text-muted leading-relaxed">{r.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <motion.section {...fadeUp} className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-10 md:p-14 text-center">
            <ShieldCheck className="w-10 h-10 text-accent-light mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Not sure which license you need?</h2>
            <p className="mt-5 text-muted text-lg max-w-xl mx-auto">
              Send us a short message about your team and devices. We&apos;ll get back to you with a clear recommendation.
            </p>
            <Link href="/contact" className="btn-gradient inline-flex mt-10">
              <span className="inline-flex items-center gap-2">Talk to us <ArrowRight className="w-4 h-4" /></span>
            </Link>
          </div>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
