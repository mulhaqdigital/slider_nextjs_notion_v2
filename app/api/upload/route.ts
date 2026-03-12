import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('image') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }

  const filename = `${Date.now()}.${ext}`;
  const dir = path.join(process.cwd(), 'public', 'card-images');
  fs.mkdirSync(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(dir, filename), buffer);

  return NextResponse.json({ url: `/card-images/${filename}` }, { status: 201 });
}
