import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "../types/product";

export type CartLine = { product: Product; quantity: number };
type CartContextValue = { items: CartLine[]; count: number; subtotal: number; addItem:(product:Product)=>void; removeItem:(id:string)=>void; setQuantity:(id:string,quantity:number)=>void; clear:()=>void };
const CartContext=createContext<CartContextValue|null>(null);
const STORAGE_KEY="partshub.cart.v1";

export function CartProvider({children}:{children:ReactNode}) {
 const [items,setItems]=useState<CartLine[]>(()=>{
  try { const raw=localStorage.getItem(STORAGE_KEY); return raw?JSON.parse(raw) as CartLine[]:[]; } catch { return []; }
 });
 useEffect(()=>{ try { localStorage.setItem(STORAGE_KEY,JSON.stringify(items)); } catch { /* Storage may be unavailable. */ } },[items]);
 const value=useMemo<CartContextValue>(()=>({
  items,
  count:items.reduce((sum,line)=>sum+line.quantity,0),
  subtotal:items.reduce((sum,line)=>sum+line.product.price*line.quantity,0),
  addItem:(product)=>setItems(current=>{const found=current.find(line=>line.product.id===product.id);return found?current.map(line=>line.product.id===product.id?{...line,quantity:line.quantity+1}:line):[...current,{product,quantity:1}]}),
  removeItem:(id)=>setItems(current=>current.filter(line=>line.product.id!==id)),
  setQuantity:(id,quantity)=>setItems(current=>quantity<=0?current.filter(line=>line.product.id!==id):current.map(line=>line.product.id===id?{...line,quantity:Math.min(99,Math.floor(quantity))}:line)),
  clear:()=>setItems([])
 }),[items]);
 return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart(){const value=useContext(CartContext);if(!value)throw new Error("useCart must be used inside CartProvider");return value;}
