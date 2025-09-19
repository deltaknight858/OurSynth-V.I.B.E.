import AppLayout from "../components/AppLayout";

export default function Studio() {
  return (
    <AppLayout title="Studio">
      <h1>Studio</h1>
      <section>
        <p>Access creative and advanced tools in the Studio.</p>
        {/* Feature Highlights */}
        <div>
          <h2>Feature Highlights</h2>
          <ul>
            <li>Visual editor</li>
            <li>Advanced organization</li>
            <li>Time Travel view</li>
          </ul>
        </div>
        {/* Studio feature integration goes here */}
      </section>
    </AppLayout>
  );
}
