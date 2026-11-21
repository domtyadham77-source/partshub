import "./Avatar.css";
type Props={name:string;src?:string|null;size?:"sm"|"md"|"lg";className?:string};
export default function Avatar({name,src,size="md",className=""}:Props){const initials=name.trim().split(/\s+/).slice(0,2).map(part=>part[0]?.toUpperCase()||"").join("")||"?";return <span className={`ph-avatar ph-avatar-${size} ${className}`.trim()} aria-label={name}>{src?<img src={src} alt=""/>:initials}</span>;}
