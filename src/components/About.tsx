"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "3+", label: "Products Shipped" },
  { value: "100%", label: "Passion-Driven" },
  { value: "24/7", label: "Dedication" },
  { value: "∞", label: "Ideas in Queue" },
];

export default function About() {
  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-mono text-accent tracking-wider uppercase">
              About Us
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Small team.
              <br />
              <span className="gradient-text">Big ambitions.</span>
            </h2>
            <p className="mt-8 text-muted text-lg leading-relaxed">
              Kojalytics is a software studio that believes great software comes from
              obsessive attention to detail. We build our own products — and we
              bring the same passion to every client project.
            </p>
            <p className="mt-4 text-muted text-lg leading-relaxed">
              Whether it&apos;s an AI-powered iOS app or a full-stack web platform,
              we don&apos;t cut corners. We ship software that looks beautiful,
              works flawlessly, and scales with your ambition.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              {["SwiftUI", "Next.js", "React", "TypeScript", "Supabase", "AI/ML", "Node.js", "PostgreSQL"].map(
                (tech) => (
                  <span
                    key={tech}
                    className="text-sm px-4 py-2 rounded-full border border-border text-muted hover:text-foreground hover:border-accent/30 transition-colors"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="glass-card rounded-2xl p-8 text-center"
              >
                <div className="text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="mt-2 text-sm text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
