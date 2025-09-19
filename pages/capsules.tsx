import AppLayout from "../components/AppLayout";
import styles from "../components/Shell.module.css";

export default function Capsules() {
  return (
    <AppLayout title="Capsules">
      <h1>Capsules</h1>
      <section>
        <p>Manage, validate, and publish Capsules here.</p>
        {/* Capsule manifest upload/creation */}
        <div className={styles.aetherGraph}>
          <h2>Upload Capsule Manifest</h2>
          <label htmlFor="capsuleManifestInput">Upload manifest:</label>
          <input id="capsuleManifestInput" type="file" title="Upload capsule manifest file" />
        </div>
        {/* List of existing capsules */}
        <div className={styles.aetherRecipeList}>
          <h2>Existing Capsules</h2>
          <ul>
            <li>Capsule Alpha</li>
            <li>Capsule Beta</li>
            <li>Capsule Gamma</li>
          </ul>
          <button className={styles.capsuleValidateBtn}>Validate</button>
          <span className={styles.capsuleStatus}>Status: Pending</span>
        </div>
      </section>
    </AppLayout>
  );
}
