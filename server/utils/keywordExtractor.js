// Simple keyword extraction using frequency analysis
// Can be replaced with NLP libraries like natural, compromise, or external APIs

export function extractKeywords(text, maxKeywords = 10) {
  if (!text || typeof text !== 'string') return [];

  const commonWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with',
    'to', 'for', 'of', 'as', 'by', 'that', 'this', 'it', 'from', 'are', 'was',
    'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'could', 'should', 'may', 'might', 'can', 'about', 'into', 'through',
    'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again',
    'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how',
    'all', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
    'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just'
  ]);

  // Tokenize and clean
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word));

  // Count frequency
  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  // Sort by frequency and return top keywords
  const keywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word, freq]) => ({
      keyword: word.charAt(0).toUpperCase() + word.slice(1),
      frequency: freq
    }));

  return keywords;
}

export function extractTopics(text, maxTopics = 5) {
  const keywords = extractKeywords(text, maxTopics);
  return keywords.map((kw, index) => ({
    name: kw.keyword,
    importance: 1 - (index * 0.15),
    keywords: [kw.keyword]
  }));
}
