import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { readCards, writeCards, Card } from '@/lib/data';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, author, link, imageUrl, labels } = await request.json();

  if (!title?.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const cards = readCards();
  const newCard: Card = {
    id: Date.now().toString(),
    creatorId: userId,
    title: title.trim(),
    description: description?.trim() || '',
    author: author?.trim() || '',
    link: link?.trim() || '',
    imageUrl: imageUrl?.trim() || '',
    labels: Array.isArray(labels)
      ? labels.map((name: string) => ({ name, color: name === 'New' ? 'green' : 'default' }))
      : [],
  };

  cards.push(newCard);
  writeCards(cards);

  return NextResponse.json({ id: newCard.id }, { status: 201 });
}
