export type AnalyticsEvent="catalog_search"|"product_view"|"cart_add"|"checkout_started";
export const analyticsService={track:(event:AnalyticsEvent,details:Record<string,string|number|boolean>={})=>{if(import.meta.env.DEV)console.debug("[Parts Hub analytics]",event,details);}};
