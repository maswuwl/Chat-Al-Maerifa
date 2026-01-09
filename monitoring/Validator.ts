
import { ProjectFile } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class Validator {
  static validate(project: ProjectFile[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (project.length === 0) {
      return { isValid: true, errors: [], warnings: [] };
    }

    // Check for index.html
    const hasHtml = project.some(f => f.path.toLowerCase().endsWith('index.html'));
    if (!hasHtml) {
      errors.push("Missing entry point: index.html is required for rendering.");
    }

    // Check for suspicious patterns
    project.forEach(file => {
      if (file.content.includes('<script') && !file.path.endsWith('.html')) {
        warnings.push(`Suspicious script tag found in non-HTML file: ${file.path}`);
      }
      if (file.content.includes('eval(')) {
        errors.push(`Security Risk: 'eval()' detected in ${file.path}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}
