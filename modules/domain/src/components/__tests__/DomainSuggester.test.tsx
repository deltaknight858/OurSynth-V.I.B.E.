import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DomainSuggester } from "../DomainSuggester";

// Mock the toast hook
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

// Mock fetch
global.fetch = jest.fn();

const mockOnSuggestionSelect = jest.fn();

describe("DomainSuggester", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it("renders input and button correctly", () => {
    render(<DomainSuggester onSuggestionSelect={mockOnSuggestionSelect} />);

    expect(screen.getByPlaceholderText(/saas for developers/)).toBeInTheDocument();
    expect(screen.getByText("Suggest Domains")).toBeInTheDocument();
    expect(screen.getByText("Need ideas? Get AI-powered domain suggestions!")).toBeInTheDocument();
  });

  it("handles input changes correctly", async () => {
    const user = userEvent.setup();
    render(<DomainSuggester onSuggestionSelect={mockOnSuggestionSelect} />);

    const input = screen.getByPlaceholderText(/saas for developers/);
    await user.type(input, "test keywords");

    expect(input).toHaveValue("test keywords");
  });

  it("makes API call when suggest button is clicked", async () => {
    const user = userEvent.setup();
    const mockResponse = {
      suggestions: ["example.com", "test.org", "mysite.dev"]
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<DomainSuggester onSuggestionSelect={mockOnSuggestionSelect} />);

    const input = screen.getByPlaceholderText(/saas for developers/);
    const button = screen.getByText("Suggest Domains");

    await user.type(input, "test keywords");
    await user.click(button);

    expect(global.fetch).toHaveBeenCalledWith("/api/domains/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords: "test keywords" })
    });
  });

  it("displays suggestions after successful API call", async () => {
    const user = userEvent.setup();
    const mockResponse = {
      suggestions: ["example.com", "test.org"]
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<DomainSuggester onSuggestionSelect={mockOnSuggestionSelect} />);

    const input = screen.getByPlaceholderText(/saas for developers/);
    const button = screen.getByText("Suggest Domains");

    await user.type(input, "test");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("example.com")).toBeInTheDocument();
      expect(screen.getByText("test.org")).toBeInTheDocument();
    });
  });

  it("calls onSuggestionSelect when suggestion is clicked", async () => {
    const user = userEvent.setup();
    const mockResponse = {
      suggestions: ["example.com"]
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<DomainSuggester onSuggestionSelect={mockOnSuggestionSelect} />);

    const input = screen.getByPlaceholderText(/saas for developers/);
    const button = screen.getByText("Suggest Domains");

    await user.type(input, "test");
    await user.click(button);

    await waitFor(() => {
      const suggestion = screen.getByText("example.com");
      return user.click(suggestion);
    });

    expect(mockOnSuggestionSelect).toHaveBeenCalledWith("example.com");
  });

  it("shows loading state during API call", async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<DomainSuggester onSuggestionSelect={mockOnSuggestionSelect} />);

    const input = screen.getByPlaceholderText(/saas for developers/);
    const button = screen.getByText("Suggest Domains");

    await user.type(input, "test");
    await user.click(button);

    expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled();
  });

  it("handles keyboard navigation for suggestions", async () => {
    const user = userEvent.setup();
    const mockResponse = {
      suggestions: ["example.com", "test.org"]
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    render(<DomainSuggester onSuggestionSelect={mockOnSuggestionSelect} />);

    const input = screen.getByPlaceholderText(/saas for developers/);
    await user.type(input, "test");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      const firstSuggestion = screen.getByText("example.com");
      expect(firstSuggestion).toBeInTheDocument();
    });

    const firstSuggestion = screen.getByText("example.com");
    firstSuggestion.focus();
    expect(firstSuggestion).toHaveFocus();
  });
});
