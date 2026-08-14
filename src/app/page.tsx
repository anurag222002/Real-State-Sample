import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Legacy } from "@/components/home/Legacy";
import { Principles } from "@/components/home/Principles";
import { Rise } from "@/components/home/Rise";
import { Construction } from "@/components/home/Construction";
import { CollectionRail } from "@/components/home/CollectionRail";
import { Partners } from "@/components/home/Partners";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Legacy />
      <Principles />
      <Rise />
      <Construction />
      <CollectionRail />
      <Partners />
    </>
  );
}
