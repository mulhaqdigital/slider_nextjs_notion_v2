import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function GET(request: NextRequest) {
  const pageId = request.nextUrl.searchParams.get('pageId');
  if (!pageId) {
    return NextResponse.json({ error: 'Missing pageId' }, { status: 400 });
  }

  try {
    const page = await notion.pages.retrieve({ page_id: pageId }) as PageObjectResponse;
    const imageProperty = (page.properties as any).image;
    const freshUrl =
      imageProperty?.files?.[0]?.file?.url ||
      imageProperty?.files?.[0]?.external?.url ||
      '';

    if (!freshUrl) {
      return NextResponse.json({ error: 'No image found' }, { status: 404 });
    }

    // Redirect to the fresh pre-signed URL
    return NextResponse.redirect(freshUrl);
  } catch (error) {
    console.error('notion-image proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}
