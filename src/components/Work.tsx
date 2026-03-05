"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const projects = [
  {
    title: "PortraitPro AI",
    category: "iOS App",
    description:
      "AI-powered professional portrait generator. Upload selfies, get studio-quality headshots in minutes. Built with SwiftUI, Supabase, and Google Gemini.",
    tags: ["SwiftUI", "AI/ML", "Supabase"],
    gradient: "from-indigo-500/20 to-purple-500/20",
    accentColor: "text-indigo-400",
    link: "/support",
  },
  {
    title: "BILDER AI",
    category: "AI Platform",
    description:
      "Next-generation image creation platform powered by cutting-edge AI models. Create stunning visuals from text descriptions.",
    tags: ["Next.js", "AI", "Cloud"],
    gradient: "from-blue-500/20 to-cyan-500/20",
    accentColor: "text-blue-400",
    link: "#",
  },
  {
    title: "Your Project",
    category: "Coming Soon",
    description:
      "We're always looking for exciting new challenges. Have an idea? Let's make it real together.",
    tags: ["Your Stack", "Your Vision", "Our Craft"],
    gradient: "from-emerald-500/20 to-teal-500/20",
    accentColor: "text-emerald-400",
    link: "/contact",
  },
];

export default function Work() {
  return (
    <section id="work" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-sm font-mono text-accent tracking-wider uppercase">
            Our Work
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            Products we&apos;re <span className="gradient-text">proud of</span>
          </h2>
          <p className="mt-6 text-muted text-lg max-w-2xl mx-auto">
            We build our own products and bring client visions to life.
            Here&apos;s what we&apos;ve been shipping.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <Link href={project.link} className="block h-full">
                <div className="glass-card rounded-2xl p-8 h-full flex flex-col group cursor-pointer">
                  <div
                    className={`w-full h-48 rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center mb-6 relative overflow-hidden`}
                  >
                    <span className="text-5xl font-bold opacity-20">
                      {project.title.charAt(0)}
                    </span>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-5 h-5 text-foreground/50" />
                    </div>
                  </div>

                  <span className={`text-xs font-mono ${project.accentColor} tracking-wider uppercase`}>
                    {project.category}
                  </span>
                  <h3 className="text-2xl font-bold mt-2 mb-3">{project.title}</h3>
                  <p className="text-muted leading-relaxed flex-1">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full border border-border text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
