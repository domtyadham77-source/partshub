import { beforeEach,describe,expect,it,vi } from "vitest";
import { fireEvent,render,screen,waitFor } from "@testing-library/react";
import { AuthProvider,useAuth } from "./AuthContext";
vi.mock("../services/auth",()=>({authService:{me:vi.fn(),login:vi.fn(),register:vi.fn(),logout:vi.fn()}}));
import { authService } from "../services/auth";
const user={id:"u1",fullName:"Test User",email:"test@example.com",phone:null,role:"customer" as const,status:"active" as const,createdAt:"2026-01-01T00:00:00.000Z"};
function Harness(){const auth=useAuth();return <><span>{auth.user?.email||"signed out"}</span><button onClick={()=>void auth.login("test@example.com","password-long")}>login</button><button onClick={()=>void auth.logout()}>logout</button></>}
describe("AuthProvider",()=>{beforeEach(()=>{vi.clearAllMocks();vi.mocked(authService.me).mockResolvedValue({user:null});});
it("loads the current session",async()=>{vi.mocked(authService.me).mockResolvedValue({user});render(<AuthProvider><Harness/></AuthProvider>);await waitFor(()=>expect(screen.getByText("test@example.com")).toBeTruthy());});
it("stores a user after login and clears after logout",async()=>{vi.mocked(authService.login).mockResolvedValue({user});vi.mocked(authService.logout).mockResolvedValue({success:true});render(<AuthProvider><Harness/></AuthProvider>);fireEvent.click(screen.getByText("login"));await waitFor(()=>expect(screen.getByText("test@example.com")).toBeTruthy());fireEvent.click(screen.getByText("logout"));await waitFor(()=>expect(screen.getByText("signed out")).toBeTruthy());});});
