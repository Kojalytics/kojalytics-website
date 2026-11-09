/**
 * The numbered label bar that opens every section: "01 / Die Apps" on the left, a meta line on the right.
 * Place it as the first child of a `.rail` section; with `crosshairs` the section's top corners get "+" ticks.
 */
export default function SectionBar({ index, label, meta }: { index: string; label: string; meta?: string }) {
  return (
    <div className="section-bar">
      <p className="hud">
        <span className="text-faint">{index}</span>
        <span className="mx-2 text-faint">/</span>
        <span className="text-foreground">{label}</span>
      </p>
      {meta && <p className="hud hidden text-right sm:block">{meta}</p>}
    </div>
  );
}
