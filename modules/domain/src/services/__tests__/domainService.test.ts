
import domainService from "../domainService";
import { supabase } from "@/integrations/supabase/client";
import type { Domain } from "../domainService";

jest.mock("@/integrations/supabase/client");

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe("domainService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockSupabase.auth.getSession as jest.Mock).mockClear();
    (mockSupabase.auth.getUser as jest.Mock).mockClear();
    (mockSupabase.from as jest.Mock).mockClear();
  });

  describe("getDomains", () => {
    it("should return an empty array if user is not authenticated", async () => {
      (mockSupabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: null,
      });
      const domains = await domainService.getDomains();
      expect(domains).toEqual([]);
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });

    it("should fetch domains successfully for an authenticated user", async () => {
      const mockDomains: Domain[] = [
        { id: "1", name: "example.com", user_id: "user-123", purchased_at: "2024-01-01T00:00:00Z", expires_at: "2025-01-01T00:00:00Z", status: "active", auto_renew: false, created_at: "2024-01-01T00:00:00Z" }
      ];
      (mockSupabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: { user: { id: "user-123" } } },
        error: null,
      });
      
      const fromMock = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockDomains, error: null }),
      };
      (mockSupabase.from as jest.Mock).mockReturnValue(fromMock);

      const result = await domainService.getDomains();

      expect(mockSupabase.from).toHaveBeenCalledWith("domains");
      expect(fromMock.select).toHaveBeenCalledWith("*");
      expect(fromMock.order).toHaveBeenCalledWith("created_at", { ascending: false });
      expect(result).toEqual(mockDomains);
    });
  });

  describe("purchaseDomain", () => {
    it("should throw an error if user is not authenticated", async () => {
      (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: null }, error: null });
      await expect(domainService.purchaseDomain("new.com", 1)).rejects.toThrow("User not authenticated");
    });

    it("should purchase a domain successfully", async () => {
      const mockUser = { id: "user-123" };
      const newDomainData = { name: "newdomain.com", years: 1 };
      const mockResponse: Domain = { id: "new-id", name: newDomainData.name, user_id: mockUser.id, purchased_at: "2024-01-01T00:00:00Z", expires_at: "2025-01-01T00:00:00Z", status: "active", auto_renew: false, created_at: "2024-01-01T00:00:00Z" };

      (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: mockUser }, error: null });
      
      const fromMock = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockResponse, error: null }),
      };
      (mockSupabase.from as jest.Mock).mockReturnValue(fromMock);
      
      const result = await domainService.purchaseDomain(newDomainData.name, newDomainData.years);

      expect(mockSupabase.from).toHaveBeenCalledWith("domains");
      expect(fromMock.insert).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual(mockResponse);
    });
  });

  describe("renewDomain", () => {
    it("should renew a domain successfully", async () => {
        const domainId = "1";
        const years = 1;
        const existingDomain = { expires_at: new Date().toISOString() };
        const updatedDomain: Domain = { id: domainId, name: "example.com", user_id: "user-123", purchased_at: "2024-01-01T00:00:00Z", expires_at: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), status: "active", auto_renew: false, created_at: "2024-01-01T00:00:00Z" };

        const fetchMock = { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ data: existingDomain, error: null }) };
        const updateMock = { update: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ data: updatedDomain, error: null }) };

        (mockSupabase.from as jest.Mock)
            .mockReturnValueOnce(fetchMock)
            .mockReturnValueOnce(updateMock);

        const result = await domainService.renewDomain(domainId, years);

        expect(mockSupabase.from).toHaveBeenCalledWith("domains");
        expect(result).toEqual(updatedDomain);
    });
  });

  describe("deleteDomain", () => {
    it("should delete a domain successfully", async () => {
        const domainId = "1";
        const deletedDomain: Domain = { id: domainId, name: "example.com", user_id: "user-123", purchased_at: "2024-01-01T00:00:00Z", expires_at: "2025-01-01T00:00:00Z", status: "active", auto_renew: false, created_at: "2024-01-01T00:00:00Z" };

        const fromMock = { delete: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ data: deletedDomain, error: null }) };
        (mockSupabase.from as jest.Mock).mockReturnValue(fromMock);

        const result = await domainService.deleteDomain(domainId);

        expect(mockSupabase.from).toHaveBeenCalledWith("domains");
        expect(result).toEqual(deletedDomain);
    });
  });
});
