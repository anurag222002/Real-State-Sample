import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { MenuCatalog } from "@/components/home/MenuCatalog";
import { Ladder } from "@/components/home/Ladder";
import { Atmosphere } from "@/components/home/Atmosphere";
import { LocationsRail } from "@/components/home/LocationsRail";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <MenuCatalog />
      <Ladder />
      <Atmosphere />
      <LocationsRail />
    </>
  );
}
