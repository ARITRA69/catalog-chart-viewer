import { CurrentVolume } from "@/components/current-volume";
import { Dashboard } from "@/components/dashboard";

export default function Home() {
  return (
    <main className="container py-20 flex flex-col gap-10 w-full">
      <CurrentVolume />
      <Dashboard />
    </main>
  );
}
