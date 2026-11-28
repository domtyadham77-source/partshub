import {render,screen} from "@testing-library/react";
import {describe,expect,it,vi} from "vitest";
import {MemoryRouter} from "react-router-dom";
import MainLayout from "./MainLayout";

vi.mock("./Header",()=>({default:()=> <header data-testid="site-header">Header</header>}));

describe("MainLayout",()=>{it("places page content below the shared header; the footer is rendered globally by AppRouter",()=>{render(<MemoryRouter><MainLayout><h1>Account overview</h1></MainLayout></MemoryRouter>);expect(screen.getByTestId("site-header")).toBeInTheDocument();expect(screen.getByRole("heading",{name:"Account overview"})).toBeInTheDocument();const main=screen.getByRole("main");expect(main).toContainElement(screen.getByRole("heading",{name:"Account overview"}));});});
