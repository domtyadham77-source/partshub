const SECURITY_HEADERS:Record<string,string>={
 "X-Content-Type-Options":"nosniff","X-Frame-Options":"DENY","Referrer-Policy":"strict-origin-when-cross-origin",
 "Permissions-Policy":"camera=(), microphone=(), geolocation=()","Cross-Origin-Resource-Policy":"same-site"
};
export function withSecurityHeaders(response:Response):Response{
 const headers=new Headers(response.headers);for(const [name,value] of Object.entries(SECURITY_HEADERS))if(!headers.has(name))headers.set(name,value);
 if(!headers.has("Cache-Control"))headers.set("Cache-Control","no-store");
 return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}