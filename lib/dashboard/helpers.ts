export function normalizeText(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[^a-z0-9\s]/g, "");
  }
  
  export function singularizeWord(word: string) {
    if (word.endsWith("ies") && word.length > 3) {
      return word.slice(0, -3) + "y";
    }
  
    if (word.endsWith("s") && !word.endsWith("ss") && word.length > 2) {
      return word.slice(0, -1);
    }
  
    return word;
  }
  
  export function normalizeWords(text: string) {
    return normalizeText(text)
      .split(" ")
      .filter(Boolean)
      .map(singularizeWord);
  }
  
  export function normalizeForComparison(text: string) {
    return normalizeWords(text).join(" ");
  }
  
  export function isStrongFoodMatch(input: string, resultName: string) {
    const normalizedInput = normalizeForComparison(input);
    const normalizedResult = normalizeForComparison(resultName);
  
    return (
      normalizedResult === normalizedInput ||
      normalizedResult.startsWith(normalizedInput + " ") ||
      normalizedResult.includes(normalizedInput)
    );
  }
  
  export function isValidNumber(value: string) {
    if (value.trim() === "") {
      return false;
    }
  
    const num = Number(value);
    return !isNaN(num);
  }
  
  export function getProgress(current: number, goal: number) {
    if (goal <= 0) return 0;
    return Math.min((current / goal) * 100, 100);
  }
  
  export function formatPercent(value: number) {
    return Math.round(value * 100);
  }