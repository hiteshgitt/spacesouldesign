/** Typographic wordmark. Replace with the official logo SVG when supplied. */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-[0.35em] leading-none ${className}`}>
      <span className="font-display font-[800] tracking-[-0.02em] [font-stretch:115%]">SPACE</span>
      <span className="font-serif italic text-[1.15em] leading-none">&amp;</span>
      <span className="font-display font-[800] tracking-[-0.02em] [font-stretch:115%]">SOUL</span>
    </span>
  );
}
