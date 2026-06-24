import { expandArticle } from './src/lib/gemini';

async function run() {
  const title = "Sales Executive at MyJobMag";
  const summary = "We are looking for a Sales Executive. Responsibilities include identifying prospects, selling products, and managing accounts. Requirements: B.Sc, 2 years experience. Send CV to hr@myjobmag.com";
  
  console.log('Calling Gemini...');
  const result = await expandArticle(title, summary);
  console.log('Result:');
  console.log(JSON.stringify(result, null, 2));
}

run().catch(console.error);
