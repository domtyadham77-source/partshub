import type { D1DatabaseLike } from "../db/connection";
import { confirmCashCollection, getOrderPaymentState } from "../db/repositories/paymentRepository";

export { confirmCashCollection, getOrderPaymentState };
export async function getPaymentSummary(db: D1DatabaseLike, orderId: string) {
  const payment = await getOrderPaymentState(db, orderId);
  if (!payment) return null;
  return {
    orderId: payment.order_id,
    method: payment.payment_method,
    status: payment.payment_status,
    amountPiasters: payment.total_piasters,
    amountEgp: payment.total_piasters / 100,
  };
}
