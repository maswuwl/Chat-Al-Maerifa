
/**
 * Utility functions for the Smart Hybrid Multimodal AI Studio
 */

/**
 * Converts a Blob or File to a Base64 string
 */
export const fileToBase64 = (file: Blob | File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Safely parses JSON with a fallback value
 */
export const safeJsonParse = <T>(json: string | null, fallback: T): T => {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    console.error("JSON Parse Error:", e);
    return fallback;
  }
};

/**
 * Formats dates consistently across the studio
 */
export const formatDate = (date: Date | string | number, locale: 'en' | 'ar' = 'en'): string => {
  const d = new Date(date);
  return d.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Generates a standard unique ID for studio entities
 */
export const generateId = (prefix: string = 'ID'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};
