import AppLayout from "../components/AppLayout";

export default function Notebooks() {
  return (
    <AppLayout title="Notebooks">
      <h1>Notebooks</h1>
      <section>
        <p>This is the Notebooks page. Organize your notes into notebooks for better structure.</p>
        {/* Feature Highlights */}
        <div>
          <h2>Feature Highlights</h2>
          <ul>
            <li>Notebook organization</li>
            <li>Branchable timelines</li>
            <li>Rights-aware sharing</li>
          </ul>
        </div>
        {/* Notebooks feature integration goes here */}
      </section>
    </AppLayout>
  );
}
