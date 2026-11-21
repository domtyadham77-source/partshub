export type CategoryId="car_parts"|"motorcycle_parts"|"workshop";
export type Category={id:CategoryId;name:string;description:string};
export const PRODUCT_CATEGORIES:Category[]=[{id:"car_parts",name:"Car parts",description:"Replacement and performance parts for cars."},{id:"motorcycle_parts",name:"Motorcycle parts",description:"Parts and accessories for motorcycles."},{id:"workshop",name:"Workshop supplies",description:"Supplies and equipment for service centers."}];
