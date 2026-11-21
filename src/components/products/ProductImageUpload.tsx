import { useEffect,useRef,useState } from "react";
import { ImagePlus,Trash2 } from "lucide-react";
import ProductImageEditor from "./ProductImageEditor";
import "./ProductImageUpload.css";
type Props={onImageReady?:(image:Blob)=>void;maxSizeMb?:number;initialPreview?:string};
export default function ProductImageUpload({onImageReady,maxSizeMb=8,initialPreview}:Props){
 const [source,setSource]=useState<string|null>(null);const [preview,setPreview]=useState<string|null>(initialPreview||null);const [error,setError]=useState("");const inputRef=useRef<HTMLInputElement>(null);const urls=useRef<string[]>([]);
 useEffect(()=>()=>{urls.current.forEach(url=>URL.revokeObjectURL(url))},[]);
 function choose(file?:File){setError("");if(!file)return;if(!file.type.startsWith("image/")){setError("Choose an image file.");return;}if(file.size>maxSizeMb*1024*1024){setError(`Image must be smaller than ${maxSizeMb} MB.`);return;}const url=URL.createObjectURL(file);urls.current.push(url);setSource(url);}
 function cancel(){setSource(null);if(inputRef.current)inputRef.current.value="";}
 function save(blob:Blob){const url=URL.createObjectURL(blob);urls.current.push(url);setPreview(url);setSource(null);onImageReady?.(blob);if(inputRef.current)inputRef.current.value="";}
 function remove(){setPreview(null);setSource(null);onImageReady?.(new Blob([],{type:"application/octet-stream"}));if(inputRef.current)inputRef.current.value="";}
 return <div className="image-upload"><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>choose(e.target.files?.[0])} hidden/><div className="image-upload-preview">{preview?<><img src={preview} alt="Product preview"/><button type="button" onClick={remove} aria-label="Remove product image"><Trash2 size={15}/></button></>:<button type="button" className="image-upload-pick" onClick={()=>inputRef.current?.click()}><ImagePlus size={25}/><span>Add product image</span><small>JPG, PNG or WebP · Max {maxSizeMb} MB</small></button>}</div>{preview&&!source&&<button type="button" className="image-upload-change" onClick={()=>inputRef.current?.click()}>Change image</button>}{error&&<p className="image-upload-error" role="alert">{error}</p>}{source&&<div className="image-upload-editor"><ProductImageEditor imageSrc={source} onCancel={cancel} onSave={save}/></div>}</div>;
}
