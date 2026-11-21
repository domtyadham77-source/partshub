import { useCallback,useState } from "react";
import Cropper,{type Area} from "react-easy-crop";
import { RotateCcw,RotateCw,ZoomIn,ZoomOut } from "lucide-react";
import Button from "../ui/Button";
import "./ProductImageEditor.css";
type Props={imageSrc:string;onCancel?:()=>void;onSave:(image:Blob)=>void};
function rotatedSize(width:number,height:number,rotation:number){const radians=rotation*Math.PI/180;return{width:Math.abs(Math.cos(radians)*width)+Math.abs(Math.sin(radians)*height),height:Math.abs(Math.sin(radians)*width)+Math.abs(Math.cos(radians)*height)};}
async function cropImage(src:string,crop:Area,rotation:number):Promise<Blob>{
 const image=new Image();image.src=src;await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error("Unable to read this image."));});
 const bounds=rotatedSize(image.width,image.height,rotation);const canvas=document.createElement("canvas");canvas.width=Math.round(bounds.width);canvas.height=Math.round(bounds.height);
 const context=canvas.getContext("2d");if(!context)throw new Error("Image editing is not supported in this browser.");
 context.translate(canvas.width/2,canvas.height/2);context.rotate(rotation*Math.PI/180);context.drawImage(image,-image.width/2,-image.height/2);
 const output=document.createElement("canvas");output.width=Math.round(crop.width);output.height=Math.round(crop.height);const outputContext=output.getContext("2d");if(!outputContext)throw new Error("Unable to create the cropped image.");
 outputContext.drawImage(canvas,crop.x,crop.y,crop.width,crop.height,0,0,output.width,output.height);
 return await new Promise<Blob>((resolve,reject)=>output.toBlob(blob=>blob?resolve(blob):reject(new Error("Unable to export the edited image.")),"image/jpeg",0.92));
}
export default function ProductImageEditor({imageSrc,onCancel,onSave}:Props){
 const [crop,setCrop]=useState({x:0,y:0});const [zoom,setZoom]=useState(1);const [rotation,setRotation]=useState(0);const [area,setArea]=useState<Area|null>(null);const [busy,setBusy]=useState(false);const [error,setError]=useState("");
 const onCropComplete=useCallback((_area:Area,pixels:Area)=>setArea(pixels),[]);
 function reset(){setCrop({x:0,y:0});setZoom(1);setRotation(0);setArea(null);setError("");}
 function rotateLeft(){setRotation(current=>(current+270)%360)}
 function rotateRight(){setRotation(current=>(current+90)%360)}
 async function save(){if(!area)return;setBusy(true);setError("");try{const blob=await cropImage(imageSrc,area,rotation);onSave(blob)}catch(err){setError(err instanceof Error?err.message:"Unable to edit this image.")}finally{setBusy(false)}}
 return <div className="image-editor" role="dialog" aria-modal="true" aria-label="Edit product image"><div className="image-editor-heading"><div><b>Edit product image</b><small>Drag to reposition · zoom to crop</small></div><button type="button" onClick={reset}>Reset</button></div><div className="image-editor-crop"><Cropper image={imageSrc} crop={crop} zoom={zoom} rotation={rotation} aspect={4/3} onCropChange={setCrop} onZoomChange={setZoom} onRotationChange={setRotation} onCropComplete={onCropComplete} objectFit="contain" showGrid/></div><div className="image-editor-controls"><div className="image-editor-zoom"><ZoomOut size={15}/><input aria-label="Zoom" type="range" min={1} max={3} step={0.05} value={zoom} onChange={e=>setZoom(Number(e.target.value))}/><ZoomIn size={15}/></div><div className="image-editor-rotate"><button type="button" onClick={rotateLeft} aria-label="Rotate left"><RotateCcw size={16}/></button><span>{rotation}°</span><button type="button" onClick={rotateRight} aria-label="Rotate right"><RotateCw size={16}/></button></div></div>{error&&<p className="image-editor-error" role="alert">{error}</p>}<div className="image-editor-actions"><Button type="button" variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button><Button type="button" onClick={()=>void save()} disabled={busy||!area}>{busy?"Applying…":"Apply crop"}</Button></div></div>;
}
