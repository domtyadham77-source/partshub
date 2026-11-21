import { storage } from "../utils/storage";
const KEY="partshub.favorites.v1";
export const favoritesService={list:()=>storage.get<string[]>(KEY,[]),has:(id:string)=>storage.get<string[]>(KEY,[]).includes(id),toggle:(id:string)=>{const current=storage.get<string[]>(KEY,[]);const next=current.includes(id)?current.filter(item=>item!==id):[...current,id];storage.set(KEY,next);return next;},clear:()=>storage.remove(KEY)};
