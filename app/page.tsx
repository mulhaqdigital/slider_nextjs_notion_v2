  import { Suspense } from 'react';
import { getCards } from '@/lib/data';
import { CardSlider } from '@/components/card-slider';
import { CardSliderSkeleton } from '@/components/card-slider-skeleton';
import LogoCloud from '@/components/logo-cloud';

export const revalidate = 1800;

async function SliderSection() {
  const cards = await getCards();
  return <CardSlider cards={cards} />;
}

export default function Home() {
  return (
    <main className="min-h-screen pt-20 pb-5">
      <div className="container mx-auto flex flex-col items-center justify-center">
        {/* Hero */}
        <div className="flex flex-col items-center gap-4 text-center max-w-2xl">
          <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
            DeTA Community &middot; Build &middot; Inspire &middot; Grow
          </span>
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            Every Project{' '}
            <span className="bg-gradient-to-r from-foreground via-foreground/70 to-foreground/40 bg-clip-text text-transparent">
              Has a Story
            </span>
          </h1>
          <p className="text-base text-muted-foreground max-w-md">
            A space for the DeTA community to share, discover, and get inspired by projects — anything that takes planning, teamwork, and continuous effort to build.
          </p>
        </div>

        <div className="w-full">
          <Suspense fallback={<CardSliderSkeleton />}>
            <SliderSection />
          </Suspense>
        </div>
        <LogoCloud />
      </div>
    </main>
  );
}
