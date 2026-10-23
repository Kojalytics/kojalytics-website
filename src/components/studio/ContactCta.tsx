import Link from "next/link";

export default function ContactCta() {
  return (
    <section className="border-t border-border px-5 py-24 md:px-6 md:py-32">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Work with us</p>
          <h2 className="display mt-3 text-5xl sm:text-6xl md:text-7xl">
            Have an app in mind? <span className="text-highlight">Tell us.</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Send us a few lines about your idea. You get an answer from the people who would build it, with questions and a first plan.
          </p>
        </div>
        <Link href="/contact" className="btn-primary shrink-0 text-base">
          Start a project
        </Link>
      </div>
    </section>
  );
}
