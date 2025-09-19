import { PatternRecognitionService } from './PatternRecognitionService';
import { ComponentAnalyzer } from './ComponentAnalyzer';
import * as fs from 'fs';
import * as path from 'path';

describe('PatternRecognitionService', () => {
  it('identifies a novel and consistent component', () => {
    // Mock new component code
    const newComponentCode = `
      import React from 'react';
      export default function UniqueCard({ title }) {
        return <div className="card-unique">{title}</div>;
      }
    `;
    // Mock UI components directory with one existing component
    const tempDir = path.join(__dirname, 'temp-ui');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    fs.writeFileSync(path.join(tempDir, 'Card.tsx'), `
      import React from 'react';
      export default function Card({ title }) {
        return <div className="card">{title}</div>;
      }
    `);
    const result = PatternRecognitionService.analyzeAndCompare(newComponentCode, tempDir);
    expect(result.isNovel).toBe(true);
    expect(result.isConsistent).toBe(true);
    expect(result.similarityScore).toBeLessThan(0.5);
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
});
