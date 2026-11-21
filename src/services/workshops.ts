import { apiRequest } from "./api";
export type WorkshopProvider={id:string;store_name:string;description:string;contact_phone:string|null;business_type:"garage"|"maintenance_center"|"motorcycle_workshop";city:string;area:string;address_line:string};
export const workshopsService={list:(city="")=>apiRequest<{items:WorkshopProvider[]}>(`/workshops?city=${encodeURIComponent(city)}`)};
