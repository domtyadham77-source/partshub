import { describe, expect, it } from "vitest";
import { paymentsService } from "../../services/payments";

describe("payment workflow", () => {
  it("keeps only cash on delivery enabled until a provider is configured", () => {
    expect(paymentsService.availableMethods().map(method => [method.id, method.enabled])).toEqual([
      ["cash_on_delivery", true], ["card", false], ["wallet", false],
    ]);
    expect(paymentsService.isEnabled("cash_on_delivery")).toBe(true);
    expect(paymentsService.isEnabled("card")).toBe(false);
  });
});
