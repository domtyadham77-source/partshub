import { beforeEach, describe, expect, it, vi } from "vitest";
import type { D1DatabaseLike } from "../src/db/connection";

const mocks = vi.hoisted(() => ({
  confirmCashCollection: vi.fn(),
  getOrderPaymentState: vi.fn(),
}));
vi.mock("../src/db/repositories/paymentRepository", () => mocks);

import { confirmCashCollection, getOrderPaymentState, getPaymentSummary } from "../src/services/paymentService";

describe("payment service", () => {
  beforeEach(() => vi.clearAllMocks());
  it("delegates cash collection confirmation", async () => {
    const db = {} as D1DatabaseLike;
    mocks.confirmCashCollection.mockResolvedValue(true);
    await expect(confirmCashCollection(db, "o1")).resolves.toBe(true);
    expect(mocks.confirmCashCollection).toHaveBeenCalledWith(db, "o1");
  });
  it("returns null for an unknown order", async () => {
    mocks.getOrderPaymentState.mockResolvedValue(null);
    await expect(getPaymentSummary({} as D1DatabaseLike, "missing")).resolves.toBeNull();
  });
  it("converts stored piasters into EGP without changing the stored amount", async () => {
    mocks.getOrderPaymentState.mockResolvedValue({
      order_id: "o1", payment_method: "cash_on_delivery", payment_status: "unpaid", total_piasters: 12345,
    });
    await expect(getPaymentSummary({} as D1DatabaseLike, "o1")).resolves.toEqual({
      orderId: "o1", method: "cash_on_delivery", status: "unpaid", amountPiasters: 12345, amountEgp: 123.45,
    });
  });
});

import { matchesPaymentsRoute } from "../src/routes/payments";
describe("payment methods route matching",()=>{it("claims the read-only payment methods endpoint",()=>{expect(matchesPaymentsRoute("/api/payments/methods","GET")).toBe(true);expect(matchesPaymentsRoute("/api/payments/methods","POST")).toBe(false);});});
