import { Client } from '@notionhq/client';
import { PageObjectResponse, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

if (!process.env.NOTION_TOKEN) {
  throw new Error('Missing NOTION_TOKEN environment variable');
}

if (!process.env.NOTION_DATABASE_ID) {
  throw new Error('Missing NOTION_DATABASE_ID environment variable');
}

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export interface Card {
  id: string;
  title: string;
  description: string;
  author: string;
  link: string;
  imageUrl: string;
}

type NotionProperties = {
  title: {
    type: 'title';
    title: Array<{ plain_text: string }>;
    id: string;
  };
  description: {
    type: 'rich_text';
    rich_text: Array<{ plain_text: string }>;
    id: string;
  };
  author: {
    type: 'rich_text';
    rich_text: Array<{ plain_text: string }>;
    id: string;
  };
  link: {
    type: 'url';
    url: string | null;
    id: string;
  };
  image: {
    type: 'files';
    files: Array<{
      type: 'file' | 'external';
      file?: { url: string };
      external?: { url: string };
    }>;
    id: string;
  };
};

export async function getCards(): Promise<Card[]> {
  try {
    // Validate environment variables
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) {
      throw new Error('NOTION_DATABASE_ID is undefined');
    }

    // Log the request
    console.log('Fetching cards from Notion database:', databaseId);
    
    const response: QueryDatabaseResponse = await notion.databases.query({
      database_id: databaseId,
      // Add sorting to ensure consistent order
      sorts: [
        {
          property: 'title',
          direction: 'ascending',
        },
      ],
    }).catch((error) => {
      console.error('Notion API Error:', {
        message: error.message,
        code: error.code,
        status: error.status,
      });
      throw error;
    });

    // Log the response
    console.log('Received response from Notion:', {
      total_results: response.results.length,
    });

    return response.results
      .filter((page): page is PageObjectResponse => {
        const hasProperties = 'properties' in page;
        if (!hasProperties) {
          console.warn('Page missing properties:', page.id);
        }
        return hasProperties;
      })
      .map((page) => {
        try {
          const properties = page.properties as unknown as NotionProperties;

          // Validate required properties
          if (!properties.title || !properties.description || !properties.author) {
            console.warn('Missing required properties for page:', page.id);
          }

          const card = {
            id: page.id,
            title: properties.title?.title[0]?.plain_text || 'Untitled',
            description: properties.description?.rich_text[0]?.plain_text || 'No description',
            author: properties.author?.rich_text[0]?.plain_text || 'Anonymous',
            link: properties.link?.url || '',
            imageUrl: properties.image?.files[0]?.file?.url || properties.image?.files[0]?.external?.url || '',
          };

          // Log successful card creation
          console.log('Processed card:', { id: card.id, title: card.title });

          return card;
        } catch (error) {
          console.error('Error processing page:', {
            pageId: page.id,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          // Return a default card instead of throwing
          return {
            id: page.id,
            title: 'Error: Failed to load content',
            description: 'There was an error loading this content',
            author: 'System',
            link: '',
            imageUrl: '',
          };
        }
      });
  } catch (error) {
    console.error('Error in getCards:', {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
      } : 'Unknown error',
    });
    // Return empty array instead of throwing
    return [];
  }
} 