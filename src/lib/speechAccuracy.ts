export const normalizeSpeechText = (str: string) =>
  str
    .toLowerCase()
    .trim()
    // keep basic latin letters + spaces only (good enough for en-US)
    .replace(/[^a-z\s]/g, "");

/**
 * Rough word-level accuracy score (0-100) comparing recognized speech vs. a target phrase.
 */
export const calculateAccuracy = (spoken: string, target: string): number => {
  if (!target || !spoken) return 0;

  const spokenNorm = normalizeSpeechText(spoken);
  const targetNorm = normalizeSpeechText(target);

  const spokenWords = spokenNorm.split(/\s+/).filter((w) => w.length > 0);
  const targetWords = targetNorm.split(/\s+/).filter((w) => w.length > 0);

  if (targetWords.length === 0) return 0;

  let matchedWords = 0;
  const usedIndices = new Set<number>();

  for (const spokenWord of spokenWords) {
    for (let idx = 0; idx < targetWords.length; idx++) {
      if (usedIndices.has(idx)) continue;

      const targetWord = targetWords[idx];
      const closeMatch =
        spokenWord.length > 2 &&
        targetWord.length > 2 &&
        (spokenWord.includes(targetWord) || targetWord.includes(spokenWord));

      if (spokenWord === targetWord || closeMatch) {
        matchedWords++;
        usedIndices.add(idx);
        break;
      }
    }
  }

  const accuracy = Math.min((matchedWords / targetWords.length) * 100, 100);
  return Math.round(accuracy);
};
