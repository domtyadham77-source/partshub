import { useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/ui/Badge";
import { useNotifications } from "../contexts/NotificationContext";
export default function NotificationsPage(){
 const {items,refresh,markRead}=useNotifications();useEffect(()=>{void refresh()},[refresh]);
 return <MainLayout><section className="orders-page"><span className="eyebrow">YOUR UPDATES</span><h1>Notifications.</h1>{items.length===0?<div className="catalog-state">You're all caught up. New updates will appear here.</div>:<div className="notification-list">{items.map(item=><article className={!item.read_at?"unread":""} key={item.id}><div><div className="notification-meta"><Badge tone={item.type==="warning"?"orange":item.type==="success"?"success":"neutral"}>{item.type}</Badge><small>{new Date(item.created_at).toLocaleString()}</small></div><h3>{item.title}</h3><p>{item.message}</p></div>{!item.read_at&&<button onClick={()=>void markRead(item.id)}>Mark read</button>}</article>)}</div>}</section></MainLayout>;
}
