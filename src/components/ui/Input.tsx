import type { InputHTMLAttributes } from "react";
type Props=InputHTMLAttributes<HTMLInputElement>&{label:string;hint?:string;error?:string};
export default function Input({label,hint,error,id,className="",...props}:Props){
 const inputId=id||props.name||label.toLowerCase().replace(/[^a-z0-9]+/g,"-");
 return <div className="ph-field"><label htmlFor={inputId}>{label}</label><input id={inputId} className={`ph-input ${error?"has-error":""} ${className}`.trim()} aria-invalid={!!error} aria-describedby={error?`${inputId}-error`:hint?`${inputId}-hint`:undefined} {...props}/>{error?<small id={`${inputId}-error`} className="field-error">{error}</small>:hint?<small id={`${inputId}-hint`} className="field-hint">{hint}</small>:null}</div>;
}
