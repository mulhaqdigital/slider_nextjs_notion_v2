'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Card as CardType } from '@/lib/data';
import styles from './card-slider.module.css';

import 'swiper/css';
import 'swiper/css/navigation';

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
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setShuffledCards(shuffleArray(cards));
  }, [cards]);

  if (cards.length === 0) {
    return (
      <div className="w-full py-16 text-center text-gray-500">
        <p className="text-lg">No cards available. Add entries to data/cards.json.</p>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <div className="relative">
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          loop={true}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onBeforeInit={(swiper) => {
            if (typeof swiper.params.navigation === 'object') {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
          }}
          slidesPerView={1}
          spaceBetween={16}
          centeredSlides={true}
          breakpoints={{
            640: { slidesPerView: 1.2, spaceBetween: 16 },
            768: { slidesPerView: 2, spaceBetween: 20, centeredSlides: false },
            1024: { slidesPerView: 3, spaceBetween: 24, centeredSlides: false },
          }}
          className="w-full"
        >
          {shuffledCards.map((card) => (
            <SwiperSlide key={card.id}>
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
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom nav buttons — desktop only */}
        <button
          ref={prevRef}
          className={styles.navPrev}
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>
        <button
          ref={nextRef}
          className={styles.navNext}
          aria-label="Next slide"
        >
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
