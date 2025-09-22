import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { ShellSidebar } from "./ShellSidebar";
import { HaloThemeProvider } from "halo-ui";
import { AppThemeProvider } from "../../components/theme/AppThemeProvider";

import Studio from "../../apps/studio/src/Studio";
import Pathways from "../../apps/pathways/src/Pathways";
import Orchestrator from "../../apps/orchestrator/src/Orchestrator";
import MeshSim from "../../apps/mesh-sim/src/MeshSim";
import Provenance from "../../apps/provenance/src/Provenance";
import Capsule from "../../apps/capsule/src/Capsule";
import CommandCenter from "../../apps/command-center/src/CommandCenter";
import Agents from "../../apps/agents/src/Agents";
// Pre-existing apps
import Taskflow from "../../apps/taskflow/src/Taskflow";
import Noteflow from "../../apps/noteflow/src/Noteflow";

export const AppShell: React.FC = () => {
  return (
    <AppThemeProvider>
      <HaloThemeProvider>
        <Router>
          <div className="shell-layout flex h-screen w-screen bg-shell">
            <ShellSidebar />
            <main className="shell-main flex-1 overflow-auto bg-main">
              <Switch>
                <Route path="/studio" component={Studio} />
                <Route path="/pathways" component={Pathways} />
                <Route path="/orchestrator" component={Orchestrator} />
                <Route path="/mesh-sim" component={MeshSim} />
                <Route path="/provenance" component={Provenance} />
                <Route path="/capsule" component={Capsule} />
                <Route path="/command-center" component={CommandCenter} />
                <Route path="/agents" component={Agents} />
                {/* Pre-existing apps */}
                <Route path="/taskflow" component={Taskflow} />
                <Route path="/noteflow" component={Noteflow} />
                <Redirect to="/studio" />
              </Switch>
            </main>
          </div>
        </Router>
      </HaloThemeProvider>
    </AppThemeProvider>
  );
};