
export class AutoRepair {
  static suggestFix(error: string): string | null {
    if (error.includes('index.html')) {
      return "Generate a basic index.html with a root div.";
    }
    if (error.includes('eval()')) {
      return "Replace eval() with JSON.parse() or a safer function alternative.";
    }
    return null;
  }
}
