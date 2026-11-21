import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
type FavoritesValue={ids:string[];isFavorite:(id:string)=>boolean;toggleFavorite:(id:string)=>void;clear:()=>void};
const FavoritesContext=createContext<FavoritesValue|null>(null);
const KEY="partshub.favorites.v1";
export function FavoritesProvider({children}:{children:ReactNode}){
 const [ids,setIds]=useState<string[]>(()=>{try{const raw=localStorage.getItem(KEY);return raw?JSON.parse(raw) as string[]:[]}catch{return[]}});
 useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(ids))}catch{/* Storage unavailable. */}},[ids]);
 const value=useMemo(()=>({ids,isFavorite:(id:string)=>ids.includes(id),toggleFavorite:(id:string)=>setIds(current=>current.includes(id)?current.filter(item=>item!==id):[...current,id]),clear:()=>setIds([])}),[ids]);
 return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
export function useFavorites(){const value=useContext(FavoritesContext);if(!value)throw new Error("useFavorites must be used inside FavoritesProvider");return value;}
