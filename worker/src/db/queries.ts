import type { D1DatabaseLike } from "./connection";
export type SqlValue=string|number|boolean|null|ArrayBuffer|Uint8Array;
export function placeholders(count:number):string { if(!Number.isInteger(count)||count<1||count>100) throw new RangeError("Placeholder count must be an integer from 1 to 100."); return Array.from({length:count},()=>"?").join(", "); }
export function clampLimit(value:unknown,fallback=25,maximum=100):number { const n=typeof value==="number"?value:Number(value); return Number.isFinite(n)?Math.min(maximum,Math.max(1,Math.trunc(n))):fallback; }
export function normalizeSearch(value:unknown,maxLength=100):string { return typeof value==="string"?value.trim().replace(/[\u0000-\u001f\u007f]/g,"").slice(0,maxLength):""; }
type SafeTable="users"|"merchant_profiles"|"products"|"orders"|"support_tickets";
export async function countRows(db:D1DatabaseLike,table:SafeTable,whereSql="",values:SqlValue[]=[]):Promise<number>{ const suffix=whereSql.trim()?" WHERE "+whereSql:""; const row=await db.prepare("SELECT COUNT(*) AS total FROM "+table+suffix).bind(...values).first<{total:number}>(); return Number(row?.total||0); }
export async function getById<T>(db:D1DatabaseLike,table:SafeTable,id:string):Promise<T|null>{ return db.prepare("SELECT * FROM "+table+" WHERE id = ? LIMIT 1").bind(id).first<T>(); }
