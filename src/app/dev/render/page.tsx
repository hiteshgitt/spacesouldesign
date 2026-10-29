import { notFound } from "next/navigation";
import RenderStage from "./RenderStage";

/** Offline render target for `npm run renders`. Never served in production. */
export default function RenderPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <RenderStage />;
}
