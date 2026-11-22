export const validators={
 email:(value:string)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())&&value.length<=254,
 password:(value:string)=>value.length>=10&&value.length<=128,
 fullName:(value:string)=>value.trim().length>=2&&value.trim().length<=90,
 phone:(value:string)=>!value||/^[+0-9()\-\s]{7,30}$/.test(value.trim()),
 positiveMoney:(value:number)=>Number.isFinite(value)&&value>0&&value<=100000000,
 quantity:(value:number)=>Number.isInteger(value)&&value>=1&&value<=99,
};
