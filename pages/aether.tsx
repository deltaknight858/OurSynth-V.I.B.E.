import AppLayout from "../components/AppLayout";
import styles from "../components/Shell.module.css";

export default function Aether() {
  return (
    <AppLayout title="Aether Workbench">
      <h1>Aether: Personal Automation Workbench</h1>
      <section>
        <p>
          Rapid experimentation, reusable recipes, and visual debugging.
          Collaborative mode coming soon.
        </p>
        {/* Feature Highlights */}
        <div>
          <h2>Feature Highlights</h2>
          <ul>
            <li>Workflow graph</li>
            <li>Recipe library</li>
            <li>Visual debugger</li>
          </ul>
        </div>
        <img
          src="/aether-mindmap.png"
          alt="Aether Mind Map"
          className={styles.aetherMindmap}
        />
        {/* Placeholder for workflow graph and recipe list */}
        <div className={styles.aetherGraph}>
          <h2>Workflow Graph</h2>
          <p>[Graph UI will be integrated here]</p>
        </div>
        <div className={styles.aetherRecipeList}>
          <h2>Recipe List</h2>
          <ul>
            <li>Sample Recipe 1</li>
            <li>Sample Recipe 2</li>
            <li>Sample Recipe 3</li>
          </ul>
        </div>
      </section>
    </AppLayout>
  );
}
