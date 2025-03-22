'use client';

/**
 * Card Slider Component
 * A responsive carousel that displays cards with images, titles, descriptions, and author information.
 * Built with Next.js, shadcn/ui, and Notion integration.
 * 
 * @component
 * @example
 * ```tsx
 * <CardSlider cards={notionCards} />
 * ```
 * 
 * Dependencies:
 * - shadcn/ui (Carousel, Card components)
 * - next/image (Image optimization)
 * - lucide-react (Icons)
 * - Tailwind CSS (Styling)
 */

import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'; // shadcn/ui carousel component
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'; // shadcn/ui card component
import { User, Image as ImageIcon } from 'lucide-react'; // Icons from lucide-react
import Image from 'next/image';
import Link from 'next/link';
import type { Card as CardType } from '@/lib/notion';
import styles from './card-slider.module.css';

/**
 * Props interface for the CardSlider component
 * @interface
 * @property {CardType[]} cards - Array of card data from Notion
 */
interface CardSliderProps {
  cards: CardType[];
}

export function CardSlider({ cards }: CardSliderProps) {
  return (
    // Main carousel wrapper with responsive max-width and padding
    <Carousel
      opts={{
        align: 'start',
        loop: true, // Enable infinite loop
      }}
      className={styles.carouselWrapper}
    >
      {/* Carousel content with negative margin for alignment */}
      <CarouselContent className={styles.carouselContent}>
        {cards.map((card) => (
          // Individual card item with responsive width breakpoints
          <CarouselItem 
            key={card.id} 
            className={styles.carouselItem}
          >
            {/* Card link wrapper with hover and focus effects */}
            <Link 
              href={card.link || '#'} 
              target={card.link ? "_blank" : undefined} 
              className={styles.cardLink}
            >
              {/* Main card component with gradient background */}
              <Card className={styles.card}>
                {/* Image section with gradient background fallback */}
                <div className={styles.imageContainer}>
                  {card.imageUrl ? (
                    <Image
                      src={card.imageUrl}
                      alt={card.title}
                      fill
                      className={styles.image}
                      sizes="(max-width: 250px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    // Placeholder icon when no image is available
                    <div className={styles.imagePlaceholder}>
                      <ImageIcon className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                {/* Card content section */}
                <CardHeader className={styles.cardHeader}>
                  {/* Title with single line truncation */}
                  <CardTitle className={styles.cardTitle}>
                    {card.title || 'Untitled'}
                  </CardTitle>
                  {/* Description with two-line truncation */}
                  <CardDescription className={styles.cardDescription}>
                    {card.description || 'No description available'}
                  </CardDescription>
                </CardHeader>
                {/* Author section */}
                <CardContent className={styles.cardContent}>
                  <div className={styles.authorContainer}>
                    {/* Author avatar with gradient background */}
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
      {/* Navigation buttons */}
      <div className={styles.navigationContainer}>
        <CarouselPrevious className={styles.navButton} />
        <CarouselNext className={styles.navButton} />
      </div>
    </Carousel>
  );
}

/**
 * Style References:
 * 
 * Breakpoints:
 * - Mobile: < 768px (1 card)
 * - Tablet: 768px - 1024px (2 cards)
 * - Desktop: > 1024px (3 cards)
 * 
 * Colors:
 * - Gradient backgrounds: blue-400 to purple-500
 * - Card background: white to gray-50 (light), gray-900 to gray-950 (dark)
 * - Text: Default theme colors with muted variants
 * 
 * Animations:
 * - Hover scale: 1.02
 * - Transitions: transform, colors
 * 
 * Components used from shadcn/ui:
 * - Carousel: For sliding functionality
 * - Card: Base card structure
 * 
 * Image handling:
 * - next/image for optimization
 * - object-cover for proper scaling
 * - Fallback icon from lucide-react
 * 
 * Accessibility:
 * - Focus states for keyboard navigation
 * - Alt text for images
 * - Semantic HTML structure
 */ 