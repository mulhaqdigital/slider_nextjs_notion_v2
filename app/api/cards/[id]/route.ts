import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { readCards, writeCards } from '@/lib/data';

const ADMIN_EMAIL = 'sedapdibedai@gmail.com';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const email = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress;

  if (email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const cards = readCards();
  const filtered = cards.filter((c) => c.id !== id);

  if (filtered.length === cards.length) {
    return NextResponse.json({ error: 'Card not found' }, { status: 404 });
  }

  writeCards(filtered);
  return NextResponse.json({ ok: true });
}
