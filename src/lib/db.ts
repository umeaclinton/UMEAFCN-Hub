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
        pub_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export async function insertPost(title: string, content: string, sourceUrl: string, guidHash: string) {
  try {
    const result = await sql`
      INSERT INTO posts (title, content, source_url, guid_hash)
      VALUES (${title}, ${content}, ${sourceUrl}, ${guidHash})
      RETURNING id, title, pub_date;
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
      SELECT id, title, content, source_url, pub_date 
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

export async function getPostById(id: number) {
  try {
    const result = await sql`
      SELECT id, title, content, source_url, pub_date 
      FROM posts 
      WHERE id = ${id};
    `;
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error fetching post by id:', error);
    throw error;
  }
}
