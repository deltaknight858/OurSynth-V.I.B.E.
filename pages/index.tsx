import AppLayout from "../components/AppLayout";

export default function Dashboard() {
  return (
    <AppLayout title="Dashboard">
      <h1>Dashboard</h1>
      <section>
        <p>Welcome to the OurSynth-Eco dashboard. This is your starting point for navigating the ecosystem.</p>
        {/* Quick Actions */}
        <div>
          <h2>Quick Actions</h2>
          <ul>
            <li>Go to Aether Workbench</li>
            <li>Open Pathways Wizard</li>
            <li>View Capsules</li>
          </ul>
        </div>
        {/* Add dashboard widgets or quick links here */}
      </section>
    </AppLayout>
  );
}
