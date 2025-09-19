import { ComponentAnalyzer } from './ComponentAnalyzer';

describe('ComponentAnalyzer', () => {
  it('extracts props, styles, and structure from a simple React component', () => {
    const code = `
      import React from 'react';
      export default function MyButton({ label, color }) {
        return <button className="btn" style={{ color }}>{label}</button>;
      }
    `;
    const result = ComponentAnalyzer.analyze(code);
    expect(result.name).toBe('MyButton');
    expect(result.props).toEqual(expect.arrayContaining(['label', 'color']));
    expect(result.styles).toEqual(expect.arrayContaining(['btn']));
    expect(result.structure).toContain('button');
  });
});
