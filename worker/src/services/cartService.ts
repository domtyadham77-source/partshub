import type { D1DatabaseLike } from "../db/connection";
import { getAvailableCartProducts, validateCart, type CartLine } from "../db/repositories/cartRepository";

export type { CartLine };
export { getAvailableCartProducts, validateCart };
export async function calculateCart(db: D1DatabaseLike, lines: CartLine[]) {
  const result = await validateCart(db, lines);
  if (!result.valid) throw new Error(result.error || "Cart validation failed.");
  return result;
}
