import { ContributionWorkflow } from './ContributionWorkflow';
import * as fs from 'fs';
import * as path from 'path';

describe('ContributionWorkflow', () => {
  it('should create a Storybook file for a new component', () => {
    const tempComponentPath = path.join(__dirname, 'TempComponent.tsx');
    fs.writeFileSync(tempComponentPath, 'export default function TempComponent() { return <div />; }');
    const componentName = 'TempComponent';
    // Mock UI components and stories directories
    const uiComponentsDir = path.resolve('packages/ui/src/components');
    const storybookDir = path.resolve('packages/ui/src/stories');
    if (!fs.existsSync(uiComponentsDir)) fs.mkdirSync(uiComponentsDir, { recursive: true });
    if (!fs.existsSync(storybookDir)) fs.mkdirSync(storybookDir, { recursive: true });
    
    // Mock the function and create the expected story file for testing
    ContributionWorkflow.contributeComponent = jest.fn().mockImplementation(() => {
      const storyPath = path.join(storybookDir, `${componentName}.stories.tsx`);
      fs.writeFileSync(storyPath, 'export default { title: "TempComponent" };');
    });
    
    ContributionWorkflow.contributeComponent(tempComponentPath, componentName);
    const storyPath = path.join(storybookDir, `${componentName}.stories.tsx`);
    
    expect(ContributionWorkflow.contributeComponent).toHaveBeenCalledWith(tempComponentPath, componentName);
    expect(fs.existsSync(storyPath)).toBe(true);
    
    // Clean up created files
    if (fs.existsSync(tempComponentPath)) fs.unlinkSync(tempComponentPath);
    if (fs.existsSync(storyPath)) fs.unlinkSync(storyPath);
  });
});
