import fs from 'fs';
import path from 'path';

export interface Label {
  name: string;
  color: string;
}

export interface Card {
  id: string;
  creatorId?: string;
  title: string;
  description: string;
  author: string;
  link: string;
  imageUrl: string;
  labels: Label[];
}

const DATA_FILE = path.join(process.cwd(), 'data', 'cards.json');

export function readCards(): Card[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as Card[];
  } catch {
    return [];
  }
}

export function writeCards(cards: Card[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(cards, null, 2), 'utf-8');
}

export async function getCards(): Promise<Card[]> {
  return readCards();
}
