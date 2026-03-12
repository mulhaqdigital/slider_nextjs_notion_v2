import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { readCards, writeCards } from '@/lib/data';

const ADMIN_EMAIL = 'sedapdibedai@gmail.com';

async function getEmail(userId: string): Promise<string | undefined> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress;
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const cards = readCards();
  const card = cards.find((c) => c.id === id);

  if (!card) {
    return NextResponse.json({ error: 'Card not found' }, { status: 404 });
  }

  const isCreator = card.creatorId === userId;
  if (!isCreator) {
    const email = await getEmail(userId);
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  writeCards(cards.filter((c) => c.id !== id));
  return NextResponse.json({ ok: true });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const cards = readCards();
  const idx = cards.findIndex((c) => c.id === id);

  if (idx === -1) {
    return NextResponse.json({ error: 'Card not found' }, { status: 404 });
  }

  const card = cards[idx];
  const isCreator = card.creatorId === userId;
  if (!isCreator) {
    const email = await getEmail(userId);
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const { title, description, author, link, imageUrl, labels } = await request.json();

  if (!title?.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  cards[idx] = {
    ...card,
    title: title.trim(),
    description: description?.trim() ?? card.description,
    author: author?.trim() ?? card.author,
    link: link?.trim() ?? card.link,
    imageUrl: imageUrl?.trim() ?? card.imageUrl,
    labels: Array.isArray(labels)
      ? labels.map((name: string) => ({ name, color: name === 'New' ? 'green' : 'default' }))
      : card.labels,
  };

  writeCards(cards);
  return NextResponse.json({ card: cards[idx] });
}
