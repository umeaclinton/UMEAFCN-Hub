import { scrapeMyJobMagApplicationMethod } from './src/lib/scraper';

async function run() {
  const url = "https://www.myjobmag.com/a_fields.php?id=1262163";
  const result = await scrapeMyJobMagApplicationMethod(url);
  console.log("\n--- RESULT ---");
  console.log(result);
}

run().catch(console.error);
