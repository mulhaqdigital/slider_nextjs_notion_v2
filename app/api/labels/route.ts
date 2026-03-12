import { NextResponse } from 'next/server';
import { readCards, Label } from '@/lib/data';

export async function GET() {
  const cards = readCards();
  const seen = new Map<string, Label>();
  for (const card of cards) {
    for (const label of card.labels) {
      if (!seen.has(label.name)) {
        seen.set(label.name, label);
      }
    }
  }
  return NextResponse.json(Array.from(seen.values()));
}
