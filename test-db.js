require('dotenv').config({path: '.env.local'});
const { sql } = require('@vercel/postgres');

async function run() {
  try {
    const res = await sql`SELECT id, title, length(content) as len, substring(content for 100) as preview FROM posts ORDER BY id DESC LIMIT 5;`;
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  }
}
run();
