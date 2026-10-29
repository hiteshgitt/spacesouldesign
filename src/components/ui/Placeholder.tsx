import { showPlaceholders } from "@/content/site";

/** Amber marker for unconfirmed content. Hidden when NEXT_PUBLIC_SHOW_PLACEHOLDERS=false. */
export default function Placeholder({ children = "Placeholder", title, className = "" }: {
  children?: React.ReactNode;
  title?: string;
  className?: string;
}) {
  if (!showPlaceholders) return null;
  return (
    <span className={`tag tag-placeholder ${className}`} title={title}>
      <span aria-hidden>◆</span> {children}
    </span>
  );
}
