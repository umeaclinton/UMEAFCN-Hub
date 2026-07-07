import { neon } from '@neondatabase/serverless';

const sql = neon("postgresql://neondb_owner:npg_atN3zci6InFy@ep-proud-star-ai2g255g-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require");

async function checkDb() {
  const res = await sql`SELECT * FROM settings;`;
  console.log("Settings table contents:", res);
}

checkDb().catch(console.error);
