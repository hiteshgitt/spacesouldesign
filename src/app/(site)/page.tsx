import Hero from "@/components/home/Hero";
import Statement from "@/components/home/Statement";
import SelectedWorks from "@/components/home/SelectedWorks";
import Difference from "@/components/home/Difference";
import BlueprintShowcase from "@/components/home/BlueprintShowcase";
import Capabilities from "@/components/home/Capabilities";
import Credibility from "@/components/home/Credibility";
import ContactFinale from "@/components/home/ContactFinale";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Statement />
      <SelectedWorks />
      <Difference />
      <BlueprintShowcase />
      <Capabilities />
      <Credibility />
      <ContactFinale />
    </>
  );
}
