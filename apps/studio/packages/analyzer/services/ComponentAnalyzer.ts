import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

export interface AnalyzedComponent {
  name: string;
  props: string[];
  styles: string[];
  structure: string;
}

export class ComponentAnalyzer {
  static analyze(code: string): AnalyzedComponent {
    // Parse the code to AST
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });
    let name = '';
    let props: string[] = [];
    let styles: string[] = [];
    let structure = '';

    traverse(ast, {
      // Find component name (function or class)
      ExportDefaultDeclaration(path) {
        if (path.node.declaration.type === 'Identifier') {
          name = path.node.declaration.name;
        } else if (path.node.declaration.type === 'FunctionDeclaration') {
          name = path.node.declaration.id?.name || '';
        } else if (path.node.declaration.type === 'ClassDeclaration') {
          name = path.node.declaration.id?.name || '';
        }
      },
      // Find props (from function params or this.props)
      FunctionDeclaration(path) {
        if (path.node.params.length > 0) {
          const param = path.node.params[0];
          if (param.type === 'Identifier') {
            props.push(param.name);
          } else if (param.type === 'ObjectPattern') {
            param.properties.forEach((p: any) => {
              if (p.type === 'ObjectProperty' && p.key.type === 'Identifier') {
                props.push(p.key.name);
              }
            });
          }
        }
      },
      // Find styled-components or Tailwind classes
      JSXAttribute(path) {
        if (path.node.name.name === 'className' && path.node.value.type === 'StringLiteral') {
          styles.push(path.node.value.value);
        }
        if (path.node.name.name === 'css' && path.node.value.type === 'StringLiteral') {
          styles.push(path.node.value.value);
        }
      },
      // Capture structure (JSX tree as string)
      JSXElement(path) {
        structure = structure || path.toString();
      },
    });

    return { name, props, styles, structure };
  }
}
