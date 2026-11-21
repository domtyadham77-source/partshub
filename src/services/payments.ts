export type PaymentMethod="cash_on_delivery"|"card"|"wallet";
export const paymentsService={availableMethods:()=>[{id:"cash_on_delivery" as const,label:"Cash on delivery",enabled:true},{id:"card" as const,label:"Card",enabled:false},{id:"wallet" as const,label:"Mobile wallet",enabled:false}],isEnabled:(method:PaymentMethod)=>method==="cash_on_delivery"};
