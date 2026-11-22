import type { D1DatabaseLike } from "../connection";
export interface MerchantProfile {id:string;user_id:string;store_name:string;description:string;contact_phone:string|null;status:"pending"|"active"|"rejected"|"suspended";business_type:string;city:string;area:string;address_line:string;created_at:string;updated_at:string;}
export async function findMerchantByUser(db:D1DatabaseLike,userId:string):Promise<MerchantProfile|null>{
  return db.prepare("SELECT * FROM merchant_profiles WHERE user_id=? LIMIT 1").bind(userId).first<MerchantProfile>();
}
export async function findMerchantById(db:D1DatabaseLike,id:string):Promise<MerchantProfile|null>{
  return db.prepare("SELECT * FROM merchant_profiles WHERE id=? LIMIT 1").bind(id).first<MerchantProfile>();
}
export async function updateMerchantStatus(db:D1DatabaseLike,id:string,status:MerchantProfile["status"]):Promise<boolean>{
  const result=await db.prepare("UPDATE merchant_profiles SET status=?,updated_at=? WHERE id=?").bind(status,new Date().toISOString(),id).run();
  return (result.meta.changes??0)>0;
}
export async function listMerchants(db:D1DatabaseLike,options:{status?:string;limit?:number}={}):Promise<MerchantProfile[]>{
  const limit=Math.min(100,Math.max(1,Math.trunc(options.limit??50)));
  const rows=options.status
    ? await db.prepare("SELECT * FROM merchant_profiles WHERE status=? ORDER BY created_at DESC LIMIT ?").bind(options.status,limit).all<MerchantProfile>()
    : await db.prepare("SELECT * FROM merchant_profiles ORDER BY created_at DESC LIMIT ?").bind(limit).all<MerchantProfile>();
  return rows.results??[];
}