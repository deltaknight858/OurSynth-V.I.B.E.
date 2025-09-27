import { domainOrderService } from "../domainOrderService";
import { supabase } from "@/integrations/supabase/client";

jest.mock("@/integrations/supabase/client");

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

interface MockSupabaseResponse<T = unknown> {
  data: T;
  error: Error | null;
}

interface MockSupabaseChain {
  select: jest.Mock;
  eq: jest.Mock;
  single: jest.Mock;
  upsert: jest.Mock;
}

// Type for the Supabase from method return value
type MockSupabaseFromReturn = MockSupabaseChain & {
  [key: string]: jest.Mock;
};

describe("domainOrderService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getDomainOrder", () => {
    it("should fetch domain order successfully", async () => {
      const mockOrder = ["domain-1", "domain-2", "domain-3"];

      const mockChain: MockSupabaseChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { domain_order: mockOrder },
          error: null
        } as MockSupabaseResponse<{ domain_order: string[] }>),
        upsert: jest.fn()
      };

      mockSupabase.from.mockReturnValue(mockChain as MockSupabaseFromReturn);

      const result = await domainOrderService.getDomainOrder("user-123");

      expect(mockSupabase.from).toHaveBeenCalledWith("domain_orders");
      expect(result).toEqual(mockOrder);
    });

    it("should return empty array when no order exists", async () => {
      const mockChain: MockSupabaseChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: null
        } as MockSupabaseResponse<null>),
        upsert: jest.fn()
      };

      mockSupabase.from.mockReturnValue(mockChain as MockSupabaseFromReturn);

      const result = await domainOrderService.getDomainOrder("user-123");

      expect(result).toEqual([]);
    });
  });

  describe("saveDomainOrder", () => {
    it("should save domain order successfully", async () => {
      const domainOrder = ["domain-1", "domain-2", "domain-3"];

      const mockChain: MockSupabaseChain = {
        select: jest.fn(),
        eq: jest.fn(),
        single: jest.fn(),
        upsert: jest.fn().mockResolvedValue({
          error: null
        } as MockSupabaseResponse<void>)
      };

      mockSupabase.from.mockReturnValue(mockChain as MockSupabaseFromReturn);

      await domainOrderService.saveDomainOrder("user-123", domainOrder);

      expect(mockSupabase.from).toHaveBeenCalledWith("domain_orders");
    });

    it("should handle errors when saving domain order", async () => {
      const domainOrder = ["domain-1", "domain-2"];
      const mockError = new Error("Save failed");

      const mockChain: MockSupabaseChain = {
        select: jest.fn(),
        eq: jest.fn(),
        single: jest.fn(),
        upsert: jest.fn().mockResolvedValue({
          error: mockError
        } as MockSupabaseResponse<void>)
      };

      mockSupabase.from.mockReturnValue(mockChain as MockSupabaseFromReturn);

      await expect(domainOrderService.saveDomainOrder("user-123", domainOrder)).rejects.toThrow("Save failed");
    });
  });
});
