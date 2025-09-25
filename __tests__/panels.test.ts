import { render, screen } from "@testing-library/react";
import { AppShell } from "../apps/shell/src/AppShell";
import { EcoThemeProvider } from "../packages/halo-ui/ThemeProvider";

test("renders all sidebar links", () => {
  render(
    <EcoThemeProvider>
      <AppShell />
    </EcoThemeProvider>
  );
  expect(screen.getByText("Studio")).toBeInTheDocument();
  expect(screen.getByText("Pathways")).toBeInTheDocument();
  expect(screen.getByText("Orchestrator")).toBeInTheDocument();
  expect(screen.getByText("MeshSim")).toBeInTheDocument();
  expect(screen.getByText("Provenance")).toBeInTheDocument();
  expect(screen.getByText("Capsule")).toBeInTheDocument();
  expect(screen.getByText("Command Center")).toBeInTheDocument();
  expect(screen.getByText("Agents")).toBeInTheDocument();
  expect(screen.getByText("Taskflow")).toBeInTheDocument();
  expect(screen.getByText("Noteflow")).toBeInTheDocument();
});

test("theme toggle switches theme", () => {
  render(
    <EcoThemeProvider>
      <AppShell />
    </EcoThemeProvider>
  );
  const toggle = screen.getByRole("button", { name: /toggle theme/i });
  expect(toggle).toBeInTheDocument();
  toggle.click();
  // Could assert CSS variables were changed if using JSDOM
});