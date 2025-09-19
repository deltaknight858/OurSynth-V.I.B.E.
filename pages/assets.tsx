import AppLayout from "../components/AppLayout";

export default function Assets() {
  return (
    <AppLayout title="Assets">
      <h1>Assets</h1>
      <section>
        <p>Browse and manage assets in the ecosystem.</p>
        {/* Feature Highlights */}
        <div>
          <h2>Feature Highlights</h2>
          <ul>
            <li>SVG catalog</li>
            <li>Asset mapping</li>
            <li>Brand token integration</li>
          </ul>
        </div>
        {/* Assets feature integration goes here */}
      </section>
    </AppLayout>
  );
}
