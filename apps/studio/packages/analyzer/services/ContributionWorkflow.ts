import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export class ContributionWorkflow {
  static async contributeComponent(componentPath: string, componentName: string) {
    const uiComponentsDir = path.resolve('packages/ui/src/components');
    const storybookDir = path.resolve('packages/ui/src/stories');
    const branchName = `add/${componentName}`;
    // 1. Create a new branch
    execSync(`git checkout -b ${branchName}`);
    // 2. Move the component file
    const destPath = path.join(uiComponentsDir, `${componentName}.tsx`);
    fs.renameSync(componentPath, destPath);
    // 3. Create a basic Storybook file
    const storyContent = `import React from 'react';
import { ${componentName} } from '../components/${componentName}';

export default {
  title: 'Components/${componentName}',
  component: ${componentName},
};

export const Basic = () => <${componentName} />;
`;
    if (!fs.existsSync(storybookDir)) fs.mkdirSync(storybookDir);
    fs.writeFileSync(path.join(storybookDir, `${componentName}.stories.tsx`), storyContent);
    // 4. Commit and push
    execSync('git add .');
    execSync(`git commit -m "feat(ui): add ${componentName} component via Self-Evolving Design System"`);
    execSync(`git push origin ${branchName}`);
    // 5. Open a PR (using GitHub CLI)
    const prDescription = `This PR adds the new ${componentName} component, automatically identified as a reusable and thematically consistent design pattern by the Self-Evolving Design System analyzer.\n\n- Props, styles, and structure were analyzed for uniqueness and consistency.\n- Storybook file included for review.\n\nPlease review and approve if this fits the design language.`;
    execSync(`gh pr create --title "Add ${componentName} component" --body "${prDescription}" --base main`);
  }
}
