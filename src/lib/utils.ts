export function cleanText(text: string): string {
  if (!text) return text;
  
  return text
    // Replace various forms of mojibake and double-encoded entities
    .replace(/ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦/g, '...')
    .replace(/Ã¢â‚¬Â¦/g, '...')
    .replace(/â€¦/g, '...')
    
    // Apostrophes and quotes
    .replace(/ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢/g, "'")
    .replace(/Ã¢â‚¬â„¢/g, "'")
    .replace(/â€™/g, "'")
    .replace(/Ã¢â‚¬Ëœ/g, "'")
    .replace(/â€˜/g, "'")
    
    .replace(/Ã¢â‚¬Å“/g, '"')
    .replace(/â€œ/g, '"')
    .replace(/Ã¢â‚¬Â /g, '"')
    .replace(/â€ /g, '"')
    
    // Dashes
    .replace(/Ã¢â‚¬â€œ/g, '-')
    .replace(/â€“/g, '-')
    .replace(/Ã¢â‚¬â€”/g, '--')
    .replace(/â€”/g, '--')
    
    // Bullets
    .replace(/Ã¢â‚¬Â¢/g, '•')
    .replace(/â€¢/g, '•')
    
    // Fallback cleanup for remaining weird chars that look like Ã‚ or Ãƒ
    .replace(/Ã[ƒ‚]/g, '')
    .trim();
}
