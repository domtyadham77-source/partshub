import {render,screen} from "@testing-library/react";
import {describe,expect,it,vi} from "vitest";
import {MemoryRouter} from "react-router-dom";
import MainLayout from "./MainLayout";

vi.mock("./Header",()=>({default:()=> <header data-testid="site-header">Header</header>}));
vi.mock("./Footer",()=>({default:()=> <footer data-testid="site-footer">Footer</footer>}));

describe("MainLayout",()=>{it("places page content between the shared header and footer",()=>{render(<MemoryRouter><MainLayout><h1>Account overview</h1></MainLayout></MemoryRouter>);expect(screen.getByTestId("site-header")).toBeInTheDocument();expect(screen.getByRole("heading",{name:"Account overview"})).toBeInTheDocument();expect(screen.getByTestId("site-footer")).toBeInTheDocument();const main=screen.getByRole("main");expect(main).toContainElement(screen.getByRole("heading",{name:"Account overview"}));});});
