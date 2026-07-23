require('dotenv').config({path: '.env.local'});
const { neon } = require('@neondatabase/serverless');

const neonSql = neon(process.env.DATABASE_URL);
const sql = async (strings, ...values) => {
  const result = await neonSql(strings, ...values);
  return { rows: result, rowCount: result.length };
};

async function getSimilarPosts(category, currentId, limit = 3) {
  try {
    let result;
    if (category) {
      result = await sql`
        SELECT id, title, category 
        FROM posts 
        WHERE apply_type != 'none' 
          AND id != ${currentId}
          AND category ILIKE ${category}
        ORDER BY pub_date DESC 
        LIMIT ${limit};
      `;
    }
    
    if (!result || result.rows.length < limit) {
      const fallbackLimit = limit - (result ? result.rows.length : 0);
      const excludeIds = result ? [currentId, ...result.rows.map((r) => r.id)] : [currentId];
      const fallbackResult = await sql`
        SELECT id, title, category 
        FROM posts 
        WHERE apply_type != 'none' 
          AND id != ${currentId}
        ORDER BY pub_date DESC 
        LIMIT ${fallbackLimit + 5};
      `;
      
      const additionalPosts = fallbackResult.rows.filter((r) => !excludeIds.includes(r.id)).slice(0, fallbackLimit);
      return result ? [...result.rows, ...additionalPosts] : additionalPosts;
    }
    
    return result.rows;
  } catch (error) {
    console.error("DB Error:", error);
    return [];
  }
}

async function test() {
  const posts = await getSimilarPosts('Remote', 1);
  console.log('Posts found:', posts.length);
  console.log(posts);
}

test();
