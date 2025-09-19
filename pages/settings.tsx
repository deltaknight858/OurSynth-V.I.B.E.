import AppLayout from "../components/AppLayout";

export default function Settings() {
  return (
    <AppLayout title="Settings">
      <h1>Settings</h1>
      <section>
        <p>Configure your OurSynth-Eco experience here.</p>
        {/* Feature Highlights */}
        <div>
          <h2>Feature Highlights</h2>
          <ul>
            <li>Theme system</li>
            <li>Brand token editor</li>
            <li>Profile management</li>
          </ul>
        </div>
        {/* Settings feature integration goes here */}
      </section>
    </AppLayout>
  );
}
