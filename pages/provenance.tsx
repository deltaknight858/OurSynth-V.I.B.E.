import AppLayout from "../components/AppLayout";

export default function Provenance() {
  return (
    <AppLayout title="Provenance">
      <h1>Provenance</h1>
      <section>
        <p>Review execution history and export provenance reports.</p>
        {/* Feature Highlights */}
        <div>
          <h2>Feature Highlights</h2>
          <ul>
            <li>Time Travel view</li>
            <li>Artifact inspection</li>
            <li>Report export</li>
          </ul>
        </div>
        {/* Provenance feature integration goes here */}
      </section>
    </AppLayout>
  );
}
