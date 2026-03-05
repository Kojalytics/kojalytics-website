"use client";

import { motion } from "framer-motion";
import { Smartphone, Globe, Cpu, Palette, Server, Zap } from "lucide-react";

const services = [
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description:
      "Native iOS and Android apps built with SwiftUI and modern frameworks. Polished, performant, and ready for the App Store.",
  },
  {
    icon: Globe,
    title: "Web Applications",
    description:
      "Full-stack web platforms using Next.js, React, and cloud-native backends. Scalable from day one.",
  },
  {
    icon: Cpu,
    title: "AI Integration",
    description:
      "We bring AI into your products — image generation, NLP, computer vision. Smart features that delight users.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Interfaces that feel intuitive and look stunning. We obsess over every pixel, animation, and micro-interaction.",
  },
  {
    icon: Server,
    title: "Backend & Cloud",
    description:
      "Robust APIs, real-time databases, and serverless infrastructure. Supabase, AWS, Vercel — we pick the right stack.",
  },
  {
    icon: Zap,
    title: "Custom Solutions",
    description:
      "Got a unique challenge? We love building things that don't exist yet. From MVPs to enterprise tools.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function Services() {
  return (
    <section id="services" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-sm font-mono text-accent tracking-wider uppercase">
            What We Do
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            End-to-end digital <span className="gradient-text">craftsmanship</span>
          </h2>
          <p className="mt-6 text-muted text-lg max-w-2xl mx-auto">
            We don&apos;t just write code. We engineer experiences — from concept through
            launch and beyond.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="glass-card rounded-2xl p-8 group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <service.icon className="w-6 h-6 text-accent-light" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
