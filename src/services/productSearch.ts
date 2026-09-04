import { Product } from '../types';

export interface SearchMatch {
  product: Product;
  score: number;
}

/**
 * Searches and ranks products given an English transliterated or Tamil query string
 */
export function searchProducts(query: string, products: Product[]): Product[] {
  if (!query || !query.trim()) {
    return products.slice(0, 10);
  }

  const cleanQuery = query.toLowerCase().trim().replace(/[^a-z0-9\u0B80-\u0BFF\s]/g, '');
  if (!cleanQuery) return products.slice(0, 10);

  const results: SearchMatch[] = [];

  for (const product of products) {
    let bestScore = 0;

    const nameTamilClean = product.nameTamil.trim().toLowerCase();
    
    // 1. Direct Tamil Exact Match
    if (nameTamilClean === cleanQuery) {
      bestScore = 3000;
    } 
    // 2. Direct Tamil Prefix Match
    else if (nameTamilClean.startsWith(cleanQuery)) {
      bestScore = 2500 - Math.min(200, (nameTamilClean.length - cleanQuery.length) * 5);
    } 
    // 3. Direct Tamil Substring Match
    else if (nameTamilClean.includes(cleanQuery)) {
      bestScore = 1500 - nameTamilClean.indexOf(cleanQuery) * 20;
    } else {
      // 4. English Search Terms & Transliterations
      for (let i = 0; i < product.searchTerms.length; i++) {
        const term = product.searchTerms[i].toLowerCase().trim();
        if (!term) continue;

        // Primary terms (first 10) are directly from product Tamil name
        const isPrimary = i < 10;

        if (term === cleanQuery) {
          const score = isPrimary ? 2600 : 1600;
          if (score > bestScore) {
            bestScore = score;
          }
        } else if (term.startsWith(cleanQuery)) {
          const diff = term.length - cleanQuery.length;
          const score = (isPrimary ? 2200 : 1300) - Math.min(250, diff * 10);
          if (score > bestScore) {
            bestScore = score;
          }
        } else if (cleanQuery.length >= 2 && term.includes(cleanQuery)) {
          const idx = term.indexOf(cleanQuery);
          const score = (isPrimary ? 800 : 300) - Math.min(150, idx * 20);
          if (score > bestScore) {
            bestScore = score;
          }
        }
      }
    }

    // Special pooja shop staples relevance boost for direct canonical words
    if (cleanQuery === 'man' && product.nameTamil === 'மஞ்சள்') {
      bestScore += 300;
    }
    if (cleanQuery === 'ku' && product.nameTamil === 'குங்குமம்') {
      bestScore += 100;
    }

    if (bestScore > 0) {
      results.push({ product, score: bestScore });
    }
  }

  // Sort strictly by score descending; if tied, shorter name (base item) first; then alphabetical
  results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (a.product.nameTamil.length !== b.product.nameTamil.length) {
      return a.product.nameTamil.length - b.product.nameTamil.length;
    }
    return a.product.nameTamil.localeCompare(b.product.nameTamil, 'ta');
  });

  return results.map(r => r.product);
}
