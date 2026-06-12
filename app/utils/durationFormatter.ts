/**
 * Utility function to standardize duration format to "X Nights Y Days"
 * Handles various input formats and converts them to the standard format
 */

export function formatDuration(duration: string): string {
  if (!duration || typeof duration !== 'string') {
    return 'N/A';
  }

  // Clean the input string
  const cleanDuration = duration.trim();

  // Handle various formats and extract numbers
  const patterns = [
    // "6 Nights 5 Days" - already in correct format
    /^(\d+)\s*Nights?\s+(\d+)\s*Days?$/i,
    // "5 Days 6 Nights" - swap order
    /^(\d+)\s*Days?\s+(\d+)\s*Nights?$/i,
    // "6 Night & 7 Days" - handle ampersand
    /^(\d+)\s*Night\s*&\s*(\d+)\s*Days?$/i,
    // "7 Days & 6 Nights" - handle ampersand, swap order
    /^(\d+)\s*Days?\s*&\s*(\d+)\s*Nights?$/i,
    // "6N 7D" - short format
    /^(\d+)N\s*(\d+)D$/i,
    // "7D 6N" - short format, swap order
    /^(\d+)D\s*(\d+)N$/i,
    // Just a number - assume it's days, calculate nights
    /^(\d+)$/
  ];

  for (const pattern of patterns) {
    const match = cleanDuration.match(pattern);
    if (match) {
      if (pattern === patterns[patterns.length - 1]) {
        // Just a number - assume it's days
        const days = parseInt(match[1]);
        const nights = Math.max(1, days - 1);
        return `${nights} Nights ${days} Days`;
      } else {
        // Extract the two numbers
        const firstNum = parseInt(match[1]);
        const secondNum = parseInt(match[2]);
        
        // Determine which is nights and which is days
        // Generally, nights should be less than days
        if (firstNum < secondNum) {
          return `${firstNum} Nights ${secondNum} Days`;
        } else {
          return `${secondNum} Nights ${firstNum} Days`;
        }
      }
    }
  }

  // If no pattern matches, return the original string
  return cleanDuration;
}

/**
 * Extract just the nights part from a duration string
 * Useful for filtering by nights
 */
export function extractNights(duration: string): string {
  const formatted = formatDuration(duration);
  const match = formatted.match(/(\d+)\s*Nights?/i);
  return match ? `${match[1]} Nights` : 'N/A';
}

/**
 * Extract just the days part from a duration string
 */
export function extractDays(duration: string): string {
  const formatted = formatDuration(duration);
  const match = formatted.match(/(\d+)\s*Days?/i);
  return match ? `${match[1]} Days` : 'N/A';
}
