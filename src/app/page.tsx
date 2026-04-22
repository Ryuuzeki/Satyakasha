import { Navbar } from '@/components/ui/Navbar';
import { Hero } from '@/components/ui/Hero';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
    </main>
  );
}
