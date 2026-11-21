import type { CartLine } from "../contexts/CartContext";
import { storage } from "../utils/storage";
const KEY="partshub.cart.v1";
export const cartService={list:()=>storage.get<CartLine[]>(KEY,[]),save:(items:CartLine[])=>storage.set(KEY,items),clear:()=>storage.remove(KEY)};
