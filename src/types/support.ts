export type SupportCategory="order"|"account"|"payment"|"delivery"|"product"|"other";
export type SupportStatus="open"|"in_progress"|"resolved"|"closed";
export type SupportTicketInput={category:SupportCategory;subject:string;message:string};
