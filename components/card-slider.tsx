'use client';

import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Card as CardType } from '@/lib/data';
import styles from './card-slider.module.css';

const AUTOPLAY_INTERVAL = 3000;

const NOTION_COLORS: Record<string, string> = {
  default: '#6b7280',
  gray: '#9ca3af',
  brown: '#92400e',
  orange: '#ea580c',
  yellow: '#ca8a04',
  green: '#16a34a',
  blue: '#2563eb',
  purple: '#7c3aed',
  pink: '#db2777',
  red: '#dc2626',
};

const NOTION_BG: Record<string, string> = {
  default: '#f3f4f6',
  gray: '#f3f4f6',
  brown: '#fef3c7',
  orange: '#ffedd5',
  yellow: '#fefce8',
  green: '#dcfce7',
  blue: '#dbeafe',
  purple: '#ede9fe',
  pink: '#fce7f3',
  red: '#fee2e2',
};

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface CardSliderProps {
  cards: CardType[];
}

export function CardSlider({ cards }: CardSliderProps) {
  const [shuffledCards, setShuffledCards] = useState(cards);
  const [api, setApi] = useState<CarouselApi>();
  const isPaused = useRef(false);

  useEffect(() => {
    setShuffledCards(shuffleArray(cards));
  }, [cards]);

  const advance = useCallback(() => {
    if (!api || isPaused.current) return;
    if (!api.canScrollNext()) {
      api.scrollTo(0);
    } else {
      api.scrollNext();
    }
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const id = setInterval(advance, AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [api, advance]);

  if (cards.length === 0) {
    return (
      <div className="w-full max-w-[72rem] mx-auto px-4 py-16 text-center text-gray-500">
        <p className="text-lg">No cards available. Add entries to data/cards.json.</p>
      </div>
    );
  }

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: 'start', loop: true }}
      className={styles.carouselWrapper}
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
    >
      <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
      <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
      <CarouselContent className={styles.carouselContent}>
        {shuffledCards.map((card) => (
          <CarouselItem key={card.id} className={styles.carouselItem}>
            <Link
              href={card.link || '#'}
              target={card.link ? '_blank' : undefined}
              className={styles.cardLink}
            >
              <Card className={styles.card}>
                <div className={styles.imageContainer}>
                  {card.imageUrl ? (
                    <Image
                      src={card.imageUrl}
                      alt={card.title}
                      fill
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <ImageIcon className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <CardHeader className={styles.cardHeader}>
                  <CardTitle className={styles.cardTitle}>
                    {card.title || 'Untitled'}
                  </CardTitle>
                  <CardDescription className={styles.cardDescription}>
                    {card.description || 'No description available'}
                  </CardDescription>
                </CardHeader>
                <CardContent className={styles.cardContent}>
                  {card.labels && card.labels.length > 0 && (
                    <div className={styles.labelsContainer}>
                      {card.labels.map((label) => (
                        <span
                          key={label.name}
                          className={styles.labelChip}
                          style={{
                            backgroundColor: NOTION_BG[label.color] ?? NOTION_BG.default,
                            color: NOTION_COLORS[label.color] ?? NOTION_COLORS.default,
                          }}
                        >
                          {label.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className={styles.authorContainer}>
                    <div className={styles.authorAvatar}>
                      <User size={14} className="text-white" />
                    </div>
                    <span className={styles.authorName}>{card.author || 'Anonymous'}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
