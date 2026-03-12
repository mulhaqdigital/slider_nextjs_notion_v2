import { Suspense } from 'react';
import { getCards } from '@/lib/data';
import { CardsGrid } from '@/components/cards-grid';

export const revalidate = 1800;

async function CardsSection() {
  const cards = await getCards();
  return <CardsGrid initialCards={cards} />;
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-black/8 bg-white dark:border-white/8 dark:bg-zinc-900">
          <div className="aspect-[4/3] w-full animate-pulse bg-zinc-100 dark:bg-zinc-800" />
          <div className="flex flex-col gap-2 p-4">
            <div className="h-3.5 w-3/4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-3 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PagesView() {
  return (
    <main className="min-h-screen px-6 pt-20 pb-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-semibold">All Cards</h1>
        <Suspense fallback={<GridSkeleton />}>
          <CardsSection />
        </Suspense>
      </div>
    </main>
  );
}
