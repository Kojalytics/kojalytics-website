"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileSpreadsheet, HardDrive, MonitorCog } from "lucide-react";

const highlights = [
  { icon: FileSpreadsheet, label: "Office & productivity" },
  { icon: MonitorCog, label: "Operating systems" },
  { icon: HardDrive, label: "Server & business software" },
];

export default function SoftwareTeaser() {
  return (
    <section id="software" className="py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto glass-card rounded-3xl p-10 md:p-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
      >
        <div>
          <span className="text-sm font-mono text-accent tracking-wider uppercase">Software Licensing</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            Software for your business, <span className="gradient-text">with advice included</span>
          </h2>
          <p className="mt-5 text-muted text-lg">
            We supply office suites, operating systems and business software — and help you choose the right licenses
            for your team.
          </p>
          <Link href="/software" className="btn-gradient inline-flex mt-8">
            <span className="inline-flex items-center gap-2">Explore software licensing <ArrowRight className="w-4 h-4" /></span>
          </Link>
        </div>
        <ul className="space-y-4">
          {highlights.map((h) => (
            <li key={h.label} className="flex items-center gap-4 rounded-2xl border border-border bg-surface/60 px-5 py-4">
              <span className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <h.icon className="w-5 h-5 text-accent-light" />
              </span>
              <span className="font-medium">{h.label}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
