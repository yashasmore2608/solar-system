import SolarSystemExperience from "@/components/space/SolarSystemExperience";
import { Loader } from "@/components/space/Loader";

export default function Home() {
  return (
    <main className="relative bg-black min-h-screen w-full selection:bg-white/30 text-white">
      <Loader />
      <SolarSystemExperience />
    </main>
  );
}
