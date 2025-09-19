import AppLayout from "../components/AppLayout";

export default function Notes() {
  return (
    <AppLayout title="Notes">
      <h1>Notes</h1>
      <section>
        <p>This is the Notes page. Capture, organize, and review your notes here.</p>
        {/* Feature Highlights */}
        <div>
          <h2>Feature Highlights</h2>
          <ul>
            <li>Rich text editing</li>
            <li>Tagging and search</li>
            <li>Memory capsules</li>
          </ul>
        </div>
        {/* Notes feature integration goes here */}
      </section>
    </AppLayout>
  );
}
