import { render, screen } from "@testing-library/react";
import { DomainCard, Domain } from "../DomainCard";

// Mock the tooltip provider
jest.mock("@/components/ui/tooltip", () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockDomain: Domain = {
  id: "1",
  name: "example.com",
  status: "active",
  expiresAt: "2025-12-31"
};

const expiredDomain: Domain = {
  id: "2",
  name: "expired.com",
  status: "expired",
  expiresAt: "2024-01-01"
};

describe("DomainCard", () => {
  it("renders domain information correctly", () => {
    render(<DomainCard domain={mockDomain} />);

    expect(screen.getByText("example.com")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Expires On")).toBeInTheDocument();
  });

  it("displays correct status badge for active domain", () => {
    render(<DomainCard domain={mockDomain} />);

    const statusBadge = screen.getByText("active");
    expect(statusBadge).toHaveClass("bg-green-500/80");
  });

  it("displays correct status badge for expired domain", () => {
    render(<DomainCard domain={expiredDomain} />);

    const statusBadge = screen.getByText("expired");
    expect(statusBadge).toHaveClass("bg-red-500/80");
  });

  it("renders action buttons with proper accessibility", () => {
    render(<DomainCard domain={mockDomain} />);

    const renewButton = screen.getByLabelText("Renew domain example.com");
    const transferButton = screen.getByLabelText("Transfer domain example.com");
    const deleteButton = screen.getByLabelText("Delete domain example.com");

    expect(renewButton).toBeInTheDocument();
    expect(transferButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it("has proper keyboard navigation support", () => {
    render(<DomainCard domain={mockDomain} />);

    const renewButton = screen.getByLabelText("Renew domain example.com");
    
    renewButton.focus();
    expect(renewButton).toHaveFocus();
  });

  it("applies drag cursor styles correctly", () => {
    render(<DomainCard domain={mockDomain} />);

    const header = screen.getByText("example.com").closest(".cursor-grab");
    expect(header).toHaveClass("cursor-grab", "active:cursor-grabbing");
  });
});
