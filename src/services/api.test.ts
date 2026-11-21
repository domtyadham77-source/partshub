import { afterEach, describe, expect, it, vi } from "vitest";
import { apiRequest, ApiRequestError } from "./api";
describe("apiRequest",()=>{
 afterEach(()=>vi.unstubAllGlobals());
 it("sends JSON with credentials and returns data",async()=>{
  const fetchMock=vi.fn().mockResolvedValue(new Response(JSON.stringify({data:{ok:true}}),{status:200,headers:{"Content-Type":"application/json"}}));
  vi.stubGlobal("fetch",fetchMock);
  await expect(apiRequest<{ok:boolean}>("/health")).resolves.toEqual({ok:true});
  expect(fetchMock).toHaveBeenCalledWith("/api/health",expect.objectContaining({credentials:"include"}));
 });
 it("normalizes API errors",async()=>{
  vi.stubGlobal("fetch",vi.fn().mockResolvedValue(new Response(JSON.stringify({error:{code:"BAD_INPUT",message:"Invalid value"}}),{status:422})));
  await expect(apiRequest("/test")).rejects.toMatchObject<ApiRequestError>({status:422,code:"BAD_INPUT",message:"Invalid value"});
 });
 it("provides a useful message when offline",async()=>{
  vi.stubGlobal("fetch",vi.fn().mockRejectedValue(new Error("offline")));
  await expect(apiRequest("/test")).rejects.toMatchObject({code:"NETWORK_ERROR"});
 });
});
