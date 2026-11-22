import {describe,expect,it,vi} from "vitest";
vi.mock("../utils/validators",()=>({validators:{email:vi.fn(value=>value==="valid@email.com"),password:vi.fn(value=>value.length>=10),phone:vi.fn(value=>/^01/.test(value)),fullName:vi.fn(value=>value.trim().length>1)}}));
import {validators} from "../utils/validators";
import {securityService} from "./security";
describe("securityService",()=>{it("delegates email, password, phone, and name validation",()=>{expect(securityService.validateEmail("valid@email.com")).toBe(true);expect(securityService.validatePassword("longpassword")).toBe(true);expect(securityService.validatePhone("01000000000")).toBe(true);expect(securityService.validateName("Test User")).toBe(true);expect(validators.email).toHaveBeenCalledWith("valid@email.com");});});