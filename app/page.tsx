import { getCards } from '@/lib/notion';
import { CardSlider } from '@/components/card-slider';
import LogoCloud from '@/components/logo-cloud'

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const cards = await getCards();

  return (
    <main className="min-h-screen py-5">
      <div className="container mx-auto flex flex-col items-center justify-center">
          <h3 className="text-center text-4xl font-semibold lg:text-3xl">Powered by DeTA</h3>
          
        <CardSlider cards={cards} />
        
        <LogoCloud />
      </div>
    </main>
  );
}
