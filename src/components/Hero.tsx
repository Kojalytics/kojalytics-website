"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";

// three.js only runs in the browser; loading it lazily keeps it out of the first paint.
const AgenticFactory3D = dynamic(() => import("@/components/ui/agentic-factory-3d"), { ssr: false });

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function Hero() {
  return (
    <section id="explore" className="relative h-[max(960px,100svh)] min-[901px]:h-[max(680px,100svh)] bg-black">
      <AgenticFactory3D hero height="100%" />

      {/* Headline inside the scene: the layer lets drags through to the machine, only its links take clicks */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 pt-28 min-[901px]:inset-y-0 min-[901px]:pt-0 min-[901px]:flex min-[901px]:items-center">
        <div className="w-full max-w-7xl mx-auto px-6 min-[901px]:px-10">
          <div className="min-[901px]:max-w-[42%]">
            <motion.div {...reveal(0.1)} className="flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase text-[#959790]">
              <span className="w-[22px] h-px bg-accent" />
              Kojalytics · Software studio
            </motion.div>

            <motion.h1
              {...reveal(0.2)}
              className="mt-6 text-[2.75rem] leading-[1.02] sm:text-6xl min-[901px]:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-[-0.035em] text-[#f4f1ea]"
            >
              We build software
              <br />
              <span className="gradient-text">that moves.</span>
            </motion.h1>

            <motion.p {...reveal(0.3)} className="mt-6 max-w-md text-base lg:text-lg leading-relaxed text-[#9da1a8]">
              From mobile apps to full-stack platforms, plus a store for the software you use every day.
              Spin the machine: this is how an order runs through Kojalytics.
            </motion.p>

            <motion.div {...reveal(0.4)} className="mt-8 flex items-center gap-3">
              <Link href="/contact" className="pointer-events-auto btn-gradient text-sm whitespace-nowrap max-[900px]:!px-6">
                <span>Start a Project</span>
              </Link>
              <Link href="#work" className="pointer-events-auto btn-outline text-sm whitespace-nowrap max-[900px]:!px-6">
                See Our Work
              </Link>
            </motion.div>

            <motion.div {...reveal(0.5)} className="mt-8 hidden min-[901px]:flex items-center gap-2 text-[10px] text-[#a6a79f]">
              <i className="w-[5px] h-[5px] rounded-full bg-accent shadow-[0_0_10px_#6366f160]" />
              Available for new projects
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
