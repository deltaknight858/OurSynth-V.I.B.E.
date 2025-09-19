import AppLayout from "../components/AppLayout";
import styles from "../components/Shell.module.css";

export default function PathwaysWizard() {
  return (
    <AppLayout title="Pathways Wizard">
      <h1>Pathways Wizard</h1>
      <section>
        <p>Guided automation and onboarding. Step-by-step workflow builder for the OurSynth ecosystem.</p>
        {/* File upload for workflows/assets */}
        <div className={styles.wizardContainer}>
          <h2>Import Workflow or Assets</h2>
          <label htmlFor="wizardFileInput">Upload files:</label>
          <input id="wizardFileInput" className={styles.wizardFileInput} type="file" multiple title="Upload workflow or asset files" />
          <h3>Recent Files</h3>
          <ul>
            <li>example-workflow.html</li>
            <li>mindmap.png</li>
            <li>custom-script.js</li>
          </ul>
        </div>
        {/* Wizard steps and progress */}
        <div className={styles.wizardContainer}>
          <h2>Wizard Steps</h2>
          <ol>
            <li>Choose a workflow</li>
            <li>Configure steps</li>
            <li>Preview & run</li>
            <li>Review results</li>
          </ol>
          <div className={styles.wizardProgress}>
            <progress value={1} max={4} /> Step 1 of 4
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
