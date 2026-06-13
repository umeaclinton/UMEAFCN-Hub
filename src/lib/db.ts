import { sql } from '@vercel/postgres';

export async function initDb() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        source_url VARCHAR(500) NOT NULL,
        guid_hash VARCHAR(64) UNIQUE NOT NULL,
        slug VARCHAR(500) UNIQUE,
        pub_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    // Add slug column to existing table if it doesn't exist
    try {
      await sql`ALTER TABLE posts ADD COLUMN slug VARCHAR(500) UNIQUE;`;
    } catch (e) {
      // Column might already exist, ignore
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export async function insertPost(title: string, content: string, sourceUrl: string, guidHash: string, slug: string) {
  try {
    const result = await sql`
      INSERT INTO posts (title, content, source_url, guid_hash, slug)
      VALUES (${title}, ${content}, ${sourceUrl}, ${guidHash}, ${slug})
      RETURNING id, title, slug, pub_date;
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error inserting post:', error);
    throw error;
  }
}

export async function getPostByHash(guidHash: string) {
  try {
    const result = await sql`
      SELECT id FROM posts WHERE guid_hash = ${guidHash} LIMIT 1;
    `;
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error checking existing post:', error);
    throw error;
  }
}

export async function getRecentPosts(limit = 20) {
  try {
    const result = await sql`
      SELECT id, title, content, source_url, slug, pub_date 
      FROM posts 
      ORDER BY pub_date DESC 
      LIMIT ${limit};
    `;
    return result.rows;
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    throw error;
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const result = await sql`
      SELECT id, title, content, source_url, slug, pub_date 
      FROM posts 
      WHERE slug = ${slug};
    `;
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    throw error;
  }
}
