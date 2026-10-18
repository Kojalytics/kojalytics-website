"use client";

import dynamic from "next/dynamic";

// three.js only runs in the browser; loading it lazily keeps it out of the first paint.
const AgenticFactory3D = dynamic(() => import("@/components/ui/agentic-factory-3d"), { ssr: false });

export default function MachineShowcase() {
  return (
    // pt-20 keeps the scene's own top bar clear of the fixed site navigation.
    <section id="explore" className="relative pt-20 bg-black">
      <AgenticFactory3D height="max(560px, calc(100svh - 5rem))" />
    </section>
  );
}
