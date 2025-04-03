import Navbar from '../components/Navbar';
import Hero from '../components/Hero';

export function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-text font-sans">
      <Navbar />
      <Hero />
    </main>
  );
}
