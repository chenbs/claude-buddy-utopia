import { neon } from "@neondatabase/serverless";

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return neon(process.env.DATABASE_URL);
}

export interface Buddy {
  id: string;
  name: string;
  author: string;
  description: string;
  image_url: string;
  text_content: string | null;
  created_at: string;
}

export type BuddyType = "image" | "text";

export async function initDb() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS buddies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      author TEXT NOT NULL DEFAULT 'Anonymous',
      description TEXT NOT NULL DEFAULT '',
      image_url TEXT NOT NULL DEFAULT '',
      text_content TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
  // Add text_content column if it doesn't exist (migration for existing databases)
  await sql`
    ALTER TABLE buddies ADD COLUMN IF NOT EXISTS text_content TEXT
  `;
}

export async function getAllBuddies(): Promise<Buddy[]> {
  const sql = getDb();
  // Ensure table exists
  await initDb();
  const rows = await sql`
    SELECT id, name, author, description, image_url, text_content, created_at
    FROM buddies
    ORDER BY created_at DESC
  `;
  return rows as unknown as Buddy[];
}

export async function getBuddyById(id: string): Promise<Buddy | null> {
  const sql = getDb();
  await initDb();
  const rows = await sql`
    SELECT id, name, author, description, image_url, text_content, created_at
    FROM buddies
    WHERE id = ${id}
  `;
  return (rows[0] as unknown as Buddy) ?? null;
}

export async function createBuddy(buddy: Omit<Buddy, "created_at">): Promise<Buddy> {
  const sql = getDb();
  await initDb();
  const rows = await sql`
    INSERT INTO buddies (id, name, author, description, image_url, text_content)
    VALUES (${buddy.id}, ${buddy.name}, ${buddy.author}, ${buddy.description}, ${buddy.image_url}, ${buddy.text_content ?? null})
    RETURNING id, name, author, description, image_url, text_content, created_at
  `;
  return rows[0] as unknown as Buddy;
}

/** Clean raw CLI ASCII art text: strip box-drawing chars and empty lines */
export function cleanAsciiText(raw: string): string {
  return raw
    .split('\n')
    .map(line => line.replace(/[─╰│╭╮╯]/g, '').trimEnd())
    .filter(line => line.trim().length > 0)
    .join('\n');
}
