import {describe,expect,it} from "vitest";
import {render,screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {LanguageProvider} from "../../contexts/LanguageContext";
import Footer from "./Footer";

describe("Footer",()=>{it("uses the approved Parts Hub wordmark",()=>{render(<MemoryRouter><LanguageProvider><Footer/></LanguageProvider></MemoryRouter>);expect(screen.getByRole("img",{name:"Parts Hub"})).toHaveAttribute("src","/brand/parts-hub-wordmark.png");expect(screen.getByRole("link",{name:"Parts Hub home"})).toHaveAttribute("href","/");expect(screen.getByRole("link",{name:"About us"})).toHaveAttribute("href","/about");expect(screen.getByRole("link",{name:"Shipping"})).toHaveAttribute("href","/shipping-policy");expect(screen.getByRole("link",{name:"Returns & cancellations"})).toHaveAttribute("href","/return-cancellation-policy");expect(screen.getByRole("link",{name:"Contact"})).toHaveAttribute("href","/contact");});});
