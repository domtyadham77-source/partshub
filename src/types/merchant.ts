export type MerchantStatus="pending"|"active"|"rejected"|"suspended";
export type MerchantBusinessType="parts_store"|"garage"|"maintenance_center"|"motorcycle_workshop";
export type MerchantProfile={id:string;storeName:string;description:string;contactPhone:string|null;businessType:MerchantBusinessType;city:string;area:string;addressLine:string;status:MerchantStatus};
