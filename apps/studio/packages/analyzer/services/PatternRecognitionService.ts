import { ComponentAnalyzer, AnalyzedComponent } from './ComponentAnalyzer';
import fs from 'fs';
import path from 'path';

export interface PatternMatchResult {
  isNovel: boolean;
  isConsistent: boolean;
  similarityScore: number;
  matchedComponent?: string;
}

export class PatternRecognitionService {
  static analyzeAndCompare(newComponentCode: string, uiComponentsDir: string): PatternMatchResult {
    const newAnalysis = ComponentAnalyzer.analyze(newComponentCode);
    const existingComponents = PatternRecognitionService.getExistingComponents(uiComponentsDir);
    let highestScore = 0;
    let matchedComponent = '';
    let isConsistent = false;

    for (const comp of existingComponents) {
      const score = PatternRecognitionService.compareComponents(newAnalysis, comp);
      if (score > highestScore) {
        highestScore = score;
        matchedComponent = comp.name;
        // Consistency: check if styles share theme tokens or class patterns
        isConsistent = PatternRecognitionService.checkConsistency(newAnalysis, comp);
      }
    }

    // Novel if similarity is below threshold but consistent with theme
    const isNovel = highestScore < 0.5 && isConsistent;
    return { isNovel, isConsistent, similarityScore: highestScore, matchedComponent };
  }

  static getExistingComponents(uiComponentsDir: string): AnalyzedComponent[] {
    const files = fs.readdirSync(uiComponentsDir).filter(f => f.endsWith('.tsx'));
    return files.map(file => {
      const code = fs.readFileSync(path.join(uiComponentsDir, file), 'utf-8');
      return ComponentAnalyzer.analyze(code);
    });
  }

  static compareComponents(a: AnalyzedComponent, b: AnalyzedComponent): number {
    // Simple similarity: props + structure
    const propScore = PatternRecognitionService.jaccard(a.props, b.props);
    const styleScore = PatternRecognitionService.jaccard(a.styles, b.styles);
    const structureScore = a.structure === b.structure ? 1 : 0;
    return (propScore + styleScore + structureScore) / 3;
  }

  static jaccard(a: string[], b: string[]): number {
    const setA = new Set(a);
    const setB = new Set(b);
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return union.size === 0 ? 0 : intersection.size / union.size;
  }

  static checkConsistency(a: AnalyzedComponent, b: AnalyzedComponent): boolean {
    // Check if styles share theme tokens or class patterns
    return a.styles.some(style => b.styles.some(s => s.includes(style) || style.includes(s)));
  }
}
