export type NotificationType="info"|"success"|"warning";
export type AppNotification={id:string;title:string;message:string;type:NotificationType;read_at:string|null;created_at:string};
