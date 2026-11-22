export type OrderStatus="pending"|"accepted"|"rejected"|"processing"|"shipped"|"delivered"|"cancelled";
export type PaymentMethod="cash_on_delivery";
export type PaymentStatus="unpaid"|"paid"|"refunded";
export type OrderItemSnapshot={productId:string;productName:string;sku:string|null;unitPricePiasters:number;quantity:number;lineTotalPiasters:number};
