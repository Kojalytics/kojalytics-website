"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";

// three.js only runs in the browser; loading it lazily keeps it out of the first paint.
const AgenticFactory3D = dynamic(() => import("@/components/ui/agentic-factory-3d"), { ssr: false });

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function Hero() {
  const [sceneReady, setSceneReady] = useState(false);

  return (
    <section className="relative min-h-screen flex flex-col min-[901px]:flex-row min-[901px]:items-center pt-28 min-[901px]:pt-20 overflow-hidden">
      {/* 3D machine: full-bleed behind the headline on wide screens, its own block below the text on phones */}
      <div
        className={`order-2 relative h-[440px] min-[901px]:absolute min-[901px]:inset-0 min-[901px]:h-auto max-[900px]:pointer-events-none transition-opacity duration-1000 ${
          sceneReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <AgenticFactory3D embed height="100%" className="bg-transparent!" onReady={() => setSceneReady(true)} />
      </div>

      <div className="order-1 relative z-10 w-full max-w-7xl mx-auto px-6 text-center min-[901px]:text-left">
        <div className="min-[901px]:max-w-[40%]">
          <motion.div {...reveal(0)}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface/50 backdrop-blur-sm mb-8">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-muted">Available for new projects</span>
            </div>
          </motion.div>

          <motion.h1
            {...reveal(0.1)}
            className="text-5xl sm:text-6xl min-[901px]:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            We build software
            <br />
            <span className="gradient-text">that moves.</span>
          </motion.h1>

          <motion.p {...reveal(0.2)} className="mt-8 text-lg md:text-xl text-muted leading-relaxed">
            From mobile apps to full-stack platforms — we design, develop, and
            ship digital products that make a real impact. Our own apps.
            Your vision. One studio.
          </motion.p>

          <motion.div
            {...reveal(0.3)}
            className="mt-12 flex flex-col sm:flex-row items-center min-[901px]:items-start justify-center min-[901px]:justify-start gap-4"
          >
            <Link href="/contact" className="btn-gradient text-base">
              <span>Start a Project</span>
            </Link>
            <Link href="#work" className="btn-outline text-base">
              See Our Work
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
