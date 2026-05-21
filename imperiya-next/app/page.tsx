import { Hero } from "@/components/sections/Hero";
import { Calculator } from "@/components/sections/calculator/Calculator";
import { ProfileSeries } from "@/components/sections/ProfileSeries";
import { GlassUnits } from "@/components/sections/GlassUnits";
import { Services } from "@/components/sections/Services";
import { Stats } from "@/components/sections/Stats";
import { Certificates } from "@/components/sections/Certificates";
import { Partners } from "@/components/sections/Partners";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Calculator />
      <ProfileSeries />
      <GlassUnits />
      <Services />
      <Stats />
      <Certificates />
      <Partners />
    </>
  );
}
