import { createContext,useCallback,useContext,useEffect,useMemo,useState,type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { notificationsService } from "../services/notifications";
import type { AppNotification } from "../types/notification";
type Value={items:AppNotification[];unreadCount:number;refresh:()=>Promise<void>;markRead:(id:string)=>Promise<void>};
const NotificationContext=createContext<Value|null>(null);
export function NotificationProvider({children}:{children:ReactNode}){
 const {user,loading}=useAuth();const [items,setItems]=useState<AppNotification[]>([]);
 const refresh=useCallback(async()=>{if(!user){setItems([]);return;}try{setItems((await notificationsService.list()).items)}catch{/* Keep the current notification view if the API is temporarily unavailable. */}},[user]);
 useEffect(()=>{if(!loading)void refresh()},[loading,refresh]);
 const markRead=useCallback(async(id:string)=>{await notificationsService.markRead(id);setItems(current=>current.map(item=>item.id===id?{...item,read_at:new Date().toISOString()}:item))},[]);
 const value=useMemo(()=>({items,unreadCount:items.filter(item=>!item.read_at).length,refresh,markRead}),[items,refresh,markRead]);
 return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
export function useNotifications(){const value=useContext(NotificationContext);if(!value)throw new Error("useNotifications must be used inside NotificationProvider");return value;}
