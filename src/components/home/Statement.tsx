import SplitReveal from "@/components/motion/SplitReveal";
import Reveal from "@/components/motion/Reveal";

export default function Statement() {
  return (
    <section className="relative bg-paper py-[var(--section-y-xl)]" aria-labelledby="statement-title">
      <div className="shell grid-12 gap-y-12">
        <p className="t-mono col-span-12 text-stone md:col-span-3">(01) — Position</p>
        <div className="col-span-12 md:col-span-9">
          <SplitReveal as="h2" id="statement-title" className="t-display-sm text-ink" by="lines">
            Not just a stall. <span className="t-serif normal-case text-cobalt">A world</span> of its own.
          </SplitReveal>
          <Reveal className="mt-14 grid gap-10 md:grid-cols-2" y={20}>
            <p className="t-lead text-ink/80" data-reveal-item>
              A trade-show floor is loud, bright and full of competing messages. We design spaces that change pace
              the moment someone steps inside — a clear idea, a considered route and details that hold attention.
            </p>
            <p className="t-body text-ink/65" data-reveal-item>
              Every project moves through the same discipline: understand the brand and the venue, imagine the
              experience, engineer it to be built, fabricate it with care and deliver it on site exactly as drawn.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
